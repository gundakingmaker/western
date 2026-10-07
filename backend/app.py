import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

db=SQLAlchemy()
mongo_client=None
mongo_db=None

def create_app():
    global mongo_client,mongo_db
    app=Flask(__name__)
    app.config["SECRET_KEY"]=os.getenv("SECRET_KEY","dev-only")
    app.config["SQLALCHEMY_DATABASE_URI"]=os.getenv("DATABASE_URL","sqlite:///ghatverse.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
    db.init_app(app)
    CORS(app,origins=[os.getenv("FRONTEND_ORIGIN","http://localhost:5173")],supports_credentials=True)

    uri=os.getenv("MONGODB_URI")
    if uri:
        mongo_client=MongoClient(uri,serverSelectionTimeoutMS=2000)
        mongo_db=mongo_client[os.getenv("MONGODB_DB","ghatverse")]

    with app.app_context():
        db.create_all()

    @app.get("/api/v1/health")
    def health():
        mongo_ok=False
        if mongo_db is not None:
            try:
                mongo_client.admin.command("ping"); mongo_ok=True
            except Exception: pass
        return jsonify({"status":"ok","service":"ghatverse-api","postgres":True,"mongodb":mongo_ok,"timestamp":datetime.utcnow().isoformat()+"Z"})

    @app.get("/api/v1/states")
    def states():
        return jsonify([s.to_dict() for s in State.query.order_by(State.name).all()])

    @app.get("/api/v1/destinations")
    def destinations():
        q=request.args.get("q","").strip()
        state=request.args.get("state","").strip()
        query=Place.query
        if q: query=query.filter(db.or_(Place.name.ilike(f"%{q}%"),Place.description.ilike(f"%{q}%")))
        if state: query=query.filter_by(state=state)
        return jsonify([p.to_dict() for p in query.order_by(Place.featured.desc(),Place.name).all()])

    @app.get("/api/v1/packages")
    def packages():
        state=request.args.get("state","").strip()
        query=Package.query
        if state: query=query.filter_by(state=state)
        return jsonify([p.to_dict() for p in query.order_by(Package.featured.desc(),Package.name).all()])

    @app.get("/api/v1/stays")
    def stays():
        state=request.args.get("state","").strip()
        query=Hotel.query
        if state: query=query.filter_by(state=state)
        return jsonify([h.to_dict() for h in query.order_by(Hotel.featured.desc(),Hotel.name).all()])

    @app.get("/api/v1/reels")
    def reels():
        if mongo_db is None: return jsonify([])
        docs=list(mongo_db.reels.find({"published":True},{"_id":0}).sort("created_at",-1).limit(30))
        return jsonify(docs)

    @app.get("/api/v1/search")
    def search():
        q=request.args.get("q","").strip()
        if not q: return jsonify({"destinations":[],"packages":[],"stays":[]})
        term=f"%{q}%"
        return jsonify({
            "destinations":[p.to_dict() for p in Place.query.filter(db.or_(Place.name.ilike(term),Place.state.ilike(term))).limit(12).all()],
            "packages":[p.to_dict() for p in Package.query.filter(db.or_(Package.name.ilike(term),Package.state.ilike(term))).limit(12).all()],
            "stays":[h.to_dict() for h in Hotel.query.filter(db.or_(Hotel.name.ilike(term),Hotel.state.ilike(term))).limit(12).all()]
        })

    @app.post("/api/v1/planner/recommend")
    def planner_recommend():
        body=request.get_json(silent=True) or {}
        state=body.get("state")
        duration=body.get("duration")
        traveller=body.get("traveller")
        query=Package.query
        if state: query=query.filter_by(state=state)
        results=[p.to_dict() for p in query.limit(6).all()]
        return jsonify({"preferences":{"state":state,"duration":duration,"traveller":traveller},"recommendations":results})

    return app

class State(db.Model):
    id=db.Column(db.String(36),primary_key=True)
    name=db.Column(db.String(80),unique=True,nullable=False)
    tag=db.Column(db.String(180),nullable=False)
    image_url=db.Column(db.Text)
    def to_dict(self): return {"id":self.id,"name":self.name,"tag":self.tag,"img":self.image_url}

class Place(db.Model):
    id=db.Column(db.String(36),primary_key=True)
    name=db.Column(db.String(140),nullable=False,index=True)
    state=db.Column(db.String(80),nullable=False,index=True)
    type=db.Column(db.String(80),nullable=False)
    meta=db.Column(db.String(180))
    description=db.Column(db.Text)
    image_url=db.Column(db.Text)
    featured=db.Column(db.Boolean,default=False)
    def to_dict(self): return {"id":self.id,"name":self.name,"state":self.state,"type":self.type,"meta":self.meta,"description":self.description,"img":self.image_url,"featured":self.featured}

class Package(db.Model):
    id=db.Column(db.String(36),primary_key=True)
    name=db.Column(db.String(140),nullable=False,index=True)
    state=db.Column(db.String(80),nullable=False,index=True)
    days=db.Column(db.String(30))
    price=db.Column(db.Integer)
    tag=db.Column(db.String(80))
    image_url=db.Column(db.Text)
    featured=db.Column(db.Boolean,default=False)
    def to_dict(self): return {"id":self.id,"name":self.name,"state":self.state,"days":self.days,"price":f"₹{self.price:,}" if self.price else "On request","tag":self.tag,"img":self.image_url,"featured":self.featured}

class Hotel(db.Model):
    id=db.Column(db.String(36),primary_key=True)
    name=db.Column(db.String(140),nullable=False,index=True)
    state=db.Column(db.String(80),nullable=False,index=True)
    location=db.Column(db.String(140))
    price_per_night=db.Column(db.Integer)
    rating=db.Column(db.Float,default=0)
    image_url=db.Column(db.Text)
    featured=db.Column(db.Boolean,default=False)
    def to_dict(self): return {"id":self.id,"name":self.name,"state":self.state,"location":self.location,"price":f"₹{self.price_per_night:,} / night" if self.price_per_night else "On request","rating":self.rating,"img":self.image_url,"featured":self.featured}

app=create_app()
if __name__=="__main__":
    app.run(host="0.0.0.0",port=int(os.getenv("PORT","5000")),debug=True)

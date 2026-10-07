import uuid
from app import app,db,State,Place,Package,Hotel

IMG="https://images.unsplash.com/{}?auto=format&fit=crop&w=1200&q=85"
states=[
("Karnataka","Forests · Hills · Heritage","photo-1500534623283-312aade485b7"),
("Kerala","Backwaters · Tea · Mist","photo-1501785888041-af3ef285b470"),
("Tamil Nadu","Hills · Temples · Wildlife","photo-1464822759023-fed622ff2c3b"),
("Goa","Beaches · Rivers · Vibes","photo-1518509562904-e7ef99cdcc86"),
("Maharashtra","Forts · Waterfalls · Wildlife","photo-1448375240586-882707db888b"),
("Gujarat","Forests · Culture · Trails","photo-1469474968028-56623f02e42e")
]
places=[
("Mullayanagiri","Karnataka","Peak","Sunrise · Trekking","photo-1464822759023-fed622ff2c3b"),
("Munnar","Kerala","Hill escape","Tea · Viewpoints","photo-1500534623283-312aade485b7"),
("Agumbe","Karnataka","Rainforest","Sunset · Wildlife","photo-1441974231531-c6227db76b6e"),
("Mahabaleshwar","Maharashtra","Hill station","Waterfalls · Food","photo-1500534623283-312aade485b7")
]
packages=[
("Coorg Gateway","Karnataka","2D / 1N",4999,"Nature","photo-1464822759023-fed622ff2c3b"),
("Munnar Escape","Kerala","3D / 2N",7999,"Hills","photo-1500534623283-312aade485b7"),
("Sahyadri Explorer","Maharashtra","4D / 3N",10499,"Adventure","photo-1448375240586-882707db888b")
]
hotels=[
("The Serai","Kerala","Munnar",3500,4.8,"photo-1505693416388-ac5ce068fe85"),
("Green Woods Retreat","Karnataka","Coorg",4200,4.8,"photo-1505693416388-ac5ce068fe85"),
("Tea Valley Resort","Kerala","Munnar",5800,4.8,"photo-1505693416388-ac5ce068fe85"),
("Forest Edge Homestay","Karnataka","Agumbe",2100,4.7,"photo-1505693416388-ac5ce068fe85")
]
with app.app_context():
    db.drop_all();db.create_all()
    for name,tag,pic in states: db.session.add(State(str(uuid.uuid4()),name,tag,IMG.format(pic)))
    for i,(name,state,typ,meta,pic) in enumerate(places): db.session.add(Place(str(uuid.uuid4()),name,state,typ,meta,name+" — curated GHATVERSE destination",IMG.format(pic),True))
    for name,state,days,price,tag,pic in packages: db.session.add(Package(str(uuid.uuid4()),name,state,days,price,tag,IMG.format(pic),True))
    for name,state,location,price,rating,pic in hotels: db.session.add(Hotel(str(uuid.uuid4()),name,state,location,price,rating,IMG.format(pic),True))
    db.session.commit()
    print("GHATVERSE PostgreSQL seed complete")

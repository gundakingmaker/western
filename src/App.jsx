import React,{useEffect,useMemo,useState}from"react";
import{Compass,Map,CalendarDays,Hotel,PlayCircle,Leaf,Heart,Search,ArrowRight,Menu,X,MapPin,Star,Users,Mountain,ChevronRight}from"lucide-react";
import{api}from"./api";

const img=(id,w=900)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const states=[
 {name:"Karnataka",tag:"Forests · Hills · Heritage",img:img("photo-1500534623283-312aade485b7")},
 {name:"Kerala",tag:"Backwaters · Tea · Mist",img:img("photo-1501785888041-af3ef285b470")},
 {name:"Tamil Nadu",tag:"Hills · Temples · Wildlife",img:img("photo-1464822759023-fed622ff2c3b")},
 {name:"Goa",tag:"Beaches · Rivers · Vibes",img:img("photo-1518509562904-e7ef99cdcc86")},
 {name:"Maharashtra",tag:"Forts · Waterfalls · Wildlife",img:img("photo-1448375240586-882707db888b")},
 {name:"Gujarat",tag:"Forests · Culture · Trails",img:img("photo-1469474968028-56623f02e42e")}
];
const destinations=[
 {name:"Mullayanagiri",state:"Karnataka",type:"Peak",meta:"Sunrise · Trekking",img:img("photo-1464822759023-fed622ff2c3b")},
 {name:"Munnar",state:"Kerala",type:"Hill escape",meta:"Tea · Viewpoints",img:img("photo-1500534623283-312aade485b7")},
 {name:"Agumbe",state:"Karnataka",type:"Rainforest",meta:"Sunset · Wildlife",img:img("photo-1441974231531-c6227db76b6e")},
 {name:"Mahabaleshwar",state:"Maharashtra",type:"Hill station",meta:"Waterfalls · Food",img:img("photo-1500534623283-312aade485b7")}
];
const packages=[
 {name:"Coorg Gateway",days:"2D / 1N",price:"₹4,999",tag:"Nature",img:img("photo-1464822759023-fed622ff2c3b")},
 {name:"Munnar Escape",days:"3D / 2N",price:"₹7,999",tag:"Hills",img:img("photo-1500534623283-312aade485b7")},
 {name:"Sahyadri Explorer",days:"4D / 3N",price:"₹10,499",tag:"Adventure",img:img("photo-1448375240586-882707db888b")}
];
const reels=[
 {place:"Shivanasamudra Falls",state:"Karnataka",img:img("photo-1433086966358-54859d0ed716"),likes:"12.4K"},
 {place:"Munnar Tea Trails",state:"Kerala",img:img("photo-1500534623283-312aade485b7"),likes:"8.9K"},
 {place:"Sahyadri Monsoon",state:"Maharashtra",img:img("photo-1441974231531-c6227db76b6e"),likes:"16.2K"}
];

function App(){
 const[page,setPage]=useState("home"),[query,setQuery]=useState(""),[menu,setMenu]=useState(false),[liked,setLiked]=useState([]);
 const[remote,setRemote]=useState({states:[],destinations:[],packages:[],stays:[],reels:[]});
 const[apiStatus,setApiStatus]=useState("connecting");
 useEffect(()=>{let live=true;Promise.all([api.states(),api.destinations(),api.packages(),api.stays(),api.reels()]).then(([s,d,p,h,r])=>{if(!live)return;setRemote({states:s||[],destinations:d||[],packages:p||[],stays:h||[],reels:r||[]});setApiStatus("online")}).catch(()=>{if(live)setApiStatus("offline")});return()=>{live=false}},[]);
 const stateData=remote.states.length?remote.states:states;
 const destinationData=remote.destinations.length?remote.destinations:destinations;
 const packageData=remote.packages.length?remote.packages:packages;
 const stayData=remote.stays.length?remote.stays:null;
 const reelData=remote.reels.length?remote.reels:reels;
 const filtered=useMemo(()=>destinationData.filter(d=>(d.name+d.state+d.type).toLowerCase().includes(query.toLowerCase())),[destinationData,query]);
 const go=p=>{setPage(p);setMenu(false);window.scrollTo({top:0,behavior:"smooth"})};
 return <div className="app">
  <header className="nav">
   <button className="brand" onClick={()=>go("home")}><span className="brandMark">⌁</span><span>GHAT<span>VERSE</span></span></button>
   <nav className={menu?"navLinks open":"navLinks"}>{["home","destinations","packages","stays","reels","planner"].map(p=><button key={p} className={page===p?"active":""} onClick={()=>go(p)}>{p==="home"?"Home":p[0].toUpperCase()+p.slice(1)}</button>)}</nav>
   <div className="navActions"><span className={"apiDot "+apiStatus} title={"API: "+apiStatus}></span><button className="iconBtn"><Search size={19}/></button><button className="menuBtn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button><button className="cta small" onClick={()=>go("planner")}>Plan a Trip</button></div>
  </header>

  {page==="home"&&<Home go={go} query={query} setQuery={setQuery} filtered={filtered} states={stateData} packages={packageData} liked={liked} setLiked={setLiked}/>}
  {page==="destinations"&&<Listing title="Discover the Western Ghats" sub="Hidden places, iconic landscapes and local experiences." items={filtered} go={go}/>}
  {page==="packages"&&<PackagePage go={go} items={packageData}/>}
  {page==="stays"&&<StayPage items={stayData}/>}
  {page==="reels"&&<ReelsPage items={reelData} liked={liked} setLiked={setLiked}/>}
  {page==="planner"&&<Planner/>}

  <footer><div><button className="brand footerBrand" onClick={()=>go("home")}><span className="brandMark">⌁</span><span>GHAT<span>VERSE</span></span></button><p>Not just a trip. It's a Ghatverse experience.</p></div><div><h4>Explore</h4><button onClick={()=>go("destinations")}>Destinations</button><button onClick={()=>go("packages")}>Packages</button><button onClick={()=>go("reels")}>Reels</button></div><div><h4>Travel</h4><button onClick={()=>go("planner")}>Trip Planner</button><button>Responsible Travel</button><button>Local Experiences</button></div><div><h4>Project</h4><button>About GHATVERSE</button><button>Contact</button><button>Privacy</button></div></footer>
 </div>
}

function Home({go,query,setQuery,filtered,states,packages,liked,setLiked}){
 return <main>
  <section className="hero"><div className="heroOverlay"/><div className="heroContent">
   <div className="eyebrow"><Leaf size={15}/> EXPLORE · STAY · EXPERIENCE</div>
   <h1>The Western Ghats,<br/><em>All in One Place.</em></h1>
   <p>Discover hidden gems, plan your perfect trip, book stays, explore local experiences and watch real stories — all on GHATVERSE.</p>
   <div className="heroBtns"><button className="cta" onClick={()=>go("destinations")}>Explore Now <ArrowRight size={18}/></button><button className="ghost" onClick={()=>go("reels")}><PlayCircle size={18}/> Watch Reels</button></div>
   <div className="searchBox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search destinations, states, packages..."/><button onClick={()=>go("destinations")}>Search</button></div>
  </div><div className="heroBadge"><Mountain/><b>6 States</b><span>1 Incredible Range</span></div></section>

  <section className="featureStrip">{[[Compass,"Discover","Hidden places & local attractions"],[CalendarDays,"Plan","Smart trip planning & recommendations"],[Hotel,"Book","Stays, packages & experiences"],[PlayCircle,"Explore","Reels, photos & real stories"],[Leaf,"Travel responsibly","Support local eco-tourism"]].map(([I,t,s])=><div className="feature" key={t}><I/><b>{t}</b><span>{s}</span></div>)}</section>

  <section className="section"><div className="sectionHead"><div><small>CURATED FOR YOU</small><h2>Explore the <em>Western Ghats</em></h2><p>From misty hills to wild forests and coastal villages.</p></div><button className="textBtn" onClick={()=>go("destinations")}>View all <ChevronRight size={17}/></button></div>
   <div className="destGrid">{filtered.slice(0,4).map(d=><article className="destCard" key={d.name} onClick={()=>go("destinations")}><img src={d.img}/><div className="cardShade"/><div className="cardInfo"><span>{d.state}</span><h3>{d.name}</h3><p>{d.type} · {d.meta}</p></div><button className="heart" onClick={e=>{e.stopPropagation();setLiked(l=>l.includes(d.name)?l.filter(x=>x!==d.name):[...l,d.name])}}><Heart fill={liked.includes(d.name)?"currentColor":"none"}/></button></article>)}</div>
  </section>

  <section className="darkSection"><div className="sectionHead"><div><small>THE GHATVERSE MAP</small><h2>One range. <em>Six states.</em></h2><p>Discover destinations across the Western Ghats, state by state.</p></div><Map size={42}/></div><div className="stateGrid">{states.map(s=><article className="stateCard" key={s.name} onClick={()=>go("destinations")}><img src={s.img}/><div><b>{s.name}</b><span>{s.tag}</span></div></article>)}</div></section>

  <section className="section"><div className="sectionHead"><div><small>READY-MADE EXPERIENCES</small><h2>Trip packages that <em>feel local.</em></h2></div><button className="textBtn" onClick={()=>go("packages")}>View packages <ChevronRight size={17}/></button></div><div className="packageGrid">{packages.map(p=><article className="packageCard" key={p.name}><img src={p.img}/><div className="packageBody"><span className="pill">{p.tag}</span><h3>{p.name}</h3><p>{p.days} · Curated itinerary</p><div><strong>{p.price}</strong><button className="miniCta" onClick={()=>go("planner")}>View package</button></div></div></article>)}</div></section>

  <section className="responsible"><Leaf size={40}/><div><small>GHATVERSE PROMISE</small><h2>Travel deeper. <em>Leave lighter.</em></h2><p>Respect forests, support local communities and experience the Western Ghats responsibly.</p></div><button className="cta" onClick={()=>go("planner")}>Plan responsibly</button></section>
 </main>
}

function Listing({title,sub,items,go}){return <main className="page"><div className="pageHero"><small>GHATVERSE DISCOVERY</small><h1>{title}</h1><p>{sub}</p></div><section className="section"><div className="filterBar"><button className="filter active">All destinations</button><button className="filter">Karnataka</button><button className="filter">Kerala</button><button className="filter">Maharashtra</button><button className="filter">Tamil Nadu</button></div><div className="destGrid large">{items.map(d=><article className="destCard" key={d.name} onClick={()=>go("planner")}><img src={d.img}/><div className="cardShade"/><div className="cardInfo"><span>{d.state}</span><h3>{d.name}</h3><p>{d.type} · {d.meta}</p></div></article>)}</div></section></main>}

function PackagePage({go,items}){return <main className="page"><div className="pageHero"><small>CURATED TRIPS</small><h1>Packages for every kind of traveller.</h1><p>Budget, standard and premium journeys across the Ghats.</p></div><section className="section"><div className="packageGrid">{[...items,...items].map((p,i)=><article className="packageCard" key={i}><img src={p.img}/><div className="packageBody"><span className="pill">{p.tag}</span><h3>{p.name}</h3><p>{p.days} · Stay · Food · Local experience</p><div><strong>{p.price}</strong><button className="miniCta" onClick={()=>go("planner")}>Plan this</button></div></div></article>)}</div></section></main>}

function StayPage({items}){const stays=items||[["The Serai","Munnar","₹3,500 / night"],["Green Woods Retreat","Coorg","₹4,200 / night"],["Tea Valley Resort","Munnar","₹5,800 / night"],["Forest Edge Homestay","Agumbe","₹2,100 / night"]].map(([name,location,price])=>({name,location,price,rating:4.8,img:img("photo-1505693416388-ac5ce068fe85")}));return <main className="page"><div className="pageHero"><small>STAY IN THE GHATS</small><h1>Stays from homestays to retreats.</h1><p>Find a place that matches your route, budget and travel style.</p></div><section className="section"><div className="stayGrid">{stays.map(s=><article className="stayCard" key={s.id||s.name}><img src={s.img}/><div><div className="rating"><Star fill="currentColor" size={14}/> {s.rating||4.8}</div><h3>{s.name}</h3><p><MapPin size={14}/> {s.location}</p><strong>{s.price}</strong></div></article>)}</div></section></main>}

function ReelsPage({items,liked,setLiked}){const feed=items||[];return <main className="page"><div className="pageHero"><small>GHATVERSE REELS</small><h1>See the Ghats through real stories.</h1><p>Short videos from travellers, locals and curated creators.</p></div><section className="section"><div className="reelGrid">{feed.map(r=><article className="reelCard" key={r.place}><img src={r.img}/><div className="reelShade"/><div className="reelText"><span>@ghatverse · {r.state}</span><h3>{r.place}</h3><p>Hidden gems of the Western Ghats</p><div><button onClick={()=>setLiked(l=>l.includes(r.place)?l.filter(x=>x!==r.place):[...l,r.place])}><Heart fill={liked.includes(r.place)?"currentColor":"none"}/>{r.likes}</button><button><PlayCircle/> Watch</button></div></div></article>)}</div></section></main>}

function Planner(){const[step,setStep]=useState(1);return <main className="planner"><div className="plannerBox"><div className="plannerIntro"><Leaf/><small>GHATVERSE TRIP PLANNER</small><h1>Let’s plan your<br/><em>perfect trip.</em></h1><p>Tell us what you want. We'll shape a Western Ghats experience around you.</p><div className="steps">{[1,2,3].map(n=><span className={step>=n?"done":""} key={n}>{n}</span>)}</div></div><div className="plannerForm">{step===1&&<><h2>Where do you want to go?</h2><div className="optionGrid">{["Karnataka","Kerala","Maharashtra","Tamil Nadu","Goa","Gujarat"].map(x=><button onClick={()=>setStep(2)} key={x}><MapPin/> {x}</button>)}</div></>}{step===2&&<><h2>How long is your trip?</h2><div className="optionGrid">{["1 Day","2D / 1N","3D / 2N","4D / 3N","5D+"].map(x=><button onClick={()=>setStep(3)} key={x}><CalendarDays/> {x}</button>)}</div></>}{step===3&&<><h2>What kind of traveller are you?</h2><div className="optionGrid">{["Solo","Couple","Friends","Family"].map(x=><button onClick={()=>setStep(1)} key={x}><Users/> {x}</button>)}</div><div className="success"><Leaf/> Your GHATVERSE itinerary is ready to personalise.</div></>}</div></div></main>}

export default App;
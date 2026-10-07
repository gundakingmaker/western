const API_BASE=(import.meta.env.VITE_API_BASE_URL||"http://localhost:5000/api/v1").replace(/\/$/,"");

async function request(path,options={}){
  const res=await fetch(API_BASE+path,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  if(!res.ok){const body=await res.text().catch(()=>"" );throw new Error(body||`API request failed: ${res.status}`)}
  return res.status===204?null:res.json();
}
export const api={
  health:()=>request("/health"),
  destinations:(params={})=>request("/destinations?"+new URLSearchParams(params)),
  states:()=>request("/states"),
  packages:(params={})=>request("/packages?"+new URLSearchParams(params)),
  stays:(params={})=>request("/stays?"+new URLSearchParams(params)),
  reels:(params={})=>request("/reels?"+new URLSearchParams(params)),
  search:q=>request("/search?"+new URLSearchParams({q})),
  plan:payload=>request("/planner/recommend",{method:"POST",body:JSON.stringify(payload)})
};
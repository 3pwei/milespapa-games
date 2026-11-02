(function(root){
// Hand-simplified Taipei municipal outline: northern volcanic hills, basin, eastern valley, southern Wenshan tail.
// Reference: Taipei City Government administrative map and Travel Taipei regional maps (2026-10-24).
const ROWS=[null,[11,16],[8,18],[6,20],[4,21],[3,22],[3,23],[4,24],[4,25],[3,26],[2,26],[3,27],[4,28],[4,29],[4,29],[4,30],[5,30],[5,29],[5,28],[6,27],[6,26],[7,25],[8,24],[10,24],[12,25],[13,24],[14,23],[15,22],[16,21],[17,19]];
const keelung=[0,0,0,0,0,10,10,11,11,12,12,12,11,11,11,11,12,12,12,13,13,13,14,14,14,14,14,13,13,12,12];
let expanded=false;const ROADS=new Set();
const HQ={x:8,y:13,w:2,h:2,door:{x:8,y:15}};
const PLACES=[{name:'大稻埕河岸',x:6,y:14,area:0,speaker:'阿海伯',quote:'我等公車的時間，都夠把你的政見背三遍了。'},{name:'西門街坊',x:6,y:18,area:0,speaker:'早餐店老闆',quote:'我都記得你不加辣，你也記一下我們的人行道。'},{name:'萬華生活圈',x:8,y:22,area:0,speaker:'慢跑阿姨',quote:'河濱有燈，我才能看到自己跑得多慢。'},{name:'士林街坊',x:11,y:10,area:1,speaker:'租屋青年',quote:'房東說房子有潛力。我看只是沒有空間。'},{name:'大安公園',x:16,y:20,area:1,speaker:'推車爸爸',quote:'孩子需要放電，我需要充電，最好同一個地方。'},{name:'中正市場',x:11,y:19,area:1,speaker:'美蘭姐',quote:'講政見可以，先幫我把這袋菜提一下。'},{name:'內湖科技街',x:24,y:12,area:2,speaker:'輪班工程師',quote:'AI 還沒取代我，早班已經快取代我的靈魂。'},{name:'南港轉運站',x:28,y:16,area:2,speaker:'阿達司機',quote:'導航叫我向前，塞車叫我看開。'},{name:'信義夜歸路',x:22,y:20,area:2,speaker:'夜班阿姨',quote:'公車比我早下班。我想回家，不是想健走。'}];
const BUILDINGS=[HQ,
{x:23,y:19,w:2,h:2,type:'taipei101',name:'台北101'},
{x:11,y:16,w:3,h:1,type:'mainstation',name:'臺北車站'},
{x:12,y:21,w:2,h:2,type:'memorial',name:'中正紀念堂'},
{x:12,y:9,w:2,h:1,type:'grandhotel',name:'圓山大飯店'},
{x:7,y:20,w:2,h:1,type:'longshan',name:'龍山寺'},
{x:7,y:7,w:2,h:1,type:'beitou',name:'北投圖書館'},
{x:16,y:8,w:2,h:1,type:'palace',name:'故宮博物院'},
{x:6,y:17,w:1,h:1,type:'redhouse',name:'西門紅樓'},
{x:20,y:17,w:2,h:1,type:'sunyatsen',name:'國父紀念館'},
{x:21,y:15,w:2,h:1,type:'arena',name:'臺北小巨蛋'}];
const LANDMARK_TYPES=new Set(BUILDINGS.filter(b=>b!==HQ).map(b=>b.type));
const TYPES=['walkup','townhouse','shop','cafe','office','clinic','school','temple','market','modern','warehouse','redbrick'];
for(let y=8;y<24;y++)for(let x=4;x<30;x++){
 if(!land(x,y)||!['grass','yard'].includes(terrain(x,y))||BUILDINGS.some(b=>inRect(x,y,b)))continue;
 if(PLACES.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<=1)||Math.abs(HQ.door.x-x)+Math.abs(HQ.door.y-y)<=1)continue;
 if(y>=19&&x>=18&&x<=22)continue;
 if(x%3!==1||y%3===0||(x*7+y*11)%5===0)continue;
 let type=TYPES[(BUILDINGS.length-11)%TYPES.length];
 BUILDINGS.push({x,y,w:1,h:1,type,floors:2+(x+y)%4,variant:(x*17+y*13)%5});
}
// Double both axes: four times the land cells, retaining the Taipei outline.
const BASE_ROWS=ROWS.map(r=>r&&r.slice()),SCALE=2,WIDTH=64,HEIGHT=60;
const enlarged=[];for(let y=0;y<HEIGHT;y++){let r=BASE_ROWS[Math.floor(y/2)];enlarged.push(r?[r[0]*2,(r[1]+1)*2-1]:null)}ROWS.splice(0,ROWS.length,...enlarged);
for(let p of PLACES){p.x*=2;p.y*=2}
for(let b of BUILDINGS){b.x*=2;b.y*=2}
for(let b of BUILDINGS){if(!LANDMARK_TYPES.has(b.type))continue;if(b.type==='taipei101'){b.w=1;b.h=3}else if(b.type==='redhouse'){b.w=b.h=1}else{b.w=b.h=2}}
HQ.w=HQ.h=1;HQ.x=17;HQ.y=27;HQ.door={x:16,y:27};
const FOE_HQ={x:48,y:32,w:1,h:1,type:'foe',name:'周岳競選總部'};
// Retain landmarks; rebuild the ordinary streetscape at the enlarged map's actual grid scale.
BUILDINGS.splice(0,BUILDINGS.length,...BUILDINGS.filter(b=>b===HQ||LANDMARK_TYPES.has(b.type)),FOE_HQ);expanded=true;
const STREETS=[[[16,14],[16,23],[14,23],[14,31],[15,31],[16,40],[18,40],[18,48]],[[28,15],[28,24],[30,24],[30,32],[28,32],[28,43],[31,43],[31,51]],[[46,19],[46,26],[49,26],[49,34],[46,34],[46,44],[43,44],[43,49]],[[10,19],[20,19],[20,18],[35,18],[35,20],[52,20]],[[10,30],[22,30],[22,31],[39,31],[39,29],[57,29]],[[13,37],[25,37],[25,39],[40,39],[40,37],[55,37]],[[18,45],[27,45],[27,46],[42,46],[48,46]],[[19,23],[24,23],[24,27],[19,27]],[[33,23],[39,23],[39,27]],[[18,34],[24,34],[24,36]],[[34,33],[38,33],[38,36]],[[51,32],[55,32],[55,35]],[[34,43],[39,43],[39,46]]];
function roadSegment(a,b){let q=[a],prev=new Map([[a.join(','),null]]),end=b.join(',');for(let i=0;i<q.length;i++){let [x,y]=q[i],k=x+','+y;if(k===end){while(k!==null){ROADS.add(k);k=prev.get(k)}return}let dirs=[[1,0],[-1,0],[0,1],[0,-1]].sort((u,v)=>(Math.abs(x+u[0]-b[0])+Math.abs(y+u[1]-b[1]))-(Math.abs(x+v[0]-b[0])+Math.abs(y+v[1]-b[1])));for(let [dx,dy]of dirs){let xx=x+dx,yy=y+dy,n=xx+','+yy;if(!prev.has(n)&&land(xx,yy)&&!building(xx,yy)){prev.set(n,k);q.push([xx,yy])}}}}
for(let line of STREETS)for(let i=1;i<line.length;i++)roadSegment(line[i-1],line[i]);roadSegment([14,27],[16,27]);
// Join every street component, then loop each remaining endpoint back into the network.
function roadComponents(){let unseen=new Set(ROADS),parts=[];while(unseen.size){let start=unseen.values().next().value,q=[start],part=[];unseen.delete(start);for(let i=0;i<q.length;i++){let k=q[i];part.push(k);let [x,y]=k.split(',').map(Number);for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let n=(x+dx)+','+(y+dy);if(unseen.delete(n))q.push(n)}}parts.push(part)}return parts}
for(let parts=roadComponents();parts.length>1;parts=roadComponents()){let main=parts[0],best=null;for(let n=1;n<parts.length;n++)for(let a of main)for(let b of parts[n]){let [ax,ay]=a.split(',').map(Number),[bx,by]=b.split(',').map(Number),d=Math.abs(ax-bx)+Math.abs(ay-by);if(!best||d<best.d)best={a:[ax,ay],b:[bx,by],d}}roadSegment(best.a,best.b)}
const roadDegree=k=>{let [x,y]=k.split(',').map(Number);return [[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>ROADS.has((x+dx)+','+(y+dy))).length};
function closeRoadEnd(start){let [sx,sy]=start.split(',').map(Number),neighbor=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>(sx+dx)+','+(sy+dy)).find(k=>ROADS.has(k)),q=[[sx,sy]],prev=new Map([[start,null]]),target=null;for(let i=0;i<q.length&&!target;i++){let [x,y]=q[i],k=x+','+y;for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let xx=x+dx,yy=y+dy,n=xx+','+yy;if(k===start&&n===neighbor||prev.has(n)||!land(xx,yy)||building(xx,yy))continue;prev.set(n,k);if(ROADS.has(n)){target=n;break}q.push([xx,yy])}}if(!target)return false;for(let k=target;k!==null;k=prev.get(k))ROADS.add(k);return true}
for(let pass=0;pass<4;pass++){let ends=[...ROADS].filter(k=>roadDegree(k)<=1);if(!ends.length)break;for(let k of ends)closeRoadEnd(k)}
PLACES[2].x=20;PLACES[2].y=44;
const WALKWAYS=new Set();
for(let target of PLACES){let start=[HQ.door.x,HQ.door.y],q=[start],prev=new Map([[start.join(','),null]]),end=target.x+','+target.y;for(let i=0;i<q.length;i++){let [x,y]=q[i],k=x+','+y;if(k===end){while(k!==null){WALKWAYS.add(k);k=prev.get(k)}break}for(let [dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]]){let xx=x+dx,yy=y+dy,n=xx+','+yy;if(!prev.has(n)&&land(xx,yy)&&terrain(xx,yy)!=='river'&&!building(xx,yy)){prev.set(n,k);q.push([xx,yy])}}}}
// Streetfront infill, with small courtyards and walking gaps between each cluster.
for(let y=15;y<49;y++)for(let x=8;x<60;x++){
 if(!land(x,y)||!['grass','yard'].includes(terrain(x,y))||building(x,y))continue;
 if(WALKWAYS.has(x+','+y)||PLACES.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<=1)||(x===HQ.door.x&&y===HQ.door.y))continue;
 let roadside=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].some(([xx,yy])=>ROADS.has(xx+','+yy)),hash=(x*17+y*13)%11;
 if(!(roadside||hash<9&&x%3!==0&&y%3!==0))continue;
 BUILDINGS.push({x,y,w:1,h:1,type:TYPES[(x*7+y*3)%TYPES.length],floors:2+(x+y)%4,variant:hash%5});
}
const DISTRICTS=PLACES.map((p,i)=>({id:i,name:['大同河岸選區','西門選區','萬華選區','士林北投選區','大安文山選區','中正選區','內湖選區','南港選區','信義松山選區'][i],x:p.x,y:p.y}));
function districtAt(x,y){if(!land(x,y))return null;let best=0,d=Infinity;for(let p of DISTRICTS){let n=(p.x-x)**2+(p.y-y)**2;if(n<d){d=n;best=p.id}}return best}
const CELLS=[];for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
 let districtId=districtAt(x,y),t=terrain(x,y),seed=(x*73856093^y*19349663)>>>0,empty=districtId===null||['river','bridge','road','hill','park'].includes(t),population=empty?0:building(x,y)?120+seed%420:25+seed%100;
 let profile=[[15,33],[24,18],[14,35],[18,28],[22,21],[17,30],[21,16],[25,18],[20,19]][districtId??0],youth=profile[0]+seed%9-4,elder=profile[1]+(seed>>>5)%9-4,middle=100-youth-elder;
 CELLS.push(Object.freeze({x,y,districtId,population,support:population?35+seed%31:null,ageRatio:Object.freeze(population?{youth,middle,elder}:{youth:0,middle:0,elder:0}),terrain:t}));
}
function metadata(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<WIDTH&&y>=0&&y<HEIGHT?CELLS[y*WIDTH+x]:null}
const key=(x,y)=>x+','+y;
function land(x,y){let r=ROWS[y];return Number.isInteger(x)&&!!r&&x>=r[0]&&x<=r[1]}
function terrain(x,y){if(!expanded)return baseTerrain(x,y);if(!land(x,y))return 'outside';let t=baseTerrain(Math.floor(x/2),Math.floor(y/2)),wet=t==='river'||t==='bridge';if(ROADS.has(x+','+y))return wet?'bridge':'road';if(wet)return 'river';return t==='road'?(x<34?'grass':'yard'):t}
function baseTerrain(x,y){let r=(expanded?BASE_ROWS:ROWS)[y];if(!r||x<r[0]||x>r[1])return 'outside';
 let west=y>=8&&x===(expanded?BASE_ROWS:ROWS)[y][0],south=y>=22&&x===(expanded?BASE_ROWS:ROWS)[y][0]+1,wet=west||south||(x>=5&&x<=30&&y===keelung[x]);
 let road=([8,14,23,28].includes(x)&&y>=8&&y<=25)||[9,15,18,22].includes(y);
 if(wet)return road?'bridge':'river';if(road)return 'road';
 if(y<7||(x>25&&y>18)||(y>24&&x>19))return 'hill';
 if((x>=15&&x<=18&&y>=19&&y<=21)||(x>=18&&x<=20&&y>=13&&y<=14))return 'park';
 return x<17?'grass':'yard'}
function inRect(x,y,b){return x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h}
function building(x,y){return BUILDINGS.some(b=>inRect(x,y,b))}
function walkable(x,y,branches=[]){return !['sea','outside','river','hill'].includes(terrain(x,y))}
function path(start,end,canWalk,max=10000){if(!canWalk(end.x,end.y))return null;let q=[start],prev=new Map([[key(start.x,start.y),null]]),target=key(end.x,end.y);for(let n=0;n<q.length&&n<max;n++){let p=q[n];if(key(p.x,p.y)===target){let out=[],cur=target;while(prev.get(cur)!==null){let [x,y]=cur.split(',').map(Number);out.push({x,y});cur=prev.get(cur)}return out.reverse()}for(let [dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]]){let x=p.x+dx,y=p.y+dy,k=key(x,y);if(!prev.has(k)&&canWalk(x,y)){prev.set(k,key(p.x,p.y));q.push({x,y})}}}return null}
function nearbyPath(start,target,canWalk){let candidates=[];for(let y=target.y-1;y<=target.y+(target.h||1);y++)for(let x=target.x-1;x<=target.x+(target.w||1);x++){if(inRect(x,y,{...target,w:target.w||1,h:target.h||1}))continue;let p=path(start,{x,y},canWalk);if(p)candidates.push(p)}return candidates.sort((a,b)=>a.length-b.length)[0]||null}
const api={WALKWAYS,ROADS,STREETS,WIDTH,HEIGHT,SCALE,FOE_HQ,DISTRICTS,CELLS,metadata,districtAt,LANDMARK_TYPES,TYPES,ROWS,HQ,PLACES,BUILDINGS,land,terrain,building,walkable,path,nearbyPath,key,inRect};if(typeof module!=='undefined')module.exports=api;root.CampaignWorld=api;
})(typeof globalThis!=='undefined'?globalThis:this);

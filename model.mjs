const date=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const seed=()=>[
{id:'DEMO-01',date:date(),time:'10:45',confirmed:true,items:[{product:'鮭',qty:10,made:6},{product:'肉そぼろ卵黄',qty:6,made:2}]},
{id:'DEMO-02',date:date(),time:'11:00',confirmed:true,items:[{product:'ツナマヨ',qty:4,made:0},{product:'梅かつお',qty:3,made:0}]},
{id:'DEMO-03',date:date(),time:'12:30',confirmed:true,paid:true,items:[{product:'鮭',qty:8,made:0},{product:'だし巻き卵',qty:12,made:0}]},
{id:'DEMO-04',date:date(),time:'17:30',confirmed:true,items:[{product:'限定',qty:2,made:0},{product:'肉そぼろ',qty:1,made:0}]}
];
export const eligible=o=>o.confirmed&&!!o.time&&!o.canceled;
export const remaining=i=>Math.max(i.qty-i.made,0);
export const orderRemaining=o=>eligible(o)?o.items.reduce((s,i)=>s+remaining(i),0):0;
export function groups(orders,view){const map=new Map();orders.filter(eligible).sort((a,b)=>a.time.localeCompare(b.time)||a.id.localeCompare(b.id)).forEach(o=>o.items.forEach((i,index)=>{const key=view==='product'?i.product:o.time+'|'+i.product;if(!map.has(key))map.set(key,{key,time:o.time,product:i.product,qty:0,made:0,left:0,refs:[]});const g=map.get(key);g.qty+=i.qty;g.made+=i.made;g.left+=remaining(i);g.refs.push({o,i,index});}));return [...map.values()];}
export function produce(refs,all=false){for(const {i} of refs){const n=remaining(i);if(n){i.made+=all?n:1;if(!all)break;}}}
export function totals(orders){return orders.reduce((s,o)=>{o.items.forEach(i=>{s.made+=i.made;if(eligible(o)){s.qty+=i.qty;s.left+=remaining(i);if(i.product!=='だし巻き卵')s.rice+=i.qty;}s.surplus+=eligible(o)?Math.max(i.made-i.qty,0):i.made;});return s;},{qty:0,made:0,left:0,rice:0,surplus:0});}

export function unproduce(refs){const ref=[...refs].reverse().find(r=>r.i.made>0);if(!ref)return;ref.i.made-=1;ref.o.packed=false;ref.o.handed=false;}

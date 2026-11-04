import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=(x,y,s,size=32,weight=400,color='#0C0C10')=>`<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(s)}</text>`;
const rect=(x,y,w,h,fill,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const W=1600,H=1100;
function svg(title,sub,body,footer){return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${rect(0,0,W,H,BG)}${text(72,100,title,48,700)}${text(72,153,sub,28,400,'#51515A')}${body}${text(72,991,footer[0],28,700)}${text(72,1040,footer[1],26,400,'#51515A')}</svg>`;}
async function memory(path){
 let b=rect(72,214,1456,80,INK)+text(100,266,'Published file set',30,700,'white')+text(780,266,'Bifrost',30,700,'white')+text(1030,266,'LiteLLM Rust',30,700,'white')+text(1310,266,'Lower RSS',28,700,'white');
 const rows=[['Messages / release capture','mem_*_messages / mem_*_release','199.1 MB','21.8 MB','Rust'],['Earlier memory capture','mem_bifrost / mem_litellm_rust','144.2 MB','26.1 MB','Rust'],['CPU sampling series','cpu_bifrost / cpu_rust','282–298 MB','35–36 MB','Rust'],['Sustained-throughput ceiling','throughput_ceiling.csv','242.6 MB','297.1 MB','Bifrost']];
 rows.forEach((r,i)=>{const y=312+i*148;b+=rect(72,y,1456,130,i===3?TINT:'#FFFFFF',i===3?ACCENT:'#D4D4D8')+text(100,y+48,r[0],32,700)+text(100,y+91,r[1],24,400,'#51515A')+text(780,y+66,r[2],32,700)+text(1030,y+66,r[3],32,700)+text(1310,y+66,r[4],30,700,ACCENT);});
 const out=svg('Peak RSS differs across four file sets','Published Bifrost / LiteLLM Rust results; decimal MB; checked 5 November 2026',b,['Three captures favor Rust; the ceiling run favors Bifrost.','Different runs are not matched repetitions. Logging’s contribution is unmeasured.']);
 await writeFile(path,await sharp(Buffer.from(out)).png().toBuffer());
}
async function claims(path){
 let b='';const rows=[['Added p99: 0.66 vs 4.544 ms','overhead_comparison.csv','A separate result; no sweep row matches it.'],['Memory: 21.8 vs 199.1 MB','overhead_comparison.csv and memory captures','One peak-RSS pair; ceiling memory ordering reverses.'],['About 4.5x RPS per hourly dollar','rps_per_dollar.csv','Estimated cost, not a measured production bill.'],['About 21% CPU at 2,800+ RPS','throughput_ceiling.csv','Rust: 21.075% average CPU at 2,814.35 RPS.']];
 rows.forEach((r,i)=>{const y=216+i*179;b+=rect(72,y,1456,155,i===3?TINT:'#FFFFFF',i===3?ACCENT:'#D4D4D8')+text(100,y+45,r[0],34,700)+text(100,y+88,r[1],28,700,ACCENT)+text(100,y+128,r[2],28,400,'#51515A');});
 await writeFile(path,await sharp(Buffer.from(svg('Trace claims to their own published run','The ceiling file supports the rounded CPU footnote and changes the memory comparison.',b,['A figure from one run cannot replace a differently configured run.','Source: BerriAI/ai-gateway-bench results and chart code; checked 5 November 2026.']))).png().toBuffer());
}
const BG='#F0EADB',INK='#111111',ACCENT='#5031AC',TINT='#E5DDFF';
await memory('src/content/blog/rust-vs-go-performance-gateways/rust-vs-go-performance-memory-pairs.png');

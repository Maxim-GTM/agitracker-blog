import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const evidence=JSON.parse(await readFile('docs/benchmark-evidence-2026-11-05.json','utf8'));
const failures=[];
async function files(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('_'))continue;const p=join(dir,e.name);if(e.isDirectory())out.push(...await files(p));else if(/\.mdx?$/.test(p))out.push(p);}return out;}
const root=evidence.articles[0].startsWith('src/content/blog/')?'src/content/blog':'src/content/articles';
const corpus=await files(root);
for(const p of corpus){const s=await readFile(p,'utf8');for(const [index,line] of s.split('\n').entries()){
 if(line.startsWith('*Correction'))continue;
 const universal=/(?:memory|RSS|smaller).{0,140}\b(?:in every (?:file|pair|published measurement)|in all (?:files|pairs))/i.test(line);
 const missingCpu=/(?:no file (?:found|behind)|(?:none|no [^.!?]{0,35}file|absent)[^.!?]{0,45}~21%|~21%.{0,90}(?:unsupported|no file|not found))/i.test(line);
 const badMax=/highest.{0,45}36\s*MB.{0,60}(?:below|<).{0,30}lowest.{0,20}144/i.test(line);
 if(universal||missingCpu||badMax||/When GenAI Brief put the question/.test(line))failures.push(`${p}:${index+1}: retired benchmark assertion`);
 }}
for(const p of evidence.articles){const s=await readFile(p,'utf8');for(const value of ['throughput_ceiling.csv','242.6','297.1','21.075','v2.4.0','v1.6.4'])if(!s.includes(value))failures.push(`${p}: missing context ${value}`);if(!/three of four|three non-ceiling/i.test(s))failures.push(`${p}: missing mixed-memory qualification`);if(!s.includes(evidence.reference_blog))failures.push(`${p}: missing reference attribution`);}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`Checked ${corpus.length} article files and ${evidence.articles.length} benchmark evidence contexts; no retired assertions found.`);

import sharp from 'sharp';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sourceDir = process.argv[2];
if (!sourceDir) throw new Error('Pass the read-only directory containing the three approved source logos, with a trailing slash.');
const result=[];
for (const [name,ext] of [['toyotomi','png'],['hiolle-technologies','svg'],['carte-noire','png']]) {
 const source=sourceDir+name+'.'+ext;
 const {data,info}=await sharp(source,ext==='svg'?{density:288}:{}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let left=info.width,top=info.height,right=0,bottom=0;
 for (let i=0;i<data.length;i+=4) {
  // Carte Noire's white ribbon becomes solid ink and its black lettering
  // becomes transparent negative space. No shapes are drawn or synthesized.
  if(name==='carte-noire') data[i+3]=Math.round(data[i+3]*data[i]/255);
  data[i]=data[i+1]=data[i+2]=0;
  if(data[i+3]>0){const x=(i/4)%info.width,y=Math.floor((i/4)/info.width);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 }
 const file='public/clients/'+name+'.png';
 const crop={left,top,width:right-left+1,height:bottom-top+1};
 await sharp(data,{raw:info}).extract(crop).resize({height:120}).png().toFile(file);
 const meta=await sharp(file).metadata();
 const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 result.push({file,source:'~/parrit-canon/docs/site-benchmark/logos-clients/'+name+'.'+ext,sourceSha256:hash(source),sha256:hash(file),width:meta.width,height:meta.height,crop,conversion:name==='carte-noire'?'alpha × luminance, negative lettering':'alpha preserved, RGB set to black'});
}
writeFileSync('tests/fixtures/new-client-logos.json',JSON.stringify(result,null,2)+'\n');
console.log(result);

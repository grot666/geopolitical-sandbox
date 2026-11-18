export const keys=['kineticIntensity','systemicSpillover','greatPowerInvolvement','geographicLeverage'];
export function score(scores,weights){
 if(weights.length!==4 || weights.some(w=>!Number.isFinite(w)||w<0)) throw Error('Invalid weights');
 const sum=weights.reduce((a,b)=>a+b,0);
 if(!sum) throw Error('At least one positive weight required');
 if(keys.some(k=>!Number.isFinite(scores[k])||scores[k]<0||scores[k]>100)) throw Error('Scores out of range');
 return Math.round(keys.reduce((s,k,i)=>s+scores[k]*weights[i],0)/sum*10)/10;
}
export function rank(nodes,weights){return [...nodes].sort((a,b)=>score(b.scores,weights)-score(a.scores,weights)||a.id.localeCompare(b.id));}
export function markerSize(value){return 12+value*.25;}

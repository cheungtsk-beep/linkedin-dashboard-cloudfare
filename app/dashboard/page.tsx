"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Download, Filter, Linkedin, LineChart as LineChartIcon, PieChart as PieChartIcon, Settings, Sparkles, RefreshCcw, Link as LinkIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const PALETTE = { navy: "#0A3D62", electric: "#1F8EFA", electricDark: "#1669C9", softWhite: "#F8FAFC", slate: "#64748B", accent: "#2DD4BF" };

type Post = { id:string; date:string; title:string; content:string; impressions:number; likes:number; comments:number; reposts:number; followersDelta?:number; topic:"VXAI"|"Raeon"|"Leadership"|"Football"|"Personal"|"Other"; format:"Text"|"Image"|"Video"|"Link"; tone:"Founder"|"Corporate"|"Reflective"|"Analytical"|"Personal"; authenticity:number; outsideReposts?:number; url?:string; };

const MOCK_POSTS: Post[] = [
  { id: "p1", date: new Date().toISOString().slice(0,10), title: "Raffles Family Office post", content: "Ten years of building… legacy rooted in trust…", impressions: 8200, likes:186, comments:21, reposts:7, followersDelta:23, topic:"Leadership", format:"Image", tone:"Founder", authenticity:78, outsideReposts:1, url:"#"},
  { id: "p2", date: new Date(Date.now()-1000*60*60*24*4).toISOString().slice(0,10), title: "CR7® LIFE HK opening", content: "Honoured to support the launch at Times Square…", impressions:15600, likes:402, comments:55, reposts:18, followersDelta:61, topic:"Football", format:"Image", tone:"Corporate", authenticity:63, outsideReposts:6, url:"#"},
  { id: "p3", date: new Date(Date.now()-1000*60*60*24*9).toISOString().slice(0,10), title: "VXAI growth drivers", content: "We’re building an AI-driven creative engine…", impressions:9800, likes:210, comments:19, reposts:10, followersDelta:35, topic:"VXAI", format:"Link", tone:"Analytical", authenticity:70, outsideReposts:2, url:"#"},
];

const fmt = new Intl.NumberFormat();
function engagementRate(p: Post){ const t=p.likes+p.comments+p.reposts; return p.impressions>0 ? (t/p.impressions)*100 : 0; }

function useDerived(posts: Post[]){
  const totals = useMemo(()=>{
    const impressions = posts.reduce((a,b)=>a+b.impressions,0);
    const likes = posts.reduce((a,b)=>a+b.likes,0);
    const comments = posts.reduce((a,b)=>a+b.comments,0);
    const reposts = posts.reduce((a,b)=>a+b.reposts,0);
    const followers = posts.reduce((a,b)=>a+(b.followersDelta||0),0);
    const avgAuth = posts.length ? Math.round(posts.reduce((a,b)=>a+b.authenticity,0)/posts.length) : 0;
    const top = [...posts].sort((a,b)=>(b.likes+b.comments+b.reposts)-(a.likes+a.comments+a.reposts))[0];
    return { impressions, likes, comments, reposts, followers, avgAuth, top };
  },[posts]);
  const timeline = useMemo(()=>{
    const by:Record<string,{date:string; impressions:number; engagement:number}> = {};
    posts.forEach(p=>{ const d=p.date; const e=p.likes+p.comments+p.reposts; if(!by[d]) by[d]={date:d, impressions:0, engagement:0}; by[d].impressions+=p.impressions; by[d].engagement+=e; });
    return Object.values(by).sort((a,b)=>a.date.localeCompare(b.date));
  },[posts]);
  const mixData = useMemo(()=>{
    const total = posts.reduce((a,b)=>a+b.likes+b.comments+b.reposts,0)||1;
    const likes = posts.reduce((a,b)=>a+b.likes,0);
    const comments = posts.reduce((a,b)=>a+b.comments,0);
    const reposts = posts.reduce((a,b)=>a+b.reposts,0);
    return [{name:"Likes", value:likes, pct:(likes/total)*100},{name:"Comments", value:comments, pct:(comments/total)*100},{name:"Reposts", value:reposts, pct:(reposts/total)*100}];
  },[posts]);
  const topicBars = useMemo(()=>{
    const by:Record<string,{topic:string; engagement:number}>={};
    posts.forEach(p=>{ const e=p.likes+p.comments+p.reposts; if(!by[p.topic]) by[p.topic]={topic:p.topic, engagement:0}; by[p.topic].engagement+=e; });
    return Object.values(by);
  },[posts]);
  return { totals, timeline, mixData, topicBars };
}

function extractKeywords(posts: Post[]): { word:string; count:number }[] {
  const stop=new Set(["the","a","and","or","of","to","we","our","is","in","on","for","with","this","that","it","at","as","be","are","was","by","an","from"]);
  const freq:Record<string,number>={}; posts.forEach(p=>{ const text=(p.title+" "+p.content).toLowerCase(); text.replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(w=>w && !stop.has(w) && w.length>2).forEach(w=>{freq[w]=(freq[w]||0)+1});}); return Object.entries(freq).map(([word,count])=>({word,count})).sort((a,b)=>b.count-a.count).slice(0,30);
}

function Card({ children }: { children: React.ReactNode }){ return <div className=\"rounded-2xl border border-slate-200 shadow-sm bg-white\">{children}</div>; }
function CardContent({ children, className=\"\" }:{ children:React.ReactNode; className?:string }){ return <div className={className}>{children}</div>; }
function Button({ children, variant=\"default\", ...props }: any){ const base=\"inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm transition\"; const styles:Record<string,string>={default:\"bg-slate-900 text-white hover:opacity-90\", outline:\"border border-slate-300 text-slate-700 hover:bg-slate-50\", secondary:\"bg-blue-500 text-white hover:opacity-90\"}; return <button className={\`\${base} \${styles[variant]||styles.default}\`} {...props}>{children}</button>; }
function Badge({ children, style }: any){ return <span className=\"inline-flex items-center rounded-full px-2 py-1 text-xs\" style={style}>{children}</span>; }

export default function Page(){
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [query, setQuery] = useState(\""); const [topic,setTopic]=useState<string>(\"all\"); const [format,setFormat]=useState<string>(\"all\"); const [tone,setTone]=useState<string>(\"all\"); const [dark,setDark]=useState(false); const [loading,setLoading]=useState(false); const [status,setStatus]=useState<string>(\"Ready.\");

  useEffect(()=>{ document.documentElement.classList.toggle(\"dark\", dark); },[dark]);

  const filtered = useMemo(()=> posts.filter(p=>{ const qOk=!query || (p.title+\" \"+p.content).toLowerCase().includes(query.toLowerCase()); const tOk=topic===\"all\"||p.topic===topic; const fOk=format===\"all\"||p.format===format; const toneOk=tone===\"all\"||p.tone===tone; return qOk&&tOk&&fOk&&toneOk; }),[posts,query,topic,format,tone]);
  const { totals, timeline, mixData, topicBars } = useDerived(filtered);
  const cloud = extractKeywords(filtered);

  const loadFromApi = async () => {
    try { setLoading(true); setStatus(\"Syncing…\"); const res = await fetch(\"/api/linkedin/posts\"); if (!res.ok) throw new Error(\"Failed\"); const data = await res.json(); if (Array.isArray(data) && data.length) { setPosts(data); setStatus(\`Loaded \${data.length} posts\`);} else { setStatus(\"Connected, but no normalized data found. Using local sample.\"); } }
    catch(e){ setStatus(\"Error syncing. Using local sample.\"); } finally { setLoading(false); }
  };

  useEffect(()=>{ loadFromApi(); },[]);

  const exportJson = () => { const blob=new Blob([JSON.stringify(posts,null,2)],{type:\"application/json\"}); const url=URL.createObjectURL(blob); const a=document.createElement(\"a\"); a.href=url; a.download=\"linkedin_posts.json\"; a.click(); URL.revokeObjectURL(url); };

  return (<div className=\"min-h-screen w-full p-4 md:p-6 lg:p-8 bg-white text-slate-900\"><div className=\"mx-auto max-w-7xl space-y-6\">
    <div className=\"flex flex-col gap-4 md:flex-row md:items-center md:justify-between\">
      <div>
        <h1 className=\"text-2xl md:text-3xl font-semibold tracking-tight\" style={{color:PALETTE.navy}}>LinkedIn Performance Dashboard</h1>
        <p className=\"text-slate-500\">Live workspace to track growth, engagement, and your authentic voice.</p>
        <div className=\"text-xs\" style={{color:PALETTE.slate}}>{status}</div>
      </div>
      <div className=\"flex items-center gap-2\">
        <Button variant=\"outline\" onClick={()=>setDark(d=>!d)}><Settings className=\"h-4 w-4 mr-2\"/> {dark?\"Dark\":\"Light\"} mode</Button>
        <Button variant=\"outline\" onClick={()=>{ window.location.href=\"/api/linkedin/start\"; }}><Linkedin className=\"h-4 w-4 mr-2\"/> Connect LinkedIn</Button>
        <Button variant=\"outline\" onClick={loadFromApi} disabled={loading}><RefreshCcw className=\"h-4 w-4 mr-2\"/> {loading?\"Syncing...\":\"Refresh\"}</Button>
        <Button onClick={exportJson}><Download className=\"h-4 w-4 mr-2\"/> Export</Button>
      </div>
    </div>

    <Card><CardContent className=\"p-4\">
      <div className=\"grid grid-cols-1 md:grid-cols-5 gap-4 items-end\">
        <div className=\"md:col-span-2\">
          <label className=\"block text-sm font-medium mb-1\">Search</label>
          <input className=\"w-full rounded-xl border border-slate-300 px-3 py-2\" placeholder=\"Find posts, themes, or phrases…\" value={query} onChange={(e)=>setQuery(e.target.value)}/>
        </div>
        <SelectField label=\"Topic\" value={topic} onChange={setTopic} options={[\"all\",\"VXAI\",\"Raeon\",\"Leadership\",\"Football\",\"Personal\",\"Other\"]}/>
        <SelectField label=\"Format\" value={format} onChange={setFormat} options={[\"all\",\"Text\",\"Image\",\"Video\",\"Link\"]}/>
        <SelectField label=\"Tone\" value={tone} onChange={setTone} options={[\"all\",\"Founder\",\"Corporate\",\"Reflective\",\"Analytical\",\"Personal\"]}/>
      </div>
    </CardContent></Card>

    <div className=\"grid grid-cols-2 md:grid-cols-6 gap-4\">
      <StatCard label=\"Posts\" value={filtered.length} color={PALETTE.electric}/>
      <StatCard label=\"Impressions\" value={fmt.format(totals.impressions)} color={PALETTE.navy}/>
      <StatCard label=\"Likes\" value={fmt.format(totals.likes)} color={PALETTE.electricDark}/>
      <StatCard label=\"Comments\" value={fmt.format(totals.comments)} color={PALETTE.navy}/>
      <StatCard label=\"Reposts\" value={fmt.format(totals.reposts)} color={PALETTE.electric}/>
      <StatCard label=\"New Followers\" value={fmt.format(totals.followers)} color={PALETTE.accent}/>
    </div>

    <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-4\">
      <Card className=\"col-span-1 lg:col-span-2\"><CardContent className=\"p-4\">
        <div className=\"flex items-center justify-between mb-2\">
          <h3 className=\"font-medium flex items-center gap-2\" style={{color:PALETTE.navy}}><LineChartIcon className=\"h-4 w-4\"/> Engagement & Impressions over time</h3>
          <Badge style={{background:PALETTE.softWhite,color:PALETTE.navy,border:`1px solid ${PALETTE.navy}33`}}>Daily</Badge>
        </div>
        <div className=\"h-64\">
          <ResponsiveContainer width=\"100%\" height=\"100%\"><LineChart data={timeline}>
            <defs>
              <linearGradient id=\"gradEng\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stopColor={PALETTE.electric} stopOpacity={1}/><stop offset=\"100%\" stopColor={PALETTE.electricDark} stopOpacity={0.6}/></linearGradient>
              <linearGradient id=\"gradImpr\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stopColor={PALETTE.navy} stopOpacity={1}/><stop offset=\"100%\" stopColor={PALETTE.navy} stopOpacity={0.5}/></linearGradient>
            </defs>
            <XAxis dataKey=\"date\" tick={{fontSize:12, fill:PALETTE.slate}}/>
            <YAxis yAxisId=\"left\" tick={{fontSize:12, fill:PALETTE.slate}}/>
            <YAxis yAxisId=\"right\" orientation=\"right\" tick={{fontSize:12, fill:PALETTE.slate}}/>
            <Tooltip/><Legend/>
            <Line yAxisId=\"left\" type=\"monotone\" dataKey=\"engagement\" name=\"Engagement\" strokeWidth={3} dot={false} stroke=\"url(#gradEng)\"/>
            <Line yAxisId=\"right\" type=\"monotone\" dataKey=\"impressions\" name=\"Impressions\" strokeWidth={2} dot={false} stroke=\"url(#gradImpr)\"/>
          </LineChart></ResponsiveContainer>
        </div>
      </CardContent></Card>

      <Card><CardContent className=\"p-4\">
        <div className=\"flex items-center justify-between mb-2\">
          <h3 className=\"font-medium flex items-center gap-2\" style={{color:PALETTE.navy}}><PieChartIcon className=\"h-4 w-4\"/> Interaction mix</h3>
        </div>
        <div className=\"h-64\">
          <ResponsiveContainer width=\"100%\" height=\"100%\"><PieChart>
            <Pie data={mixData} dataKey=\"value\" nameKey=\"name\" outerRadius={90} label>
              {mixData.map((_,i)=>(<Cell key={i} fill={[PALETTE.electric,PALETTE.navy,PALETTE.accent][i%3]}/>))}
            </Pie><Legend/>
          </PieChart></ResponsiveContainer>
        </div>
      </CardContent></Card>
    </div>

    <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-4\">
      <Card className=\"col-span-1 lg:col-span-2\"><CardContent className=\"p-4\">
        <div className=\"flex items-center justify-between mb-2\">
          <h3 className=\"font-medium flex items-center gap-2\" style={{color:PALETTE.navy}}><LineChartIcon className=\"h-4 w-4\"/> Engagement by Topic</h3>
        </div>
        <div className=\"h-64\">
          <ResponsiveContainer width=\"100%\" height=\"100%\"><BarChart data={topicBars}>
            <XAxis dataKey=\"topic\" tick={{fontSize:12, fill:PALETTE.slate}}/>
            <YAxis tick={{fontSize:12, fill:PALETTE.slate}}/>
            <Tooltip/>
            <Bar dataKey=\"engagement\" fill={PALETTE.electric}/>
          </BarChart></ResponsiveContainer>
        </div>
      </CardContent></Card>

      <Card><CardContent className=\"p-4\">
        <div className=\"flex items-center justify-between mb-3\">
          <h3 className=\"font-medium flex items-center gap-2\" style={{color:PALETTE.navy}}><Sparkles className=\"h-4 w-4\"/> Authenticity Index</h3>
          <Badge style={{background:PALETTE.electric,color:\"white\"}}>Avg {useDerived(filtered).totals.avgAuth}%</Badge>
        </div>
        <div className=\"space-y-2\">
          <p className=\"text-sm text-slate-500\">Measures how personal/story-driven your posts are (0–100). Aim for 65–85% for a balanced founder voice.</p>
          <div className=\"flex flex-wrap gap-2\">
            {extractKeywords(filtered).map(({word,count}) => (<span key={word} className=\"rounded-full px-3 py-1\" style={{background:PALETTE.softWhite,color:PALETTE.navy,border:`1px solid ${PALETTE.navy}22`, fontSize:`${12+count*2}px`}}>{word}</span>))}
          </div>
        </div>
      </CardContent></Card>
    </div>

    <Card><CardContent className=\"p-4\">
      <div className=\"flex items-center justify-between mb-3\">
        <h3 className=\"font-medium flex items-center gap-2\" style={{color:PALETTE.navy}}><LinkIcon className=\"h-4 w-4\"/> Posts</h3>
        <Button variant=\"outline\" onClick={()=>setPosts(prev=>[...prev].sort((a,b)=>(b.likes+b.comments+b.reposts)-(a.likes+a.comments+a.reposts)))}><Filter className=\"h-4 w-4 mr-2\"/> Sort by engagement</Button>
      </div>
      <div className=\"overflow-x-auto\">
        <table className=\"w-full text-sm\">
          <thead><tr className=\"text-left\" style={{color:PALETTE.slate}}>
            <th className=\"py-2\">Date</th><th className=\"py-2\">Title</th><th className=\"py-2\">Topic</th><th className=\"py-2\">Tone</th><th className=\"py-2\">Format</th><th className=\"py-2\">Impr.</th><th className=\"py-2\">Likes</th><th className=\"py-2\">Comms</th><th className=\"py-2\">Reposts</th><th className=\"py-2\">Eng. %</th><th className=\"py-2\">Outside Reposts</th><th className=\"py-2\">Open</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (<tr key={p.id} className=\"border-b\" style={{borderColor:PALETTE.navy+\"22\"}}>
              <td className=\"py-2 align-top\">{p.date}</td>
              <td className=\"py-2 align-top max-w-[280px]\"><div className=\"font-medium line-clamp-1\" style={{color:PALETTE.navy}}>{p.title}</div><div className=\"line-clamp-2\" style={{color:PALETTE.slate}}>{p.content}</div></td>
              <td className=\"py-2 align-top\"><span className=\"inline-flex items-center rounded-full px-2 py-1 text-xs\" style={{background:PALETTE.softWhite,color:PALETTE.navy,border:`1px solid ${PALETTE.navy}22`}}>{p.topic}</span></td>
              <td className=\"py-2 align-top\">{p.tone}</td>
              <td className=\"py-2 align-top\">{p.format}</td>
              <td className=\"py-2 align-top\">{fmt.format(p.impressions)}</td>
              <td className=\"py-2 align-top\">{fmt.format(p.likes)}</td>
              <td className=\"py-2 align-top\">{fmt.format(p.comments)}</td>
              <td className=\"py-2 align-top\">{fmt.format(p.reposts)}</td>
              <td className=\"py-2 align-top\">{engagementRate(p).toFixed(2)}%</td>
              <td className=\"py-2 align-top\">{p.outsideReposts ?? 0}</td>
              <td className=\"py-2 align-top\"><a className=\"underline\" style={{color:PALETTE.electric}} href={p.url||\"#\"} target=\"_blank\" rel=\"noreferrer\">Link</a></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </CardContent></Card>

    <div className=\"text-xs text-center py-2\" style={{color:PALETTE.slate}}>Built for Terence’s LinkedIn hub • Option A • Cloudflare Pages (Next-on-Pages)</div>

  </div></div>);
}

function StatCard({ label, value, color }:{label:string; value:string|number; color:string}){
  return (<div className=\"rounded-2xl border border-slate-200 shadow-sm bg-white\"><div className=\"p-4\">
    <div className=\"text-sm\" style={{color:PALETTE.slate}}>{label}</div>
    <div className=\"text-2xl font-semibold\" style={{color}}>{value}</div>
  </div></div>);
}
function SelectField({ label, value, onChange, options }:{label:string; value:string; onChange:(v:string)=>void; options:string[]}){
  return (<div><label className=\"block text-sm font-medium mb-1\">{label}</label><select className=\"w-full rounded-xl border border-slate-300 px-3 py-2\" value={value} onChange={(e)=>onChange(e.target.value)}>
    {options.map(op=><option key={op} value={op}>{op[0].toUpperCase()+op.slice(1)}</option>)}
  </select></div>);
}

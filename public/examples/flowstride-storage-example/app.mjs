import http from 'node:http';
const customers = new Map();
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Flowstride local example</title><style>body{font:18px system-ui;max-width:600px;margin:80px auto;padding:24px;color:#232330}label,input,button{display:block;margin:16px 0}input,button{padding:12px;font:inherit}button{background:#6539c9;border:0;color:white;border-radius:6px}</style></head><body>
<h1>Customer sign in</h1><p>This is a disposable local test application.</p><form><label for="email">Email</label><input id="email" name="email" aria-label="Email" placeholder="Email" type="email" required><button>Sign in</button></form><p id="session-state" data-mode="signed-out">No active customer</p>
<script>
function show(name){document.querySelector('h1').textContent='Welcome, '+name;document.querySelector('#session-state').textContent='Signed in';document.querySelector('#session-state').dataset.mode='signed-in';}
const saved=sessionStorage.getItem('docs.customer');if(saved)show(saved);
document.querySelector('form').addEventListener('submit',async event=>{event.preventDefault();const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.querySelector('input').value})});const data=await response.json();if(!response.ok){document.querySelector('#session-state').textContent=data.error;return;}sessionStorage.setItem('docs.customer',data.name);show(data.name);});
</script></body></html>`;
const server=http.createServer(async(req,res)=>{
 if(req.method==='GET'&&req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(html);}
 if(req.method==='GET'&&req.url==='/favicon.ico'){res.statusCode=204;return res.end();}
 res.setHeader('Content-Type','application/json');
 if(req.method==='POST'&&['/api/customers','/api/login'].includes(req.url)){
  try{let body='';for await(const chunk of req){body+=chunk;if(body.length>65536)throw Error('Too large');}const data=JSON.parse(body);
   if(req.url==='/api/customers'){if(typeof data.email!=='string'||typeof data.name!=='string')throw Error('Missing fields');customers.set(data.email,data.name);res.statusCode=201;return res.end(JSON.stringify({id:'DOCS-001',email:data.email}));}
   const name=customers.get(data.email);if(!name){res.statusCode=404;return res.end(JSON.stringify({error:'Create the customer first'}));}return res.end(JSON.stringify({name}));
  }catch{res.statusCode=400;return res.end(JSON.stringify({error:'Invalid example request'}));}
 }
 res.statusCode=404;res.end(JSON.stringify({error:'Not found'}));
});
server.listen(4174,'127.0.0.1',()=>console.log('Local example: http://127.0.0.1:4174'));

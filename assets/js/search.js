// Works with /search.json produced by _includes/search_lunr.html
async function runSearch(){
  const box = document.getElementById('q');
  const list = document.getElementById('results');
  const data = await fetch('/search.json').then(r=>r.json());
  const idx = lunr(function(){
    this.ref('url');
    this.field('title');
    this.field('content');
    this.field('tags');
    data.forEach(doc=>this.add(doc));
  });
  function render(items){
    list.innerHTML = items.map(d=>`<li><a href="${d.url}">${d.title}</a><div class="small muted">${d.date} — ${d.tags.join(', ')}</div></li>`).join('');
  }
  function doSearch(){
    const q = box.value.trim();
    if(!q){ list.innerHTML=''; return; }
    const hits = idx.search(q);
    const mapped = hits.map(h=> data.find(d=>d.url===h.ref));
    render(mapped);
  }
  box.addEventListener('input', doSearch);
}
if(document.getElementById('q')) runSearch();

(function(){
  const root = document.documentElement;
  function setTheme(mode){
    if(mode === 'dark'){ root.classList.add('dark'); localStorage.setItem('theme','dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme','light'); }
  }
  window.__toggleTheme = function(){
    const isDark = root.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }
  // init
  const saved = localStorage.getItem('theme');
  if(saved){ setTheme(saved); }
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ setTheme('dark'); }
})();

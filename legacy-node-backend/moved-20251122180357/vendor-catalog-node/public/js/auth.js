// auth helper: manage token, logout, and UI toggles
function getToken(){ return localStorage.getItem('token'); }
function isLoggedIn(){ return !!getToken(); }
function logout(){ localStorage.removeItem('token'); window.location.href = '/'; }

function applyAuthUI(){
  // show/hide login/logout links and admin buttons
  const token = getToken();
  document.querySelectorAll('.needs-auth').forEach(el=>{ el.style.display = token ? '' : 'none'; });
  document.querySelectorAll('.no-auth').forEach(el=>{ el.style.display = token ? 'none' : ''; });
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){ logoutBtn.addEventListener('click', logout); }
}

window.addEventListener('load', ()=>{ try{ applyAuthUI(); }catch(e){} });

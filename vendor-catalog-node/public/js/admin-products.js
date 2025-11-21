async function loadVendors(selectEl){
  const res = await fetch('/api/vendors');
  if (!res.ok) return;
  const list = await res.json();
  selectEl.innerHTML = '<option value="">Select vendor</option>' + list.map(v=>`<option value="${v.id}">${v.vendor_name}</option>`).join('');
}

async function loadProductsList(){
  const res = await fetch('/api/products');
  if (!res.ok) return;
  const list = await res.json();
  const container = document.getElementById('adminProductsList');
  container.innerHTML = '';
  for (const p of list){
    const el = document.createElement('div');
    el.className = 'p-3 border rounded flex justify-between items-start';
    const left = document.createElement('div');
    left.innerHTML = `<div class="font-medium">${p.product_name}</div><div class="text-sm text-slate-600">${p.description||''}</div>`;
    const right = document.createElement('div');
    right.className = 'text-right';
    right.innerHTML = `<div class="text-sm">${p.price ? '$'+p.price : ''}</div><div class="text-xs text-slate-500">MOQ: ${p.moq||'-'}</div>`;
    el.appendChild(left); el.appendChild(right);
    container.appendChild(el);
  }
}

window.addEventListener('load', async ()=>{
  const form = document.getElementById('adminProductForm');
  const vendorSelect = form.querySelector('select[name=vendor_id]');
  await loadVendors(vendorSelect);
  await loadProductsList();

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = document.getElementById('adminFormMsg'); msg.innerText = '';
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.vendor_id) { msg.innerText = 'Please select a vendor'; return; }
    if (!data.product_name || data.product_name.trim().length<2){ msg.innerText = 'Product name required'; return; }
    const token = localStorage.getItem('token');
    if (!token){ msg.innerText = 'You must be logged in as admin to create products'; return; }
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify(data) });
    if (!res.ok){ const err = await res.json().catch(()=>({ error: 'Failed' })); msg.innerText = err.error || 'Failed to create'; return; }
    form.reset();
    await loadProductsList();
    msg.innerText = 'Product created';
    setTimeout(()=>msg.innerText='',2000);
  });

  document.getElementById('clearBtn').addEventListener('click', ()=>{ form.reset(); });

  // apply auth UI visibility from existing auth.js
  if (typeof applyAuthUI === 'function') applyAuthUI();
});
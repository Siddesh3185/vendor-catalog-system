async function loadProducts() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/products', { headers: token?{'Authorization':'Bearer '+token}:{}});
  const list = await res.json();
  const tbody = document.getElementById('productsList');
  tbody.innerHTML = '';
  for (const [idx, p] of list.entries()) {
    // fetch vendor name
    let vendorName = '';
    if (p.vendor_id) {
      const r = await fetch('/api/vendors/' + p.vendor_id);
      if (r.ok) { const v = await r.json(); vendorName = v.vendor_name; }
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${idx+1}</td>
      <td class="px-4 py-2">${p.product_name}</td>
      <td class="px-4 py-2">${vendorName}</td>
      <td class="px-4 py-2">${p.price || ''}</td>
      <td class="px-4 py-2">
        <button data-id="${p.id}" class="edit btn px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
        <button data-id="${p.id}" class="del btn px-3 py-1 bg-red-600 text-white rounded">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

async function loadVendorsIntoSelect(select){
  const res = await fetch('/api/vendors');
  const list = await res.json();
  select.innerHTML = '<option value="">Select vendor</option>' + list.map(v=>`<option value="${v.id}">${v.vendor_name}</option>`).join('');
}

function toggleForm(show){ document.getElementById('formWrap').classList.toggle('hidden', !show); }

window.addEventListener('load', async ()=>{
  await loadProducts();
  await loadVendorsIntoSelect(document.querySelector('select[name=vendor_id]'));
  document.getElementById('showAdd').addEventListener('click', ()=>{ toggleForm(true); document.getElementById('productForm').reset(); });
  document.getElementById('cancel').addEventListener('click', ()=>toggleForm(false));

  document.getElementById('productForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const msgEl = document.getElementById('productFormMsg'); if (msgEl) msgEl.innerText = '';
    // basic validation
    if (!data.product_name || data.product_name.trim().length < 2) { if (msgEl) msgEl.innerText = 'Product name is required'; return; }
    if (!data.vendor_id) { if (msgEl) msgEl.innerText = 'Please select a vendor'; return; }
    const token = localStorage.getItem('token');
    if (data.id) await fetch('/api/products/'+data.id, { method:'PUT', headers:Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{}), body: JSON.stringify(data) });
    else await fetch('/api/products', { method:'POST', headers:Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{}), body: JSON.stringify(data) });
    toggleForm(false);
    await loadProducts();
  });

  document.getElementById('productsList').addEventListener('click', async (e)=>{
    if (e.target.classList.contains('del')){
      if (!confirm('Delete product?')) return;
      const token = localStorage.getItem('token');
      await fetch('/api/products/' + e.target.dataset.id, { method:'DELETE', headers: token?{'Authorization':'Bearer '+token}:{}});
      await loadProducts();
    }
      if (e.target.classList.contains('edit')){
      const res = await fetch('/api/products/' + e.target.dataset.id);
      const product = await res.json();
      const form = document.getElementById('productForm');
      form.id.value = product.id;
      form.vendor_id.value = product.vendor_id || '';
      form.product_name.value = product.product_name || '';
      form.price.value = product.price || '';
      form.moq.value = product.moq || '';
      form.description.value = product.description || '';
      toggleForm(true);
    }
  });

  document.getElementById('search').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    Array.from(document.querySelectorAll('#productsList tr')).forEach(tr=>{ tr.style.display = tr.innerText.toLowerCase().includes(q) ? '' : 'none'; });
  });
});

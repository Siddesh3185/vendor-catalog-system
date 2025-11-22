async function loadVendors() {
  const headers = {};
  const token = localStorage.getItem('token'); if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch('/api/vendors', { headers });
  const list = await res.json();
  const tbody = document.getElementById('vendorsList');
  tbody.innerHTML = '';
  list.forEach((v, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${idx+1}</td>
      <td class="px-4 py-2">${v.vendor_name}</td>
      <td class="px-4 py-2">${v.category||''}</td>
      <td class="px-4 py-2">${v.status}</td>
      <td class="px-4 py-2">
        <button data-id="${v.id}" class="edit btn px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
        <button data-id="${v.id}" class="del btn px-3 py-1 bg-red-600 text-white rounded">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleForm(show){
  document.getElementById('formWrap').classList.toggle('hidden', !show);
}

window.addEventListener('load', async ()=>{
  await loadVendors();
  document.getElementById('showAdd').addEventListener('click', ()=>{ toggleForm(true); document.getElementById('vendorForm').reset(); });
  document.getElementById('cancel').addEventListener('click', ()=>toggleForm(false));

  document.getElementById('vendorForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const msgEl = document.getElementById('vendorFormMsg'); if (msgEl) msgEl.innerText = '';
    // basic validation
    if (!data.vendor_name || data.vendor_name.trim().length < 2) { if (msgEl) msgEl.innerText = 'Vendor name is required (min 2 chars)'; return; }
    if (data.id) {
      await fetch('/api/vendors/' + data.id, { method:'PUT', headers:Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{},), body: JSON.stringify(data) });
    } else {
      await fetch('/api/vendors', { method:'POST', headers:Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{}), body: JSON.stringify(data) });
    }
    toggleForm(false);
    await loadVendors();
  });

  document.getElementById('vendorsList').addEventListener('click', async (e)=>{
    if (e.target.classList.contains('del')){
      if (!confirm('Delete vendor?')) return;
      const id = e.target.dataset.id;
      await fetch('/api/vendors/' + id, { method:'DELETE', headers: token?{'Authorization':'Bearer '+token}:{}});
      await loadVendors();
    }
    if (e.target.classList.contains('edit')){
      const id = e.target.dataset.id;
      const res = await fetch('/api/vendors/' + id);
      const vendor = await res.json();
      const form = document.getElementById('vendorForm');
      form.id.value = vendor.id;
      form.vendor_name.value = vendor.vendor_name || '';
      form.gst_no.value = vendor.gst_no || '';
      form.category.value = vendor.category || '';
      form.address.value = vendor.address || '';
      toggleForm(true);
    }
  });

  document.getElementById('search').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase();
    Array.from(document.querySelectorAll('#vendorsList tr')).forEach(tr=>{
      tr.style.display = tr.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});

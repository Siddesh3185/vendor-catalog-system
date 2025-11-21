async function loadContacts(){
  const token = localStorage.getItem('token');
  const res = await fetch('/api/contacts', { headers: token?{'Authorization':'Bearer '+token}:{}});
  const list = await res.json();
  const tbody = document.getElementById('contactsList');
  tbody.innerHTML = '';
  for (const [idx,c] of list.entries()){
    let vendorName = '';
    if (c.vendor_id){ const r = await fetch('/api/vendors/'+c.vendor_id); if (r.ok){ const v=await r.json(); vendorName=v.vendor_name; }}
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${idx+1}</td>
      <td class="px-4 py-2">${c.name}</td>
      <td class="px-4 py-2">${vendorName}</td>
      <td class="px-4 py-2">${c.phone||''}</td>
      <td class="px-4 py-2">
        <button data-id="${c.id}" class="edit btn px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
        <button data-id="${c.id}" class="del btn px-3 py-1 bg-red-600 text-white rounded">Delete</button>
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
  await loadContacts();
  await loadVendorsIntoSelect(document.querySelector('select[name=vendor_id]'));
  document.getElementById('showAdd').addEventListener('click', ()=>{ toggleForm(true); document.getElementById('contactForm').reset(); });
  document.getElementById('cancel').addEventListener('click', ()=>toggleForm(false));

  document.getElementById('contactForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const msgEl = document.getElementById('contactFormMsg'); if (msgEl) msgEl.innerText = '';
    if (!data.name || data.name.trim().length < 2) { if (msgEl) msgEl.innerText = 'Contact name is required'; return; }
    if (!data.vendor_id) { if (msgEl) msgEl.innerText = 'Please select a vendor'; return; }
    const token = localStorage.getItem('token');
    if (data.id) await fetch('/api/contacts/'+data.id, { method:'PUT', headers:Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{}), body: JSON.stringify(data) });
    else await fetch('/api/contacts', { method:'POST', headers:Object.assign({'Content-Type':'application/json'}, token?{'Authorization':'Bearer '+token}:{}), body: JSON.stringify(data) });
    toggleForm(false);
    await loadContacts();
  });

  document.getElementById('contactsList').addEventListener('click', async (e)=>{
    if (e.target.classList.contains('del')){
      if (!confirm('Delete contact?')) return;
      const token = localStorage.getItem('token');
      await fetch('/api/contacts/' + e.target.dataset.id, { method:'DELETE', headers: token?{'Authorization':'Bearer '+token}:{}});
      await loadContacts();
    }
    if (e.target.classList.contains('edit')){
      const res = await fetch('/api/contacts/' + e.target.dataset.id);
      const contact = await res.json();
      const form = document.getElementById('contactForm');
      form.id.value = contact.id;
      form.vendor_id.value = contact.vendor_id || '';
      form.name.value = contact.name || '';
      form.email.value = contact.email || '';
      form.phone.value = contact.phone || '';
      form.designation.value = contact.designation || '';
      toggleForm(true);
    }
  });

  document.getElementById('search').addEventListener('input', (e)=>{ const q = e.target.value.toLowerCase(); Array.from(document.querySelectorAll('#contactsList tr')).forEach(tr=>{ tr.style.display = tr.innerText.toLowerCase().includes(q) ? '' : 'none'; }); });
});

async function fetchCounts() {
  const [v,p,c] = await Promise.all([
    fetch('/api/vendors').then(r=>r.json()),
    fetch('/api/products').then(r=>r.json()),
    fetch('/api/contacts').then(r=>r.json())
  ]);
  document.getElementById('vendorsCount').innerText = v.length;
  document.getElementById('productsCount').innerText = p.length;
  document.getElementById('contactsCount').innerText = c.length;
  const ul = document.getElementById('recentVendors');
  ul.innerHTML = '';
  v.slice(0,5).forEach(item => {
    const li = document.createElement('li');
    li.className = 'border p-2 rounded';
    li.innerHTML = `<strong>${item.vendor_name}</strong><div class="text-sm text-gray-600">${item.category||''}</div>`;
    ul.appendChild(li);
  });

}

window.addEventListener('load', () => {
  fetchCounts();
});

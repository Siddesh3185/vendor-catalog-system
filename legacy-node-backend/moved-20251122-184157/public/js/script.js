document.addEventListener('DOMContentLoaded', function(){
	// Table search
	const search = document.querySelector('#tableSearch');
	if(search){
		search.addEventListener('input', function(e){
			const q = e.target.value.toLowerCase();
			const tbody = document.querySelector('table tbody');
			if(!tbody) return;
			Array.from(tbody.rows).forEach(row=>{
				const text = row.innerText.toLowerCase();
				row.style.display = text.indexOf(q) === -1 ? 'none' : '';
			})
		})
	}

	// Delete confirmations
	document.querySelectorAll('.btn-delete').forEach(btn=>{
		btn.addEventListener('click', function(e){
			const id = this.dataset.id;
			const href = this.dataset.href;
			if(confirm('Are you sure you want to delete this item?')){
				// If dataset.href provided, navigate to server route
				if(href){ window.location.href = href; return }
				// else try fetch delete
				fetch(`/api/delete/${id}`, {method:'DELETE'}).then(r=>{
					if(r.ok) location.reload(); else alert('Delete failed');
				}).catch(()=>alert('Delete failed'))
			}
		})
	})
})


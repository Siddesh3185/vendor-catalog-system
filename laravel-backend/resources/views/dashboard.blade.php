@extends('layout')

@section('content')
<section class="hero" style="background-image: url('/images/hero-bg.jpg'); background-size: cover; background-position: center; padding: 50px 20px; color: white; text-align: center;">
    <h1>Welcome to the Vendor Catalog System</h1>
    <p>Your one-stop solution for managing vendors, products, and contacts efficiently.</p>
    <div class="btn-3d">
        <a href="/vendors" class="btn btn-primary">Get Started</a>
    </div>
</section>

<div class="page-header">
    <h1>Dashboard</h1>
    <div class="controls">
        <input id="tableSearch" class="search-input" placeholder="Search across tables...">
    </div>
</div>

<div class="cards">
    <div class="card">
        <h3>Vendors</h3>
        <div class="muted">{{ $stats['vendors'] ?? '—' }}</div>
    </div>
    <div class="card">
        <h3>Products</h3>
        <div class="muted">{{ $stats['products'] ?? '—' }}</div>
    </div>
    <div class="card">
        <h3>Contacts</h3>
        <div class="muted">{{ $stats['contacts'] ?? '—' }}</div>
    </div>
</div>

<div class="table-wrap">
    <h3>Recently added</h3>
    <table>
        <thead>
            <tr><th>Name</th><th>Type</th><th>Created</th></tr>
        </thead>
        <tbody>
            @if(!empty($recent) && count($recent))
                @foreach($recent as $r)
                    <tr>
                        <td>{{ $r->name }}</td>
                        <td>{{ $r->type ?? '-' }}</td>
                        <td>{{ $r->created_at ? $r->created_at->format('Y-m-d H:i') : '-' }}</td>
                    </tr>
                @endforeach
            @else
                <tr><td colspan="3">No recent items</td></tr>
            @endif
        </tbody>
    </table>
</div>

<style>
.btn-3d { perspective: 1000px; }
.btn-3d a { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; transform: rotateX(0deg) rotateY(0deg); transition: transform 0.3s ease; }
.btn-3d a:hover { transform: rotateX(10deg) rotateY(10deg); }
</style>

<script>
// small helper scripts kept from original
(function(){
  const addContactButton = () => {
    const button = document.createElement('button');
    button.textContent = 'Contact Us';
    button.style.cssText = `position: fixed; bottom: 20px; right: 20px; background-color: #007bff; color: white; border: none; border-radius: 50px; padding: 10px 20px; font-size: 16px; cursor: pointer; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;`;
    button.addEventListener('click', () => window.location.href = '/contacts');
    document.body.appendChild(button);
  };
  addContactButton();
})();
</script>
@endsection
@extends('layout')

@section('content')
<div class="auth-page">
  <h1>Login</h1>
  <form method="POST" action="/login">
    @csrf
    <div>
      <label>Email</label>
      <input type="email" name="email" required>
    </div>
    <div>
      <label>Password</label>
      <input type="password" name="password" required>
    </div>
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
</div>
@endsection
@extends('layout')

@section('content')
<div class="auth-page">
  <h1>Register</h1>
  <form method="POST" action="/register">
    @csrf
    <div>
      <label>Name</label>
      <input type="text" name="name" required>
    </div>
    <div>
      <label>Email</label>
      <input type="email" name="email" required>
    </div>
    <div>
      <label>Password</label>
      <input type="password" name="password" required>
    </div>
    <div>
      <button type="submit">Register</button>
    </div>
  </form>
</div>
@endsection
@extends('layout')

@section('content')
<h1>Add Vendor</h1>
<form action="{{ route('vendors.store') }}" method="POST">
    @csrf
    <label>Name</label>
    <input type="text" name="name" value="{{ old('name') }}" required>
    @error('name')<div class="field-error">{{ $message }}</div>@enderror

    <label>Email</label>
    <input type="email" name="email" value="{{ old('email') }}">
    @error('email')<div class="field-error">{{ $message }}</div>@enderror

    <label>Phone</label>
    <input type="text" name="phone" value="{{ old('phone') }}">
    @error('phone')<div class="field-error">{{ $message }}</div>@enderror

    <label>Address</label>
    <textarea name="address">{{ old('address') }}</textarea>
    @error('address')<div class="field-error">{{ $message }}</div>@enderror

    <button type="submit">Save</button>
</form>
@endsection

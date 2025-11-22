@extends('layout')

@section('content')
<h1>Edit Vendor</h1>
<form action="{{ route('vendors.update', $vendor->id) }}" method="POST">
    @csrf
    @method('PUT')
    <label>Name</label>
    <input type="text" name="name" value="{{ old('name', $vendor->name) }}" required>
    @error('name')<div class="field-error">{{ $message }}</div>@enderror

    <label>Email</label>
    <input type="email" name="email" value="{{ old('email', $vendor->email) }}">
    @error('email')<div class="field-error">{{ $message }}</div>@enderror

    <label>Phone</label>
    <input type="text" name="phone" value="{{ old('phone', $vendor->phone) }}">
    @error('phone')<div class="field-error">{{ $message }}</div>@enderror

    <label>Address</label>
    <textarea name="address">{{ old('address', $vendor->address) }}</textarea>
    @error('address')<div class="field-error">{{ $message }}</div>@enderror

    <button type="submit">Update</button>
</form>
@endsection

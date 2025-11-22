@extends('layout')

@section('content')
<h1>Add Product</h1>
<form action="{{ route('products.store') }}" method="POST">
    @csrf
    <label>Name</label>
    <input type="text" name="name" value="{{ old('name') }}" required>
    @error('name')<div class="field-error">{{ $message }}</div>@enderror

    <label>Description</label>
    <textarea name="description">{{ old('description') }}</textarea>
    @error('description')<div class="field-error">{{ $message }}</div>@enderror

    <label>Price</label>
    <input type="text" name="price" value="{{ old('price') }}">
    @error('price')<div class="field-error">{{ $message }}</div>@enderror

    <label>Vendor</label>
    <select name="vendor_id">
        <option value="">-- none --</option>
        @foreach($vendors as $vendor)
        <option value="{{ $vendor->id }}" @if(old('vendor_id') == $vendor->id) selected @endif>{{ $vendor->name }}</option>
        @endforeach
    </select>
    @error('vendor_id')<div class="field-error">{{ $message }}</div>@enderror

    <label>Image</label>
    <input type="text" name="image" value="{{ old('image') }}">
    @error('image')<div class="field-error">{{ $message }}</div>@enderror

    <button type="submit">Save</button>
</form>
@endsection

@extends('layout')

@section('content')
<h1>Edit Product</h1>
<form action="{{ route('products.update', $product->id) }}" method="POST">
    @csrf
    @method('PUT')
    <label>Name</label>
    <input type="text" name="name" value="{{ old('name', $product->name) }}" required>
    @error('name')<div class="field-error">{{ $message }}</div>@enderror

    <label>Description</label>
    <textarea name="description">{{ old('description', $product->description) }}</textarea>
    @error('description')<div class="field-error">{{ $message }}</div>@enderror

    <label>Price</label>
    <input type="text" name="price" value="{{ old('price', $product->price) }}">
    @error('price')<div class="field-error">{{ $message }}</div>@enderror

    <label>Vendor</label>
    <select name="vendor_id">
        <option value="">-- none --</option>
        @foreach($vendors as $vendor)
        <option value="{{ $vendor->id }}" @if(old('vendor_id', $product->vendor_id) == $vendor->id) selected @endif>{{ $vendor->name }}</option>
        @endforeach
    </select>
    @error('vendor_id')<div class="field-error">{{ $message }}</div>@enderror

    <label>Image</label>
    <input type="text" name="image" value="{{ old('image', $product->image) }}">
    @error('image')<div class="field-error">{{ $message }}</div>@enderror

    <button type="submit">Update</button>
</form>
@endsection

@extends('layout')

@section('content')
<h1>Edit Contact</h1>
<form action="{{ route('contacts.update', $contact->id) }}" method="POST">
    @csrf
    @method('PUT')
    <label>Name</label>
    <input type="text" name="name" value="{{ old('name', $contact->name) }}" required>
    @error('name')<div class="field-error">{{ $message }}</div>@enderror

    <label>Email</label>
    <input type="email" name="email" value="{{ old('email', $contact->email) }}">
    @error('email')<div class="field-error">{{ $message }}</div>@enderror

    <label>Phone</label>
    <input type="text" name="phone" value="{{ old('phone', $contact->phone) }}">
    @error('phone')<div class="field-error">{{ $message }}</div>@enderror

    <label>Vendor</label>
    <select name="vendor_id">
        <option value="">-- none --</option>
        @foreach($vendors as $vendor)
        <option value="{{ $vendor->id }}" @if(old('vendor_id', $contact->vendor_id) == $vendor->id) selected @endif>{{ $vendor->name }}</option>
        @endforeach
    </select>
    @error('vendor_id')<div class="field-error">{{ $message }}</div>@enderror

    <label>Note</label>
    <textarea name="note">{{ old('note', $contact->note) }}</textarea>
    @error('note')<div class="field-error">{{ $message }}</div>@enderror

    <button type="submit">Update</button>
</form>
@endsection

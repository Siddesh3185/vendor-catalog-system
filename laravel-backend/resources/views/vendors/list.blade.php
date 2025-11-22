@extends('layout')

@section('content')
<h1>Vendors</h1>
<p><a href="{{ route('vendors.create') }}">Add Vendor</a></p>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($vendors as $vendor)
        <tr>
            <td>{{ $vendor->id }}</td>
            <td>{{ $vendor->name }}</td>
            <td>{{ $vendor->email }}</td>
            <td>{{ $vendor->phone }}</td>
            <td>
                <a href="{{ route('vendors.edit', $vendor->id) }}">Edit</a> |
                <form action="{{ route('vendors.destroy', $vendor->id) }}" method="POST" style="display:inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" onclick="return confirm('Delete vendor?')">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection

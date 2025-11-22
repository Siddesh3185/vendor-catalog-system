@extends('layout')

@section('content')
<h1>Contacts</h1>
<p><a href="{{ route('contacts.create') }}">Add Contact</a></p>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vendor</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($contacts as $contact)
        <tr>
            <td>{{ $contact->id }}</td>
            <td>{{ $contact->name }}</td>
            <td>{{ $contact->email }}</td>
            <td>{{ $contact->phone }}</td>
            <td>{{ optional($contact->vendor)->name }}</td>
            <td>
                <a href="{{ route('contacts.edit', $contact->id) }}">Edit</a> |
                <form action="{{ route('contacts.destroy', $contact->id) }}" method="POST" style="display:inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" onclick="return confirm('Delete contact?')">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection

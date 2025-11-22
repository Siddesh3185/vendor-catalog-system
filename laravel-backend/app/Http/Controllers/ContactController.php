<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Vendor;

class ContactController extends Controller
{
    /**
     * Display a listing of contacts.
     */
    public function index()
    {
        $contacts = Contact::with('vendor')->orderBy('id', 'desc')->get();
        return view('contacts.list', compact('contacts'));
    }

    /**
     * Show the form for creating a new contact.
     */
    public function create()
    {
        $vendors = Vendor::orderBy('name')->get();
        return view('contacts.add', compact('vendors'));
    }

    /**
     * Store a newly created contact in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'vendor_id' => 'nullable|integer',
            'note' => 'nullable|string'
        ]);

        Contact::create($data);
        return redirect()->route('contacts.index')->with('success', 'Contact created.');
    }

    /**
     * Show the form for editing the specified contact.
     */
    public function edit($id)
    {
        $contact = Contact::findOrFail($id);
        $vendors = Vendor::orderBy('name')->get();
        return view('contacts.edit', compact('contact', 'vendors'));
    }

    /**
     * Update the specified contact in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'vendor_id' => 'nullable|integer',
            'note' => 'nullable|string'
        ]);

        $contact = Contact::findOrFail($id);
        $contact->update($data);

        return redirect()->route('contacts.index')->with('success', 'Contact updated.');
    }

    /**
     * Remove the specified contact from storage.
     */
    public function destroy($id)
    {
        Contact::destroy($id);
        return redirect()->route('contacts.index')->with('success', 'Contact deleted.');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Vendor;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::with('vendor')->orderBy('id', 'desc')->get();
        return view('products.list', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $vendors = Vendor::orderBy('name')->get();
        return view('products.add', compact('vendors'));
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'vendor_id' => 'nullable|integer',
            'image' => 'nullable|string'
        ]);

        Product::create($data);
        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $vendors = Vendor::orderBy('name')->get();
        return view('products.edit', compact('product', 'vendors'));
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'vendor_id' => 'nullable|integer',
            'image' => 'nullable|string'
        ]);

        $product = Product::findOrFail($id);
        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy($id)
    {
        Product::destroy($id);
        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }
}

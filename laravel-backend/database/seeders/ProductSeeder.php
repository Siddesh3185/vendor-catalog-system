<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Vendor;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $vendor = Vendor::first();
        if (!$vendor) return;

        Product::insert([
            ['name' => 'Sample Product A', 'description' => 'Sample product A description', 'price' => 9.99, 'vendor_id' => $vendor->id, 'image' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sample Product B', 'description' => 'Sample product B description', 'price' => 19.99, 'vendor_id' => $vendor->id, 'image' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

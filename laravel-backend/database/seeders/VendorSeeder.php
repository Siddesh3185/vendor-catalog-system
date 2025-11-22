<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vendor;

class VendorSeeder extends Seeder
{
    public function run()
    {
        Vendor::insert([
            ['name' => 'Acme Supplies', 'email' => 'sales@acme.example', 'phone' => '123-456-7890', 'address' => '100 Main St', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Global Industrial', 'email' => 'info@global.example', 'phone' => '555-555-5555', 'address' => '200 Market Ave', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

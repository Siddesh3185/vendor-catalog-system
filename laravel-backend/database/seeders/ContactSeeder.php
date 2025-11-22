<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\Vendor;

class ContactSeeder extends Seeder
{
    public function run()
    {
        $vendor = Vendor::first();
        if (!$vendor) return;

        Contact::insert([
            ['name' => 'Alice Smith', 'email' => 'alice@example.com', 'phone' => '111-222-3333', 'vendor_id' => $vendor->id, 'note' => 'Primary contact', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bob Jones', 'email' => 'bob@example.com', 'phone' => '444-555-6666', 'vendor_id' => $vendor->id, 'note' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

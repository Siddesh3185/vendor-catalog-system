Auth setup notes — Laravel Breeze (PowerShell)

Overview
- These instructions use Laravel Breeze (Blade) to add authentication to the Laravel 10 scaffold.
- Prerequisites on your machine: PHP 8.1+, Composer, Node.js + npm, MySQL (or other supported DB).
- Assumes your Laravel app directory is `laravel-app` located at `C:\Users\Admin\Desktop\vendor-catalog-system\laravel-app`.

Before you start
- Make sure Laravel app exists: if you followed earlier steps you should have `laravel-app`.
- Open PowerShell and confirm versions:

```powershell
php -v
composer -V
node -v
npm -v
```

Step-by-step (exact PowerShell commands)
1) Change to the Laravel application directory

```powershell
cd C:\Users\Admin\Desktop\vendor-catalog-system\laravel-app
```

2) Install Breeze (dev dependency) via Composer

```powershell
composer require laravel/breeze --dev
```

3) Install Breeze scaffolding (Blade views)

```powershell
php artisan breeze:install blade
```

This will scaffold routes, controllers, views, and basic auth logic.

4) Install Node packages and build frontend assets

- For quick local development (hot build), run:

```powershell
npm install
npm run dev
```

- For production build (one-off), run:

```powershell
npm install
npm run build
```

If you prefer to avoid building assets now, you can skip `npm run dev` — the Blade pages work without compiled assets but CSS/JS may be missing.

5) Run migrations (create DB tables)

- Ensure `laravel-app\.env` DB_* values are set (DB_DATABASE, DB_USERNAME, DB_PASSWORD).

```powershell
php artisan migrate
```

6) (Optional) Create a demo user seeder (recommended)

- Create the seeder file:

```powershell
php artisan make:seeder DemoUserSeeder
```

- Edit `database/seeders/DemoUserSeeder.php` and add code to insert a user. Example content (paste into file):

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DemoUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
            ]
        );
    }
}
```

- Then run the seeder (or include it from `DatabaseSeeder`):

```powershell
php artisan db:seed --class=DemoUserSeeder
```

Now you can log in at `/login` with `admin@example.com` / `password` (change the password in production).

7) Protect your resource routes (make admin pages require auth)

- Update `routes/web.php` to wrap resources in `auth` middleware. Example snippet to replace or merge with existing routes:

```php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ContactController;

Route::get('/', function() { return redirect()->route('vendors.index'); });

Route::middleware(['auth'])->group(function () {
    Route::resource('vendors', VendorController::class)->except(['show']);
    Route::resource('products', ProductController::class)->except(['show']);
    Route::resource('contacts', ContactController::class)->except(['show']);
});

require __DIR__.'/auth.php'; // Breeze authentication routes
```

Note: Breeze creates `routes/auth.php` (or modifies routes depending on version) — include it as shown.

8) Serve the app locally

```powershell
php artisan serve
# open http://127.0.0.1:8000/login
```

Troubleshooting hints
- "Could not find driver" when running `php artisan migrate` → enable `pdo_mysql` in `php.ini` (uncomment `extension=pdo_mysql`) and restart PHP.
- Composer memory errors on Windows → try `composer install --no-plugins --no-scripts` then `composer install` or run with increased PHP memory: `php -d memory_limit=-1 composer.phar install`.
- If Breeze command fails, make sure your `composer` is up to date and you're in the Laravel project root.

Post-install tasks I can do for you
- Add `DemoUserSeeder` file into `laravel-backend/database/seeders` here for you to copy into your Laravel project.
- Wire auth middleware into the prepared `routes-web-snippet.txt` (I can update that file for you).
- Configure role-based checks or admin-only middleware.

Tell me which of the post-install tasks you want me to do next (I can add the seeder file and update the route snippet automatically).
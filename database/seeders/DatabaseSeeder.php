<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@bingospao.com',
            'password' => Hash::make('password'),
        ]);

        $this->call([
            SorteoSeeder::class,
            ParticipanteSeeder::class,
            GanadorSeeder::class,
        ]);
    }
}

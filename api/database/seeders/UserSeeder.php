<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()->updateOrCreate([
            'email' => 'test@gmail.com',
        ], [
            'name' => 'Test',
            'password' => bcrypt('12345678'),
        ]);
    }
}

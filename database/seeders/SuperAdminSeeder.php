<?php

namespace Database\Seeders;

use App\Models\User;
use App\RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@sipeta.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => RoleEnum::SUPER_ADMIN,
                'is_verified' => true,
                'is_active' => true,
            ]
        );

        $this->command->info('Super Admin created successfully!');
        $this->command->info('Email: superadmin@sipeta.com');
        $this->command->info('Password: password');
    }
}

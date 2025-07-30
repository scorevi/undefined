<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    protected $signature = 'test:create-users';
    protected $description = 'Create test users for login testing';

    public function handle()
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Create regular user
        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        $this->info('Test users created:');
        $this->info('Admin: admin@test.com / password');
        $this->info('User: user@test.com / password');

        return 0;
    }
}

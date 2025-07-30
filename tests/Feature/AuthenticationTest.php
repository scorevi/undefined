<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register_with_valid_data()
    {
        $response = $this->postJson('/api/user/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'role'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'user'
        ]);
    }

    /** @test */
    public function admin_can_register_with_valid_data()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test Admin',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'role'
                    ],
                    'token'
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@example.com',
            'role' => 'admin'
        ]);
    }
}

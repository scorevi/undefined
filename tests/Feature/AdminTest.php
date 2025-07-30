<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

class AdminTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123')
        ]);
        $this->user = User::factory()->create(['role' => 'user']);
    }

    /** @test */
    public function admin_can_update_email()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/email', [
            'email' => 'newemail@example.com'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Administrator email updated successfully.'
                ]);

        $this->assertDatabaseHas('users', [
            'id' => $this->admin->id,
            'email' => 'newemail@example.com'
        ]);
    }

    /** @test */
    public function admin_email_update_fails_with_invalid_email()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/email', [
            'email' => 'invalid-email'
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Administrator email update validation failed. Please check the provided email address.',
                ])
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function admin_email_update_fails_with_duplicate_email()
    {
        $otherUser = User::factory()->create(['email' => 'existing@example.com']);
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/email', [
            'email' => 'existing@example.com'
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Administrator email update validation failed. Please check the provided email address.',
                ])
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function regular_user_cannot_update_admin_email()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/email', [
            'email' => 'newemail@example.com'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'error' => 'Administrator access required. Please log in with an administrator account.'
                ]);
    }

    /** @test */
    public function admin_can_update_password()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/password', [
            'current_password' => 'password123',
            'new_password' => 'newpassword123'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Administrator password updated successfully.'
                ]);

        // Verify password was actually changed
        $this->admin->refresh();
        $this->assertTrue(Hash::check('newpassword123', $this->admin->password));
    }

    /** @test */
    public function admin_password_update_fails_with_wrong_current_password()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/password', [
            'current_password' => 'wrongpassword',
            'new_password' => 'newpassword123'
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'error' => 'Current administrator password is incorrect. Please enter your current password correctly.'
                ]);
    }

    /** @test */
    public function admin_password_update_fails_with_short_new_password()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/password', [
            'current_password' => 'password123',
            'new_password' => '123'
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Administrator password update validation failed. Please check the provided password information.',
                ])
                ->assertJsonValidationErrors(['new_password']);
    }

    /** @test */
    public function regular_user_cannot_update_admin_password()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/password', [
            'current_password' => 'password123',
            'new_password' => 'newpassword123'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'error' => 'Administrator access required. Please log in with an administrator account.'
                ]);
    }

    /** @test */
    public function admin_can_get_site_settings()
    {
        // Create some test settings
        DB::table('settings')->insert([
            ['key' => 'site_name', 'value' => 'Test Site'],
            ['key' => 'site_description', 'value' => 'Test Description']
        ]);

        Sanctum::actingAs($this->admin);

        $response = $this->getJson('/api/admin/settings');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'settings'
                ]);
    }

    /** @test */
    public function regular_user_cannot_get_site_settings()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/admin/settings');

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'error' => 'Administrator access required. Please log in with an administrator account.'
                ]);
    }

    /** @test */
    public function admin_can_update_site_settings()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/site-settings', [
            'site_name' => 'New Site Name',
            'site_description' => 'New Site Description'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ]);

        // Verify settings were stored
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'New Site Name'
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'site_description',
            'value' => 'New Site Description'
        ]);
    }

    /** @test */
    public function site_settings_update_fails_with_too_long_site_name()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/site-settings', [
            'site_name' => str_repeat('a', 256), // Exceeds 255 character limit
            'site_description' => 'Valid description'
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Site settings validation failed. Please check the provided information.',
                ])
                ->assertJsonValidationErrors(['site_name']);
    }

    /** @test */
    public function site_settings_update_fails_with_too_long_description()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/admin/site-settings', [
            'site_name' => 'Valid Site Name',
            'site_description' => str_repeat('a', 1001) // Exceeds 1000 character limit
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Site settings validation failed. Please check the provided information.',
                ])
                ->assertJsonValidationErrors(['site_description']);
    }

    /** @test */
    public function regular_user_cannot_update_site_settings()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/admin/site-settings', [
            'site_name' => 'New Site Name',
            'site_description' => 'New Site Description'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'error' => 'Administrator access required. Please log in with an administrator account.'
                ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_admin_endpoints()
    {
        $endpoints = [
            ['POST', '/api/admin/email'],
            ['POST', '/api/admin/password'],
            ['GET', '/api/admin/settings'],
            ['POST', '/api/admin/site-settings']
        ];

        foreach ($endpoints as [$method, $endpoint]) {
            $response = $this->json($method, $endpoint);
            $response->assertStatus(401);
        }
    }

    /** @test */
    public function admin_can_update_site_settings_with_partial_data()
    {
        // Set initial values
        DB::table('settings')->updateOrInsert(['key' => 'site_name'], ['value' => 'Old Site Name']);
        DB::table('settings')->updateOrInsert(['key' => 'site_description'], ['value' => 'Old Description']);

        Sanctum::actingAs($this->admin);

        // Update only site name
        $response = $this->postJson('/api/admin/site-settings', [
            'site_name' => 'New Site Name Only'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ]);

        // Verify only site name was updated
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'New Site Name Only'
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'site_description',
            'value' => 'Old Description'
        ]);
    }

    /** @test */
    public function admin_can_clear_site_settings()
    {
        // Set initial values
        DB::table('settings')->updateOrInsert(['key' => 'site_name'], ['value' => 'Old Site Name']);
        DB::table('settings')->updateOrInsert(['key' => 'site_description'], ['value' => 'Old Description']);

        Sanctum::actingAs($this->admin);

        // Clear settings by sending empty values
        $response = $this->postJson('/api/admin/site-settings', [
            'site_name' => '',
            'site_description' => ''
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ]);

        // Verify settings were cleared
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => ''
        ]);
        $this->assertDatabaseHas('settings', [
            'key' => 'site_description',
            'value' => ''
        ]);
    }
}

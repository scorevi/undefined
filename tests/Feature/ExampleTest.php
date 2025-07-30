<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the home page loads successfully.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test that the API is accessible.
     */
    public function test_api_is_accessible(): void
    {
        $response = $this->get('/api/posts');

        $response->assertStatus(200);
    }

    /**
     * Test that the application has basic structure.
     */
    public function test_application_structure(): void
    {
        // Test that essential directories exist
        $this->assertDirectoryExists(app_path());
        $this->assertDirectoryExists(database_path());
        $this->assertDirectoryExists(storage_path());

        // Test that essential files exist
        $this->assertFileExists(app_path('Models/User.php'));
        $this->assertFileExists(base_path('routes/api.php'));
        $this->assertFileExists(base_path('routes/web.php'));
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

class PostTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
    }

    /** @test */
    public function admin_can_create_post_with_valid_data()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is test content',
            'category' => 'news',
            'is_featured' => false,
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'post' => [
                        'id',
                        'title',
                        'content',
                        'category',
                        'is_featured',
                        'user_id'
                    ]
                ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'content' => 'This is test content',
            'category' => 'news',
            'user_id' => $this->admin->id
        ]);
    }

    /** @test */
    public function regular_user_cannot_create_post()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is test content',
            'category' => 'news',
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'error' => 'Only administrators can create posts. Please contact an admin if you need to publish content.'
                ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_create_post()
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is test content',
            'category' => 'news',
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Unauthenticated.'
                ]);
    }

    /** @test */
    public function post_creation_fails_with_missing_title()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/posts', [
            'content' => 'This is test content',
            'category' => 'news',
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'error' => 'Post creation validation failed. Please check the provided data.',
                ])
                ->assertJsonValidationErrors(['title']);
    }

    /** @test */
    public function post_creation_fails_with_invalid_category()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is test content',
            'category' => 'invalid-category',
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'error' => 'Post creation validation failed. Please check the provided data.',
                ])
                ->assertJsonValidationErrors(['category']);
    }

    /** @test */
    public function admin_can_create_post_with_image()
    {
        Storage::fake('public');
        Sanctum::actingAs($this->admin);

        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post with Image',
            'content' => 'This is test content',
            'category' => 'news',
            'image' => $file,
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ]);

        Storage::disk('public')->assertExists('posts/' . $file->hashName());
    }

    /** @test */
    public function can_retrieve_single_post()
    {
        $post = Post::factory()->create([
            'user_id' => $this->admin->id,
            'title' => 'Test Post',
            'content' => 'Test content'
        ]);

        $response = $this->getJson("/api/posts/{$post->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'title',
                        'content',
                        'user'
                    ]
                ]);
    }

    /** @test */
    public function returns_error_for_nonexistent_post()
    {
        $response = $this->getJson('/api/posts/999');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The requested post does not exist or has been removed.'
                ]);
    }

    /** @test */
    public function admin_can_update_own_post()
    {
        Sanctum::actingAs($this->admin);

        $post = Post::factory()->create([
            'user_id' => $this->admin->id,
            'title' => 'Original Title',
            'content' => 'Original content'
        ]);

        $response = $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'category' => 'review'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Post updated successfully.'
                ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'category' => 'review'
        ]);
    }

    /** @test */
    public function admin_can_update_any_post()
    {
        Sanctum::actingAs($this->admin);

        $otherUser = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Original Title'
        ]);

        $response = $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated by Different Admin',
            'content' => 'Updated content',
            'category' => 'news'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ]);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated by Different Admin'
        ]);
    }

    /** @test */
    public function regular_user_cannot_update_post()
    {
        Sanctum::actingAs($this->user);

        $post = Post::factory()->create([
            'user_id' => $this->admin->id,
        ]);

        $response = $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Attempted Update',
            'content' => 'Updated content',
            'category' => 'news'
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'error' => 'You can only update your own posts unless you are an admin.'
                ]);
    }

    /** @test */
    public function cannot_update_nonexistent_post()
    {
        Sanctum::actingAs($this->admin);

        $response = $this->putJson('/api/posts/999', [
            'title' => 'Updated Title',
            'content' => 'Updated content',
            'category' => 'news'
        ]);

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The post you are trying to update does not exist.'
                ]);
    }

    /** @test */
    public function admin_can_delete_post()
    {
        Sanctum::actingAs($this->admin);

        $post = Post::factory()->create([
            'user_id' => $this->admin->id,
        ]);

        $response = $this->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Post deleted successfully.'
                ]);

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id
        ]);
    }

    /** @test */
    public function regular_user_cannot_delete_post()
    {
        Sanctum::actingAs($this->user);

        $post = Post::factory()->create([
            'user_id' => $this->admin->id,
        ]);

        $response = $this->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'error' => 'You can only delete your own posts unless you are an admin.'
                ]);
    }

    /** @test */
    public function can_list_posts()
    {
        Post::factory()->count(5)->create([
            'user_id' => $this->admin->id
        ]);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'content',
                            'category',
                            'user'
                        ]
                    ],
                    'current_page',
                    'last_page',
                    'total'
                ]);
    }

    /** @test */
    public function can_filter_posts_by_category()
    {
        Post::factory()->create([
            'user_id' => $this->admin->id,
            'category' => 'news'
        ]);
        Post::factory()->create([
            'user_id' => $this->admin->id,
            'category' => 'review'
        ]);

        $response = $this->getJson('/api/posts?category=news');

        $response->assertStatus(200);

        $posts = $response->json('data');
        foreach ($posts as $post) {
            $this->assertEquals('news', $post['category']);
        }
    }

    /** @test */
    public function can_get_trending_posts()
    {
        Post::factory()->count(3)->create([
            'user_id' => $this->admin->id,
            'views' => 100
        ]);

        $response = $this->getJson('/api/posts/trending');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'title',
                        'content',
                        'user'
                    ]
                ]);
    }

    /** @test */
    public function can_get_featured_posts()
    {
        Post::factory()->create([
            'user_id' => $this->admin->id,
            'is_featured' => true
        ]);

        $response = $this->getJson('/api/posts/featured');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'title',
                        'content',
                        'user'
                    ]
                ]);
    }
}

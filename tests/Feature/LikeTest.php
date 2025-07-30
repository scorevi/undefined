<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Like;
use Laravel\Sanctum\Sanctum;

class LikeTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $post;

    protected function setUp(): void
    {
        parent::setUp();

        $admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
        $this->post = Post::factory()->create(['user_id' => $admin->id]);
    }

    /** @test */
    public function authenticated_user_can_like_post()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/posts/{$this->post->id}/like");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'liked' => true,
                    'message' => 'Post liked successfully.'
                ])
                ->assertJsonStructure([
                    'success',
                    'liked',
                    'like_count',
                    'message'
                ]);

        $this->assertDatabaseHas('likes', [
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_like_post()
    {
        $response = $this->postJson("/api/posts/{$this->post->id}/like");

        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Unauthenticated.'
                ]);
    }

    /** @test */
    public function cannot_like_nonexistent_post()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/posts/999/like');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The post you are trying to like does not exist.'
                ]);
    }

    /** @test */
    public function authenticated_user_can_unlike_post()
    {
        Sanctum::actingAs($this->user);

        // First like the post
        Like::create([
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);

        $response = $this->postJson("/api/posts/{$this->post->id}/unlike");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'liked' => false,
                    'message' => 'Post unliked successfully.'
                ])
                ->assertJsonStructure([
                    'success',
                    'liked',
                    'like_count',
                    'message'
                ]);

        $this->assertDatabaseMissing('likes', [
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_unlike_post()
    {
        $response = $this->postJson("/api/posts/{$this->post->id}/unlike");

        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Unauthenticated.'
                ]);
    }

    /** @test */
    public function cannot_unlike_nonexistent_post()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/posts/999/unlike');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The post you are trying to unlike does not exist.'
                ]);
    }

    /** @test */
    public function can_get_like_status_for_authenticated_user()
    {
        Sanctum::actingAs($this->user);

        // Like the post first
        Like::create([
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);

        $response = $this->getJson("/api/posts/{$this->post->id}/like-status");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'liked' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'liked',
                    'like_count'
                ]);
    }

    /** @test */
    public function can_get_like_status_for_unauthenticated_user()
    {
        $response = $this->getJson("/api/posts/{$this->post->id}/like-status");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'liked' => false,
                ])
                ->assertJsonStructure([
                    'success',
                    'liked',
                    'like_count'
                ]);
    }

    /** @test */
    public function cannot_get_like_status_for_nonexistent_post()
    {
        $response = $this->getJson('/api/posts/999/like-status');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The post you are trying to check does not exist.'
                ]);
    }

    /** @test */
    public function like_count_increases_when_post_is_liked()
    {
        Sanctum::actingAs($this->user);

        // Get initial like count
        $initialResponse = $this->getJson("/api/posts/{$this->post->id}/like-status");
        $initialCount = $initialResponse->json('like_count');

        // Like the post
        $this->postJson("/api/posts/{$this->post->id}/like");

        // Check like count increased
        $finalResponse = $this->getJson("/api/posts/{$this->post->id}/like-status");
        $finalCount = $finalResponse->json('like_count');

        $this->assertEquals($initialCount + 1, $finalCount);
    }

    /** @test */
    public function like_count_decreases_when_post_is_unliked()
    {
        Sanctum::actingAs($this->user);

        // Like the post first
        $this->postJson("/api/posts/{$this->post->id}/like");

        // Get like count after liking
        $afterLikeResponse = $this->getJson("/api/posts/{$this->post->id}/like-status");
        $afterLikeCount = $afterLikeResponse->json('like_count');

        // Unlike the post
        $this->postJson("/api/posts/{$this->post->id}/unlike");

        // Check like count decreased
        $finalResponse = $this->getJson("/api/posts/{$this->post->id}/like-status");
        $finalCount = $finalResponse->json('like_count');

        $this->assertEquals($afterLikeCount - 1, $finalCount);
    }

    /** @test */
    public function user_can_like_multiple_posts()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $post1 = Post::factory()->create(['user_id' => $admin->id]);
        $post2 = Post::factory()->create(['user_id' => $admin->id]);

        Sanctum::actingAs($this->user);

        // Like both posts
        $response1 = $this->postJson("/api/posts/{$post1->id}/like");
        $response2 = $this->postJson("/api/posts/{$post2->id}/like");

        $response1->assertStatus(200)->assertJson(['success' => true, 'liked' => true]);
        $response2->assertStatus(200)->assertJson(['success' => true, 'liked' => true]);

        // Verify both likes exist in database
        $this->assertDatabaseHas('likes', ['user_id' => $this->user->id, 'post_id' => $post1->id]);
        $this->assertDatabaseHas('likes', ['user_id' => $this->user->id, 'post_id' => $post2->id]);
    }

    /** @test */
    public function multiple_users_can_like_same_post()
    {
        $user2 = User::factory()->create(['role' => 'user']);

        Sanctum::actingAs($this->user);
        $response1 = $this->postJson("/api/posts/{$this->post->id}/like");

        Sanctum::actingAs($user2);
        $response2 = $this->postJson("/api/posts/{$this->post->id}/like");

        $response1->assertStatus(200)->assertJson(['success' => true, 'liked' => true]);
        $response2->assertStatus(200)->assertJson(['success' => true, 'liked' => true]);

        // Verify both likes exist
        $this->assertDatabaseHas('likes', ['user_id' => $this->user->id, 'post_id' => $this->post->id]);
        $this->assertDatabaseHas('likes', ['user_id' => $user2->id, 'post_id' => $this->post->id]);

        // Check final like count
        $statusResponse = $this->getJson("/api/posts/{$this->post->id}/like-status");
        $statusResponse->assertJson(['like_count' => 2]);
    }
}

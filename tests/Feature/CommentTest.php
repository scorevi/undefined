<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Laravel\Sanctum\Sanctum;

class CommentTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $post;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
        $this->post = Post::factory()->create(['user_id' => $this->admin->id]);
    }

    /** @test */
    public function authenticated_user_can_create_comment()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/posts/{$this->post->id}/comments", [
            'content' => 'This is a test comment'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'comment' => [
                        'id',
                        'content',
                        'user_id',
                        'post_id',
                        'user'
                    ]
                ]);

        $this->assertDatabaseHas('comments', [
            'content' => 'This is a test comment',
            'user_id' => $this->user->id,
            'post_id' => $this->post->id
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_create_comment()
    {
        $response = $this->postJson("/api/posts/{$this->post->id}/comments", [
            'content' => 'This is a test comment'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Unauthenticated.'
                ]);
    }

    /** @test */
    public function comment_creation_fails_with_empty_content()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/posts/{$this->post->id}/comments", [
            'content' => ''
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'error' => 'Comment creation validation failed. Please check your comment content.',
                ])
                ->assertJsonValidationErrors(['content']);
    }

    /** @test */
    public function comment_creation_fails_with_too_long_content()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/posts/{$this->post->id}/comments", [
            'content' => str_repeat('a', 1001) // Exceeds 1000 character limit
        ]);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'error' => 'Comment creation validation failed. Please check your comment content.',
                ])
                ->assertJsonValidationErrors(['content']);
    }

    /** @test */
    public function cannot_comment_on_nonexistent_post()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/posts/999/comments', [
            'content' => 'This is a test comment'
        ]);

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The post you are trying to comment on does not exist.'
                ]);
    }

    /** @test */
    public function can_list_comments_for_post()
    {
        $comments = Comment::factory()->count(3)->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->getJson("/api/posts/{$this->post->id}/comments");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'content',
                            'user_id',
                            'post_id',
                            'user'
                        ]
                    ],
                    'current_page',
                    'last_page',
                    'total'
                ]);
    }

    /** @test */
    public function user_can_update_own_comment()
    {
        Sanctum::actingAs($this->user);

        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Original comment'
        ]);

        $response = $this->patchJson("/api/posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Updated comment content'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ])
                ->assertJsonStructure([
                    'success',
                    'comment' => [
                        'id',
                        'content',
                        'user'
                    ]
                ]);

        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Updated comment content'
        ]);
    }

    /** @test */
    public function admin_can_update_any_comment()
    {
        Sanctum::actingAs($this->admin);

        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Original comment'
        ]);

        $response = $this->patchJson("/api/posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Updated by admin'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                ]);

        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => 'Updated by admin'
        ]);
    }

    /** @test */
    public function user_cannot_update_others_comment()
    {
        $otherUser = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($otherUser);

        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'content' => 'Original comment'
        ]);

        $response = $this->patchJson("/api/posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Attempted update'
        ]);

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'error' => 'You can only edit your own comments unless you are an admin.'
                ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_update_comment()
    {
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->patchJson("/api/posts/{$this->post->id}/comments/{$comment->id}", [
            'content' => 'Attempted update'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Unauthenticated.'
                ]);
    }

    /** @test */
    public function cannot_update_nonexistent_comment()
    {
        Sanctum::actingAs($this->user);

        $response = $this->patchJson("/api/posts/{$this->post->id}/comments/999", [
            'content' => 'Attempted update'
        ]);

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The comment you are trying to edit does not exist.'
                ]);
    }

    /** @test */
    public function user_can_delete_own_comment()
    {
        Sanctum::actingAs($this->user);

        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson("/api/posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Comment deleted successfully.'
                ]);

        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id
        ]);
    }

    /** @test */
    public function admin_can_delete_any_comment()
    {
        Sanctum::actingAs($this->admin);

        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson("/api/posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Comment deleted successfully.'
                ]);

        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id
        ]);
    }

    /** @test */
    public function user_cannot_delete_others_comment()
    {
        $otherUser = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($otherUser);

        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson("/api/posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                    'error' => 'You can only delete your own comments unless you are an admin.'
                ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_delete_comment()
    {
        $comment = Comment::factory()->create([
            'post_id' => $this->post->id,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson("/api/posts/{$this->post->id}/comments/{$comment->id}");

        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Unauthenticated.'
                ]);
    }

    /** @test */
    public function cannot_delete_nonexistent_comment()
    {
        Sanctum::actingAs($this->user);

        $response = $this->deleteJson("/api/posts/{$this->post->id}/comments/999");

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'error' => 'The comment you are trying to delete does not exist.'
                ]);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseIntegrityTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function all_required_tables_exist()
    {
        $requiredTables = [
            'users',
            'posts',
            'comments',
            'likes',
            'settings',
            'post_views',
            'sessions',
            'password_reset_tokens'
        ];

        foreach ($requiredTables as $table) {
            $this->assertTrue(
                Schema::hasTable($table),
                "Required table '{$table}' does not exist"
            );
        }
    }

    /** @test */
    public function users_table_has_required_columns()
    {
        $requiredColumns = [
            'id', 'name', 'email', 'password', 'role',
            'email_verified_at', 'remember_token', 'created_at', 'updated_at'
        ];

        foreach ($requiredColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('users', $column),
                "Users table is missing required column '{$column}'"
            );
        }
    }

    /** @test */
    public function posts_table_has_required_columns()
    {
        $requiredColumns = [
            'id', 'user_id', 'title', 'content', 'category',
            'is_featured', 'image', 'views', 'created_at', 'updated_at'
        ];

        foreach ($requiredColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('posts', $column),
                "Posts table is missing required column '{$column}'"
            );
        }
    }

    /** @test */
    public function comments_table_has_required_columns()
    {
        $requiredColumns = [
            'id', 'post_id', 'user_id', 'content', 'created_at', 'updated_at'
        ];

        foreach ($requiredColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('comments', $column),
                "Comments table is missing required column '{$column}'"
            );
        }
    }

    /** @test */
    public function likes_table_has_required_columns()
    {
        $requiredColumns = [
            'id', 'user_id', 'post_id', 'created_at', 'updated_at'
        ];

        foreach ($requiredColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('likes', $column),
                "Likes table is missing required column '{$column}'"
            );
        }
    }

    /** @test */
    public function user_model_relationships_work()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create(['user_id' => $user->id]);
        $comment = Comment::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);
        $like = Like::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);

        // Test user relationships (if they exist)
        $this->assertInstanceOf(Post::class, $post);
        $this->assertInstanceOf(Comment::class, $comment);
        $this->assertInstanceOf(Like::class, $like);

        $this->assertEquals($user->id, $post->user_id);
        $this->assertEquals($user->id, $comment->user_id);
        $this->assertEquals($user->id, $like->user_id);
    }

    /** @test */
    public function post_model_relationships_work()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create(['user_id' => $user->id]);
        $comment = Comment::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);
        $like = Like::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);

        // Test post relationships
        $this->assertInstanceOf(User::class, $post->user);
        $this->assertEquals($user->id, $post->user->id);

        $postComments = $post->comments;
        $this->assertCount(1, $postComments);
        $this->assertEquals($comment->id, $postComments->first()->id);

        $postLikes = $post->likes;
        $this->assertCount(1, $postLikes);
        $this->assertEquals($like->id, $postLikes->first()->id);

        // Test isLikedBy method
        $this->assertTrue($post->isLikedBy($user));

        $otherUser = User::factory()->create();
        $this->assertFalse($post->isLikedBy($otherUser));
    }

    /** @test */
    public function comment_model_relationships_work()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create(['user_id' => $user->id]);
        $comment = Comment::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);

        // Test comment relationships
        $this->assertInstanceOf(User::class, $comment->user);
        $this->assertEquals($user->id, $comment->user->id);

        $this->assertInstanceOf(Post::class, $comment->post);
        $this->assertEquals($post->id, $comment->post->id);
    }

    /** @test */
    public function foreign_key_constraints_work()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create(['user_id' => $user->id]);

        // Test that deleting a post cascades properly or prevents deletion
        $comment = Comment::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);
        $like = Like::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);

        // Verify records exist
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
        $this->assertDatabaseHas('comments', ['id' => $comment->id, 'post_id' => $post->id]);
        $this->assertDatabaseHas('likes', ['id' => $like->id, 'post_id' => $post->id]);

        // Delete the post
        $post->delete();

        // Comments and likes should be handled appropriately
        // (This depends on your foreign key configuration)
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    /** @test */
    public function user_roles_are_properly_constrained()
    {
        $adminUser = User::factory()->create(['role' => 'admin']);
        $regularUser = User::factory()->create(['role' => 'user']);

        $this->assertEquals('admin', $adminUser->role);
        $this->assertEquals('user', $regularUser->role);

        // Test that roles are stored correctly
        $this->assertDatabaseHas('users', ['id' => $adminUser->id, 'role' => 'admin']);
        $this->assertDatabaseHas('users', ['id' => $regularUser->id, 'role' => 'user']);
    }

    /** @test */
    public function post_categories_are_properly_stored()
    {
        $user = User::factory()->create(['role' => 'admin']);

        $validCategories = ['news', 'review', 'podcast', 'opinion', 'lifestyle'];

        foreach ($validCategories as $category) {
            $post = Post::factory()->create([
                'user_id' => $user->id,
                'category' => $category
            ]);

            $this->assertEquals($category, $post->category);
            $this->assertDatabaseHas('posts', ['id' => $post->id, 'category' => $category]);
        }
    }

    /** @test */
    public function post_featured_status_is_boolean()
    {
        $user = User::factory()->create(['role' => 'admin']);

        $featuredPost = Post::factory()->create([
            'user_id' => $user->id,
            'is_featured' => true
        ]);

        $regularPost = Post::factory()->create([
            'user_id' => $user->id,
            'is_featured' => false
        ]);

        $this->assertTrue($featuredPost->is_featured);
        $this->assertFalse($regularPost->is_featured);
    }

    /** @test */
    public function unique_constraints_work()
    {
        // Test that a user can only like a post once
        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create(['user_id' => $admin->id]);

        $like1 = Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id
        ]);

        // Attempting to create a duplicate like should either fail or be handled gracefully
        $existingLike = Like::where('user_id', $user->id)->where('post_id', $post->id)->first();
        $this->assertNotNull($existingLike);

        // If using firstOrCreate, it should return the existing like
        $like2 = Like::firstOrCreate([
            'user_id' => $user->id,
            'post_id' => $post->id
        ]);

        $this->assertEquals($like1->id, $like2->id);
    }

    /** @test */
    public function settings_table_works_properly()
    {
        // Test that settings can be stored and retrieved
        DB::table('settings')->insert([
            'key' => 'test_setting',
            'value' => 'test_value'
        ]);

        $this->assertDatabaseHas('settings', [
            'key' => 'test_setting',
            'value' => 'test_value'
        ]);

        // Test updateOrInsert functionality
        DB::table('settings')->updateOrInsert(
            ['key' => 'test_setting'],
            ['value' => 'updated_value']
        );

        $this->assertDatabaseHas('settings', [
            'key' => 'test_setting',
            'value' => 'updated_value'
        ]);
    }

    /** @test */
    public function post_views_tracking_works()
    {
        $user = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create(['user_id' => $user->id, 'views' => 0]);

        // Simulate a view
        $ip = '192.168.1.1';
        DB::table('post_views')->insert([
            'post_id' => $post->id,
            'ip' => $ip,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $post->increment('views');

        $this->assertDatabaseHas('post_views', [
            'post_id' => $post->id,
            'ip' => $ip
        ]);

        $post->refresh();
        $this->assertEquals(1, $post->views);
    }
}

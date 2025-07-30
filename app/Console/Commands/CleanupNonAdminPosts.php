<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class CleanupNonAdminPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:cleanup-non-admin {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove all posts created by non-admin users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');

        $this->info('=== Post Cleanup Analysis ===');

        // Get post statistics
        $totalPosts = Post::count();
        $adminPosts = Post::join('users', 'posts.user_id', '=', 'users.id')
            ->where('users.role', 'admin')
            ->count();
        $nonAdminPosts = Post::join('users', 'posts.user_id', '=', 'users.id')
            ->where('users.role', '!=', 'admin')
            ->count();

        $this->info("Total posts: {$totalPosts}");
        $this->info("Posts by admin users: {$adminPosts}");
        $this->info("Posts by non-admin users: {$nonAdminPosts}");

        if ($nonAdminPosts > 0) {
            if ($dryRun) {
                $this->warn('DRY RUN MODE - No posts will be actually deleted');
            }

            $this->info('');
            $this->info('=== Posts to be deleted ===');

            // Get posts by non-admin users with their associated files
            $postsToDelete = Post::join('users', 'posts.user_id', '=', 'users.id')
                ->where('users.role', '!=', 'admin')
                ->select('posts.*', 'users.name as author_name', 'users.role as author_role')
                ->get();

            foreach ($postsToDelete as $post) {
                $this->line("Post ID {$post->id}: {$post->title} (by {$post->author_name} - {$post->author_role})");

                if ($post->image) {
                    $this->line("  - Has image: {$post->image}");
                }

                if (!$dryRun) {
                    // Delete associated image if exists
                    if ($post->image && Storage::disk('public')->exists($post->image)) {
                        Storage::disk('public')->delete($post->image);
                        $this->line("  - Deleted image: {$post->image}");
                    }

                    // Delete the post (this will cascade delete likes and comments due to foreign key constraints)
                    $post->delete();
                    $this->line("  - Post deleted");
                }
            }

            $this->info('');
            if ($dryRun) {
                $this->warn("DRY RUN: Would delete {$nonAdminPosts} posts by non-admin users.");
                $this->info("Run without --dry-run to actually delete the posts.");
            } else {
                $this->info("Cleanup completed! Deleted {$nonAdminPosts} posts by non-admin users.");
            }
        } else {
            $this->info('');
            $this->info('No posts by non-admin users found. Nothing to clean up.');
        }

        if (!$dryRun) {
            $this->info('');
            $this->info('=== Final Statistics ===');
            $finalTotal = Post::count();
            $this->info("Total posts remaining: {$finalTotal}");
        }

        return 0;
    }
}

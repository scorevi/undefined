<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Post;
use App\Models\User;

echo "=== CHECKING DATABASE POSTS ===\n";

$postsCount = Post::count();
echo "Total posts in database: {$postsCount}\n\n";

if ($postsCount > 0) {
    echo "=== FIRST POST DATA ===\n";
    $post = Post::first();
    echo "ID: {$post->id}\n";
    echo "Title: {$post->title}\n";
    echo "Created At (raw): {$post->getOriginal('created_at')}\n";
    echo "Created At (cast): {$post->created_at}\n";
    echo "Created At (formatted): {$post->created_at->toDateTimeString()}\n";
    echo "Updated At (raw): {$post->getOriginal('updated_at')}\n";
    echo "Updated At (cast): {$post->updated_at}\n";
    echo "Updated At (formatted): {$post->updated_at->toDateTimeString()}\n\n";

    echo "=== JSON REPRESENTATION ===\n";
    echo json_encode($post->toArray(), JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "No posts found. Creating a test post...\n";

    // Create a test user first
    $user = User::factory()->create(['role' => 'admin', 'name' => 'Test Admin']);
    echo "Created test user: {$user->name} (ID: {$user->id})\n";

    // Create a test post
    $post = Post::create([
        'user_id' => $user->id,
        'title' => 'Test Post',
        'content' => 'This is a test post to check date handling.',
        'category' => 'news',
        'is_featured' => false,
    ]);

    echo "Created test post: {$post->title} (ID: {$post->id})\n";
    echo "Created At: {$post->created_at->toDateTimeString()}\n";
    echo "Updated At: {$post->updated_at->toDateTimeString()}\n\n";

    echo "=== JSON REPRESENTATION ===\n";
    echo json_encode($post->toArray(), JSON_PRETTY_PRINT) . "\n\n";
}

echo "=== CHECKING API RESPONSE ===\n";
if ($postsCount > 0 || isset($post)) {
    $testPost = $post ?? Post::first();

    // Simulate API response
    $apiResponse = [
        'success' => true,
        'data' => $testPost
    ];

    echo "API Response:\n";
    echo json_encode($apiResponse, JSON_PRETTY_PRINT) . "\n";
}

echo "\nTest completed!\n";

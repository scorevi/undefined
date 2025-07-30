<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Post;
use App\Models\User;

// Create a test user and post
$user = User::factory()->create(['role' => 'admin']);
$post = Post::factory()->create(['user_id' => $user->id]);

echo "Post created successfully!\n";
echo "Created at: " . $post->created_at->toDateTimeString() . "\n";
echo "Updated at: " . $post->updated_at->toDateTimeString() . "\n";
echo "JSON representation:\n";
echo json_encode($post->toArray(), JSON_PRETTY_PRINT) . "\n";

// Clean up
$post->delete();
$user->delete();

echo "Test completed successfully!\n";

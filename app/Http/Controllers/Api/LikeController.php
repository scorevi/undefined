<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Like;

class LikeController extends Controller
{
    // Like a post
    public function like($postId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $post = Post::findOrFail($postId);
        $like = Like::firstOrCreate([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
        $likeCount = $post->likes()->count();
        return response()->json(['liked' => true, 'like_count' => $likeCount]);
    }

    // Unlike a post
    public function unlike($postId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $post = Post::findOrFail($postId);
        Like::where('user_id', $user->id)->where('post_id', $post->id)->delete();
        $likeCount = $post->likes()->count();
        return response()->json(['liked' => false, 'like_count' => $likeCount]);
    }

    // Get like status and count for a post
    public function status($postId)
    {
        $user = Auth::user();
        $post = Post::findOrFail($postId);
        $liked = $user ? $post->isLikedBy($user) : false;
        $likeCount = $post->likes()->count();
        return response()->json(['liked' => $liked, 'like_count' => $likeCount]);
    }
}

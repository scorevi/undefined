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
            return response()->json([
                'success' => false,
                'error' => 'Authentication required. Please log in to like posts.'
            ], 401);
        }

        $post = Post::find($postId);
        if (!$post) {
            return response()->json([
                'success' => false,
                'error' => 'The post you are trying to like does not exist.'
            ], 404);
        }

        $like = Like::firstOrCreate([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
        $likeCount = $post->likes()->count();
        return response()->json([
            'success' => true,
            'liked' => true,
            'like_count' => $likeCount,
            'message' => 'Post liked successfully.'
        ]);
    }

    // Unlike a post
    public function unlike($postId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Authentication required. Please log in to unlike posts.'
            ], 401);
        }

        $post = Post::find($postId);
        if (!$post) {
            return response()->json([
                'success' => false,
                'error' => 'The post you are trying to unlike does not exist.'
            ], 404);
        }

        Like::where('user_id', $user->id)->where('post_id', $post->id)->delete();
        $likeCount = $post->likes()->count();
        return response()->json([
            'success' => true,
            'liked' => false,
            'like_count' => $likeCount,
            'message' => 'Post unliked successfully.'
        ]);
    }

    // Get like status and count for a post
    public function status($postId)
    {
        $user = Auth::user();
        $post = Post::find($postId);

        if (!$post) {
            return response()->json([
                'success' => false,
                'error' => 'The post you are trying to check does not exist.'
            ], 404);
        }

        $liked = $user ? $post->isLikedBy($user) : false;
        $likeCount = $post->likes()->count();
        return response()->json([
            'success' => true,
            'liked' => $liked,
            'like_count' => $likeCount
        ]);
    }
}

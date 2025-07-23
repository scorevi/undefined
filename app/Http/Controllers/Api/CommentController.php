<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // List comments for a post
    public function index($postId, Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $comments = Comment::with('user')
            ->where('post_id', $postId)
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
        return response()->json([
            'data' => $comments->items(),
            'current_page' => $comments->currentPage(),
            'last_page' => $comments->lastPage(),
            'total' => $comments->total(),
        ]);
    }

    // Store a new comment
    public function store(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);
        $user = Auth::user();
        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => $user ? $user->id : null,
            'content' => $request->input('content'),
        ]);
        $comment->load('user');
        return response()->json(['success' => true, 'comment' => $comment]);
    }

    // Delete a comment
    public function destroy($postId, $commentId)
    {
        $user = Auth::user();
        $comment = Comment::where('post_id', $postId)->where('id', $commentId)->firstOrFail();
        if (!$user || ($user->id !== $comment->user_id && $user->role !== 'admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $comment->delete();
        return response()->json(['success' => true]);
    }

    // Update a comment
    public function update(Request $request, $postId, $commentId)
    {
        $user = Auth::user();
        $comment = Comment::where('post_id', $postId)->where('id', $commentId)->firstOrFail();
        if (!$user || ($user->id !== $comment->user_id && $user->role !== 'admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);
        $comment->content = $request->input('content');
        $comment->save();
        $comment->load('user');
        return response()->json(['success' => true, 'comment' => $comment]);
    }
} 
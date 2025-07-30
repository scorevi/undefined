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
        try {
            $request->validate([
                'content' => 'required|string|max:1000',
            ], [
                'content.required' => 'Comment content is required.',
                'content.string' => 'Comment content must be a valid text string.',
                'content.max' => 'Comment content cannot exceed 1000 characters.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Comment creation validation failed. Please check your comment content.',
                'errors' => $e->errors()
            ], 422);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Authentication required. Please log in to post a comment.'
            ], 401);
        }

        // Check if post exists
        $post = Post::find($postId);
        if (!$post) {
            return response()->json([
                'success' => false,
                'error' => 'The post you are trying to comment on does not exist.'
            ], 404);
        }

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ]);
        $comment->load('user');
        return response()->json(['success' => true, 'comment' => $comment]);
    }

    // Delete a comment
    public function destroy($postId, $commentId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Authentication required. Please log in to delete comments.'
            ], 401);
        }

        $comment = Comment::where('post_id', $postId)->where('id', $commentId)->first();
        if (!$comment) {
            return response()->json([
                'success' => false,
                'error' => 'The comment you are trying to delete does not exist.'
            ], 404);
        }

        if ($user->id !== $comment->user_id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'You can only delete your own comments unless you are an admin.'
            ], 403);
        }

        $comment->delete();
        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully.'
        ]);
    }

    // Update a comment
    public function update(Request $request, $postId, $commentId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Authentication required. Please log in to edit comments.'
            ], 401);
        }

        $comment = Comment::where('post_id', $postId)->where('id', $commentId)->first();
        if (!$comment) {
            return response()->json([
                'success' => false,
                'error' => 'The comment you are trying to edit does not exist.'
            ], 404);
        }

        if ($user->id !== $comment->user_id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'You can only edit your own comments unless you are an admin.'
            ], 403);
        }

        try {
            $request->validate([
                'content' => 'required|string|max:1000',
            ], [
                'content.required' => 'Comment content is required.',
                'content.string' => 'Comment content must be a valid text string.',
                'content.max' => 'Comment content cannot exceed 1000 characters.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Comment update validation failed. Please check your comment content.',
                'errors' => $e->errors()
            ], 422);
        }

        $comment->content = $request->input('content');
        $comment->save();
        $comment->load('user');
        return response()->json(['success' => true, 'comment' => $comment]);
    }

    // List all comments for admin
    public function adminIndex(Request $request)
    {
        $perPage = (int) $request->query('per_page', 20);
        $comments = Comment::with(['user', 'post'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        return response()->json([
            'data' => $comments->items(),
            'current_page' => $comments->currentPage(),
            'last_page' => $comments->lastPage(),
            'total' => $comments->total(),
        ]);
    }
}

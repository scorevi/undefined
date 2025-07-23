<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // List all posts
    public function index()
    {
        $posts = Post::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($posts);
    }

    // Show a single post
    public function show($id, Request $request)
    {
        $post = Post::with('user')->find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }
        // Unique view tracking by IP in session
        $ip = $request->ip();
        $viewedKey = 'viewed_post_' . $id . '_' . $ip;
        if (!session()->has($viewedKey)) {
            $post->increment('views');
            session([$viewedKey => true]);
        }
        return response()->json($post);
    }

    // Create a new post
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image' => $imagePath,
        ]);

        $post->load('user');
        return response()->json(['success' => true, 'post' => $post]);
    }

    // Update a post
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $post = Post::findOrFail($id);
        if (!$user || ($user->id !== $post->user_id && $user->role !== 'admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $post->image = $request->file('image')->store('posts', 'public');
        }
        $post->title = $validated['title'];
        $post->content = $validated['content'];
        $post->save();
        $post->load('user');
        return response()->json(['success' => true, 'post' => $post]);
    }

    // Delete a post
    public function destroy($id)
    {
        $user = Auth::user();
        $post = Post::findOrFail($id);
        if (!$user || ($user->id !== $post->user_id && $user->role !== 'admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();
        return response()->json(['success' => true]);
    }
}

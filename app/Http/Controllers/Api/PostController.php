<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    // List all posts with filters
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $category = $request->query('category');
        $search = $request->query('search');

        $query = Post::with('user')
            ->withCount('likes')
            ->withCount('comments');

        // Category filter (based on tags or content)
        if ($category && $category !== 'all') {
            $query->where('content', 'like', '%' . $category . '%');
        }

        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('content', 'like', '%' . $search . '%');
            });
        }

        $posts = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $postsArr = $posts->items();
        return response()->json([
            'data' => $postsArr,
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'total' => $posts->total(),
        ]);
    }

    // Show a single post
    public function show($id, Request $request)
    {
        $post = Post::with('user')->find($id);
        if (!$post) {
            return response()->json(['error' => 'Post not found'], 404);
        }
        // Unique view tracking by IP in the database
        $ip = $request->ip();
        $viewExists = DB::table('post_views')->where('post_id', $id)->where('ip', $ip)->exists();
        if (!$viewExists) {
            $post->increment('views');
            DB::table('post_views')->insert(['post_id' => $id, 'ip' => $ip, 'created_at' => now(), 'updated_at' => now()]);
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
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'image' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:51200', // 50MB
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            // Double-check MIME type server-side
            $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file->getMimeType(), $allowedMimes)) {
                return response()->json(['error' => 'Only JPEG, PNG, GIF, or WEBP images are allowed.'], 422);
            }
            $imagePath = $file->store('posts', 'public');
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

    // Trending posts by most likes, then views
    public function trending()
    {
        $posts = Post::with('user')
            ->withCount('likes')
            ->orderByDesc('likes_count')
            ->orderByDesc('views')
            ->take(5)
            ->get();
        return response()->json($posts);
    }

    // Featured posts (most viewed this week)
    public function featured()
    {
        $posts = Post::with('user')
            ->withCount('likes')
            ->withCount('comments')
            ->where('created_at', '>=', now()->subWeek())
            ->orderByDesc('views')
            ->orderByDesc('likes_count')
            ->take(3)
            ->get();
        return response()->json($posts);
    }

    // Get categories (based on content analysis)
    public function categories()
    {
        // Simple category extraction from content
        $categories = [
            ['name' => 'All Posts', 'slug' => 'all', 'count' => Post::count()],
            ['name' => 'Technology', 'slug' => 'technology', 'count' => Post::where('content', 'like', '%technology%')->count()],
            ['name' => 'Lifestyle', 'slug' => 'lifestyle', 'count' => Post::where('content', 'like', '%lifestyle%')->count()],
            ['name' => 'Business', 'slug' => 'business', 'count' => Post::where('content', 'like', '%business%')->count()],
            ['name' => 'Travel', 'slug' => 'travel', 'count' => Post::where('content', 'like', '%travel%')->count()],
            ['name' => 'Food', 'slug' => 'food', 'count' => Post::where('content', 'like', '%food%')->count()],
        ];

        return response()->json($categories);
    }

    // Get post stats for dashboard
    public function stats()
    {
        $totalPosts = Post::count();
        $totalViews = Post::sum('views');
        $totalLikes = DB::table('likes')->count();
        $totalComments = DB::table('comments')->count();

        return response()->json([
            'posts' => $totalPosts,
            'views' => $totalViews,
            'likes' => $totalLikes,
            'comments' => $totalComments,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = [
            'site_name' => config('app.name', 'Laravel'),
            'site_description' => 'A modern blog platform for the DWP Subject.',
            'total_posts' => Post::count(),
            'published_posts' => Post::where('status', 'published')->count(),
            'draft_posts' => Post::where('status', 'draft')->count(),
            'total_views' => Post::sum('views'),
            'total_comments' => Comment::count(),
            'users_count' => DB::table('users')->count(),
            'posts_today' => Post::whereDate('created_at', today())->count(),
            'comments_today' => Comment::whereDate('created_at', today())->count(),
            'recent_posts' => Post::with('user')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'views' => $post->views,
                        'status' => $post->status ?? 'published',
                        'author' => $post->user->name,
                        'created_at' => $post->created_at->format('Y-m-d H:i:s')
                    ];
                }),
            'trending_posts' => Post::withCount('likes')
                ->orderByDesc('likes_count')
                ->orderByDesc('views')
                ->take(5)
                ->get()
                ->map(function($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'views' => $post->views,
                        'likes' => $post->likes_count,
                        'status' => $post->status ?? 'published'
                    ];
                }),
            // Remove duplicate and conflicting keys below, as they are already defined above.
            // If you want to override site_name and site_description from settings, uncomment below and remove the earlier definitions.
            // 'site_name' => DB::table('settings')->where('key', 'site_name')->value('value') ?? '',
            // 'site_description' => DB::table('settings')->where('key', 'site_description')->value('value') ?? '',
        ];
        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }
}

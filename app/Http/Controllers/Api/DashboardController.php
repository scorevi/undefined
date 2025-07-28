<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = [
            'site_name' => config('app.name', 'Laravel'),
            'site_description' => 'A modern blog platform for the DWP Subject.',
            'total_posts' => Post::count(),
            'total_comments' => Comment::count(),
            'total_views' => Post::sum('views'),
            'trending_posts' => Post::withCount('likes')
                ->orderByDesc('likes_count')
                ->orderByDesc('views')
                ->take(5)
                ->get(),
        ];

        if ($user->role === 'admin') {
            // Add admin-specific stats
            $stats['users_count'] = DB::table('users')->count();
            $stats['posts_today'] = Post::whereDate('created_at', today())->count();
            $stats['comments_today'] = Comment::whereDate('created_at', today())->count();
        }

        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }
}

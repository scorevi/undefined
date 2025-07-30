<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Post;

class UserDashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'user') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get site settings from database
        $siteSettings = DB::table('settings')->pluck('value', 'key')->toArray();

        // Replace with actual data from your models
        $stats = [
            'site_name' => $siteSettings['site_name'] ?? 'Erikanoelvi\'s Blog',
            'site_description' => $siteSettings['site_description'] ?? 'A modern blog platform for the DWP Subject.',
            'profile_views' => 125,
            'completed_tasks' => 8,
            'active_hours' => 24,
            'total_posts' => 3,
            'recent_activities' => [
                ['title' => 'Profile Updated', 'description' => 'You updated your profile information', 'time' => '2 hours ago'],
                ['title' => 'New Post Created', 'description' => 'You created a new blog post', 'time' => '1 day ago'],
                ['title' => 'Comment Added', 'description' => 'You commented on a post', 'time' => '3 days ago'],
            ]
        ];
        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }

    public function users(Request $request)
    {
        try {
            $users = User::withCount(['posts'])
                ->withSum('posts', 'views')
                ->with(['posts' => function($query) {
                    $query->withCount('likes');
                }])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'avatar' => $user->avatar,
                        'posts_count' => $user->posts_count,
                        'total_views' => $user->posts_sum_views ?? 0,
                        'total_likes' => $user->posts->sum(function($post) {
                            return $post->likes_count;
                        }),
                        'created_at' => $user->created_at,
                    ];
                });

            return response()->json([
                'data' => $users,
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

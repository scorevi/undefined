<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'user') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Replace with actual data from your models
        $stats = [
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
}

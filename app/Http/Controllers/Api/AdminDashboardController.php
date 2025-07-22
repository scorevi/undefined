<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Replace with actual data from your models
        $stats = [
            'total_posts' => 25,
            'published_posts' => 20,
            'draft_posts' => 5,
            'total_views' => 15420,
            'total_comments' => 89,
            'recent_posts' => [
                ['title' => 'Getting Started with Laravel', 'views' => 1250, 'status' => 'published'],
                ['title' => 'Advanced PHP Techniques', 'views' => 890, 'status' => 'published'],
                ['title' => 'Web Development Best Practices', 'views' => 650, 'status' => 'draft'],
            ]
        ];
        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }
}

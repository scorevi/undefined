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
            'total_posts' => Post::count(),
            'total_views' => Post::sum('views'),
            'total_comments' => Comment::count(),
            'recent_posts' => Post::withCount('likes')->orderBy('created_at', 'desc')->take(5)->get(['id', 'title', 'views', 'created_at']),
            'site_name' => DB::table('settings')->where('key', 'site_name')->value('value') ?? '',
            'site_description' => DB::table('settings')->where('key', 'site_description')->value('value') ?? '',
        ];
        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }
}

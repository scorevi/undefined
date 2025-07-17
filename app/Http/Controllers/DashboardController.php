<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $user = Auth::user();
        
        // Mock data for dashboard - replace with actual data from your models
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

        return view('dashboard.index', compact('user', 'stats'));
    }
} 
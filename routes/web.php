<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DashboardController;

// Regular User API Routes
Route::post('/api/user/login', function () {
    $credentials = request()->only(['email', 'password']);
    if (Auth::attempt($credentials)) {
        return response()->json(['success' => true, 'redirect' => '/dashboard']);
    }
    return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
})->name('user.login.post');

Route::post('/api/user/register', function () {
    $validated = request()->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = \App\Models\User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
    ]);

    Auth::login($user);
    return response()->json(['success' => true, 'redirect' => '/dashboard']);
})->name('user.register.post');

// User Dashboard API route (protected by auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/user/dashboard', function () {
        $user = Auth::user();
        
        // Mock data for user dashboard - replace with actual data from your models
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
    });
});

// User Logout API route
Route::post('/api/user/logout', function () {
    Auth::logout();
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('user.logout');

// Hidden Admin API Routes (for admin access)
Route::post('/api/login', function () {
    $credentials = request()->only(['email', 'password']);
    if (Auth::attempt($credentials)) {
        return response()->json(['success' => true, 'redirect' => '/admin']);
    }
    return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
})->name('login.post');

Route::post('/api/register', function () {
    $validated = request()->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = \App\Models\User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
    ]);

    Auth::login($user);
    return response()->json(['success' => true, 'redirect' => '/admin']);
})->name('register.post');

// Admin Dashboard API route (protected by auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/dashboard', function () {
        $user = Auth::user();
        
        // Mock data for admin dashboard - replace with actual data from your models
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
    });
});

// Logout API route
Route::post('/api/logout', function () {
    Auth::logout();
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('logout');

// Serve React app for ALL routes (SPA)
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');

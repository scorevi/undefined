<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DashboardController;

// API Routes for Authentication
Route::post('/api/login', function () {
    $credentials = request()->only(['email', 'password']);
    if (Auth::attempt($credentials)) {
        return response()->json(['success' => true, 'redirect' => '/dashboard']);
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
    return response()->json(['success' => true, 'redirect' => '/dashboard']);
})->name('register.post');

// Dashboard API route (protected by auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/dashboard', function () {
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

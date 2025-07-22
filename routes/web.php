<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\UserDashboardController;

// Regular User API Routes
Route::post('/api/user/login', [UserAuthController::class, 'login'])->name('user.login.post');
Route::post('/api/user/register', [UserAuthController::class, 'register'])->name('user.register.post');

// User Dashboard API route (protected by auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/user/dashboard', UserDashboardController::class);
});

// User Logout API route
Route::post('/api/user/logout', function () {
    Auth::logout();
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('user.logout');

// Hidden Admin API Routes (for admin access)
Route::post('/api/login', [AdminAuthController::class, 'login'])->name('login.post');
Route::post('/api/register', [AdminAuthController::class, 'register'])->name('register.post');

// Admin Dashboard API route (protected by auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/dashboard', AdminDashboardController::class);
});

// Logout API route
Route::post('/api/logout', function () {
    Auth::logout();
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('logout');

// Serve React app for ALL routes (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

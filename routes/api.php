<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;

// Public API Routes (no authentication required)
Route::get('/posts/trending', [PostController::class, 'trending']);
Route::get('/posts/featured', [PostController::class, 'featured']);
Route::get('/posts/categories', [PostController::class, 'categories']);

// Authentication Routes (with proper session middleware for Docker compatibility)
Route::middleware(['api', 'web'])->group(function () {
    Route::post('/user/login', [UserAuthController::class, 'login'])->name('user.login.post');
    Route::post('/user/register', [UserAuthController::class, 'register'])->name('user.register.post');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');
    Route::post('/register', [AdminAuthController::class, 'register'])->name('register.post');
});

// Protected API Routes (requires Sanctum token authentication - for Admin)
Route::middleware('auth:sanctum')->group(function () {
    // Test route for token authentication
    Route::get('/test-auth', function (Request $request) {
        return response()->json([
            'authenticated' => true,
            'user' => auth()->user(),
            'token_valid' => true
        ]);
    });

    Route::get('/admin/dashboard', [AdminDashboardController::class, '__invoke']);
    Route::get('/admin/settings', [AdminController::class, 'getSettings']);
    Route::post('/admin/site-settings', [AdminController::class, 'updateSiteSettings']);
    Route::post('/admin/email', [AdminController::class, 'updateEmail']);
    Route::post('/admin/password', [AdminController::class, 'updatePassword']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
});

// Protected API Routes (requires session authentication - for Users)
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/user/dashboard', [UserDashboardController::class, '__invoke']);
    Route::post('/posts/{post}/like', [LikeController::class, 'like']);
    Route::post('/posts/{post}/unlike', [LikeController::class, 'unlike']);
// Logout routes (with session middleware)
Route::middleware(['web'])->group(function () {
    Route::post('/user/logout', function (\Illuminate\Http\Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['success' => true, 'redirect' => '/']);
    })->name('user.logout');

    Route::post('/logout', function (\Illuminate\Http\Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['success' => true, 'redirect' => '/']);
    })->name('logout');
});

// Blog Post API Routes
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/posts/{post}/like-status', [LikeController::class, 'status']);
Route::get('/posts/trending', [PostController::class, 'trending']);

// Comments API
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->middleware(['web', 'auth']);
Route::delete('/posts/{post}/comments/{comment}', [CommentController::class, 'destroy'])->middleware(['web', 'auth']);
Route::patch('/posts/{post}/comments/{comment}', [CommentController::class, 'update'])->middleware(['web', 'auth']);
// Admin comments management
Route::middleware(['web', 'auth'])->get('/comments', [CommentController::class, 'adminIndex']);

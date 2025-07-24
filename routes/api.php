<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;

// Regular User API Routes
Route::middleware(['web'])->group(function () {
    Route::post('/user/login', [UserAuthController::class, 'login'])->name('user.login.post');
    Route::post('/user/register', [UserAuthController::class, 'register'])->name('user.register.post');
});

// User Dashboard and Protected API routes (protected by web and auth middleware)
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/user/dashboard', UserDashboardController::class);
    Route::get('/dashboard', AdminDashboardController::class);
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/posts/{post}/like', [LikeController::class, 'like']);
    Route::post('/posts/{post}/unlike', [LikeController::class, 'unlike']);
    
});

// User Logout API route
Route::post('/user/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('user.logout');

// Hidden Admin API Routes (for admin access)
Route::middleware(['web'])->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.post');
    Route::post('/register', [AdminAuthController::class, 'register'])->name('register.post');
});

// Logout API route
Route::post('/logout', function (\Illuminate\Http\Request $request) {
    try {
        \Illuminate\Support\Facades\Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    } catch (\Throwable $e) {
        // Ignore errors, always return JSON
    }
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('logout');

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

// Admin settings endpoints
Route::middleware(['web', 'auth'])->post('/admin/email', [App\Http\Controllers\Api\AdminController::class, 'updateEmail']);
Route::middleware(['web', 'auth'])->post('/admin/password', [App\Http\Controllers\Api\AdminController::class, 'updatePassword']);
Route::middleware(['web', 'auth'])->post('/admin/site-settings', [App\Http\Controllers\Api\AdminController::class, 'updateSiteSettings']); 
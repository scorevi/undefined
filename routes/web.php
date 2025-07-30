<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\UserAuthController;

// Test session route
Route::get('/test-session', function(\Illuminate\Http\Request $request) {
    if (!$request->session()->isStarted()) {
        $request->session()->start();
    }

    $request->session()->put('test', 'Session is working!');
    return response()->json([
        'session_id' => $request->session()->getId(),
        'test_value' => $request->session()->get('test'),
        'all_session_data' => $request->session()->all()
    ]);
});

// Sanctum SPA login/logout
Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['success' => true]);
});

// Only web routes and SPA fallback remain here

// Add this above the SPA fallback
Route::get('/login', function () {
    return view('welcome');
})->name('login');

// Serve React app for ALL routes (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

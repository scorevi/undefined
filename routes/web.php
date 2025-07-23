<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\UserAuthController;

// Sanctum SPA login/logout
Route::post('/login', [UserAuthController::class, 'login']);
Route::post('/logout', function (\Illuminate\Http\Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['success' => true]);
});

// Only web routes and SPA fallback remain here

// Serve React app for ALL routes (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

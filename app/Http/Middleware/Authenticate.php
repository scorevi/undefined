<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, do not redirect, just return null
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        // Only try to redirect for web requests if the route exists
        if (Route::has('login')) {
            return Route::route('login');
        }
        return '/'; // Or any default page
    }
} 
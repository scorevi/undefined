<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminAuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'admin',
        ]);

        Auth::login($user);
        return response()->json(['success' => true, 'user' => $user, 'redirect' => '/admin']);
    }

    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if ($user->role !== 'admin') {
                Auth::logout();
                return response()->json(['success' => false, 'message' => 'You do not have admin access.'], 403);
            }
            return response()->json(['success' => true, 'user' => $user, 'redirect' => '/admin']);
        }
        return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
    }
}

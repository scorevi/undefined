<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role' => 'user',
            ]);

            Auth::login($user);

            // Removed session regeneration for Docker compatibility

            return response()->json(['success' => true, 'user' => $user, 'redirect' => '/dashboard']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Registration failed. Please try again.'], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:1',
            ]);

            $credentials = $request->only(['email', 'password']);
            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                if ($user->role !== 'user') {
                    Auth::logout();
                    return response()->json(['success' => false, 'message' => 'You do not have user access.'], 403);
                }

                return response()->json(['success' => true, 'user' => $user, 'redirect' => '/dashboard']);
            }

            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Login failed. Please try again.'], 500);
        }
    }
}

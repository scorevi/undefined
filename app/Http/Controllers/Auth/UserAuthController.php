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
            ], [
                'name.required' => 'Full name is required.',
                'name.string' => 'Full name must be a valid text string.',
                'name.max' => 'Full name cannot exceed 255 characters.',
                'email.required' => 'Email address is required.',
                'email.string' => 'Email address must be a valid text string.',
                'email.email' => 'Please enter a valid email address.',
                'email.max' => 'Email address cannot exceed 255 characters.',
                'email.unique' => 'This email address is already registered. Please use a different email or try logging in.',
                'password.required' => 'Password is required.',
                'password.string' => 'Password must be a valid text string.',
                'password.min' => 'Password must be at least 8 characters long.',
                'password.confirmed' => 'Password confirmation does not match. Please ensure both password fields are identical.',
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
                'message' => 'User registration validation failed. Please check the provided information.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Registration failed due to a server error. Please try again.'], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:1',
            ], [
                'email.required' => 'Email address is required.',
                'email.email' => 'Please enter a valid email address.',
                'password.required' => 'Password is required.',
                'password.min' => 'Password cannot be empty.',
            ]);

            $credentials = $request->only(['email', 'password']);
            if (Auth::attempt($credentials)) {
                $user = Auth::user();

                if ($user->role !== 'user') {
                    Auth::logout();
                    return response()->json([
                        'success' => false,
                        'message' => 'Access denied. This login is for regular users only. Please use the admin login if you have admin privileges.'
                    ], 403);
                }

                return response()->json(['success' => true, 'user' => $user, 'redirect' => '/dashboard']);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password. Please check your credentials and try again.'
            ], 401);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login validation failed. Please check the provided information.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Login failed due to a server error. Please try again.'], 500);
        }
    }
}

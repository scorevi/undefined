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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ], [
                'name.required' => 'Administrator name is required.',
                'name.string' => 'Administrator name must be a valid text string.',
                'name.max' => 'Administrator name cannot exceed 255 characters.',
                'email.required' => 'Administrator email address is required.',
                'email.string' => 'Administrator email address must be a valid text string.',
                'email.email' => 'Please enter a valid administrator email address.',
                'email.max' => 'Administrator email address cannot exceed 255 characters.',
                'email.unique' => 'This email address is already registered. Please use a different email.',
                'password.required' => 'Administrator password is required.',
                'password.string' => 'Administrator password must be a valid text string.',
                'password.min' => 'Administrator password must be at least 8 characters long.',
                'password.confirmed' => 'Password confirmation does not match. Please ensure both password fields are identical.',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role' => 'admin',
            ]);

            // Create Sanctum token for API authentication
            $token = $user->createToken('admin-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $token,
                'redirect' => '/admin',
                'message' => 'Admin account created successfully.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Administrator registration validation failed. Please check the provided information.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Admin registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Administrator registration failed due to a server error. Please try again.'
            ], 500);
        }
    }    public function login(Request $request)
    {
        // Validate input with detailed error messages
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:1',
        ], [
            'email.required' => 'Administrator email address is required.',
            'email.email' => 'Please enter a valid administrator email address.',
            'password.required' => 'Administrator password is required.',
            'password.min' => 'Administrator password cannot be empty.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Administrator login validation failed. Please check the provided information.',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only(['email', 'password']);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if ($user->role !== 'admin') {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Administrator privileges required. Please use the regular user login if you have a user account.'
                ], 403);
            }

            // Create Sanctum token for API authentication
            $token = $user->createToken('admin-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $token,
                'redirect' => '/admin',
                'message' => 'Administrator login successful.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid administrator email or password. Please check your credentials and try again.'
        ], 401);
    }
}

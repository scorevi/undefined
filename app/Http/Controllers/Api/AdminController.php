<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminController extends Controller
{
    // Update admin email
    public function updateEmail(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email,' . $user->id
        ], [
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already in use.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->email = $request->input('email');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Email updated successfully.'
        ]);
    }

    // Update admin password
    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ], [
            'current_password.required' => 'Current password is required.',
            'new_password.required' => 'New password is required.',
            'new_password.min' => 'New password must be at least 8 characters.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Current password is incorrect. Please try again.'
            ], 422);
        }

        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.'
        ]);
    }

    // Get site settings
    public function getSettings(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $settings = DB::table('settings')->pluck('value', 'key')->toArray();

        return response()->json([
            'success' => true,
            'settings' => $settings
        ]);
    }

    // Update site settings (site_name, site_description)
    public function updateSiteSettings(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized access.'], 401);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'site_name' => 'nullable|string|max:255',
            'site_description' => 'nullable|string|max:1000',
        ], [
            'site_name.max' => 'Site name cannot exceed 255 characters.',
            'site_description.max' => 'Site description cannot exceed 1000 characters.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Store in a settings table (create if not exists)
        DB::table('settings')->updateOrInsert(
            ['key' => 'site_name'],
            ['value' => $request->input('site_name', '')]
        );
        DB::table('settings')->updateOrInsert(
            ['key' => 'site_description'],
            ['value' => $request->input('site_description', '')]
        );

        return response()->json([
            'success' => true,
            'message' => 'Site settings updated successfully.'
        ]);
    }
}

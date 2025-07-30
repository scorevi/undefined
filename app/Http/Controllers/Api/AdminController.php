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
            return response()->json([
                'success' => false,
                'error' => 'Administrator access required. Please log in with an administrator account.'
            ], 401);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email,' . $user->id
        ], [
            'email.required' => 'Administrator email address is required.',
            'email.email' => 'Please enter a valid administrator email address.',
            'email.unique' => 'This email address is already in use by another account. Please choose a different email address.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Administrator email update validation failed. Please check the provided email address.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->email = $request->input('email');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Administrator email updated successfully.'
        ]);
    }

    // Update admin password
    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'Administrator access required. Please log in with an administrator account.'
            ], 401);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ], [
            'current_password.required' => 'Current administrator password is required to change your password.',
            'new_password.required' => 'New administrator password is required.',
            'new_password.min' => 'New administrator password must be at least 8 characters long.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Administrator password update validation failed. Please check the provided password information.',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Current administrator password is incorrect. Please enter your current password correctly.'
            ], 422);
        }

        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Administrator password updated successfully.'
        ]);
    }

    // Get site settings
    public function getSettings(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'error' => 'Administrator access required. Please log in with an administrator account.'
            ], 401);
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
            return response()->json([
                'success' => false,
                'error' => 'Administrator access required. Please log in with an administrator account.'
            ], 401);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'site_name' => 'nullable|string|max:255',
            'site_description' => 'nullable|string|max:1000',
        ], [
            'site_name.string' => 'Site name must be a valid text string.',
            'site_name.max' => 'Site name cannot exceed 255 characters.',
            'site_description.string' => 'Site description must be a valid text string.',
            'site_description.max' => 'Site description cannot exceed 1000 characters.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Site settings validation failed. Please check the provided information.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Store in a settings table (create if not exists)
        if ($request->has('site_name')) {
            $value = $request->input('site_name');
            DB::table('settings')->updateOrInsert(
                ['key' => 'site_name'],
                ['value' => $value === null ? '' : $value]
            );
        }

        if ($request->has('site_description')) {
            $value = $request->input('site_description');
            DB::table('settings')->updateOrInsert(
                ['key' => 'site_description'],
                ['value' => $value === null ? '' : $value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Site settings updated successfully.'
        ]);
    }
}

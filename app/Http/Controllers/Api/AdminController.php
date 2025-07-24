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
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $request->validate(['email' => 'required|email|unique:users,email,' . $user->id]);
        $user->email = $request->input('email');
        $user->save();
        return response()->json(['success' => true]);
    }

    // Update admin password
    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8',
        ]);
        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 422);
        }
        $user->password = Hash::make($request->input('new_password'));
        $user->save();
        return response()->json(['success' => true]);
    }

    // Update site settings (site_name, site_description)
    public function updateSiteSettings(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $request->validate([
            'site_name' => 'nullable|string|max:255',
            'site_description' => 'nullable|string|max:1000',
        ]);
        // Store in a settings table (create if not exists)
        DB::table('settings')->updateOrInsert(
            ['key' => 'site_name'],
            ['value' => $request->input('site_name', '')]
        );
        DB::table('settings')->updateOrInsert(
            ['key' => 'site_description'],
            ['value' => $request->input('site_description', '')]
        );
        return response()->json(['success' => true]);
    }
} 
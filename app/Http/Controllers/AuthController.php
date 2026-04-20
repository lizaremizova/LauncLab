<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Reģistrācija veiksmīga!'
        ], 201);
    }
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'E-pasts vai parole nav pareiza'], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Sveicināti atpakaļ!'
        ]);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Jūs veiksmīgi izrakstijies'
        ]);
    }

    public function updateAvatar(Request $request, $id)
    {
        $request->validate([
            'avatar' => 'required|string'
        ]);

        $user = \App\Models\User::where('id', $id)->first();

        if (!$user) {
            return response()->json(['message' => 'Lietotājs nav atrasts'], 404);
        }

        $user->avatar_url = $request->avatar;
        $user->save();

        return response()->json([
            'message' => 'Profila attēls veiksmīgi atjaunināts!',
            'avatar_url' => $user->avatar_url
        ]);
    }

}

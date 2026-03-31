<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use App\Http\Controllers\JobController;
use App\Http\Controllers\AuthController;

Route::get('/jobs/feed', [JobController::class, 'getDashboardJobs']);
Route::get('/jobs/all', [JobController::class, 'getAllJobs']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/jobs', [JobController::class, 'store']);
Route::put('/profile', [JobController::class, 'Profile']);

Route::get('/users', function () {
    return [
        ['id' => 1, 'name' => 'Alice', 'email' => 'alice@example.com'],
        ['id' => 2, 'name' => 'Bob', 'email' => 'bob@example.com'],
    ];
});

Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255', 'unique:users,email'],
        'password' => ['required', 'confirmed', Password::min(8)],
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'message' => 'User created',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ],
    ], 201);
});

Route::get('/user/{id}/jobs', [JobController::class, 'getMyJobs']);
Route::get('/jobs/feed', [JobController::class, 'getFeedJobs']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/jobs', [JobController::class, 'store']);
});

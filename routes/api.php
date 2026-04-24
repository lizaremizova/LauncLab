<?php

use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/jobs/feed', [JobController::class, 'getFeedJobs']);
Route::get('/user/{id}/jobs', [JobController::class, 'getJobsByAuthorId']);
Route::get('/user/{userId}/applications', [ApplicationController::class, 'userApplications']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::patch('/listings/{listingId}', [JobController::class, 'updateListing']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::post('/user/{id}/avatar', [AuthController::class, 'updateAvatar']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/{id}/profile', [AuthController::class, 'updateProfile']);
    Route::get('/listings/{listingId}/applications', [ApplicationController::class, 'getByListing']);
    Route::patch('/applications/{applicationId}/approve', [ApplicationController::class, 'approve']);
    Route::delete('/listings/{listingId}/delete', [JobController::class, 'delete']);
    Route::post('/listings/{listingId}/attachment', [JobController::class, 'uploadAttachment']);
});

<?php

use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/listings/feed', [ListingController::class, 'feed']);
Route::get('/user/{id}/listings', [ListingController::class, 'byAuthor']);
Route::get('/user/{userId}/applications', [ApplicationController::class, 'userApplications']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::patch('/listings/{listingId}', [ListingController::class, 'update']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{applicationId}', [ApplicationController::class, 'show']);
    Route::post('/applications/{applicationId}/result', [ApplicationController::class, 'uploadResult']);
    Route::get('/applications/{applicationId}/result/download', [ApplicationController::class, 'downloadResult']);
    Route::post('/user/{id}/avatar', [AuthController::class, 'updateAvatar']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/{id}/profile', [AuthController::class, 'updateProfile']);
    Route::get('/listings/{listingId}/applications', [ApplicationController::class, 'getByListing']);
    Route::patch('/applications/{applicationId}/approve', [ApplicationController::class, 'approve']);
    Route::delete('/listings/{listingId}/delete', [ListingController::class, 'delete']);
    Route::post('/listings/{listingId}/attachment', [ListingController::class, 'uploadAttachment']);
    Route::get('/listings/{listingId}/attachment', [ListingController::class, 'downloadAttachment']);
});

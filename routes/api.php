<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CategoryController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/jobs/feed', [JobController::class, 'getFeedJobs']);
Route::get('/user/{id}/jobs', [JobController::class, 'getJobsByAuthorId']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/jobs', [JobController::class, 'store']);
});

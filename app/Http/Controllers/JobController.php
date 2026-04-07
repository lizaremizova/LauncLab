<?php

namespace App\Http\Controllers;

use App\Http\Requests\JobPostRequest;
use App\Models\Job;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function __construct(
        private JobService $jobService
    ) {}

    public function getAllActiveJobs(): JsonResponse
    {
        $jobs = $this->jobService->getAllActiveJobs();

        return response()->json($jobs);
    }

    public function getJobsByAuthorId(int $authorId): JsonResponse
    {
        $jobs = $this->jobService->getJobsByAuthorId($authorId);

        return response()->json($jobs);
    }

    public function getFeedJobs(Request $request): JsonResponse
    {
        $jobs = $this->jobService->getFeedJobs($request->query('myId'));

        return response()->json($jobs);
    }

    public function store(JobPostRequest $request): JsonResponse
    {
        $job = $this->jobService->createJob(
            $request->validated(),
            auth()->id()
        );

        return response()->json([
            'message' => 'Success',
            'data' => $job,
        ], 201);
    }

    public function index()
    {
        $jobs = Job::with('categories')->get();

        return response()->json($jobs);
    }
}

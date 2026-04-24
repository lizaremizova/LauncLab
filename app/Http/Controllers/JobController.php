<?php

namespace App\Http\Controllers;

use App\Http\Requests\JobPostRequest;
use App\Http\Requests\ListingUpdateRequest;
use App\Models\Job;
use App\Services\JobService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

    public function getJobsByAuthorId(string $authorId): JsonResponse
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

    public function updateListing(ListingUpdateRequest $request, string $listingId): JsonResponse
    {
        $listing = $this->jobService->updateListing(
            $listingId,
            $request->validated(),
            auth()->id()
        );

        return response()->json([
            'message' => 'sludinājums atjaunināts!',
            'data' => $listing,
        ]);
    }

    public function index()
    {
        $jobs = Job::with('categories')->get();

        return response()->json($jobs);
    }

    public function delete(string $listingId): JsonResponse
    {
        $userId = auth()->id();

        if (!$userId) {
            return response()->json([
                'message' => 'Neautorizēts lietotājs'
            ], 401);
        }

        $listing = DB::table('listings')
            ->where('listing_id', $listingId)
            ->first();

        if (!$listing) {
            return response()->json([
                'message' => 'Sludinājums nav atrasts'
            ], 404);
        }

        if ($listing->author_id !== $userId) {
            throw new AuthorizationException('Jūs nevarat dzēst šo sludinājumu');
        }

        DB::transaction(function () use ($listingId) {

            DB::table('applications')
                ->where('listing_id', $listingId)
                ->delete();
            DB::table('job')
                ->where('listing_id', $listingId)
                ->delete();
            DB::table('listing_category')
                ->where('listing_id', $listingId)
                ->delete();
            DB::table('listings')
                ->where('listing_id', $listingId)
                ->delete();
        });

        return response()->json([
            'message' => 'Sludinājums veiksmīgi dzēsts'
        ]);}

        public function uploadAttachment(Request $request, string $listingId): JsonResponse
    {
        $userId = auth()->id();

        $listing = DB::table('listings')->where('listing_id', $listingId)->first();

        $request->validate([
            'attachment' => 'required|file|max:10240',
        ]);

        $file = $request->file('attachment');

        if ($listing->attachment_path && Storage::disk('public')->exists($listing->attachment_path)) {
            Storage::disk('public')->delete($listing->attachment_path);
        }

        $path = $file->store('listing-attachments', 'public');

        DB::table('listings')
            ->where('listing_id', $listingId)
            ->update([
                'attachment_path' => $path,
                'attachment_name' => $file->getClientOriginalName(),
                'attachment_mime' => $file->getClientMimeType(),
                'attachment_size' => $file->getSize(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Fails augšupielādēts veiksmīgi',
            'data' => [
                'attachment_name' => $file->getClientOriginalName(),
                'attachment_mime' => $file->getClientMimeType(),
                'attachment_size' => $file->getSize(),
                'attachment_url' => asset('storage/' . $path),
            ]
        ]);
    }
}

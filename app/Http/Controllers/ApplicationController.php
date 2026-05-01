<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Listing;
use Illuminate\Http\Request;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController
{
    public function __construct(
        private ApplicationService $applicationService
    ) {}

    public function getByListing(string $listingId): JsonResponse
    {
        $applications = $this->applicationService->getByListing($listingId, auth()->id());

        $mapped = collect($applications)->map(function ($app) {
            $appArr = (array) $app;

            $appArr['result_url'] = !empty($appArr['result_path'])
                ? ($appArr['result_path'] !== '0' ? "/api/applications/{$appArr['application_id']}/result/download" : null)
                : null;

            return $appArr;
        })->values();

        return response()->json($mapped);
    }

    public function approve(string $applicationId): JsonResponse
    {
        $result = $this->applicationService->approve($applicationId, auth()->id());

        return response()->json([
            'message' => 'Pieteikums apstiprināts',
            'data' => $result
        ]);
    }

    public function show(string $applicationId): JsonResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new AuthorizationException('Neautorizets lietotajs');
        }

        $app = Application::with(['listing.user', 'listing.categories'])
            ->where('id', $applicationId)
            ->firstOrFail();

        $listing = $app->listing;
        if (!$listing) {
            abort(404, 'Listing not found');
        }

        if ($app->user_id !== $userId && $listing->user_id !== $userId) {
            throw new AuthorizationException('Jums nav piekluves sis pieteikuma datiem');
        }

        $attachmentUrl = $listing->attachment_path
            ? "/api/listings/{$listing->id}/attachment"
            : null;

        $resultUrl = ($app->result_path && $app->result_path !== '0')
            ? "/api/applications/{$app->id}/result/download"
            : null;

        return response()->json([
            'application' => [
                'id' => $app->id,
                'status' => $app->status,
                'result_name' => $app->result_name,
                'result_mime' => $app->result_mime,
                'result_size' => $app->result_size,
                'result_url' => $resultUrl,
                'result_uploaded_at' => $app->result_uploaded_at,
                'created_at' => $app->created_at,
            ],
            'listing' => [
                'id' => $listing->id,
                'name' => $listing->name,
                'description' => $listing->description,
                'type' => $listing->type,
                'statuss' => $listing->statuss,
                'publication_date' => $listing->publication_date,
                'budget' => $listing->budget,
                'deadline_days' => $listing->deadline_days,
                'attachment_name' => $listing->attachment_name,
                'attachment_mime' => $listing->attachment_mime,
                'attachment_size' => $listing->attachment_size,
                'attachment_url' => $attachmentUrl,
                'categories' => $listing->categories,
                'user' => $listing->user ? [
                    'id' => $listing->user->id,
                    'username' => $listing->user->username,
                    'name' => $listing->user->name,
                ] : null,
            ],
        ]);
    }

    public function uploadResult(Request $request, string $applicationId): JsonResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new AuthorizationException('Neautorizets lietotajs');
        }

        $request->validate([
            'result' => ['required', 'file', 'max:10240'], // 10MB
        ]);

        $app = Application::with('listing')
            ->where('id', $applicationId)
            ->firstOrFail();

        if ($app->user_id !== $userId) {
            throw new AuthorizationException('Jus nevarat iesniegt rezultatu cita lietotaja pieteikumam');
        }

        if ($app->status !== 'apstiprināts') {
            throw new AuthorizationException('Rezultatu var augssupieladet tikai apstiprinatam pieteikumam');
        }

        $file = $request->file('result');

        if (!empty($app->result_path)) {
            Storage::disk('local')->delete($app->result_path);
        }

        Storage::disk('local')->makeDirectory("application-results/{$applicationId}");
        $path = $file->store("application-results/{$applicationId}", 'local');
        if (!$path) {
            abort(500, 'File storage failed');
        }

        $app->result_path = $path;
        $app->result_name = $file->getClientOriginalName();
        $app->result_mime = $file->getClientMimeType();
        $app->result_size = $file->getSize();
        $app->result_uploaded_at = now();
        $app->save();

        Listing::where('id', $app->listing_id)->update([
            'statuss' => 'pabeigts',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Rezultats augssupieladets',
            'data' => [
                'result_name' => $app->result_name,
                'result_mime' => $app->result_mime,
                'result_size' => $app->result_size,
                'result_url' => ($app->result_path && $app->result_path !== '0')
                    ? "/api/applications/{$app->id}/result/download"
                    : null,
                'result_uploaded_at' => $app->result_uploaded_at,
            ],
        ], 201);
    }

    public function downloadResult(string $applicationId): StreamedResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new AuthorizationException('Neautorizets lietotajs');
        }

        $app = Application::with('listing')
            ->where('id', $applicationId)
            ->firstOrFail();

        $listing = $app->listing;
        if (!$listing) {
            abort(404, 'Listing not found');
        }

        if ($app->user_id !== $userId && $listing->user_id !== $userId) {
            throw new AuthorizationException('Jums nav piekluves rezultata failam');
        }

        if (empty($app->result_path) || $app->result_path === '0') {
            abort(404, 'Result not found');
        }

        if (!Storage::disk('local')->exists($app->result_path)) {
            abort(404, 'Result file missing');
        }

        $downloadName = $app->result_name ?: basename($app->result_path);
        return Storage::disk('local')->download($app->result_path, $downloadName);
    }
    public function store(Request $request)
    {
        $application = Application::create([
            'listing_id' => $request->listing_id,
            'user_id' => auth()->id(),
            'status' => 'gaida apstiprinājumu',
        ]);

        return response()->json([
            'message' => 'Pieteikums veiksmīgi nosūtīts!',
            'application' => $application
        ], 201);
    }

    public function userApplications($userId)
    {
        $apps = Application::with(['listing.user', 'listing.categories'])
            ->where('user_id', $userId)
            ->get();

        return $apps->map(function($app) use ($userId) {
            $listing = $app->listing;

            $author = $listing ? $listing->user : null;

            $displayAuthor = 'Nezināms';
            if ($author) {
                $displayAuthor = ($author->id === $userId) ? 'Jūs' : $author->username;
            }

            return [
                'app_id' => $app->id,
                'status' => $app->status,
                'listing_id' => $listing ? $listing->id : null,
                'job_name' => $listing ? $listing->name : 'RELATIONSHIP_BROKEN',
                'author_name' => $displayAuthor,
                'description' => $listing ? $listing->description : '',
                'budget' => $listing ? ($listing->budget ?? 0) : 0,
                'deadline' => $listing ? ($listing->deadline_days ?? 0) : 0,
                'categories' => $listing ? $listing->categories : [],
                'attachment_name' => $listing ? $listing->attachment_name : null,
                'attachment_mime' => $listing ? $listing->attachment_mime : null,
                'attachment_size' => $listing ? $listing->attachment_size : null,
                'attachment_url' => ($listing && $listing->attachment_path)
                    ? "/api/listings/{$listing->id}/attachment"
                    : null,
                'result_name' => $app->result_name,
                'result_mime' => $app->result_mime,
                'result_size' => $app->result_size,
                'result_url' => ($app->result_path && $app->result_path !== '0')
                    ? "/api/applications/{$app->id}/result/download"
                    : null,
            ];
        });
    }
}

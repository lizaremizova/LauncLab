<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JobController extends Controller
{
    public function uploadAttachment(Request $request, string $listingId): JsonResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new AuthorizationException('Neautorizets lietotajs');
        }

        $request->validate([
            'attachment' => ['required', 'file', 'max:10240'], // 10MB
        ]);

        $listing = DB::table('listings')->where('id', $listingId)->first();
        if (!$listing) {
            abort(404, 'Listing not found');
        }

        if ($listing->user_id !== $userId) {
            throw new AuthorizationException('Jus nevarat augssupieladet materialus sis sludinajumam');
        }

        $file = $request->file('attachment');

        if (!empty($listing->attachment_path)) {
            Storage::disk('local')->delete($listing->attachment_path);
        }

        Storage::disk('local')->makeDirectory("listing-attachments/{$listingId}");
        $path = $file->store("listing-attachments/{$listingId}", 'local');
        if (!$path) {
            abort(500, 'File storage failed');
        }

        $payload = [
            'attachment_path' => $path,
            'attachment_name' => $file->getClientOriginalName(),
            'attachment_mime' => $file->getClientMimeType(),
            'attachment_size' => $file->getSize(),
            'updated_at' => now(),
        ];

        DB::table('listings')
            ->where('id', $listingId)
            ->update($payload);

        return response()->json([
            'message' => 'Fails augssupieladets',
            'data' => [
                'attachment_name' => $payload['attachment_name'],
                'attachment_mime' => $payload['attachment_mime'],
                'attachment_size' => $payload['attachment_size'],
                'attachment_url' => "/api/listings/{$listingId}/attachment",
            ],
        ], 201);
    }

    public function downloadAttachment(string $listingId): StreamedResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new AuthorizationException('Neautorizets lietotajs');
        }

        $listing = DB::table('listings')->where('id', $listingId)->first();
        if (!$listing) {
            abort(404, 'Listing not found');
        }

        // Allow listing author OR approved applicant to download.
        if ($listing->user_id !== $userId) {
            $hasApproved = DB::table('applications')
                ->where('listing_id', $listingId)
                ->where('user_id', $userId)
                ->where('status', 'apstiprināts')
                ->exists();

            if (!$hasApproved) {
                throw new AuthorizationException('Jums nav piekluves pielikumam');
            }
        }

        if (empty($listing->attachment_path)) {
            abort(404, 'Attachment not found');
        }

        if (!Storage::disk('local')->exists($listing->attachment_path)) {
            abort(404, 'Attachment file missing');
        }

        $downloadName = $listing->attachment_name ?: basename($listing->attachment_path);
        return Storage::disk('local')->download($listing->attachment_path, $downloadName);
    }

    public function delete(string $listingId): JsonResponse
    {
        $userId = auth()->id();
        if (!$userId) {
            throw new AuthorizationException('Neautorizets lietotajs');
        }

        return DB::transaction(function () use ($listingId, $userId) {
            $listing = DB::table('listings')->where('id', $listingId)->first();
            if (!$listing) {
                abort(404, 'Listing not found');
            }

            if ($listing->user_id !== $userId) {
                throw new AuthorizationException('Jus nevarat dzest so sludinajumu');
            }

            if (!empty($listing->attachment_path)) {
                Storage::disk('local')->delete($listing->attachment_path);
            }

            if (Schema::hasColumn('applications', 'result_path')) {
                $resultPaths = DB::table('applications')
                    ->where('listing_id', $listingId)
                    ->whereNotNull('result_path')
                    ->pluck('result_path')
                    ->all();

                foreach ($resultPaths as $resultPath) {
                    Storage::disk('local')->delete($resultPath);
                }
            }

            DB::table('listings')->where('id', $listingId)->delete();

            return response()->json([
                'message' => 'Sludinajums dzests',
            ]);
        });
    }
}

<?php

namespace App\Services;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ApplicationService
{
    public function getByListing(string $listingId, ?string $currentUserId): array
    {
        $listing = DB::table('listings')
            ->where('id', $listingId)
            ->first();

        if (!$listing) {
            abort(404, 'Listing not found');
        }

        if (!$currentUserId) {
            throw new AuthorizationException('Neautorizēts lietotājs');
        }

        if ($listing->user_id !== $currentUserId) {
            throw new AuthorizationException('Jūs nevarat apskatīt pieteikumus');
        }

        $select = [
            'applications.id as application_id',
            'applications.status',
        ];

        if (Schema::hasColumn('applications', 'result_path')) {
            $select[] = 'applications.result_path';
            $select[] = 'applications.result_name';
            $select[] = 'applications.result_mime';
            $select[] = 'applications.result_size';
            $select[] = 'applications.result_uploaded_at';
        }

        $select = array_merge($select, [
            'applications.created_at as applied_at',
            'users.id as user_id',
            'users.name',
            'users.username',
            'users.email',
            'users.avatar_url',
            'users.description',
        ]);

        return DB::table('applications')
            ->join('users', 'applications.user_id', '=', 'users.id')
            ->where('applications.listing_id', $listingId)
            ->select($select)
            ->orderBy('applications.created_at', 'desc')
            ->get()
            ->toArray();
    }

    public function approve(string $applicationId, ?string $currentUserId): array
    {
        if (!$currentUserId) {
            throw new AuthorizationException('Neautorizēts lietotājs');
        }

        return DB::transaction(function () use ($applicationId, $currentUserId) {
            $application = DB::table('applications')
                ->where('id', $applicationId)
                ->first();

            if (!$application) {
                abort(404, 'Application not found');
            }

            $listing = DB::table('listings')
                ->where('id', $application->listing_id)
                ->first();

            if (!$listing) {
                abort(404, 'Listing not found');
            }

            if ($listing->user_id !== $currentUserId) {
                throw new AuthorizationException('Jūs nevarat apstiprināt šo pieteikumu');
            }

            $alreadyApproved = DB::table('applications')
                ->where('listing_id', $application->listing_id)
                ->where('status', 'apstiprināts')
                ->where('id', '!=', $applicationId)
                ->exists();

            if ($alreadyApproved) {
                abort(409, 'Listing already has an approved application');
            }

            DB::table('applications')
                ->where('id', $applicationId)
                ->update([
                    'status' => 'apstiprināts',
                    'updated_at' => now(),
                ]);

            DB::table('applications')
                ->where('listing_id', $application->listing_id)
                ->where('id', '!=', $applicationId)
                ->whereIn('status', ['gaida apstiprinājumu', 'gaida apstiprinÄjumu'])
                ->update([
                    'status' => 'noraidīts',
                    'updated_at' => now(),
                ]);

            DB::table('listings')
                ->where('id', $application->listing_id)
                ->update([
                    'statuss' => 'procesa',
                    'updated_at' => now(),
                ]);

            return [
                'application_id' => $applicationId,
                'listing_id' => $application->listing_id,
                'status' => 'apstiprināts',
            ];
        });
    }
}

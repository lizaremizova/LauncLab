<?php

namespace App\Services;

use App\Repositories\JobRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class JobService
{
    public function __construct(
        private JobRepository $jobRepository
    ) {}

    public function getAllActiveJobs()
    {
        return $this->jobRepository->getAllActiveJobs();
    }

    public function getJobsByAuthorId(string $authorId)
    {
        return $this->jobRepository->getJobsByAuthorId($authorId);
    }

    public function getFeedJobs($myId = null)
    {
        return $this->jobRepository->getFeedJobs($myId);
    }

    public function getByListing(string $listingId, ?string $currentUserId): array
    {
        $listing = DB::table('listings')
            ->where('listing_id', $listingId)
            ->first();

        if (!$listing) {
            abort(404, 'Listing not found');
        }

        if (!$currentUserId) {
            throw new AuthorizationException('NeautorizÄ“ts lietotÄjs');
        }

        if ($listing->author_id !== $currentUserId) {
            throw new AuthorizationException('JÅ«s nevarat apskatÄ«ties pieteikumus');
        }

        return DB::table('applications')
            ->join('users', 'applications.user_id', '=', 'users.id')
            ->where('applications.listing_id', $listingId)
            ->select(
                'applications.id as application_id',
                'applications.status',
                'applications.created_at as applied_at',
                'users.id as user_id',
                'users.name',
                'users.username',
                'users.email',
                'users.avatar_url',
                'users.description'
            )
            ->orderBy('applications.created_at', 'desc')
            ->get()
            ->toArray();
    }

    public function updateListing(string $listingId, array $data, ?string $currentUserId): object
    {
        if (!$currentUserId) {
            throw new AuthorizationException('NeautorizÄ“ts lietotÄjs');
        }

        return DB::transaction(function () use ($listingId, $data, $currentUserId) {
            $listing = DB::table('listings')
                ->where('listing_id', $listingId)
                ->first();

            if (!$listing) {
                abort(404, 'Listing not found');
            }

            if ($listing->author_id !== $currentUserId) {
                throw new AuthorizationException('JÅ«s nevarat rediÄ£et Å¡o sludinÄjumu!');
            }

            $update = [];
            foreach (['name', 'description', 'statuss'] as $field) {
                if (array_key_exists($field, $data)) {
                    $update[$field] = $data[$field];
                }
            }

            if ($update !== []) {
                $update['updated_at'] = now();

                DB::table('listings')
                    ->where('listing_id', $listingId)
                    ->update($update);
            }

            return DB::table('listings')
                ->where('listing_id', $listingId)
                ->first();
        });
    }
}


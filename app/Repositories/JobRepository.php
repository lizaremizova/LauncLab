<?php

namespace App\Repositories;

use App\Models\Listing;
use Illuminate\Support\Facades\DB;

class JobRepository
{
    public function getAllActiveJobs()
    {
        return DB::table('listings')
            ->join('job', 'listings.listing_id', '=', 'job.listing_id')
            ->join('users', 'listings.author_id', '=', 'users.id')
            ->select(
                'listings.*',
                'job.budget',
                'job.deadline_days',
                'users.username'
            )
            ->where('listings.statuss', 'aktīvs')
            ->orderBy('listings.publication_date', 'desc')
            ->get();
    }

    public function getJobsByAuthorId(string $authorId)
    {
        $rows = DB::table('listings')
            ->join('job', 'listings.listing_id', '=', 'job.listing_id')
            ->join('users', 'listings.author_id', '=', 'users.id')
            ->leftJoin('listing_category', 'listings.listing_id', '=', 'listing_category.listing_id')
            ->leftJoin('categories', 'listing_category.category_id', '=', 'categories.category_id')
            ->select(
                'listings.*',
                'job.budget',
                'job.deadline_days',
                'users.username',
                'categories.category_id as cat_id',
                'categories.name as cat_name'
            )
            ->where('listings.author_id', $authorId)
            ->orderBy('listings.publication_date', 'desc')
            ->get();

        $jobs = [];

        foreach ($rows as $row) {
            $jobId = $row->listing_id;

            if (!isset($jobs[$jobId])) {
                $jobs[$jobId] = [
                    'listing_id' => $row->listing_id,
                    'name' => $row->name,
                    'description' => $row->description,
                    'author_id' => $row->author_id,
                    'username' => $row->username,
                    'statuss' => $row->statuss,
                    'publication_date' => $row->publication_date,
                    'budget' => $row->budget,
                    'deadline_days' => $row->deadline_days,
                    'categories' => [],
                ];
            }

            if ($row->cat_id) {
                $jobs[$jobId]['categories'][] = [
                    'id' => $row->cat_id,
                    'name' => $row->cat_name,
                ];
            }
        }

        return array_values($jobs);
    }

    public function getFeedJobs(?string $myId = null)
    {
        $query = DB::table('listings')
            ->join('job', 'listings.listing_id', '=', 'job.listing_id')
            ->join('users', 'listings.author_id', '=', 'users.id')
            ->leftJoin('listing_category', 'listings.listing_id', '=', 'listing_category.listing_id')
            ->leftJoin('categories', 'listing_category.category_id', '=', 'categories.category_id')
            ->select(
                'listings.listing_id',
                'listings.name',
                'listings.description',
                'listings.author_id',
                'listings.statuss',
                'listings.publication_date',
                'job.budget',
                'job.deadline_days',
                'users.username',
                'categories.category_id as cat_id',
                'categories.name as cat_name'
            )
            ->where('listings.statuss', 'aktīvs');

        if ($myId !== null) {
            $query->where('listings.author_id', '!=', $myId);
        }

        $rows = $query
            ->orderBy('listings.publication_date', 'desc')
            ->limit(10)
            ->get();

        $jobs = [];

        foreach ($rows as $row) {
            $jobId = $row->listing_id;

            if (!isset($jobs[$jobId])) {
                $jobs[$jobId] = [
                    'listing_id' => $row->listing_id,
                    'name' => $row->name,
                    'description' => $row->description,
                    'author_id' => $row->author_id,
                    'username' => $row->username,
                    'statuss' => $row->statuss,
                    'publication_date' => $row->publication_date,
                    'budget' => $row->budget,
                    'deadline_days' => $row->deadline_days,
                    'categories' => [],
                ];
            }

            if ($row->cat_id) {
                $jobs[$jobId]['categories'][] = [
                    'id' => $row->cat_id,
                    'name' => $row->cat_name,
                ];
            }
        }

        return array_values($jobs);
    }

    public function createListing(array $data): string
    {
        $listing = Listing::create($data);
        return $listing->listing_id;
    }

    public function createJobDetails(array $data): void
    {
        DB::table('job')->insert($data);
    }

    public function attachCategories(string $listingId, array $categoryIds): void
    {
        $rows = [];

        foreach ($categoryIds as $katId) {
            $rows[] = [
                'listing_id' => $listingId,
                'category_id' => $katId,
            ];
        }

        DB::table('listing_category')->insert($rows);
    }

    public function findById(string $listingId)
    {
        return DB::table('listings')
            ->join('job', 'listings.listing_id', '=', 'job.listing_id')
            ->select('listings.*', 'job.budget', 'job.deadline_days')
            ->where('listings.listing_id', $listingId)
            ->first();
    }
}

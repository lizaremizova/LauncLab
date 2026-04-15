<?php

namespace App\Services;

use App\Repositories\JobRepository;
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

    public function createJob(array $data, string $author_id): object
    {
        return DB::transaction(function () use ($data, $author_id) {
            $listing_id = $this->jobRepository->createListing([
                'name' => $data['name'],
                'description' => $data['description'],
                'statuss' => 'aktīvs',
                'publication_date' => now(),
                'author_id' => $author_id,
            ]);

            $this->jobRepository->createJobDetails([
                'listing_id' => $listing_id,
                'budget' => $data['budget'],
                'deadline_days' => $data['deadline_days'],
            ]);

            $this->jobRepository->attachCategories(
                $listing_id,
                $data['categories']
            );

            return $this->jobRepository->findById($listing_id);
        });
    }
}

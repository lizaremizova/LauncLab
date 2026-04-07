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

    public function getJobsByAuthorId(int $authorId)
    {
        return $this->jobRepository->getJobsByAuthorId($authorId);
    }

    public function getFeedJobs($myId = null)
    {
        $myId = is_numeric($myId) ? (int) $myId : null;

        return $this->jobRepository->getFeedJobs($myId);
    }

    public function createJob(array $data, int $authorId): object
    {
        return DB::transaction(function () use ($data, $authorId) {
            $sludinajumsId = $this->jobRepository->createSludinajums([
                'nosaukums' => $data['nosaukums'],
                'apraksts' => $data['apraksts'],
                'statuss' => 'aktīvs',
                'publDatums' => now(),
                'autoraID' => $authorId,
            ]);

            $this->jobRepository->createDarbs([
                'sludinajumaID' => $sludinajumsId,
                'budzets' => $data['budzets'],
                'termina_dienas' => $data['termina_dienas'],
            ]);

            $this->jobRepository->attachCategories(
                $sludinajumsId,
                $data['kategorijas']
            );

            return $this->jobRepository->findById($sludinajumsId);
        });
    }
}

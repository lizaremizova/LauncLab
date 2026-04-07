<?php

namespace App\Repositories;

use App\Models\Listing;
use Illuminate\Support\Facades\DB;

class JobRepository
{
    public function getAllActiveJobs()
    {
        return DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->select('sludinajums.*', 'darbs.budzets', 'darbs.termina_dienas')
            ->where('sludinajums.statuss', 'aktīvs')
            ->orderBy('sludinajums.publDatums', 'desc')
            ->get();
    }

    public function getJobsByAuthorId(int $authorId)
    {
        $rows = DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->leftJoin('sludinajums_kategorija', 'sludinajums.sludinajumaID', '=', 'sludinajums_kategorija.sludinajumaID')
            ->leftJoin('kategorija', 'sludinajums_kategorija.kategorijaID', '=', 'kategorija.kategorijasID')
            ->select(
                'sludinajums.*',
                'darbs.budzets',
                'darbs.termina_dienas',
                'kategorija.kategorijasID as kategorijas_id',
                'kategorija.nosaukums as kategorijas_nosaukums'
            )
            ->where('sludinajums.autoraID', $authorId)
            ->orderBy('sludinajums.publDatums', 'desc')
            ->get();

        $jobs = [];

        foreach ($rows as $row) {
            $jobId = $row->sludinajumaID;

            if (!isset($jobs[$jobId])) {
                $jobs[$jobId] = [
                    'sludinajumaID' => $row->sludinajumaID,
                    'nosaukums' => $row->nosaukums,
                    'apraksts' => $row->apraksts,
                    'autoraID' => $row->autoraID,
                    'statuss' => $row->statuss,
                    'publDatums' => $row->publDatums,
                    'budzets' => $row->budzets,
                    'termina_dienas' => $row->termina_dienas,
                    'kategorijas' => [],
                ];
            }

            if ($row->kategorijas_id) {
                $jobs[$jobId]['kategorijas'][] = [
                    'id' => $row->kategorijas_id,
                    'nosaukums' => $row->kategorijas_nosaukums,
                ];
            }
        }

        return array_values($jobs);
    }
    public function getFeedJobs(?int $myId = null)
    {
        $query = DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->leftJoin('sludinajums_kategorija', 'sludinajums.sludinajumaID', '=', 'sludinajums_kategorija.sludinajumaID')
            ->leftJoin('kategorija', 'sludinajums_kategorija.kategorijaID', '=', 'kategorija.kategorijasID')
            ->select(
                'sludinajums.sludinajumaID',
                'sludinajums.nosaukums',
                'sludinajums.apraksts',
                'sludinajums.autoraID',
                'sludinajums.statuss',
                'sludinajums.publDatums',
                'darbs.budzets',
                'darbs.termina_dienas',
                'kategorija.kategorijasID as kategorijas_id',
                'kategorija.nosaukums as kategorijas_nosaukums'
            )
            ->where('sludinajums.statuss', 'aktīvs');

        if ($myId !== null) {
            $query->where('sludinajums.autoraID', '!=', $myId);
        }

        $rows = $query
            ->orderBy('sludinajums.publDatums', 'desc')
            ->limit(10)
            ->get();

        $jobs = [];

        foreach ($rows as $row) {
            $jobId = $row->sludinajumaID;

            if (!isset($jobs[$jobId])) {
                $jobs[$jobId] = [
                    'sludinajumaID' => $row->sludinajumaID,
                    'nosaukums' => $row->nosaukums,
                    'apraksts' => $row->apraksts,
                    'autoraID' => $row->autoraID,
                    'statuss' => $row->statuss,
                    'publDatums' => $row->publDatums,
                    'budzets' => $row->budzets,
                    'termina_dienas' => $row->termina_dienas,
                    'kategorijas' => [],
                ];
            }

            if ($row->kategorijas_id) {
                $jobs[$jobId]['kategorijas'][] = [
                    'id' => $row->kategorijas_id,
                    'nosaukums' => $row->kategorijas_nosaukums,
                ];
            }
        }

        return array_values($jobs);
    }
    public function createSludinajums(array $data): int
    {
        $sludinajums = Listing::create($data);
        return $sludinajums->sludinajumaID;
    }

    public function createDarbs(array $data): void
    {
        DB::table('darbs')->insert($data);
    }

    public function attachCategories(int $sludinajumsId, array $categoryIds): void
    {
        $rows = [];

        foreach ($categoryIds as $katId) {
            $rows[] = [
                'sludinajumaID' => $sludinajumsId,
                'kategorijaID' => $katId,
            ];
        }

        DB::table('sludinajums_kategorija')->insert($rows);
    }

    public function findById(int $sludinajumsId)
    {
        return DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->select('sludinajums.*', 'darbs.budzets', 'darbs.termina_dienas')
            ->where('sludinajums.sludinajumaID', $sludinajumsId)
            ->first();
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class JobController extends Controller
{
    public function getDashboardJobs(): JsonResponse
    {
        $jobs = DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->select(
                'sludinajums.nosaukums',
                'sludinajums.apraksts',
                'darbs.budzets',
                'darbs.termina_dienas'
            )
            ->where('sludinajums.statuss', '=', 'aktīvs')
            ->orderBy('sludinajums.publDatums', 'desc')
            ->limit(4)
            ->get();

        return response()->json($jobs);
    }

    public function getAllJobs(): JsonResponse {
        $jobs = DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->select('sludinajums.*', 'darbs.budzets', 'darbs.termina_dienas')
            ->where('sludinajums.statuss', '=', 'aktīvs')
            ->orderBy('sludinajums.publDatums', 'desc')
            ->get(); 

        return response()->json($jobs);
    }
}

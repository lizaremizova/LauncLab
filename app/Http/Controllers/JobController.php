<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function getDashboardJobs(): JsonResponse
    {

        return response()->json([]);
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
    public function getMyJobs($id)
    {
        $jobs = DB::table('sludinajums')
            ->join('darbs', 'sludinajums.sludinajumaID', '=', 'darbs.sludinajumaID')
            ->select('sludinajums.*', 'darbs.budzets', 'darbs.termina_dienas')
            ->where('sludinajums.autoraID', '=', $id) // This is the filter!
            ->orderBy('sludinajums.publDatums', 'desc')
            ->get();

        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nosaukums' => 'required|string',
            'apraksts' => 'required|string',
            'budzets' => 'required|numeric',
            'termina_dienas' => 'required|integer',
            'kategorijas' => 'required|array' // Added for multiple categories
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // 1. Create the Ad
                $sludinajumsId = DB::table('sludinajums')->insertGetId([
                    'nosaukums' => $validated['nosaukums'],
                    'apraksts' => $validated['apraksts'],
                    'statuss' => 'aktīvs',
                    'publDatums' => now(),
                    'autoraID' => auth()->id()
                ]);

                // 2. Create the Job Details
                DB::table('darbs')->insert([
                    'sludinajumaID' => $sludinajumsId,
                    'budzets' => $validated['budzets'],
                    'termina_dienas' => $validated['termina_dienas'],
                ]);

                // 3. Link Multiple Categories (Pivot Table)
                foreach ($validated['kategorijas'] as $katId) {
                    DB::table('sludinajums_kategorija')->insert([
                        'sludinajumaID' => $sludinajumsId,
                        'kategorijaID' => $katId
                    ]);
                }

                return response()->json(['message' => 'Success'], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


}

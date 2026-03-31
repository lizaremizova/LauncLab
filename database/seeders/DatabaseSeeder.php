<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
        ]);

        DB::table('users')->insert([
            'name' => 'Polina',
            'email' => 'polinan@test.com',
            'password' => bcrypt('password'),
        ]);

        DB::table('users')->updateOrInsert(
            ['email' => 'edgar@test.com'],
            [
                'name' => 'Edgar',
                'password' => bcrypt('password'),
            ]
        );

        $sid1 = DB::table('sludinajums')->insertGetId([
            'nosaukums' => 'Mārketinga aģentūras mājaslapas izveide',
            'apraksts' => 'Nepieciešams radošs tīkla izstrādātājs...',
            'statuss' => 'aktīvs',
            'publDatums' => now(),
            'autoraID' => 1,
        ]);

        DB::table('darbs')->insert([
            'sludinajumaID' => $sid1,
            'budzets' => 250.00,
            'termina_dienas' => 10,
        ]);

// SECOND JOB
        $sid2 = DB::table('sludinajums')->insertGetId([
            'nosaukums' => 'React Dashboard Template',
            'apraksts' => 'Moderns un pielāgojams vadības paneļa veidnis...',
            'statuss' => 'aktīvs',
            'publDatums' => now(),
            'autoraID' => 1,
        ]);

        DB::table('darbs')->insert([
            'sludinajumaID' => $sid2,
            'budzets' => 300.00,
            'termina_dienas' => 20,
        ]);

        $sid3 = DB::table('sludinajums')->insertGetId([
            'nosaukums' => 'UX/UI Redesign for Fitness App',
            'apraksts' => 'Looking for a UI designer to modernize a mobile fitness app interface.',
            'statuss' => 'aktīvs',
            'publDatums' => now(),
            'autoraID' => 2,
        ]);

        DB::table('darbs')->insert([
            'sludinajumaID' => $sid3,
            'budzets' => 300.00,
            'termina_dienas' => 20,
        ]);

        $sid4 = DB::table('sludinajums')->insertGetId([
            'nosaukums' => 'mobile App',
            'apraksts' => 'Looking for a developer.',
            'statuss' => 'aktīvs',
            'publDatums' => now(),
            'autoraID' => 3,
        ]);

        DB::table('darbs')->insert([
            'sludinajumaID' => $sid4,
            'budzets' => 300.00,
            'termina_dienas' => 20,
        ]);


        DB::table('kategorija')->insert([
            ['kategorijasID' => 1, 'nosaukums' => 'Dizains'],
            ['kategorijasID' => 2, 'nosaukums' => 'Izstrāde'],
            ['kategorijasID' => 3, 'nosaukums' => 'Mārketings'],
            ['kategorijasID' => 4, 'nosaukums' => 'Teksti'],
        ]);
    }
}



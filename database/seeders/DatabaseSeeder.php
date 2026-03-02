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

        DB::table('kategorija')->insertGetId([
            'nosaukums' => 'Izstrāde'
        ]);

        $sid = DB::table('sludinajums')->insertGetId([
            'nosaukums' => 'Mārketinga aģentūras mājaslapas izveide',
            'apraksts' => 'Nepieciešams radošs tīmekļa izstrādātājs...',
            'statuss' => 'aktīvs',
            'publDatums' => now(),
            'autoraID' => 1,
            'kategorijasID' => 1,
        ]);

        DB::table('darbs')->insert([
            'sludinajumaID' => $sid,
            'budzets' => 250.00,
            'termina_dienas' => 10,
        ]);
    }
}



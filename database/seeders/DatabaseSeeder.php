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

        DB::table('users')->updateOrInsert(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('parol0909'),
                'username' => 'admin',
            ]
        );


        DB::table('users')->updateOrInsert(
            ['email' => 'edgar@test.com'],
            [
                'name' => 'Edgar',
                'password' => bcrypt('password'),
                'username' => 'edgar',
            ]
        );

        $sid1 = DB::table('listings')->insertGetId([
            'name' => 'Mārketinga aģentūras mājaslapas izveide',
            'description' => 'Nepieciešams radošs tīkla izstrādātājs...',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => 1,
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid1,
            'budget' => 250.00,
            'deadline_days' => 10,
        ]);

// SECOND JOB
        $sid2 = DB::table('listings')->insertGetId([
            'name' => 'React Dashboard Template',
            'description' => 'Moderns un pielāgojams vadības paneļa veidnis...',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => 2,
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid2,
            'budget' => 300.00,
            'deadline_days' => 20,
        ]);

        $sid3 = DB::table('listings')->insertGetId([
            'name' => 'UX/UI Redesign for Fitness App',
            'description' => 'Looking for a UI designer to modernize a mobile fitness app interface.',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => 1,
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid3,
            'budget' => 300.00,
            'deadline_days' => 20,
        ]);

        $sid4 = DB::table('listings')->insertGetId([
            'name' => 'mobile App',
            'description' => 'Looking for a developer.',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => 2,
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid4,
            'budget' => 300.00,
            'deadline_days' => 20,
        ]);

//        $sid3 = DB::table('listings')->insertGetId([
//            'nosaukums' => 'ai chatbot development',
//            'apraksts' => 'Moderns un pielāgojams vadības paneļa veidnis...',
//            'statuss' => 'aktīvs',
//            'publDatums' => now(),
//            'autoraID' => 1,
//        ]);
//
//        DB::table('job')->insert([
//            'sludinajumaID' => $sid3,
//            'budzets' => 355.00,
//            'termina_dienas' => 15,
//        ]);

        DB::table('categories')->insert([
            ['name' => 'Dizains'],
            ['name' => 'Izstrāde'],
            ['name' => 'Mārketings'],
            ['name' => 'Teksti'],
            ['name' => 'spēles']
        ]);

        DB::table('listings')->where('listing_id', $sid1)->update([
            'statuss' => 'pabeigts',
        ]);

        DB::table('listing_category')->insert([
            'listing_id' => $sid1,
            'category_id' => 2,
        ]);
    }
}



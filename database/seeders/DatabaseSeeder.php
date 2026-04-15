<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //USERS
        $adminId = (string) Str::uuid();
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@test.com'],
            [
                'id' => $adminId,
                'name' => 'Admin',
                'password' => Hash::make('parol0909'),
                'username' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $edgarId = (string) Str::uuid();
        DB::table('users')->updateOrInsert(
            ['email' => 'edgar@test.com'],
            [
                'id' => $edgarId,
                'name' => 'Edgar',
                'password' => Hash::make('password'),
                'username' => 'edgar',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        //LISTINGS

        $sid1 = (string) Str::uuid();
        DB::table('listings')->insert([
            'listing_id' => $sid1,
            'name' => 'Mārketinga aģentūras mājaslapas izveide',
            'description' => 'Nepieciešams radošs tīkla izstrādātājs...',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => $adminId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid1,
            'budget' => 250.00,
            'deadline_days' => 10,
        ]);

        $sid2 = (string) Str::uuid();
        DB::table('listings')->insert([
            'listing_id' => $sid2,
            'name' => 'React Dashboard Template',
            'description' => 'Moderns un pielāgojams vadības paneļa veidnis...',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => $edgarId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid2,
            'budget' => 300.00,
            'deadline_days' => 20,
        ]);

        $sid3 = (string) Str::uuid();
        DB::table('listings')->insert([
            'listing_id' => $sid3,
            'name' => 'UX/UI Redesign for Fitness App',
            'description' => 'Looking for a UI designer to modernize a mobile fitness app interface.',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => $adminId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid3,
            'budget' => 300.00,
            'deadline_days' => 20,
        ]);

        $sid4 = (string) Str::uuid();
        DB::table('listings')->insert([
            'listing_id' => $sid4,
            'name' => 'mobile App',
            'description' => 'Looking for a developer.',
            'statuss' => 'aktīvs',
            'publication_date' => now(),
            'author_id' => $edgarId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('job')->insert([
            'listing_id' => $sid4,
            'budget' => 300.00,
            'deadline_days' => 20,
        ]);

        //CATEGORIES
        DB::table('categories')->insert([
            ['category_id' => (string) Str::uuid(), 'name' => 'Dizains', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => (string) Str::uuid(), 'name' => 'Izstrāde', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => (string) Str::uuid(), 'name' => 'Mārketings', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => (string) Str::uuid(), 'name' => 'Teksti', 'created_at' => now(), 'updated_at' => now()],
            ['category_id' => (string) Str::uuid(), 'name' => 'spēles', 'created_at' => now(), 'updated_at' => now()],
        ]);


        DB::table('listings')->where('listing_id', $sid1)->update([
            'statuss' => 'pabeigts',
            'updated_at' => now(),
        ]);

        $devCatId = DB::table('categories')->where('name', 'Izstrāde')->value('category_id');

        if ($devCatId) {
            DB::table('listing_category')->updateOrInsert(
                ['listing_id' => $sid1, 'category_id' => $devCatId],
                ['id' => (string) Str::uuid()]
            );
        }}
}

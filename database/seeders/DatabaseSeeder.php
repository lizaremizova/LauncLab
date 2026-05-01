<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = DB::table('users')->where('email', 'admin@test.com')->value('id') ?: (string) Str::uuid();
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@test.com'],
            [
                'id' => $adminId,
                'name' => 'Admin',
                'password' => Hash::make('parol0909'),
                'username' => 'admin',
                'description' => 'Job author (seed)',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $edgarId = DB::table('users')->where('email', 'edgar@test.com')->value('id') ?: (string) Str::uuid();
        DB::table('users')->updateOrInsert(
            ['email' => 'edgar@test.com'],
            [
                'id' => $edgarId,
                'name' => 'Edgar',
                'password' => Hash::make('password'),
                'username' => 'edgar',
                'description' => 'Applicant (seed)',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Categories (idempotent).
        $categoryNames = ['Dizains', 'Izstrade', 'Marketings', 'Teksti', 'Speles'];
        foreach ($categoryNames as $name) {
            $catId = DB::table('categories')->where('name', $name)->value('category_id') ?: (string) Str::uuid();
            DB::table('categories')->updateOrInsert(
                ['name' => $name],
                [
                    'category_id' => $catId,
                    'name' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $devCatId = DB::table('categories')->where('name', 'Izstrade')->value('category_id');
        $designCatId = DB::table('categories')->where('name', 'Dizains')->value('category_id');

        // Listing A: active, with attachment, and one pending application.
        $listingAId = DB::table('listings')
            ->where('user_id', $adminId)
            ->where('name', 'Landing page improvements')
            ->value('id') ?: (string) Str::uuid();
        $attachmentPathA = "listing-attachments/{$listingAId}/spec.txt";
        Storage::disk('local')->put($attachmentPathA, "Seed attachment for listing {$listingAId}\n");

        DB::table('listings')->updateOrInsert(
            ['id' => $listingAId],
            [
                'name' => 'Landing page improvements',
                'description' => 'Implement UI polish and responsive fixes. Attachment contains acceptance criteria.',
                'type' => 'job',
                'statuss' => 'aktīvs',
                'publication_date' => now(),
                'budget' => 250.00,
                'deadline_days' => 10,
                'user_id' => $adminId,
                'attachment_path' => $attachmentPathA,
                'attachment_name' => 'spec.txt',
                'attachment_mime' => 'text/plain',
                'attachment_size' => Storage::disk('local')->size($attachmentPathA),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        if ($devCatId) {
            DB::table('listing_category')->updateOrInsert(
                ['listing_id' => $listingAId, 'category_id' => $devCatId],
                ['id' => (string) Str::uuid()]
            );
        }

        $appPendingId = DB::table('applications')
            ->where('listing_id', $listingAId)
            ->where('user_id', $edgarId)
            ->value('id') ?: (string) Str::uuid();
        DB::table('applications')->updateOrInsert(
            ['id' => $appPendingId],
            [
                'listing_id' => $listingAId,
                'user_id' => $edgarId,
                'status' => 'gaida apstiprinājumu',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Listing B: approved application + uploaded result (if migration applied).
        $listingBId = DB::table('listings')
            ->where('user_id', $adminId)
            ->where('name', 'Logo vector cleanup')
            ->value('id') ?: (string) Str::uuid();
        $attachmentPathB = "listing-attachments/{$listingBId}/brief.txt";
        Storage::disk('local')->put($attachmentPathB, "Seed brief for listing {$listingBId}\n");

        DB::table('listings')->updateOrInsert(
            ['id' => $listingBId],
            [
                'name' => 'Logo vector cleanup',
                'description' => 'Clean up the logo vectors and export SVG + PNG.',
                'type' => 'job',
                'statuss' => 'procesa',
                'publication_date' => now(),
                'budget' => 120.00,
                'deadline_days' => 3,
                'user_id' => $adminId,
                'attachment_path' => $attachmentPathB,
                'attachment_name' => 'brief.txt',
                'attachment_mime' => 'text/plain',
                'attachment_size' => Storage::disk('local')->size($attachmentPathB),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        if ($designCatId) {
            DB::table('listing_category')->updateOrInsert(
                ['listing_id' => $listingBId, 'category_id' => $designCatId],
                ['id' => (string) Str::uuid()]
            );
        }

        $appApprovedId = DB::table('applications')
            ->where('listing_id', $listingBId)
            ->where('user_id', $edgarId)
            ->value('id') ?: (string) Str::uuid();
        $appApprovedRow = [
            'listing_id' => $listingBId,
            'user_id' => $edgarId,
            'status' => 'apstiprināts',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        if (Schema::hasColumn('applications', 'result_path')) {
            $resultPath = "application-results/{$appApprovedId}/result.txt";
            Storage::disk('local')->put($resultPath, "Seed result for application {$appApprovedId}\n");

            $appApprovedRow = array_merge($appApprovedRow, [
                'result_path' => $resultPath,
                'result_name' => 'result.txt',
                'result_mime' => 'text/plain',
                'result_size' => Storage::disk('local')->size($resultPath),
                'result_uploaded_at' => now(),
            ]);

            // Since result exists, mark listing completed for realistic testing.
            DB::table('listings')->where('id', $listingBId)->update([
                'statuss' => 'pabeigts',
                'updated_at' => now(),
            ]);
        }

        DB::table('applications')->updateOrInsert(
            ['id' => $appApprovedId],
            $appApprovedRow
        );

        // Listing C: edgar posts an active job so admin feed is never empty.
        $listingCId = DB::table('listings')
            ->where('user_id', $edgarId)
            ->where('name', 'React dashboard template')
            ->value('id') ?: (string) Str::uuid();

        DB::table('listings')->updateOrInsert(
            ['id' => $listingCId],
            [
                'name' => 'React dashboard template',
                'description' => 'Build a clean dashboard layout and hook up API data.',
                'type' => 'job',
                'statuss' => 'aktīvs',
                'publication_date' => now(),
                'budget' => 180.00,
                'deadline_days' => 7,
                'user_id' => $edgarId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        if ($devCatId) {
            DB::table('listing_category')->updateOrInsert(
                ['listing_id' => $listingCId, 'category_id' => $devCatId],
                ['id' => (string) Str::uuid()]
            );
        }
    }
}

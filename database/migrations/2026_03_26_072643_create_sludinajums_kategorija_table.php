<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sludinajums_kategorija', function (Blueprint $table) {
            $table->id();


            $table->foreignId('sludinajumaID')
                ->constrained('sludinajums', 'sludinajumaID')
                ->onDelete('cascade');


            $table->foreignId('kategorijaID')
                ->constrained('kategorija', 'kategorijasID')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sludinajums_kategorija');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('darbs', function (Blueprint $table) {
            $table->unsignedBigInteger('sludinajumaID')->primary();
            $table->decimal('budzets', 10, 2);
            $table->integer('termina_dienas');
            $table->foreign('sludinajumaID')->references('sludinajumaID')->on('sludinajums')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('darbs');
    }
};

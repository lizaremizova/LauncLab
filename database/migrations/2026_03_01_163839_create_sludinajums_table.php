<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sludinajums', function (Blueprint $table) {
            $table->id('sludinajumaID');
            $table->string('nosaukums', 100);
            $table->text('apraksts');
            $table->string('statuss', 20)->default('aktīvs');
            $table->date('publDatums');
            $table->unsignedBigInteger('autoraID');
            $table->unsignedBigInteger('kategorijasID');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sludinajums');
    }
};

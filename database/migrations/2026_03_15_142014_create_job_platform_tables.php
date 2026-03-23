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
        // 1. Categories Table (Design, IT, etc.)
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });

        // 2. Pivot table for User Interests (Tags)
        Schema::create('category_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
        });

        // 3. Add necessary columns to existing Users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_url')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_onboarded')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_platform_tables');
    }
};

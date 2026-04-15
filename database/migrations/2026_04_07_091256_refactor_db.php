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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('avatar_url')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('listings', function (Blueprint $table) {
            $table->uuid('listing_id')->primary();
            $table->string('name', 100);
            $table->text('description');
            $table->string('statuss', 20)->default('aktīvs');
            $table->date('publication_date');
            $table->foreignUuid('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('job', function (Blueprint $table) {
            $table->uuid('listing_id')->primary();
            $table->decimal('budget', 10, 2);
            $table->integer('deadline_days');
            $table->foreign('listing_id')->references('listing_id')->on('listings')->onDelete('cascade');
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('category_id')->primary();
            $table->string('name', 20);
            $table->timestamps();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuidMorphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('listing_category', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('(UUID())'));

            $table->foreignUuid('listing_id')
                ->constrained('listings', 'listing_id')
                ->onDelete('cascade');

            $table->foreignUuid('category_id')
                ->constrained('categories', 'category_id')
                ->onDelete('cascade');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('listing_id')
                ->constrained('listings', 'listing_id')
                ->onDelete('cascade');

            $table->foreignUuid('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->string('status')->default('gaida apstiprinājumu');
            $table->timestamps();
        });

    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

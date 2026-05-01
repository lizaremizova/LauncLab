<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'listing_id',
        'user_id',
        'status',
        'result_path',
        'result_name',
        'result_mime',
        'result_size',
        'result_uploaded_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function listing(): BelongsTo
    {
        // ('TargetModel', 'ForeignKey_In_This_Table', 'OwnerKey_In_Listings_Table')
        return $this->belongsTo(\App\Models\Listing::class, 'listing_id', 'id');
    }
}

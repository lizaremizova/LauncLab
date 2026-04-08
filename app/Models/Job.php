<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $table = 'job';
    protected $primaryKey = 'listing_id';
    public $timestamps = false;

    protected $fillable = [
        'listing_id',
        'budget',
        'deadline_days',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id', 'listing_id');
    }

}

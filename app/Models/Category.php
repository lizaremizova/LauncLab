<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'category_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function listings()
    {
        return $this->belongsToMany(
            Listing::class,
            'listing_category',
            'category_id',
            'listing_id'
        );
    }
}

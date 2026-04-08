<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $table = 'listings';
    protected $primaryKey = 'listing_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'statuss',
        'publication_date',
        'author_id',
    ];

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'listing_category',
            'listing_id',
            'category_id'
        );
    }

    public function job()
    {
        return $this->hasOne(Job::class, 'listing_id', 'listing_id');
    }

}

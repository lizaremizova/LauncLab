<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasUuids;

    protected $table = 'listings';
    protected $primaryKey = 'listing_id';
    public $incrementing = false;
    protected $keyType = 'string';
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

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Category extends Model
{
    use HasUuids;

    protected $table = 'categories';
    protected $primaryKey = 'category_id';
    public $incrementing = false;
    protected $keyType = 'string';
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

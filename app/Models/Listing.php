<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasUuids;

    protected $table = 'listings';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'type',
        'statuss',
        'publication_date',
        'user_id',
        'budget',
        'deadline_days',
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

    public function author()
    {
        // Backwards-compatible alias. Prefer `user()` going forward.
        return $this->user();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

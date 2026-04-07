<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'kategorija';
    protected $primaryKey = 'kategorijaID';
    public $timestamps = false;

    protected $fillable = [
        'nosaukums',
    ];

    public function listings()
    {
        return $this->belongsToMany(
            Listing::class,
            'sludinajums_kategorija',
            'kategorijaID',
            'sludinajumaID'
        );
    }
}

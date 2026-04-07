<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    protected $table = 'sludinajums';
    protected $primaryKey = 'sludinajumaID';
    public $timestamps = false;

    protected $fillable = [
        'nosaukums',
        'apraksts',
        'statuss',
        'publDatums',
        'autoraID',
    ];

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'sludinajums_kategorija',
            'sludinajumaID',
            'kategorijaID'
        );
    }

    public function job()
    {
        return $this->hasOne(Job::class, 'sludinajumaID', 'sludinajumaID');
    }
}

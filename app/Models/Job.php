<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $table = 'darbs';
    protected $primaryKey = 'sludinajumaID';
    public $timestamps = false;

    protected $fillable = [
        'sludinajumaID',
        'budzets',
        'termina_dienas',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'sludinajumaID', 'sludinajumaID');
    }

}

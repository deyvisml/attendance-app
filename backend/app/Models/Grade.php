<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $table = 'grades';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'name',
        'section_id'
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}

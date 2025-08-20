<?php

namespace App\Models;

use App\Http\Resources\GradeResource;
use Illuminate\Database\Eloquent\Model;

class UserGrade extends Model
{
    protected $table = 'user_grade';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'year',
        'user_id',
        'grade_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); 
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class, 'grade_id');
    }
}

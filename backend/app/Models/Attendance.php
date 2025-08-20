<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'datetime',
        'attendance_list_id',
        'user_grade_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'datetime'   => 'datetime', // tu campo personalizado
    ];

    public function user_grade()
    {
        return $this->belongsTo(UserGrade::class);
    }
}

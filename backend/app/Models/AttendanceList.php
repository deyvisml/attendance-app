<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceList extends Model
{
    protected $table = 'attendance_lists';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'name'
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function user_grades()
    {
        return $this->hasManyThrough(
            UserGrade::class,
            Attendance::class,
            'attendance_list_id',
            'id',
            'id',
            'user_grade_id'
        );
    }
}

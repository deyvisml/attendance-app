<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'dni',
        'name',
        'father_last_name',
        'mother_last_name',
        'state_id'
    ];
}

<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AttendanceListController;
use App\Http\Controllers\UserGradeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('attendance-lists', AttendanceListController::class);

Route::apiResource('attendances', AttendanceController::class);

Route::post('/student', [UserGradeController::class, 'createUserThenAssignGrade']);

Route::get('/attendance-lists/{attendance_list_id}/registered-students', [AttendanceListController::class, 'getRegisteredStudents']);

Route::get('/attendance-lists/{attendance_list_id}/export', [AttendanceListController::class, 'exportRegisteredStudents']);

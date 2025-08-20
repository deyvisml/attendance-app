<?php

namespace App\Http\Controllers;

use App\Http\Resources\GradeResource;
use App\Models\Attendance;
use App\Models\UserGrade;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation_rules = [
            'attendance_list_id' => 'required|integer|exists:attendance_lists,id',
            'user_grade_id'      => 'required|integer|exists:user_grade,id',
        ];

        $data = [
            'attendance_list_id' => $request->input('attendance_list_id'),
            'user_grade_id'      => $request->input('code'),
            'datetime'           => Carbon::now(),
        ];

        $validation = Validator::make($data, $validation_rules);

        if ($validation->fails()) {
            $response = [
                'status' => false,
                'message' => 'Error de validación.',
                'error' => [
                    'type' => 'validation-error',
                    'data' => $validation->errors(),
                ],
            ];
            return response()->json($response, 422);
        }

        // Buscar si ya existe el registro
        $attendance = Attendance::where('attendance_list_id', $data['attendance_list_id'])
                                ->where('user_grade_id', $data['user_grade_id'])
                                ->first();

        if ($attendance) {
            $response = [
                'status' => false,
                'message' => "El registro ya existe para este usuario en la lista de asistencia.",
                'error' => [
                    'type' => 'duplicate-error',
                    'data' => $attendance
                ],
            ];
            return response()->json($response, 409); // 409 Conflict
        }

        Attendance::create($data);

        $user_grade = UserGrade::find($data['user_grade_id']);

        $response = [
            'status' => true,
            'message' => "Registro creado exitosamente.",
            'data' => [
                'user' => $user_grade->user,
                'grade' => new GradeResource($user_grade->grade)
            ],
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }
}

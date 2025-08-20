<?php

namespace App\Http\Controllers;

use App\Exports\AttendancesExport;
use App\Http\Resources\AttendanceListResource;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\UserGradeResource;
use App\Models\AttendanceList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class AttendanceListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $RECORDS_PER_PAGE = 15; // Define how many records to show per page
        $attendanceLists = AttendanceList::orderBy('created_at', 'desc')
        ->simplePaginate($RECORDS_PER_PAGE);

        return AttendanceListResource::collection($attendanceLists);
    }

    public function getRegisteredStudents($attendance_list_id)
    {
        $validation_rules = [
            'attendance_list_id' => 'required|integer|exists:attendance_lists,id'
        ];

        $validation = Validator::make(['attendance_list_id' => $attendance_list_id], $validation_rules);

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

        $attendanceList = AttendanceList::find($attendance_list_id);

        $attendances = $attendanceList->attendances()->orderBy('datetime', 'desc')->get();

        $response = [
            'status' => true,
            'message' => "Lista de asistencia obtenida exitosamente.",
            'data' => AttendanceResource::collection($attendances),
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation_rules = [
            'name' => 'required|string',
        ];

        $validation = Validator::make($request->all(), $validation_rules);

        if ($validation->fails()) {
            $response = [
                'status' => false,
                'message' => 'Error de validación.',
                'error' => [
                    'type' => 'validation-error',
                    'data' => $validation->errors(),
                ],
            ];
            return response()->json($response);
        }

        $attendance_list = AttendanceList::create($request->all());

        $response = [
            'status' => true, 
            'message' => "Registro creado exitosamente.",
            'data' => [
                'attendance_list' => $attendance_list,
            ],
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceList $attendanceList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttendanceList $attendanceList)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceList $attendanceList)
    {
        //
    }

    public function exportRegisteredStudents($attendance_list_id)
    {
        $attendanceList = AttendanceList::findOrFail($attendance_list_id);

        $attendances = $attendanceList->attendances()->orderBy('datetime', 'desc')->get();

        $file_name = $attendanceList->name . '.xlsx';

        return Excel::download(new AttendancesExport($attendances), $file_name);
    }
}

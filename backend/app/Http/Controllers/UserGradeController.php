<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\User;
use App\Models\UserGrade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserGradeController extends Controller
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
        //
    }

    public function createUserThenAssignGrade(Request $request)
    {
        $validation_rules = [
            'dni' => 'required|string|unique:users,dni',
            'name' => 'required|string',
            'father_last_name' => 'required|string',
            'mother_last_name' => 'required|string',
            'grade_name' => 'required|string',
            'section_id' => 'required|exists:sections,id',
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
            return response()->json($response, 200);
        }

        // get grade_id
        $grade = Grade::where('name', $request->input('grade_name'))
            ->where('section_id', $request->input('section_id'))
            ->first();

        if (!$grade) {
            $response = [
                'status' => false,
                'message' => 'El grado no existe.',
                'error' => [
                    'type' => 'not-found',
                    'data' => ['grade' => 'El grado no existe.'],
                ],
            ];
            return response()->json($response, 404);
        }

        $user = User::create([
            'dni' => $request->input('dni'),
            'name' => $request->input('name'),
            'father_last_name' => $request->input('father_last_name'),
            'mother_last_name' => $request->input('mother_last_name'),
            'state_id' => 1,
        ]);

        $user_grade = UserGrade::create([
            'year' => date('Y'),
            'user_id' => $user->id,
            'grade_id' => $grade->id,
        ]);

        $response = [
            'status' => true,
            'message' => "Registro creado exitosamente.",
            'data' => $user_grade,
        ];

        return response()->json($response, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserGrade $userGrade)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserGrade $userGrade)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserGrade $userGrade)
    {
        //
    }
}

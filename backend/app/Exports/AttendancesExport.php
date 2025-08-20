<?php

namespace App\Exports;

use App\Models\Attendance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendancesExport implements FromCollection, WithHeadings, WithStyles
{
    protected $attendances;

    public function __construct($attendances)
    {
        $this->attendances = $attendances;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->attendances->map(function ($attendance) {
            $user_grade = $attendance->user_grade;
            $user = $user_grade->user;
            $grade = $user_grade->grade;
            return [
                'Estudiante' => $user->name . " " . $user->father_last_name . " " . $user->mother_last_name ?? 'N/A',
                'Grado' => $grade->name ?? 'N/A',
                'Sección' => $grade->section->name ?? 'N/A',
                'Hora' => $attendance->datetime ? $attendance->datetime->format('H:i') : 'N/A',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Estudiante',
            'Grado',
            'Sección',
            'Hora',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Fila 1 (cabeceras) en negrita
            1 => ['font' => ['bold' => true]],
        ];
    }
}

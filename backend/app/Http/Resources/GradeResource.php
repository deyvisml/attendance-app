<?php

namespace App\Http\Resources;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $section = Section::find($this->section_id);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'section' => $section,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

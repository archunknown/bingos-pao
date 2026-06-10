<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSorteoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'               => ['required', 'string', 'max:200'],
            'tipo'                 => ['required', Rule::in(['sorteo', 'pozito', 'especial', 'aniversario'])],
            'fecha_sorteo'         => ['required', 'date'],
            'precio_participacion' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'descripcion'          => ['nullable', 'string', 'max:5000'],
        ];
    }
}

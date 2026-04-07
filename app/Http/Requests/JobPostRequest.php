<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'nosaukums' => ['required', 'string', 'max:255'],
            'apraksts' => ['required', 'string'],
            'budzets' => ['required', 'numeric'],
            'termina_dienas' => ['required', 'integer'],
            'kategorijas' => ['required', 'array', 'min:1'],
            'kategorijas.*' => ['integer'],
        ];
    }
}

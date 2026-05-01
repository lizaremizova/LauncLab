<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:60'],
            'description' => ['sometimes', 'required', 'string', 'max:400'],
            'statuss' => ['sometimes', 'required', 'string', 'max:20'],
            'type' => ['sometimes', 'required', 'in:job,project'],
            'budget' => ['sometimes', 'nullable', 'numeric'],
            'deadline_days' => ['sometimes', 'nullable', 'integer'],
        ];
    }
}

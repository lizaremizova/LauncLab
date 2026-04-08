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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'budget' => ['required', 'numeric'],
            'deadline_days' => ['required', 'integer'],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*' => ['integer'],
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUniteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nom'        => 'required',
            'conversion' => 'required|numeric'
        ];
    }

    public function messages()
    {
        return [
            'nom.required'        => 'Le nom est manquant',
            'conversion.required' => 'La valeur de conversion est requise',
            'conversion.numeric'  => 'La valeur de conversion est invalide'
        ];
    }
}
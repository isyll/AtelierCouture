<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCategoryConfectionRequest extends FormRequest
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
            'libelle'  => [
                'required', Rule::unique('categories', 'libelle')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'unite'    => 'required|exists:unites,id',
            'unites'   => 'sometimes|nullable|array|min:1',
            'unites.*' => 'sometimes|distinct|exists:unites,id',
            'type'     => 'required',
        ];
    }

    public function messages()
    {
        return [
            'libelle.required'  => 'Le libellé est manquant',
            'libelle.unique'    => 'Le libellé existe déjà',
            'unite.required'    => "L'unité est manquante",
            'unite.exists'      => "L'unité n'existe pas",
            'unites.array'      => 'Les unités sont invalides',
            'unites.min'        => 'Les unités sont invalides',
            'unites.*.distinct' => 'Les unités sont invalides',
            'unites.*.exists'   => "Les unités n'existent pas"
        ];
    }

    public function prepareForValidation()
    {
        return $this->merge(['type' => 'confection']);
    }
}
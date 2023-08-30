<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryConfectionRequest extends FormRequest
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
                'sometimes', Rule::unique('categories', 'libelle')->ignore($this->category, 'id')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'unite'    => 'sometimes|exists:unites,id',
            'unites'   => 'sometimes|nullable|array|min:1',
            'unites.*' => 'sometimes|distinct|exists:unites,id',
        ];
    }

    public function messages()
    {
        return [
            'libelle.unique'    => 'Le libellé existe déjà',
            'unite.exists'      => "L'unité n'existe pas",
            'unites.array'      => 'Les unités sont invalides',
            'unites.min'        => 'Les unités sont invalides',
            'unites.*.distinct' => 'Les unités sont invalides',
            'unites.*.exists'   => "Les unités n'existent pas"
        ];
    }
}
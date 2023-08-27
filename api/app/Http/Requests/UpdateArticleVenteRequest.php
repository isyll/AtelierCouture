<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleVenteRequest extends FormRequest
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
            'confection'       => 'sometimes|confection_validation',
            'libelle'          => [
                'sometimes', Rule::unique('articles', 'libelle')->ignore($this->article, 'id')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'ref'              => [
                'sometimes', Rule::unique('articles', 'ref')->ignore($this->article, 'id')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'stock'            => 'sometimes|numeric',
            'category'         => 'sometimes|numeric|exists:categories,id|category_validation:vente',
            'photo'            => 'sometimes|max:65535',
            'type'             => 'sometimes',
            'cout_fabrication' => 'sometimes|numeric',
            'marge'            => 'sometimes|numeric',
            'promo'            => 'sometimes|numeric'
        ];
    }

    public function messages(): array
    {
        return [
            'confection.confection_validation' => 'Les données de confection sont invalides',
            'category.category_validation'     => "La catégorie n'est pas une catégorie de vente",
            'libelle.unique'                   => 'Le libellé existe déjà',
            'ref.unique'                       => 'La référence existe déjà',
            'stock.numeric'                    => 'Le stock est invalide',
            'category.exists'                  => "La catégorie n'existe pas",
            'photo.max'                        => 'La photo est trop grande',

        ];
    }

    public function prepareForValidation()
    {
        return $this->merge(['type' => 'vente']);
    }
}
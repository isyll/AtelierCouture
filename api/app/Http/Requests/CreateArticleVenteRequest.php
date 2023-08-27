<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class CreateArticleVenteRequest extends FormRequest
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
            'confection'       => 'required|confection_validation',
            'libelle'          => [
                'required', Rule::unique('articles', 'libelle')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'ref'              => 'required|unique:articles,ref',
            'stock'            => 'required|numeric',
            'category'         => 'required|numeric|exists:categories,id|category_validation:vente',
            'photo'            => 'sometimes|max:65535',
            'type'             => 'required',
            'cout_fabrication' => 'required|numeric',
            'marge'            => 'required|numeric',
            'promo'            => 'sometimes|numeric'
        ];
    }

    public function messages(): array
    {
        return [
            'confection.confection_validation' => 'Les données de confection sont invalides',
            'confection.required'              => 'Le champs confection est requis',
            'category.category_validation'     => "La catégorie n'est pas une catégorie de vente",
            'libelle.required'                 => 'Le libellé est manquant',
            'libelle.unique'                   => 'Le libellé existe déjà',
            'ref.required'                     => 'La référence est manquante',
            'ref.unique'                       => 'La référence existe déjà',
            'stock.required'                   => 'Le stock est manquant',
            'stock.numeric'                    => 'Le stock est invalide',
            'category.required'                => 'La catégorie est manquante',
            'category.exists'                  => "La catégorie n'existe pas",
            'photo.max'                        => 'La photo est trop grande',
            'cout_fabrication.required'        => 'Le coût de fabrication est manquant',
            'marge.required'                   => 'La marge est manquante',

        ];
    }

    public function prepareForValidation()
    {
        return $this->merge(['type' => 'vente']);
    }
}
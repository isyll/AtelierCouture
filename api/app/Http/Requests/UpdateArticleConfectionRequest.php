<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleConfectionRequest extends FormRequest
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
            'libelle'        => [
                'sometimes', Rule::unique('articles', 'libelle')->ignore($this->article, 'id')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'ref'            => [
                'sometimes', Rule::unique('articles', 'ref')->ignore($this->article, 'id')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'prix'           => 'sometimes|numeric',
            'stock'          => 'sometimes|numeric',
            'fournisseurs'   => 'sometimes',
            'fournisseurs.*' => 'sometimes|distinct|numeric|exists:fournisseurs,id',
            'category'       => 'required|distinct|numeric|exists:categories,id',
            'photo'          => 'sometimes|max:65535',
        ];
    }

    public function messages()
    {
        return [
            'libelle.required'        => 'Le libellé est manquant',
            'libelle.unique'          => 'Le libellé existe déjà',
            'prix.numeric'            => 'Le prix est invalide',
            'stock.numeric'           => 'Le stock est invalide',
            'category.exists'         => "La catégorie n'existe pas",
            'category.required'       => "La catégorie est manquante",
            'ref.unique'              => 'La référence appartient à un autre article',
            'fournisseurs.required'   => 'Les fournisseurs sont manquants',
            'fournisseurs.array'      => 'Les fournisseurs sont invalides',
            'fournisseurs.min'        => 'Les fournisseurs sont invalides',
            'fournisseurs.*.distinct' => 'Les fournisseurs sont invalides',
            'fournisseurs.*.exists'   => 'Des fournisseurs sont inexistants',
            'photo.max'               => 'La photo est trop grande'
        ];
    }

    public function prepareForValidation()
    {
        return $this->merge(['type' => 'confection']);
    }
}
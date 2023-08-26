<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateArticleRequest extends FormRequest
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
                'required', Rule::unique('articles', 'libelle')->where(function ($query) {
                    return $query->whereNull('deleted_at')
                        ->orWhereNotNull('deleted_at');
                })
            ],
            'ref'            => 'required|unique:articles,ref',
            'prix'           => 'required|numeric',
            'stock'          => 'required|numeric',
            'fournisseurs'   => 'required|array|min:1',
            'fournisseurs.*' => 'required|distinct|numeric|exists:fournisseurs,id',
            'category'       => 'required|numeric|exists:categories,id',
            'photo'          => 'sometimes|max:65535',
        ];
    }

    public function messages()
    {
        return [
            'libelle.required'        => 'Le libellé est manquant',
            'libelle.unique'          => 'Le libellé existe déjà',
            'ref.required'            => 'La référence est manquante',
            'prix.required'           => 'Le prix est manquant',
            'stock.required'          => 'Le stock est manquant',
            'category.required'       => 'La catégorie est manquante',
            'category.exists'         => "La catégorie n'existe pas",
            'fournisseurs.required'   => 'Les fournisseurs sont manquants',
            'fournisseurs.array'      => 'Les fournisseurs sont invalides',
            'fournisseurs.min'        => 'Les fournisseurs sont invalides',
            'fournisseurs.*.distinct' => 'Les fournisseurs sont invalides',
            'fournisseurs.*.exists'   => 'Des fournisseurs sont inexistants',
            'photo.max'               => 'La photo est trop grande'
        ];
    }
}
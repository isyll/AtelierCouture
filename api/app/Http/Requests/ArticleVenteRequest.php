<?php

namespace App\Http\Requests;

use App\Models\Article;
use Illuminate\Foundation\Http\FormRequest;

class ArticleVenteRequest extends FormRequest
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
            'id'           => 'required|exists:articles,id,type,vente',
            'confection'   => 'required|array|distinct|min:1',
            'confection.*' => 'required|exists:articles,id,type,confection'
        ];
    }

    public function messages(): array
    {
        return [
            'id.required'           => "L'id est manquant",
            'id.exists'             => "L'id est invalide",
            'confection'            => 'Les données sont invalides',
            'confection.*.required' => 'Les données sont invalides',
            'confection.*.exists'   => 'Les données sont invalides',
        ];
    }
}
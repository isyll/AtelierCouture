<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $size       = $request->get('size', 2);
        $categories = new CategoryCollection(Category::paginate($size));
        return $categories;
    }

    public function create(CategoryRequest $request)
    {
        $validated = $request->validated();

        if (Category::where('libelle', $validated['libelle'])->first()) {
            return [
                'errors'  => ['libelle' => ['Cette catégorie existe déjà']],
                'message' => 'Cette catégorie existe déjà',
                'success' => true
            ];
        }

        $category          = new Category;
        $category->libelle = $validated['libelle'];
        $category->save();

        return [
            'message' => 'Catégorie créée avec succès',
            'data'    => $category,
            'success' => true
        ];
    }

    public function update(UpdateCategoryRequest $request, int $category)
    {
        $category  = Category::findOrFail($category);
        $validated = $request->validated();

        $category->libelle = $validated['libelle'];
        $saved             = $category->save();

        return [
            'message' => $saved ? 'Mise à jour effectuée avec succès' : 'Une erreur est survenue',
            'data'    => CategoryResource::make($category),
            'success' => $saved
        ];
    }

    public function delete(Category $category)
    {
        $deleted = $category->delete();

        return [
            'message' => $deleted ? 'Élément supprimé avec succès' : 'Une erreur esst survenue',
            'success' => $deleted === null ? true : false,
            'data'    => null
        ];
    }

    public function search(Request $request)
    {
        $value = $request->input('value');

        if ($value) {
            $data = Category::where('libelle', $value)->first();
            if ($data) return new CategoryResource($data);
        }

        return ['data' => null, 'success' => true];
    }
}

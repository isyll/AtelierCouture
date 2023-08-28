<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateArticleVenteRequest;
use App\Http\Requests\UpdateArticleVenteRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleVenteCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class ArticleVenteController extends Controller
{
    public function create(CreateArticleVenteRequest $request)
    {
        $validated = $request->validated();
        $article   = Article::create($validated);
        $article->confection;
        return [
            'message' => 'Création réussie',
            'data'    => ArticleResource::make($article)
        ];
    }

    public function index(Request $request)
    {
        return [
            'categories_vente'    => CategoryResource::collection(Category::where('type', 'vente')->get()),
            'articles_confection' => ArticleResource::collection(Article::where('type', 'confection')->get()),
            'articles_vente'      => new ArticleVenteCollection(Article::with('confection')->where('type', 'vente')->paginate($request->input('size', 2))),
        ];
    }

    public function paginate(Request $request)
    {
        $size = $request->input('size', 2);
        return new ArticleVenteCollection(Article::with('confection')->where('type', 'vente')->paginate($size));
    }

    public function delete(int $article)
    {
        $article = Article::find($article);
        if ($article) {
            if ($article->type === 'vente') {
                $article->confection;
                $data = $article;
                $article->delete();

                return [
                    'message' => 'Suppression effectuée avec succès',
                    'data'    => ArticleResource::make($data)
                ];
            } else return response()->json([
                    'message' => "L'article n'est pas de type vente",
                ], 422);
        }

        return response()->json([
            'message' => "L'article n'existe pas",
        ], 422);
    }

    public function update(int $article, UpdateArticleVenteRequest $request)
    {
        $article = Article::find($article);

        if ($article) {
            if ($article->type === 'vente') {
                $validated = $request->validated();

                $article->fill($validated);
                $article->save();
                $article->confection()->sync($request->confection);

                return [
                    'message' => 'Mise à jour effectuée avec succès',
                    'data'    => ArticleResource::make($article)
                ];
            } else return response()->json([
                    'message' => "L'article n'est pas de type vente",
                ], 422);
        }

        return response()->json([
            'message' => "L'article n'existe pas",
        ], 422);
    }
}
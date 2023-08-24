<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleCollection;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Traits\PhotoHandler;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    use PhotoHandler;

    public function index(Request $request)
    {
        $size = $request->input('size', 2);
        return new ArticleCollection(Article::paginate($size));
    }

    public function paginate(Request $request)
    {
        $size = $request->input('size', 2);
        return new ArticleCollection(Article::paginate($size), false);
    }

    public function show(Article $article)
    {
        return ArticleResource::make($article);
    }

    public function create(CreateArticleRequest $request)
    {
        $validated = $request->validated();

        $article              = new Article;
        $article->libelle     = $validated['libelle'];
        $article->ref         = $validated['ref'];
        $article->prix        = $validated['prix'];
        $article->stock       = $validated['stock'];
        $article->category_id = $validated['category'];

        if (isset($validated['photo']))
            $article->photo = $this->handleImage($validated['photo']);

        $article->save();
        $article->fournisseurs()->attach($validated['fournisseurs']);

        return ArticleResource::make($article);
    }

    public function delete(Request $request)
    {
        $data = $request->input('data');
        return ['data' => Article::whereIn('id', $data)->delete()];
    }

    public function update(UpdateArticleRequest $request, int $article)
    {
        $article   = Article::findOrFail($article);
        $validated = $request->validated();

        $article->fill($validated);
        $article->save();

        if (isset($validated['fournisseurs']))
            $article->fournisseurs()->sync($validated['fournisseurs']);

        return response()->json(['message' => 'Mise à jour réussie', 'data' => ArticleResource::make($article)]);
    }
}
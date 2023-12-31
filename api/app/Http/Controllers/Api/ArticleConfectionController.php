<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateArticleConfectionRequest;
use App\Http\Requests\UpdateArticleConfectionRequest;
use App\Http\Resources\ArticleCollection;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Traits\PhotoHandler;
use Illuminate\Http\Request;

class ArticleConfectionController extends Controller
{
    use PhotoHandler;

    public function index(Request $request)
    {
        $size = $request->input('size', 2);
        return new ArticleCollection(Article::where('type', 'confection')->paginate($size));
    }

    public function paginate(Request $request)
    {
        $size = $request->input('size', 2);
        return new ArticleCollection(Article::where('type', 'confection')->paginate($size), false);
    }

    public function show(Article $article)
    {
        return ArticleResource::make($article);
    }

    public function create(CreateArticleConfectionRequest $request)
    {
        $validated = $request->validated();
        $article   = Article::create($validated);

        if (isset($validated['photo']))
            $article->photo = $this->handleImage($validated['photo']);

        $article->save();

        return ArticleResource::make($article);
    }

    public function delete(Request $request)
    {
        $data = $request->input('data');
        return ['data' => Article::whereIn('id', $data)->delete()];
    }

    public function update(UpdateArticleConfectionRequest $request, int $article)
    {
        $article   = Article::findOrFail($article);
        $validated = $request->validated();

        $article->fill($validated);
        $article->save();
        $article->fournisseurs()->sync($request->fournisseurs);

        return response()->json(['message' => 'Mise à jour réussie', 'data' => ArticleResource::make($article)]);
    }

    public function filter(Request $request)
    {
        if (in_array($type = $request->input('type'), ['vente', 'confection'])) {
            $articles = Article::where('type', $type)->get();
            return ArticleResource::collection($articles);
        }

        return ['data' => null];
    }
}
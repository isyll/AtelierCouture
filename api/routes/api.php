<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ArticleVenteController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FournisseurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('/categories')
    ->controller(CategoryController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'create');
        Route::put('/{category}', 'update');
        Route::delete('/{category}', 'delete');
        Route::get('/search', 'search');
        Route::get('/filter', 'filter');
        Route::get('/{category}', 'show')->whereNumber('category');
    });

Route::prefix('/fournisseurs')
    ->controller(FournisseurController::class)
    ->group(function () {
        Route::get('/', 'index');
        Route::get('/all', 'all');
        Route::get('/suggest/{str}', 'suggest');
        Route::get('/{fournisseur}', 'show');
    });

Route::prefix('/articles')
    ->controller(ArticleController::class)
    ->group(function () {
        Route::get('/', 'paginate');
        Route::get('/all', 'index');
        Route::get('/filter', 'filter');
        Route::get('/{article}', 'show');
        Route::post('/', 'create');
        Route::delete('/{article}', 'delete');
        Route::put('/{article}', 'update');

        Route::prefix('vente')
            ->controller(ArticleVenteController::class)
            ->group(function () {
                Route::post('/', 'create');
            });
    });
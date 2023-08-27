<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('confection_validation', function ($attribute, $value, $parameters, $validator) {
            foreach ($value as $id => $data) {
                if ($article = Article::find($id)) {
                    if ($article->type != 'confection') return false;
                } else return false;

                if (
                    !array_key_exists('quantite', $data)
                    || !is_numeric($data['quantite'])
                )
                    return false;
            }

            return true;
        });

        Validator::extend('category_validation', function ($attribute, $value, $parameters, $validator) {
            foreach ($parameters as $type) {
                if (Category::find($value)->type != $type)
                    return false;
            }

            return true;
        });
    }
}

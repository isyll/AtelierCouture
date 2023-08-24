<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Fournisseur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types        = [
            'confection' => ['tissu', 'bouton', 'fil', 'fermeture'],
            'vente'      => ['costume', 'robe', 'costume africain', 'chaussure', 'veste']
        ];
        $fournisseurs = Fournisseur::all('id');

        foreach ($types as $type => $value) {
            foreach ($value as $v) {
                $category          = new Category;
                $category->libelle = $v;
                $category->save();

                for ($i = 0; $i < 5; $i++) {
                    $article              = new Article;
                    $article->libelle     = fake()->word() . fake()->word();
                    $article->type        = $type;
                    $article->prix        = fake()->randomFloat(2, max: 100_000);
                    $article->category_id = $category->id;
                    $article->stock       = fake()->randomFloat(1, max: 100);
                    $article->ref         = $article->ref();
                    $article->save();

                    $article->fournisseurs()->save(fake()->randomElement($fournisseurs));
                }
            }
        }
    }
}
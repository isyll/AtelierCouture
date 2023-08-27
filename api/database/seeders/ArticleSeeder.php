<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\Fournisseur;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fournisseurs = Fournisseur::all();

        $articles = [
            'vente'      => ['kaftan', 'pagne', 'grand boubou', 'costume', 'pantalon'],
            'confection' => ['doublure', 'ruban', 'dentelles', 'fil', 'bouton', 'tissu']
        ];

        foreach ($articles as $key => $value) {
            foreach ($value as $art) {
                $data = [
                    'type'    => $key,
                    'libelle' => $art,
                    'stock'   => fake()->randomFloat(
                        1,
                        max: 100
                    ),
                ];

                if ($key === 'confection')
                    $data['prix'] = fake()->randomFloat(
                        1,
                        max: 10_000
                    );

                $categories = Category::where('type', $key)->get();

                $data['category_id'] = ($categorie = fake()->randomElement($categories))['id'];

                $ref         = strtoupper("REF-" . substr($art, 0, 3) .
                    '-' . substr('', 0, 3) . substr($categorie->libelle, 0, 3) . '-' . count($categorie->articles) + 1);
                $data['ref'] = $ref;

                $article = Article::create($data);

                if ($key === 'confection')
                    $article->fournisseurs()->save(fake()->randomElement($fournisseurs));
            }
        }
    }
}
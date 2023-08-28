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
        $fournisseurs          = Fournisseur::all();
        $categories_vente      = Category::where('type', 'vente')->get();
        $categories_confection = Category::where('type', 'confection')->get();

        $articles = [
            'confection' => [
                'fil'    => ['fil coton', 'fil soie', 'fil polyester'],
                'bouton' => ['bouton de manche', 'bouton en plastique', 'bouton en bois'],
                'tissu'  => ['wax', 'bazin', 'soie', 'voile']
            ],

            'vente'      => [
                'costume'          => ['costume classique', 'costume 3 pièces'],
                'robe'             => ['robe évasée'],
                'costume africain' => ['grand boubou', 'taille basse']
            ]
        ];

        foreach ($articles as $type => $values) {
            foreach ($values as $categorie => $articles_data) {
                foreach ($articles_data as $nom) {
                    $data = [
                        'type'    => $type,
                        'libelle' => $nom,
                        'stock'   => fake()->randomFloat(
                            1,
                            max: 100
                        ),
                    ];

                    if ($type === 'confection') {
                        $data['prix'] = fake()->randomFloat(
                            1,
                            max: 10_000
                        );
                    }

                    $cat                 = Category::where('libelle', $categorie)->first();
                    $data['category_id'] = $cat->id;
                    $data['ref']         = strtoupper("REF-" . substr($nom, 0, 3) .
                        '-' . substr($cat->libelle, 0, 3) . '-' . count($cat->articles) + 1);

                    $article = Article::create($data);

                    if ($type === 'confection')
                        $article->fournisseurs()->save(fake()->randomElement($fournisseurs));
                }
            }
        }
    }
}
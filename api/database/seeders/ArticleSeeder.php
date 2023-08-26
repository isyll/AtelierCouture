<?php

namespace Database\Seeders;

use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Fournisseur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fournisseurs = Fournisseur::all();

        for ($i = 0; $i < 15; $i++) {
            $data = [
                'libelle' => $libelle = fake()->word() . fake()->word(),
                'type'    => $type = ['confection', 'vente'][rand(0, 1)],
                'prix'    => fake()->randomFloat(
                    1,
                    max: 10_000
                ),
                'stock'   => fake()->randomFloat(
                    1,
                    max: 100
                ),
            ];

            $categories = Category::where('type', $type)->get();

            $data['category_id'] = ($categorie = fake()->randomElement($categories))['id'];
            $data['ref']         = strtoupper("REF-" . substr($libelle, 0, 3) .
                '-' . substr('', 0, 3) . substr($categorie->libelle, 0, 3) . '-' . count($categorie->articles) + 1);

            $article = Article::create($data);

            $article->fournisseurs()->save(fake()->randomElement($fournisseurs));
        }
    }
}

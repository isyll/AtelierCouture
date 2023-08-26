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
        $categories   = Category::all()->toArray();

        for ($i = 0; $i < 5; $i++) {
            $article = Article::create([
                'libelle'     => $libelle = fake()->word() . fake()->word(),
                'type'        => fake()->randomElement(['confection', 'vente']),
                'prix'        => fake()->randomFloat(
                    1,
                    max: 10_000
                ),
                'stock'       => fake()->randomFloat(
                    1,
                    max: 100
                ),
                'category_id' => ($categorie = fake()->randomElement($categories))['id'],
                'ref'         => "REF-" . substr($libelle, 0, 3) .
                '-' . substr('', 0, 3) .
                substr($categorie['libelle'], 0, 3)
            ]);

            // $article->fournisseurs()->save(fake()->randomElement($fournisseurs));
        }
    }
}
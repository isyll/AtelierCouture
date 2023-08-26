<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'confection' => ['tissu', 'bouton', 'fil', 'fermeture'],
            'vente'      => ['costume', 'robe', 'costume africain', 'chaussure', 'veste']
        ];

        foreach ($types as $c => $t) foreach ($t as $v) {
                $category          = new Category;
                $category->libelle = $v;
                $category->type    = $c;
                $category->save();
            }
    }
}
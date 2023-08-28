<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Unite;
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
            'vente'      => ['costume', 'robe', 'costume africain']
        ];

        $metre = Unite::where('nom', 'metre')->first();

        foreach ($types as $type => $values) {
            foreach ($values as $libelle) {
                $category          = new Category;
                $category->libelle = $libelle;
                $category->type    = $type;

                if ($type === 'confection')
                    $category->unite_id = $metre->id;

                $category->save();
            }
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\Unite;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UniteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $unites = [
            'metre'      => 1,
            'centimetre' => 0.01,
            'yard'       => 0.9144
        ];

        foreach ($unites as $nom => $conversion) {
            $unite             = new Unite;
            $unite->nom        = $nom;
            $unite->conversion = $conversion;
            $unite->save();
        }
    }
}
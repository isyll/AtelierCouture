<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FournisseurResource;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    public function index()
    {
        return FournisseurResource::collection(Fournisseur::paginate(2));
    }

    public function all()
    {
        return FournisseurResource::collection(Fournisseur::all());
    }

    public function show(int $fournisseur)
    {
        $fournisseur = Fournisseur::find($fournisseur);
        if ($fournisseur)
            return FournisseurResource::make($fournisseur);

        return response()->json([
            'message' => 'Fournisseur inexistant',
            'errors'  => ['fournisseur' => ['Fournisseur inexistant']]
        ]);
    }

    public function suggest(string $str)
    {
        return FournisseurResource::collection(Fournisseur::startsWith($str)->get());
    }
}
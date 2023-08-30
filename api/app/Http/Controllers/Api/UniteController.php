<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUniteRequest;
use App\Http\Resources\UniteResource;
use App\Models\Unite;

class UniteController extends Controller
{
    public function create(CreateUniteRequest $request)
    {
        $validated = $request->validated();

        $unite = Unite::create($validated);

        return [
            'message' => 'Création réussie',
            'data'    => UniteResource::make($unite)
        ];
    }
}
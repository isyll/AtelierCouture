<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }

    public function scopeStartsWith($query, $prefix)
    {
        return $query->where('nom', 'LIKE', $prefix . '%');
    }
}
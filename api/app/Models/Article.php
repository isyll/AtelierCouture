<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    public $guarded = ['id'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function fournisseurs()
    {
        return $this->belongsToMany(Fournisseur::class);
    }

    public function ref()
    {
        $lib   = substr($this->libelle, 0, 3);
        $cat   = substr($this->category->libelle, 0, 3);
        $count = count($this->category->articles) + 1;

        return strtoupper("REF-{$lib}-{$cat}-{$count}");
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    public $guarded = ['id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            if (request()->category)
                $item->category_id = request()->category;
        });

        static::created(function ($item) {
            if (request()->fournisseurs) {
                $item->fournisseurs()->attach(request()->fournisseurs);
            }
            if (request()->confection && $item->type === 'vente') {
                $item->confection()->attach(request()->confection);
            }
        });

        static::updated(function ($item) {
            if (request()->fournisseurs) {
                $item->fournisseurs()->sync(request()->fournisseurs);
            }
            if (request()->confection && $item->type === 'vente') {

                $item->confection()->sync(request()->confection);
            }
        });
    }

    public function confection()
    {
        return $this->belongsToMany(
            Article::class,
            'vente_confection',
            'article_vente_id',
            'article_confection_id',
        )->withPivot(['quantite']);
    }

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

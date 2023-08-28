<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            if (request()->unite)
                $item->unite_id = request()->unite;
        });

        static::created(function ($item) {
            if ($item->type === 'confection' && request()->unites)
                $item->unites()->attach(request()->unites);
        });
    }

    public $guarded = ['id'];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function unite()
    {
        return $this->belongsTo(Unite::class);
    }

    public function unites()
    {
        return $this->belongsToMany(Unite::class, 'categorie_unite', 'category_id', 'unite_id');
    }

    public function scopeStartsWith($query, $prefix)
    {
        return $query->where('libelle', 'LIKE', $prefix . '%');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public static function cl(int $id)
    {
        $c = self::find($id);
        return count($c->articles()->withTrashed()->get()) + 1;
    }

    public function scopeStartsWith($query, $prefix)
    {
        return $query->where('libelle', 'LIKE', $prefix . '%');
    }
}

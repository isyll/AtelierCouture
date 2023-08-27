<?php

use App\Models\Article;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vente_confection', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Article::class, 'article_vente_id');
            $table->foreignIdFor(Article::class, 'article_confection_id');
            $table->float('quantite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vente_confection');
    }
};
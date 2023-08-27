<?php

use App\Models\Category;
use App\Models\Fournisseur;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique();
            $table->string('libelle')->unique();
            $table->enum('type', ['confection', 'vente']);
            $table->double('prix', unsigned: true)->nullable();
            $table->double('stock', unsigned: true);
            $table->longText('photo')->nullable();
            $table->foreignIdFor(Category::class)
                ->constrained()
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->float('promo')->nullable();
            $table->double('cout_fabrication', unsigned: true)->nullable();
            $table->double('marge', unsigned: true)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
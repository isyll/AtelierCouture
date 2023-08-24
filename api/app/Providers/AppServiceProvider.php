<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('base64_image_size', function ($attribute, $value, $parameters, $validator) {

            // Decode the image
            $decodedImage = base64_decode($value);

            if (!$decodedImage) return false;

            // Get image size in kilobytes
            $imageSize = strlen($decodedImage) / 1024;

            // Check if image is below max size
            return $imageSize <= $parameters[0];

        });
    }
}
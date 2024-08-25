<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('posts', \App\Http\Controllers\Api\PostController::class)->only([
    'index', 'show'
]);

Route::group([
    'middleware' => 'auth:sanctum'
], function ($router) {
    Route::group([
        'prefix' => 'uploads'
    ], function ($router) {
        Route::post('', [\App\Http\Controllers\Api\FileUploadController::class, 'saveImage']);
        Route::delete('', [\App\Http\Controllers\Api\FileUploadController::class, 'deleteImage']);
    });

    Route::resource('posts', \App\Http\Controllers\Api\PostController::class)->only([
        'store', 'destroy'
    ]);
});


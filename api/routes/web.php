<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group([
    'prefix' => 'auth',
    'middleware' => 'auth:sanctum'
], function ($router) {
    Route::get('me', [\App\Http\Controllers\Auth\AuthController::class, 'me']);
});

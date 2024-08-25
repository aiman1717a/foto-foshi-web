<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
    $posts = \App\Models\Post::query()->get();
    foreach ($posts as $post){
        $post->delete();
    }

})->purpose('Display an inspiring quote')->hourly();

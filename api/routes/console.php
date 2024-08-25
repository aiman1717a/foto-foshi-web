<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('delete-all-posts', function () {
    $posts = \App\Models\Post::query()->get();
    foreach ($posts as $post){
        $post->delete();
    }
});

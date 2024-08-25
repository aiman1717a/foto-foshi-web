<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Collection;
class PostService
{
    public function uploadMedia(Post $post, $media, $type = 'URL'){
        (new FileService())->uploadMedia($post, [$media], 'images', $type);
    }
}

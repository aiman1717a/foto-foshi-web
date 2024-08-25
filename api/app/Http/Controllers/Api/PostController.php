<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Shop;
use App\Services\FileService;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
//    public function __construct(Request $request)
//    {
//        $this->authorizeResource(Post::class, 'post');
//    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Post::class);

        $validated = $request->validate([
            'cursor' => 'nullable',
        ]);

        $posts =  Post::query()->orderBy('created_at', 'DESC')->cursorPaginate(9);
        foreach ($posts as $post){
            $post->getMedia('images');
        }
        return response($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        Gate::authorize('create', Post::class);

        $validated = $request->validated();
        $media = Arr::pull($validated, 'media');
        $validated['created_by_id'] = auth()->id();
        $item = Post::query()->create($validated);
        (new PostService())->uploadMedia($item, $media);
        return $this->show($item);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        Gate::authorize('view', $post);
        $item = Post::query()->where('id', $post->id)->with('createdBy')->first();
        if($item){
            $item->getMedia('images');
        }
        return $item;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        Gate::authorize('update', Post::class);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);
        return $post->delete();
    }
}

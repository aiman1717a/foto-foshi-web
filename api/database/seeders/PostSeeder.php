<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Services\PostService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@gmail.com')->first();
        if($user){
            $noOfPosts = 1000;
            for ($i = 0; $i < $noOfPosts; $i++) {
                $path = Storage::disk('local')->path('images/image-' . rand(1,5) . '.jpg');
                $media = [
                    'original_url' => $path
                ];
                $post = Post::query()->create([
                    'description' => fake()->paragraph(),
                    'created_by_id' => $user->id
                ]);
                (new PostService())->uploadMedia($post, $media, 'FILE');
            }
        }

    }
}

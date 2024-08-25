<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileService;
use Hidehalo\Nanoid\Client;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function saveImage(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required',
            'folder' => 'nullable',
        ]);

        return (new FileService())->upload($validated['file']);

    }

    //Not used
    public function deleteImage(Request $request)
    {
        $validated = $request->validate([
            'location' => 'required',
        ]);
        return (new FileService())->deleteImage($validated['file']);
    }

}

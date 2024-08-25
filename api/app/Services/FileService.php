<?php
namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Facades\Storage;

class FileService
{

    public function upload($file)
    {
        if (!$file) {
            throw new \Exception('File Missing');
        }
        if(!$file->isValid()){
            throw new \Exception('Invalid File');
        }

        if(!$this->checkMimeType($file)) {
            throw new \Exception('Mime type mismatch');
        }

        if(!$this->checkExtension($file)) {
            throw new \Exception('Extension mismatch');
        }

        $folder = 'tmp/';

        $filename = $folder . now()->timestamp. '-' . Str::random(20) . '.'. $file->guessExtension();
        if(Storage::disk(config('filesystems.default'))->exists($filename)){
            Storage::disk(config('filesystems.default'))->delete($filename);
        }

        Storage::disk(config('filesystems.default'))->put($filename, file_get_contents($file));
        return response(Storage::disk(config('filesystems.default'))->url($filename));
    }

    //Not used
    public function deleteImage(Request $request)
    {
        $location = $request->get('location');
        if($location !== null){
            if(Storage::disk(config('filesystems.default'))->exists($location)){
                Storage::disk(config('filesystems.default'))->delete($location);
            }
        }
        return response($location);

    }
    private function checkMimeType($file) {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (in_array(strtolower($file->getClientMimeType()), $allowedMimes)) {
            return true;
        }
        return false;
    }
    private function checkExtension($file) {
        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (in_array(strtolower($file->guessExtension()), $allowedExt)) {
            return true;
        }
        return false;
    }
    public function uploadMedia($model, $images, $toMediaCollection = '*', $type = 'URL'){
        foreach ($model->getMedia($toMediaCollection) as $media) {
            $exist = false;
            foreach ($images as $image){
                if($image){
                    if(isset($image['id'])){
                        if($media->getFullUrl() === $image['original_url']){
                            $exist = true;
                        }
                    }
                }
            }
            if(!$exist){
                $media->delete();
            }
        }


        foreach ($images as $index => $image){
            if($image){
                if(isset($image['uuid'])){
                    $newMedia = Media::findByUuid($image['uuid']);
                    $newMedia->order_column = $index + 1;
                    if(isset($image['custom_properties'])){
                        $newMedia->custom_properties = $image['custom_properties'];
                    }
                    $newMedia->save();
                } else {
                    if($type === 'URL'){
                        $newMedia = $model->addMediaFromUrl($image['original_url'])->preservingOriginal()->toMediaCollection($toMediaCollection);
                    }else{
                        $newMedia = $model->addmedia($image['original_url'])->preservingOriginal()->toMediaCollection($toMediaCollection);
                    }

                    $newMedia->order_column = $index + 1;
                    if(isset($image['custom_properties'])){
                        $newMedia->custom_properties = $image['custom_properties'];
                    }
                    $newMedia->save();
                }
            }
        }
    }
}

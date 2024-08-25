<template>
  <div class="mb-6 multiple-image-input-field" :id="'form-' + field">
    <div class="w-full">
      <template v-if="showLabel">
        <TitleComponent :title="label" :rtl="rtl" :info="info"></TitleComponent>
      </template>
      <div class="dropzone border-[2px] border-dashed py-5" :class="isInvalid(form.errors.value, field) ? 'border-red-500': 'border-slate-500'" @drop.prevent="onFileChanged" @dragover.prevent="onDragOver"  @dragleave.prevent="onDragOver">
        <ClientOnly>
          <font-awesome-icon class="w-20 mb-2" icon="fa-solid fa-cloud-arrow-up" />
        </ClientOnly>
        <div class="file-upload-btn" v-if="!uploadingStatus">
          <label class="text-sm md:text-base" :for="field"> Drag Or Choose Image to Upload </label>
          <!--Drop Zone-->
          <Form v-slot="{ errors }" ref="fieldForm">
            <Field :id="field" name="images_field" :rules="fileRules" type="file" :multiple="multiple" @change="onFileChanged($event, errors)"/>
            <ErrorMessage name="images_field" class="text-danger text-sm" />
          </Form>
        </div>
        <div class="w-full px-5 text-center" v-else>
          <ProgressBar mode="indeterminate" style="height: 6px" class="w-full"></ProgressBar>
          Uploading...
        </div>
      </div>

      <div class="@container">
        <viewer :images="displayValue">
          <draggable
              v-model="displayValue"
              handle=".imagehandle"
              :component-data="{
                tag: 'ul',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null
              }"
              @start="drag = true"
              @end="drag = false"
              v-bind="dragOptions"
              item-key="id"
              class="grid grid-cols-2 @xl:grid-cols-3 @2xl:grid-cols-5"
          >
            <template #item="{ element: file, index }" :key="index">
              <div class="p-4">
                <div class="relative">
                  <div class="relative aspect-video group transition-all overflow-hidden">
                    <div
                        class="absolute top-0 left-0 blur-lg object-cover h-full w-full mx-auto z-10"
                        :style="{'background-image': 'url(' +  file.original_url + ')'}"
                    ></div>
                    <img :src="file.original_url" class="relative object-cover h-full w-fit mx-auto z-20 group-hover:scale-110 transition-all" />
                  </div>
                  <template v-if="caption">
                    <template v-if="file['custom_properties']">
                      <template v-if="file['custom_properties']['caption']">
                        <div
                            class="text-slate-500 break-all"
                            :dir="captionThaana ? 'rtl': 'ltr'"
                            :class="captionThaana ? 'dv text-right': 'eng text-left'"
                            v-html="file['custom_properties']['caption']">

                        </div>
                      </template>
                    </template>
                  </template>

                  <div class="bg-slate-700 text-white absolute top-0 left-0 rounded-full p-4 w-5 h-5 flex justify-center items-center -translate-x-3 -translate-y-3 z-30">
                    {{ index + 1 }}
                  </div>
                  <div class="absolute top-0 right-0 flex flex-row gap-2 p-2 z-30">
                    <template v-if="caption">
                      <template v-if="!uploadingStatus">
                        <div class="bg-white rounded-full flex flex-row justify-center items-center cursor-pointer w-7 h-7">
                          <font-awesome-icon icon="fa-solid fa-pencil" @click="openForm(index)" />
                        </div>
                      </template>
                    </template>


                    <div class="imagehandle bg-white rounded-full flex flex-row justify-center items-center cursor-move w-7 h-7">
                      <font-awesome-icon icon="arrow-right-arrow-left" class="w-3 h-3" />
                    </div>

                    <div
                        class="text-white bg-primary rounded-full cursor-pointer flex items-center justify-center w-7 h-7"
                        @click="deleteUploadedFile(index)"
                    >
                      <font-awesome-icon icon="fa-solid fa-x" class="w-3 h-3" />
                    </div>
                  </div>

                </div>
              </div>
            </template>
          </draggable>
        </viewer>
      </div>



      <Dialog v-model:visible="visible" modal header="Caption" :style="{ width: '50rem' }">

        <span class="p-text-secondary block mb-5">Update your caption.</span>
        <form v-if="propertiesForm" @submit.prevent="onSubmit">
          <FormTextField :form="propertiesForm" label="Caption" field="caption" :thaana="captionThaana" :font-class="captionThaana ? 'dv': 'eng'"></FormTextField>
          <div class="flex flex-row">
            <Button label="Cancel" class="ml-auto b" text severity="secondary" @click="visible = false" autofocus />
            <Button type="submit" label="Save" outlined severity="secondary" :loading="propertiesForm.isSubmitting" autofocus />
          </div>
        </form>

      </Dialog>

      <template v-if="form.errors.value">
        <p class="text-red-700 text-sm mt-2">{{form.errors.value[field]}}</p>
      </template>
      <template v-else>
        <p class="text-red-700 text-sm mt-2">{{form.errors[field]}}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, onMounted, nextTick, toRefs, defineModel } from 'vue'
import _ from 'lodash-es'
import draggable from 'vuedraggable'
import TitleComponent from "@/cms/TitleComponent.vue";
import {useField, Form, ErrorMessage, Field, useForm} from "vee-validate";
import { useHelper } from '@/cms/useHelper'
import isImage from 'is-image';

const { $api } = useNuxtApp()

interface Props {
  form: any;
  label?: string;
  field?: string | string[];
  info?: string;
  show?(input: object, formData: object): any;
  showLabel?: boolean;
  rtl?: boolean;
  placeHolder?: string;
  disabled?: boolean;
  pt?: any;


  multiple?: boolean;
  fileRules?: string | null;
  uploadUrl?: string | null;
  deleteUrl?: string | null;
  fileName?: string | null;
  width?: number | null;
  height?: number | null;
  folder?: string | null;
  disk?: string;
  caption?: boolean;
  captionThaana?: boolean;
}

const props = withDefaults(defineProps<Props>(),{
  label: 'Name',
  field: 'name',
  info: null,
  show: () => {},
  showLabel: true,
  rtl: false,
  placeHolder: '',
  disabled: false,
  pt: null,

  multiple: false,
  fileRules: 'image|ext:jpg,png,jpeg,gif|size:5000', // rules set default to image uploads
  uploadUrl: 'api/uploads',
  deleteUrl: 'api/uploads',
  fileName: null,
  width: 1200,
  height: null,
  folder: null,
  disk: import.meta.env.VITE_FILESYSTEM_DISK || '',
  caption: false,
  captionThaana: false
})

const {
  form,
  label,
  field,
  info,
  show,
  showLabel,
  rtl,
  placeHolder,
  disabled,
  pt,


  multiple,
  fileRules,
  uploadUrl,
  deleteUrl,
  fileName,
  width,
  height,
  folder,
  disk,
  caption,
  captionThaana,
} = toRefs(props);

const { value, errorMessage } = useField(field, undefined, {
  form: form.value,
  syncVModel: true,
  validateOnModelUpdate: true,
});
const { isInvalid } = useHelper()


const propertiesForm = ref()
const onSubmit = ref()
function initForm(){
  propertiesForm.value = useForm({
    validationSchema: {
      media: 'required',
      caption: ''
    },
    initialValues: {
      media: null,
      caption: null
    }
  })

  onSubmit.value = propertiesForm.value?.handleSubmit(async (values) => {
    if(value.value[values['media']]){
      value.value[values['media']]['custom_properties'] = {
        caption: values['caption']
      }

      visible.value = false
    }
  })
}

const drag = ref<boolean>(false)
const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  };
})
const sortable = ref(null)
const uploadingStatus = ref<boolean>(false)
const visible = ref(false);


async function openForm(index){
  initForm()
  await nextTick()
  propertiesForm.value.resetForm()
  propertiesForm.value.setFieldValue('media', index)

  if(value.value[index]){
    if(value.value[index]['custom_properties']){
      if(value.value[index]['custom_properties']['caption']){
        propertiesForm.value.setFieldValue('caption', value.value[index]['custom_properties']['caption'])
      }
    }
  }
  visible.value = true
}

function onDragOver(ev: any) {
  ev.preventDefault()
}
function deleteUploadedFile(index: number) {
  if (displayValue.value.length > 0) {
    deleteUploadedFiles(index, displayValue.value[index])
  }
}
async function onFileChanged(e: any, errors: any) {
  uploadingStatus.value = true
  await nextTick()
  if (e !== null) {
    const uploading = e.target.files || e.dataTransfer.files

    if(errors){
      if(errors['images_field']){
        uploadingStatus.value = false
        return
      }
    }
    if (uploading.length <= 0) {
      uploadingStatus.value = false
      return
    }

    for (const file of Array.from(uploading)) {
      const index = Array.from(uploading).indexOf(file);
      await uploadFile(index, file)
    }
  }
}
async function uploadFile(index: any, file: any) {
  try {
    var formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder.value as string)

    const { data, status } = await useMyFetch(uploadUrl.value, {
      method: 'POST',
      body: formData,
      headers: {
        'ContentType': 'multipart/form-data'
      }
    })

    if(status.value === 'success'){
      let temp = _.cloneDeep(value.value)
      let structure = {
        'original_url': data.value
      }
      if(captionThaana.value){
        structure['custom_properties'] = {
          'caption': null
        }
      }

      if(multiple.value){
        if(_.isArray(value.value)){
          temp.push(structure)
          value.value = temp
        }else{
          temp.push(structure)
          value.value = []
          value.value = temp
        }
      }else{
        value.value = structure
      }
    }
    uploadingStatus.value = false
  } catch (e) {
    uploadingStatus.value = false
    console.log(e)
  }
}
async function deleteUploadedFiles(index: any) {
  if(multiple.value){
    if (_.isArray(value.value)) {
      let temp = _.cloneDeep(value.value)
      temp.splice(index, 1)
      console.log(index)
      console.log(temp)
      value.value = temp

    }
  } else {
    value.value = null
  }
}
const displayValue = computed({
  get() {
    if(!value.value){
      return []
    }

    if(multiple.value){
      if (_.isArray(value.value)) {
        return _.cloneDeep(value.value)
      }
      return [value.value]
    }else{
      if (_.isArray(value.value)) {
        if(value.value.length > 0){
          return _.cloneDeep([value.value[0]])
        }
        return []
      }
      return _.cloneDeep([value.value])
    }
  },
  set(v) {
    value.value = _.cloneDeep(v)
  }
})

</script>

<style lang="scss">
.multiple-image-input-field {
  .dropzone {
    background-color: white;
    width: 100%;
    height: 200px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .file-upload-btn {
      label {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
      }
    }
    .progress-bar {
      margin-top: 20px;
      width: 75%;
    }
  }
  input[type='file'] {
    display: none;
  }
  .image {
    img {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      //width: 100%;
      height: 100%;
      object-fit: cover;
      margin-right: auto;
      margin-left: auto;
    }
    &:before {
      content: '';
      display: block;
      padding-top: 56.25%; // ratio 16:9
    }
  }
}
</style>

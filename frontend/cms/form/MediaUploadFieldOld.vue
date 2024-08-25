<template>
  <div class="mb-6 multiple-image-input-field" :id="'form-' + field">
    <div class="w-full">
      <template v-if="showLabel">
        <TitleComponent :title="label" :rtl="rtl" :info="info"></TitleComponent>
      </template>

      value: {{value}}

      <div class="dropzone border-[2px] border-dashed py-5" :class="isInvalid(form.errors.value, field) ? 'border-red-500': 'border-slate-500'" @drop.prevent="onFileChanged" @dragover.prevent="onDragOver"  @dragleave.prevent="onDragOver">
        <div class="file-upload-btn" v-if="!uploadingStatus">
          <label :for="field"> Choose Media to Upload </label>
          <!--Drop Zone-->
          <VeeForm v-slot="{ errors }" ref="fieldForm">
            <Field :id="field" name="images_field" :rules="fileRules" type="file" :multiple="multiple" @change="onFileChanged($event, errors)" />
            <ErrorMessage name="images_field" class="text-danger text-sm" />
          </VeeForm>
        </div>
        <div v-else>
          <ProgressSpinner />
        </div>
      </div>

      <div class="grid grid-cols-6 gap-5 mt-5">
        <div class="relative aspect-square group transition-all overflow-hidden border rounded-xl" v-for="file in displayFiles">
          <div class="absolute top-0 right-0 z-20 p-2">
            <button type="button" class="bg-danger rounded-full text-white w-7 h-7">
              <i class="pi pi-times !text-xs"></i>
            </button>
          </div>
          <img :src="file" alt="" class="relative object-cover h-full w-fit mx-auto z-10 group-hover:scale-110 transition-all">
        </div>
      </div>



<!--      <div class="@container">
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
              class="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-5"
          >
            <template #item="{ element: file, index }" :key="index">
              <div class="p-4">
                <div class="relative">
                  <div class="image rounded-lg overflow-hidden relative border">
                    <div
                        class="absolute top-0 left-0 h-full w-full blur-lg"
                        :style="{'background-image': 'url(' +  file.original_url + ')'}"
                    ></div>
                    <img :src="file.original_url" />
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

                  <div class="bg-slate-700 text-white absolute top-0 left-0 rounded-full p-4 w-5 h-5 flex justify-center items-center -translate-x-3 -translate-y-3">
                    {{ index + 1 }}
                  </div>
                  <div class="absolute top-0 right-0 flex flex-row gap-2 p-2">
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
      </div>-->

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
import {useField, Form as VeeForm, ErrorMessage, Field, useForm} from "vee-validate";
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
  uploadUrl: 'api/pos/uploads',
  deleteUrl: 'api/pos/uploads',
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

const files = ref([]);
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
  // uploadingStatus.value = true
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
      files.value.push(file);
      // await uploadFile(index, file)
    }
  }
}


const displayFiles = computed({
  get() {
    if(!files.value){
      return []
    }
    let newFiles = files.value.map((file) => {
      return URL.createObjectURL(file)
    })
    return newFiles
  },
  set(v) {

  }
})

watch(files, () => {
  let target = _.cloneDeep(value.value)
  if(multiple.value){
    if(target){
      if(target.newUploads){
        target.newUploads = files.value
      }
    }
  }else{
    if(files.value.length > 0){
      if(target){
        if(target.newUploads){
          target.newUploads = [files.value[0]]
        }
      }
    }
  }
  value.value = target
}, {immediate: true, deep: true})
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
  }
  input[type='file'] {
    display: none;
  }
}
</style>

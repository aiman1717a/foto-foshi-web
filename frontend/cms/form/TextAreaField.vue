<template>
  <div class="w-full" :id="'form-' + field">
    <template v-if="showLabel">
      <TitleComponent :title="label" :rtl="rtl" :info="info"></TitleComponent>
    </template>
    <Textarea :key="updateKey" v-model="value" :pt="pt" :rows="rows" :cols="cols" :disabled="disabled" class="w-full" :auto-resize="autoResize"  :class="[{'rtl text-right': thaana || rtl}]"/>
    <template v-if="form.errors.value">
      <p class="text-red-700 text-sm mt-2">{{form.errors.value[field]}}</p>
    </template>
    <template v-else>
      <p class="text-red-700 text-sm mt-2">{{form.errors[field]}}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import TitleComponent from "@/cms/TitleComponent.vue";
import { useHelper } from '@/cms/useHelper'

interface Props {
  form: any;
  label?: string;
  field?: string | string[];
  info?: string | null;
  show?(input: object, formData: object): any;
  showLabel?: boolean;
  rtl?: boolean;
  placeHolder?: string;
  disabled?: boolean;
  pt?: any,

  thaana?: boolean;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
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

  thaana: false,
  rows: 5,
  cols: 30,
  autoResize: true
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

  thaana,
  rows,
  cols,
  autoResize
} = toRefs(props);

const updateKey = ref(0)

const { value, errorMessage } = useField(field, undefined, {
  form: form.value,
  syncVModel: true,
  validateOnModelUpdate: true,
});
const { isInvalid } = useHelper()

</script>

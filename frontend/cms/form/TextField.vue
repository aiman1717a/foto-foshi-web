<template>
  <div class="w-full flex flex-col" :id="'form-' + field">
    <template v-if="showLabel">
      <TitleComponent :title="label" :rtl="rtl" :info="info"></TitleComponent>
    </template>
    <template v-if="password">
      <template v-if="generatePassword">
        <Button type="button" severity="info" label="Generate Password" class="w-fit" text  @click="randomPassword()" />
      </template>
      <Password
          @focus="isFocused = true" @blur="isFocused = false"
          :id="label"
          :key="updateKey"
          v-model="value"
          :type="type"
          :autocomplete="autocomplete"
          :pt="{
              input: {
                 root: {
                    autocomplete: autocomplete
                 }
              },
              ...pt
          }"
          :invalid="isInvalid(form.errors.value, field)"
          :name="label" class="w-full thaana-keyboard" :class="[{'rtl text-right': thaana || rtl}]"
          :disabled="disabled" toggle-mask
          onblur="this.setAttribute('readonly', 'readonly');" onfocus="this.removeAttribute('readonly');" readonly
          :feedback="passwordFeedback"/>
    </template>
    <template v-else>
      <InputText
          @focus="isFocused = true" @blur="isFocused = false"
          :id="label"
          :key="updateKey"
          v-model="value"
          :type="type"
          :autocomplete="autocomplete"
          :pt="pt"
          :invalid="isInvalid(form.errors.value, field)"
          :name="label" class="w-full" :class="[{'rtl text-right': thaana || rtl}]"
          :disabled="disabled"
          onblur="this.setAttribute('readonly', 'readonly');" onfocus="this.removeAttribute('readonly');" readonly
          :typeautocomplete="autocomplete"/>
    </template>
    <template v-if="errorMessage">
      <p class="text-red-700 text-sm mt-2">{{errorMessage}}</p>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useField } from "vee-validate";
import TitleComponent from "@/cms/TitleComponent.vue";
import { useHelper } from '@/cms/useHelper'

export interface Props {
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

  type?: string | null;
  autocomplete?: string | null;
  password?: boolean;
  generatePassword?: boolean;
  passwordFeedback?: boolean;
  thaana?: boolean;
  slug?: string | null;
  slugUrl?: boolean;
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

  type: 'text',
  autocomplete: 'off',
  password: false,
  generatePassword: false,
  passwordFeedback: true,
  thaana: false,
  slug: null,
  slugUrl: false
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

  type,
  autocomplete,
  password,
  generatePassword,
  passwordFeedback,
  thaana,
  slug,
  slugUrl
} = toRefs(props);
const updateKey = ref(0)

const { value, errorMessage } = useField(field, undefined, {
  form: form.value,
  syncVModel: true,
  validateOnModelUpdate: true,
});

const isFocused = defineModel('isFocused')
const { isInvalid } = useHelper()


function randomPassword() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const passwordLength = 12
  let password = ''
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length)
    password += chars.substring(randomNumber, randomNumber + 1)
  }
  value.value = password
}
</script>

<style lang="scss">
.p-password-input{
  width: 100%
}
</style>
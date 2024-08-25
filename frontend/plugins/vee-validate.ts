import { defineRule, Form, Field, ErrorMessage, configure } from 'vee-validate'
import { all } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import _ from 'lodash-es'

configure({
    validateOnInput: true,
    generateMessage: localize({
        en
    })
})

Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);
});

defineRule('string', (value) => {
    // if(typeof value  !== "undefined"){
    //     if (value !== null) {
    //         if (Object.prototype.toString.call(value) !== '[object String]') {
    //             return 'This field must be a text'
    //         }
    //     }
    // }
    return true
})

defineRule('decimal', (value: any) => {
    if (isNaN(value)) {
        return 'This field must be a decimal'
    }
    return true
})

defineRule('boolean', (value) => {
    if (!_.isBoolean(value)) {
        return 'This field must be a boolean'
    }
    return true
})
defineRule('required_if', (value, params, ctx) => {
    const target = params.slice(0, 1)[0]
    const p = params.slice(1, params.length)
    let required = false
    p.forEach((item) => {
        if (item == ctx.form[target]) {
            required = true
        }
    })

    if (required) {
        if(typeof value === "undefined" || value === null || value == ''){
            return 'This field is required'
        }
    }
    return true
})

defineRule('required_with', (value, params, ctx) => {
    const target = params.slice(0, 1)[0]

    let required = false
    if (ctx.form[target] !== null && typeof ctx.form[target] !== "undefined" && ctx.form[target] !== "") {
        required = true
    }

    if (required && _.isEmpty(value)) {
        if(typeof value === "undefined" || value === null || value == ''){
            return 'This field is required'
        }
    }
    return true
})
export default defineNuxtPlugin(nuxtApp => {
    return {}
})
import { computed } from 'vue'
import _ from 'lodash-es'
import moment from "moment";
import pkg from 'notiflix/build/notiflix-notify-aio';
const { Notify } = pkg;

export function useHelper() {

    function isInvalid(errors: any, field: any){
        let t = false
        if(errors){
            if(errors[field]){
                t = true
            }
        }
        return t
    }


    return { notify:Notify, isInvalid }
}

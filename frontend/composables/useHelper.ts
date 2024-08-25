import type  {Media} from "@/types";
import pkg from 'notiflix/build/notiflix-notify-aio';
import moment from 'moment'

const { Notify } = pkg;
export function useHelper() {
    function getCollection(media: Media[], name: String){
        const collection = [] as Media[]
        if(typeof media !== "undefined"){
            Object.values(media).forEach(val => {
                if(val.collection_name === name){
                    collection.push(val)
                }
            });
        }
        return collection
    }

    function publishedAt(publishedAt: any, format: string = 'DD MMMM YYYY h:mm') {
        const outputFormat = format
        // const yesterday = moment().subtract(1, 'days')
        const publishedAtObj = moment(publishedAt)
        return publishedAtObj.format(outputFormat)

        /*if (publishedAtObj.isBefore(yesterday, 'second')) {
            return publishedAtObj.format(outputFormat)
        }
        return publishedAtObj.fromNow()*/
    }




    return { getCollection, notify: Notify, publishedAt }
}

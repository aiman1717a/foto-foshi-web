import type {User, Post} from "@/types";

export function usePolicy() {
    const { loggedInUser, can, canAny } = useAuth()

    function viewAllItems() {
        let access = true
        /*Custom Access options here*/
        return access;
    }

    function viewItem(item: Post | null = null) {
        let access = true
        return access;
    }
    function createItem(item: Post | null = null) {
        let access = true
        return access
    }
    function updateItem(item: Post | null = null) {
        let access = false
        return access
    }
    function deleteItem(item: Post | null = null) {
        let access = false

        if(loggedInUser.value){
            if(item.created_by_id === loggedInUser.value.id){
                access = true
            }
        }
        return access
    }

    return { viewAllItems, viewItem, createItem, updateItem, deleteItem }
}

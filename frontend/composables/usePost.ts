const visibleDeleteDialog = ref(false);
const post_id = ref()
export const usePost = () => {
    function showDeleteConfirmationDialog(status: boolean, id: any){
        visibleDeleteDialog.value = status
        post_id.value = id
    }
    function closeDeleteConfirmationDialog(status: boolean){
        visibleDeleteDialog.value = status
        post_id.value = null
    }
    return { visibleDeleteDialog, post_id, showDeleteConfirmationDialog, closeDeleteConfirmationDialog }
}

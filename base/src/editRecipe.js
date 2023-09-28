export async function editRecipeFn(){

}

export async function deleteRecipeFn(event){
    const target = event.target;
    const parentArticle = target.parentElement.parentElement;
    const articleId = parentArticle.recipeId;
    const token = sessionStorage.accessToken;
    let confirmation = confirm("Are you sure you want to delete this recipe?");
    if (confirmation){
        const deleteUrl = 'http://localhost:3030/data/recipes/' + articleId;
        try {
            const request = await fetch(deleteUrl, {
                method: "delete",
                headers:{'X-Authorization': token}
            })
            if(request.status !== 200){
                throw new Error(request.message);
            }
        } catch (error) {
            alert(error.message);
        }
        
    }else {
        console.log("Canceled");
    }

}

function createDeleteHeading(){
    const h2 = document.createElement("h2");
    h2.textContent = "Recipe deleted";
    return h2;
}
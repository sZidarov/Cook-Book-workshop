import { getMoreInfo } from "./app.js";

const token = sessionStorage.accessToken;
const main = document.querySelector('main');
const url = 'http://localhost:3030/data/recipes/';

export async function editRecipeFn(event){
    const target = event.target;
    const parentArticle = target.parentElement.parentElement;
    const articleId = parentArticle.id;
    const editScreen = document.getElementById("edit");
    main.replaceChildren(editScreen);
    const dataObj = await getMoreInfo(articleId);
    editScreen.querySelector('[name="name"]').value = dataObj.recipeName;
    editScreen.querySelector('[name="img"]').value = dataObj.imgSrc;
    editScreen.querySelector('[name="ingredients"]').value = dataObj.ingredientsArr.join("\n");
    editScreen.querySelector('[name="steps"]').value = dataObj.preparationArr.join("\n");
    main.querySelector("form").addEventListener("submit", (ev)=>{
        ev.preventDefault();
        const editForm = new FormData(ev.target);

    })
    console.log(dataObj);
    // this is not good
    async function onSubmit(){
        const ingredients = editForm.get("ingredients").split("\n");
        const steps = editForm.get("steps").split("\n");
        
        const body =  JSON.stringify({
        "name": editForm.get("name"),
        "img": editForm.get("img"),
        ingredients,
        steps,
        })
        console.log(body);
    
        try {
            const editUrl = url + articleId;
            const request = await fetch(editUrl, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "X-Authorization": token,
                },
                body,
            })
        } catch (error) {

        }
    
    }
    
}

export async function deleteRecipeFn(event){
    const target = event.target;
    const parentArticle = target.parentElement.parentElement;
    const articleId = parentArticle.id;
    //console.log(parentArticle);
    let confirmation = confirm("Are you sure you want to delete this recipe?");
    if (confirmation){
        const delUrl = url + articleId;
        try {
            const request = await fetch(delUrl, {
                method: "delete",
                headers:{'X-Authorization': token}
            })
            if(request.status !== 200){
                throw new Error(request.message);
            }
            main.replaceChildren(createDeleteHeading());
        } catch (error) {
            alert(error.message);
        }
    }

}

function createDeleteHeading(){
    const h2 = document.createElement("h2");
    h2.textContent = "Recipe deleted";
    return h2;
}
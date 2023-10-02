import { loadRecepies, navActiveStatus } from "./app.js";

const main = document.querySelector("main");
const createScreen = document.getElementById("create");
createScreen.classList.add("notAttached");
const newRecipeForm = createScreen.querySelector("article form");

/*
let newRecipeForm;
window.addEventListener("load", ()=>{
    newRecipeForm = document.querySelector("form");
    newRecipeForm.addEventListener("submit", sendRecipe)
})
*/

export async function createRecipeFn(event){
    event.preventDefault();
    navActiveStatus(event.target);
    //console.log(event.target);
    main.replaceChildren(createScreen);
    newRecipeForm.removeEventListener("submit", onSubmit);
    if (createScreen.classList.contains("notAttached")){
        newRecipeForm.addEventListener("submit", onSubmit);
        createScreen.classList.remove("notAttached");
    }
    
    function onSubmit (event){
        event.preventDefault();
        sendRecipe(event);
        // it is important to remove the event listener here, because it adds itself on top everytime 
        newRecipeForm.removeEventListener("submit", onSubmit)
        createScreen.classList.add("notAttached");
        event.stopPropagation();
        newRecipeForm.reset();
    }
    
    async function sendRecipe (event){
        //console.log("New recipe sent!")
        const formData = new FormData(newRecipeForm);
        const url = "http://localhost:3030/data/recipes";
        const ingredients = formData.get("ingredients").split("\n");
        const steps = formData.get("steps").split("\n");
        const body = JSON.stringify({
            "name": formData.get("name"),
            "img": formData.get("img"),
            ingredients,
            steps,
        })
    
        const request = await fetch(url, {
            method: "POST",
            headers: {
                "X-Authorization": sessionStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body
        });
        try {
           if (request.status === false){
            throw new Error(request.message)
           }
           loadRecepies(event);     
        } catch (error) {
            alert(error.message)
        }
    }
}


import { loadRecepies, navActiveStatus } from "./app.js";

const main = document.querySelector("main");
const createScreen = document.getElementById("create");

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
        const newRecipeForm = createScreen.querySelector("article form");
        main.replaceChildren(createScreen);
        newRecipeForm.addEventListener("submit", (event)=>{
            event.preventDefault();
            sendRecipe();
        });
    
    async function sendRecipe (){
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
           loadRecepies();     
        } catch (error) {
            alert(error.message)
        }
    }
}


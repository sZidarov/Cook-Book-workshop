let newRecipeForm;

window.addEventListener("load", ()=>{
    newRecipeForm = document.querySelector("form");
    newRecipeForm.addEventListener("submit", sendRecipe)
})

async function sendRecipe (event){
    event.preventDefault();
    const formData = new FormData(newRecipeForm);
    const url = "http://localhost:3030/data/recipes";
    const ingredients = formData.get("ingredients").split("\n");
    const preparation = formData.get("steps").split("\n");
    const body = JSON.stringify({
        "name": formData.get("name"),
        "img": formData.get("img"),
        ingredients,
        preparation,
    })
    const request = await fetch(url, {
        method: "POST",
        headers: {
            "X-Authorization": sessionStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body
    });
    
}
import { createRecipeFn } from "./createRecipe.js";
import { deleteRecipeFn, editRecipeFn } from "./editRecipe.js";
import { loadHomePage } from "./homePage.js";
import { logInFn } from "./login.js";
import { logOutFn } from "./logout.js";
import { createHeaderAndFooter, getRecipesCount } from "./paging.js";
import { registerFn } from "./register.js";

export async function loadRecepies(event) {
    //let currentPage = document.querySelector("main header").dataset.page
    let offset = 0
    const url = `http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg&offset=${offset}&pageSize=5`
    //const responce = await fetch('http://localhost:3030/jsonstore/cookbook/recipes');
    //const responce = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg');
    const responce = await fetch(url);
    const main = document.querySelector('main');
    const data = await responce.json();
    const recipesTotalCount = await getRecipesCount();
    
    main.replaceChildren();
    setUserNav(); 
    if (event !== undefined){
        navActiveStatus(event.target);
    }
    // add paging header
    const header = createHeaderAndFooter(recipesTotalCount).header
    main.appendChild(header);
    
    for (const recipe in data) {
        //console.log(data[recipe]);
        main.appendChild(createRecipePreview(data[recipe].name ,data[recipe].img, data[recipe]._id))
    };
    // add paging footer
    const footer = createHeaderAndFooter(recipesTotalCount).footer;
    main.appendChild(footer);
    
    //const nextBtn = document.getElementById("next");
    //const prevBtn = document.getElementById("prev");
    /*
    nextBtn.addEventListener("click", ()=>{
        //currentPage = document.querySelector("main header").dataset.page
        console.log(currentPage)
        //document.querySelector("main header").dataset.page = currentPage++;
        loadRecepies()
    })
    prevBtn.addEventListener("click", ()=>console.log("previous page..."))
    */
};

function onLoad(){
    setUserNav();
    loadHomePage();
    
    const homeLink = document.querySelector("header h1 a");
    homeLink.addEventListener("click", loadHomePage);

    const catalogBtn = document.getElementById("catalogBtn");
    catalogBtn.addEventListener("click", (event)=>{
        event.preventDefault();
        loadRecepies(event);
    });

    const loginBtn = document.getElementById("loginBtn");
    loginBtn.addEventListener("click", logInFn);

    const registerBtn = document.getElementById("registerBtn");
    registerBtn.addEventListener("click", registerFn);

    const createBtn = document.getElementById("createBtn");
    createBtn.addEventListener("click", createRecipeFn);

    const logOutBtn = document.getElementById("logoutBtn");
    logOutBtn.addEventListener("click", logOutFn);
};
onLoad();

export function setUserNav(){
    const guestNav = document.getElementById("guest");
    const userNav = document.getElementById("user")
    const userToken = sessionStorage.getItem("accessToken");
    if(userToken === null){
        guestNav.style.display = "inline";
        userNav.style.display = "none";
    }else if (userToken){
        userNav.style.display = "inline";
        guestNav.style.display = "none";
    }
};
export function navActiveStatus (navElement){
    const navBtns = document.querySelectorAll("header nav a");
    for (const navBtn of navBtns) {
        navBtn.classList.remove("active");
    }
    //console.log(navBtns);
    if(navElement !== undefined){
        navElement.classList.add("active");
    };
}
/*
window.addEventListener('load', async () => {
    // show recipes on page load
    //const recipes = await loadRecepies();
    const navBar = document.querySelectorAll("nav a");
    onLoad();
});
*/

function createRecipePreview (recipeName, src, id){
    const article = document.createElement('article');
    article.classList.add('preview');
    article.id = id;
    article.addEventListener('click', getFullView);
    
    const divImg = document.createElement('div');
    divImg.classList.add('small');
    
    const img = document.createElement('img');
    img.src = src;
    divImg.appendChild(img);

    const divTitle = document.createElement('div');
    divTitle.classList.add('title');

    const header = document.createElement('h2');
    header.textContent = recipeName;
    divTitle.appendChild(header);

    article.appendChild(divTitle);
    article.appendChild(divImg);
    return article;   
};
export async function getFullView(event){
    const target = event.currentTarget;
    const recipeId = target.id;
    //console.log(target);
    const moreInfoData = await getMoreInfo(recipeId);


    const fullViewArticle = createFullViewArticle(moreInfoData);
    
    //return fullViewArticle
    //target.replaceWith(fullViewArticle);
    // show full view and hide the rest
    const main = document.querySelector('main');
    main.replaceChildren(fullViewArticle);
};

export async function getMoreInfo(id){
    let ingredientsArr = [];
    let preparationArr = [];
    let imgSrc = '';
    let recipeName = '';
    let ownerId = '';
    //console.log(`http://localhost:3030/data/recipes/${id}`);
    await fetch(`http://localhost:3030/data/recipes/${id}`)
    .then(responce => responce.json())
     .then(data => {
         //console.log(data);
         ownerId = data._ownerId;
         imgSrc = data.img;
         ingredientsArr = data.ingredients;
         preparationArr = data.steps;
         recipeName = data.name;
     })

    return {
        recipeName,
        imgSrc,
        ingredientsArr,
        preparationArr,
        ownerId,
        "recipeId": id,
    };
};

export function createFullViewArticle(dataObj){
    //console.log(dataObj);
    const title = dataObj.recipeName;
    const thumbSrc = dataObj.imgSrc;
    const ingredients = dataObj.ingredientsArr;
    const preparation = dataObj.preparationArr;
    const ownerId = dataObj.ownerId;

    const fullViewArticle = document.createElement('article');
    fullViewArticle.id = dataObj.recipeId;

    const h2 = document.createElement('h2');
    h2.textContent = title;

    const bandDiv = document.createElement('div');
    bandDiv.className = 'band';

    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'thumb';

    const img = document.createElement('img');
    img.src = thumbSrc;
    thumbDiv.appendChild(img);

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.className = 'ingredients';

    const ingredientH3 = document.createElement('h3');
    ingredientH3.textContent = "Ingredients:";
    ingredientsDiv.appendChild(ingredientH3);

    const ingredientsUl = document.createElement('ul');

    // Create and append list of ingredients
    for (const ingredient of ingredients) {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsUl.appendChild(li);
    };

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';

    const preparationH3 = document.createElement('h3');
    preparationH3.textContent = "Preparation:";
    descriptionDiv.appendChild(preparationH3);

    // Create and append preparation sequence
    for (const prepStep of preparation) {
        const p = document.createElement('p');
        p.textContent = prepStep;
        descriptionDiv.appendChild(p);
    };

    bandDiv.appendChild(thumbDiv);
    ingredientsDiv.appendChild(ingredientsUl);
    bandDiv.appendChild(ingredientsDiv);
    
    fullViewArticle.appendChild(h2);
    fullViewArticle.appendChild(bandDiv);
    fullViewArticle.appendChild(descriptionDiv);

    // Create and append Edit and Delete buttons
    const accessToken = sessionStorage.getItem("accessToken");
    const loggedUserId = sessionStorage.getItem("loggedUserId");
    if (accessToken != null && loggedUserId == ownerId) {
        const controlsDiv = document.createElement("div");
        controlsDiv.className = "controls";
    
        const editBtn = document.createElement("button");
        editBtn.textContent = "\u270E Edit";
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u2716 Delete";
        
        // Add event listeners to the buttons 
        editBtn.addEventListener("click", editRecipeFn);
        deleteBtn.addEventListener("click", deleteRecipeFn);

        controlsDiv.appendChild(editBtn);
        controlsDiv.appendChild(deleteBtn);
        fullViewArticle.appendChild(controlsDiv);
    }

    return fullViewArticle;
};


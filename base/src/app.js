import { logOutFn } from "./logout.js";

async function loadRecepies() {
    //const responce = await fetch('http://localhost:3030/jsonstore/cookbook/recipes');
    const responce = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg');
    const main = document.querySelector('main');
    const data = await responce.json();
    
    main.replaceChildren();
    
    for (const recipe in data) {
        main.appendChild(createRecipePreview(data[recipe].name ,data[recipe].img, data[recipe]._id))
    };      
};

function onLoad(){
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
    const logOutBtn = document.getElementById("logoutBtn");
    logOutBtn.addEventListener("click", logOutFn)
    //console.log(userToken);
}

window.addEventListener('load', async () => {
    const recipes = await loadRecepies();
    const navBar = document.querySelectorAll("nav a");
    onLoad();
});

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
async function getFullView(event){
    const target = event.currentTarget;
    const recipeId = target.id;
    //console.log(recipeId);
    const moreInfoData = await getMoreInfo(recipeId);


    const fullViewArticle = createFullViewArticle(moreInfoData);
    
    //return fullViewArticle
    target.replaceWith(fullViewArticle);
};

async function getMoreInfo(id){
    let ingredientsArr = [];
    let preparationArr = [];
    let imgSrc = '';
    let recipeName = '';
    //console.log(`http://localhost:3030/data/recipes/${id}`);
    await fetch(`http://localhost:3030/data/recipes/${id}`)
    .then(responce => responce.json())
     .then(data => {
         console.log(data);
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
    };
};

function createFullViewArticle(dataObj){
    const title = dataObj.recipeName;
    const thumbSrc = dataObj.imgSrc;
    const ingredients = dataObj.ingredientsArr;
    const preparation = dataObj.preparationArr;

    const fullViewArticle = document.createElement('article');

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

    return fullViewArticle;
};

function createBtn(){
    
}


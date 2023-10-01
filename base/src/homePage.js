import { getFullView, loadRecepies, navActiveStatus } from "./app.js";

export async function loadHomePage(event){
    if (event !== undefined) {
        event.preventDefault();
    }
    const main = document.querySelector("main");
    const homePageUrl = "http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg&sortBy=_createdOn%20desc&pageSize=3";
    const request = await fetch(homePageUrl);
    const responce = await request.json();
    navActiveStatus();

    main.replaceChildren(createHomePage(responce));

}


function createHomePage(recentRecipes) {
    const section = document.createElement("section");
    section.id = "home";

    const heroDiv = document.createElement("div");
    heroDiv.classList.add("hero");

    const heroH2 = document.createElement("h2");
    heroH2.textContent = "Welcome to My Cookbook";
    heroDiv.appendChild(heroH2);
    section.appendChild(heroDiv);

    const header = document.createElement("header");
    header.classList.add("section-title");
    header.textContent = "Recetly added recipes";
    section.appendChild(header);

    const recentDiv = document.createElement("div");
    recentDiv.classList.add("recent-recipes");

    for (let i = 0; i < recentRecipes.length; i++) {
        const currentRecipe = recentRecipes[i];
        const imgSrc = currentRecipe.img;
        const name = currentRecipe.name;
        const id = currentRecipe._id;

        const recipeArticle = document.createElement("article");
        recipeArticle.classList.add("recent");
        recipeArticle.id = id;
        recipeArticle.addEventListener("click", getFullView);

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("recent-preview");

        const img = document.createElement("img");
        img.src = imgSrc;
        imgDiv.appendChild(img);
        
        const titleDiv = document.createElement("div");
        titleDiv.classList.add("recent-title");
        titleDiv.textContent = name;

        recipeArticle.appendChild(imgDiv);
        recipeArticle.appendChild(titleDiv);
        
        recentDiv.appendChild(recipeArticle);

        if(i !== recentRecipes.length-1){
            const spaceDiv = document.createElement("div");
            spaceDiv.classList.add("recent-space");
            recentDiv.appendChild(spaceDiv);
        };  
    }

    const footer = document.createElement("footer");
    footer.classList.add("section-title");

    const footerP = document.createElement("p");
    
    const footerTextContent = document.createTextNode("Browse all recipes in the ");
    
    const footerA = document.createElement("a");
    footerA.href="#";
    footerA.textContent = "Catalog";
    footerA.addEventListener("click", loadRecepies);
    footerP.appendChild(footerTextContent);
    footerP.appendChild(footerA);
    footer.appendChild(footerP);
    
    section.appendChild(recentDiv);
    section.appendChild(footer);

    return section;
};
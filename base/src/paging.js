import { createRecipePreview, loadRecepies } from "./app.js";

export async function getRecipesCount(){
    const countUrl = "http://localhost:3030/data/recipes?count";
    const request = await fetch(countUrl);
    try {
        if(request.status !== 200){
            throw new Error(request.message);
        };
        const count = await request.json();
        return count;
    } catch (error) {
        alert(error.message);
    };
};

export async function createPage (page){

    let offset = (page-1)*5;

    const url = `http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg&offset=${offset}&pageSize=5`;
    const pageCount = await getRecipesCount();
    const pageOf = Math.ceil(pageCount/5);
    const request = await fetch(url);
    const data = await request.json();
    const main = document.querySelector("main");

    main.appendChild(createHeaderAndFooter(true, page, pageOf));
    
    for (const recipe in data) {
        main.appendChild(createRecipePreview(data[recipe].name ,data[recipe].img, data[recipe]._id));
    };
    
    main.appendChild(createHeaderAndFooter(false, page, pageOf));
    
};

export function createHeaderAndFooter(flag, page, pageOf){

    // if the flag is true the function will return a header
    // if the flag is false the function will return a footer
    
    let type;
    if(flag){
        type = "header";
    }else {
        type = "footer";
    };
    
    const typer = document.createElement(type);
    typer.classList.add("section-title");
    typer.dataset.page = 1;
    
    typer.appendChild(createParagraph());
    
    function createParagraph (){
    const headerP = document.createElement("p");
    const headerText = document.createTextNode(`Page ${page} of ${pageOf} `);
    headerP.appendChild(headerText);

    const nextA = document.createElement("a");
    nextA.addEventListener("click", nextPage)
    nextA.id = "next";
    nextA.textContent = "Next >";
    nextA.href = "#";
  
    const prevA = document.createElement("a");
    prevA.addEventListener("click", prevPage)
    prevA.id = "prev";
    prevA.href = "#";
    prevA.textContent = "< Prev";
    
    if (page == 1 && pageOf > 1){
        headerP.appendChild(nextA);
    }else if (page == pageOf && page > 1){
        headerP.appendChild(prevA);
    }else if (page != pageOf){
        headerP.appendChild(prevA);
        const spacer = document.createTextNode(" | ");
        headerP.appendChild(spacer);
        headerP.appendChild(nextA);
    };
    return headerP;
    };
    return typer;
};

function nextPage (){
    document.getElementById("catalogBtn").dataset.page++;
    loadRecepies();
};

function prevPage (){
    document.getElementById("catalogBtn").dataset.page--;
    loadRecepies();
};
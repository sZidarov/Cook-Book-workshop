
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

export function createHeaderAndFooter(pageCount){
    
    // here i have a problem !!!!!!
    
    let page = 1;
    
    //const pageOf = 1;
    const pageOf = Math.ceil(pageCount/5);
    const header = document.createElement("header");
    header.classList.add("section-title");
    header.dataset.page = page;
    const footer = document.createElement("footer");
    footer.classList.add("section-title");
    header.dataset.page = page;
    header.appendChild(createParagraph());
    footer.appendChild(createParagraph())
    
    function createParagraph (){
    const headerP = document.createElement("p");
    const headerText = document.createTextNode(`Page ${page} of ${pageOf} `);
    headerP.appendChild(headerText);

    const nextA = document.createElement("a");
    nextA.textContent = "Next>";
    nextA.href = "#";
  
    const prevA = document.createElement("a");
    prevA.href = "#";
    prevA.textContent = "<Prev";
    if (page == 1 && pageOf > 1){
        headerP.appendChild(nextA);
    }else if (page == pageOf && page > 1){
        headerP.appendChild(prevA);
    }else if (page !== pageOf){
        headerP.appendChild(prevA);
        const spacer = document.createTextNode(" ");
        headerP.appendChild(spacer);
        headerP.appendChild(nextA);
    };
    return headerP;
    };
    

    return {
        header,
        footer
    };
}
import { loadRecepies, navActiveStatus, setUserNav } from "./app.js";

//const token = sessionStorage.accessToken;
const main = document.querySelector('main');
//const url = 'http://localhost:3030/users/login';
const loginScreen = document.getElementById("login");

/*
let loginForm;
window.addEventListener('load', ()=>{
    loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", logInFn);    
    
})
*/

export async function logInFn(event) {
    event.preventDefault();
    navActiveStatus(event.target);
    const url = "http://localhost:3030/users/login";
    main.replaceChildren(loginScreen);
    const loginForm = loginScreen.querySelector("article form");
    //console.log(loginForm)
    loginForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        onSubmit();
    })
    //console.log(formData);
    
    async function onSubmit(){
        const formData = new FormData(loginForm);
        console.log(loginForm)
        try {
            if (formData.get("email") == "" || formData.get("password") == ""){
                throw new Error("All fields must be filled!");
            }
            const body = JSON.stringify({
                "email": formData.get("email"),
                "password": formData.get("password"),
            });
            const request = await fetch (url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body
            })
            const userToken = await request.json();
            if(userToken.code == 403){
                throw new Error(userToken.message);
            }
            loadRecepies();
            sessionStorage.setItem("accessToken", userToken.accessToken);
            sessionStorage.setItem("loggedUserId", userToken._id);
        } catch (error) {
            alert(error.message)
        }
    }
}


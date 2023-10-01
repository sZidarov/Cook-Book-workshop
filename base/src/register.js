import { loadRecepies, navActiveStatus } from "./app.js";

const main = document.querySelector("main");
const registerScreen = document.getElementById("register");

/*
let registerForm; 
window.addEventListener("load", ()=>{
    registerForm = document.querySelector('form');
    registerForm.addEventListener("submit", registerFn);
})
*/

export async function registerFn(event){
    event.preventDefault();
    navActiveStatus(event.target);
    const registerForm = registerScreen.querySelector("article form");
    main.replaceChildren(registerScreen);
    registerForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        onSubmit();
    })
    
    async function onSubmit (){
        const url = "http://localhost:3030/users/register";
        const dataForm = new FormData(registerForm);
    
        try {
            if (dataForm.get("email")==""||dataForm.get("password")==""||dataForm.get("rePass"=="")) {
                throw new Error("All fields must be filled!");
            }
            if (dataForm.get("password")!==dataForm.get("rePass")){
                throw new Error("Passwords didn't match!")
            }
            const body = JSON.stringify({
                "email": dataForm.get("email"),
                "password": dataForm.get("password"),
            });
            const request = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body,
            });
            const responce = await request.json();
            if(request.status !==  200){
                throw new Error(responce.message);
            }
            sessionStorage.setItem("accessToken", responce.accessToken);
            sessionStorage.setItem("loggedUserId", responce._id);
            loadRecepies();
        } catch (error) {
            alert(error.message)
        };
    };
};
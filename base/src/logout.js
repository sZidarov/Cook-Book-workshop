import { loadRecepies, navActiveStatus } from "./app.js";

export async function logOutFn(event){
    navActiveStatus(event.target);
    const url = "http://localhost:3030/users/logout";
    await fetch (url);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("loggedUserId");
    loadRecepies();
};
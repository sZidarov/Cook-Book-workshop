export async function logOutFn(){
    const url = "http://localhost:3030/users/logout";
    await fetch (url);
    sessionStorage.removeItem("accessToken");
    window.location = "index.html"
}
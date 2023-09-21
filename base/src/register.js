let registerForm; 
window.addEventListener("load", ()=>{
    registerForm = document.querySelector('form');
    registerForm.addEventListener("submit", registerFn);
})

async function registerFn (event){
    event.preventDefault();
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
        console.log(request)
        const responce = await request.json();
        console.log(responce);
        if(request.status !==  200){
            throw new Error(responce.message);
        }
        sessionStorage.setItem("accessToken", responce.accessToken);
        window.location="index.html";
    } catch (error) {
        alert(error.message)
    }

}
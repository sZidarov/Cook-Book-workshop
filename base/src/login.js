let loginForm;
window.addEventListener('load', ()=>{
    loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", logInFn);    
        
})

async function logInFn(event) {
    event.preventDefault();
    const url = "http://localhost:3030/users/login";
    const formData = new FormData(loginForm);
    //console.log(formData);
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
        //console.log(request);
        
        const userToken = await request.json();
        if(userToken.code == 403){
            throw new Error(userToken.message);
        }
        sessionStorage.setItem("accessToken", userToken.accessToken);
        sessionStorage.setItem("loggedUserId", userToken._id);
        //console.log(userToken);
    
        window.location = "index.html"
    } catch (error) {
        alert(error.message)
    }
}
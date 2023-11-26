import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Login() {

    const [ user, setUser ] = useState({});

    function handleCallbackResponse(response) {
        console.log("JWT token " + response.credential);
        var userObject = jwtDecode(response.credential);
        console.log(userObject);
        setUser(userObject);
        //Hide sing in button when signed in
        document.getElementById("signInDiv").hidden = true;

    }

    //Sign out function
    function handleSignOut(event) {
        //Set user to empty
        setUser({});
        //Show signin button
        document.getElementById("signInDiv").hidden = false;
    }

    useEffect(() => {
       /* global google */
       google.accounts.id.initialize({
        client_id: "145576447643-auavc750vqj1uhpi9f3h9h7a16t2e219.apps.googleusercontent.com",
        callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        );
    }, []);
 //If we have no user: Sign in button
 //If we have a user: Show the log out button
 //When logged in, show name and picture of account
    return (
        <div>
        <div id="signInDiv"> </div>
        { Object.keys(user).length !== 0 &&
            <button onClick={ (e) => handleSignOut(e)}>Logga ut</button>
        }
        { user &&
            <div> 
                <img src={user.picture} alt=""></img>
                <h3>{user.name}</h3>
            </div>
        }
        </div>
    )
}
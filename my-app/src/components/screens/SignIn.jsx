import React, {useState, useContext}from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from "../../App";
import M from 'materialize-css';
function SignIn(){
    const{state,dispatch} = useContext(UserContext)
    const history = useHistory();
    const[password, setpassword] = useState("");
    const[email, setemail] = useState("");

    const postData = () =>{
        fetch("/signin", {
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                password,
                email
            })
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            if(data.error){
                M.toast({html: data.error, classes : "#b71c1c red darken-4"});
            }else{
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type : "USER", payload : data.user})
                M.toast({html : "Sign In success", classes : "#43a047 green darken-1"});
                history.push('/');
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    return(
    <div className = "mycard">
        <div className = "card auth-card input-field">
            <h2 className = "brand-logo">Instagram</h2>
            <input type = "email" placeholder = "email" value = {email} onChange = {(e) => setemail(e.target.value)} />
            <input type = "password" placeholder = "password"  value = {password} onChange = {(e) => setpassword(e.target.value)} />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() =>{postData()}}>SignIn</button>
            <h5><Link to ="/signup">Don't have an account ?</Link></h5>
        </div>
    </div>
    );
}

export default SignIn;
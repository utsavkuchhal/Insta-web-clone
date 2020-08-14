import React,{useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
function SignUp(){
    const history = useHistory();
    const[name, setname] = useState("");
    const[password, setpassword] = useState("");
    const[email, setemail] = useState("");
    const[image, setImage] = useState("");
    const[url , setUrl] = useState(undefined); 

    useEffect(() => {
        if(url){
            postData();
        }
    }, [url])


    const uploadData = () => {
        if(image){
            uploadImage();
        }else{
            postData();
        }
    }

    const postData = () =>{
        fetch("/signup", {
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                name,
                password,
                email,
                pic : url
            })
        })
        .then(res => res.json())
        .then(data =>{
            if(data.error){
                M.toast({html: data.error, classes : "#b71c1c red darken-4"})
            }else{
                M.toast({html : data.message, classes : "#43a047 green darken-1"});
                history.push('/signin');    
            }
        })
        .catch(err => {
            console.log(err);
        })
    }


    
    const uploadImage = () =>{
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name", "djbqlhith");
        fetch("https://api.cloudinary.com/v1_1/djbqlhith/image/upload",{
            method : "post",
            body:data
        })
        .then(res => res.json())
        .then(data => setUrl(data.url))
        .catch(err => console.log(err));
    }

    return(
        <div className = "mycard">
        <div className = "card auth-card input-field">
            <h2 className = "brand-logo">Instagram</h2>
            <input 
             type = "text"
             placeholder = "name" 
             value = {name} 
             onChange = {(e) => setname(e.target.value)}/>
            <input
             type = "email"
             placeholder = "email" 
             value = {email} 
             onChange = {(e) => setemail(e.target.value)} />
            <input 
            type = "password" 
            placeholder = "password" 
            value = {password} 
            onChange = {(e) => setpassword(e.target.value)} />
            <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Upload pic</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {uploadData}>SignUp</button>
            <h5><Link to ="/signin">Already have an account ?</Link></h5>
        </div>
    </div>
    );
}

export default SignUp;
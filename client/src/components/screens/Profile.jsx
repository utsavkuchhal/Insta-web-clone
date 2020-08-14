import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';

function Profile(){
    const[mypics, setpics] = useState([]);
    const{state,dispatch} = useContext(UserContext);
    const[image, setImage] = useState("");
    const[url , setUrl] = useState(undefined); 

    useEffect(() =>{
        fetch('/myposts',{
            headers : {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(result => {
            setpics(result.myposts);
        });
    });


    useEffect(() => {
        if(image){
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset","insta-clone");
            data.append("cloud_name", "djbqlhith");
            fetch("https://api.cloudinary.com/v1_1/djbqlhith/image/upload",{
                method : "post",
                body:data
            })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
                fetch('/updatepic',{
                    method : "put",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body : JSON.stringify({
                        pic : data.url
                    })
                })
                .then(res => res.json())
                .then(result => {
                    localStorage.setItem("user",JSON.stringify({...state, pic : result.pic}));
                    dispatch({type : "UPDATEPIC", payload : result.pic})
                    window.location.reload();
                })
            })
            .catch(err => console.log(err));
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file);
    }


    return(
    <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{
            margin:"18px 0px",
             borderBottom:"1px solid grey"
         }}>
            <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
                <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src= {state ? state.pic : "Loading..."}/>
                </div>
             
            <div>
            <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Upload pic</span>
                <input type="file" onChange={(e)=> updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
                <h4>{state ? state.name : "Loading.."}</h4>
                <h5>{state ? state.email : "Loading.."}</h5>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h5>{mypics.length} posts</h5>
                    <h5>{state ? state.followers.length :"0" } followers</h5>
                    <h5>{state ? state.following.length : "0"} following</h5>
                </div>
            </div>
            </div>
        </div>
        <div className = "gallery">
        {
            mypics.map((item) =>{
                return(
                <img className = "item" src= {item.photo} alt = {item.title} key = {item._id}/>
                )
            })
        }
        </div>
    </div>
    );
}

export default Profile;
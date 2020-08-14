import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom'
function UserProfile(){
    const[user, setProfile] = useState(null);
    const{state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const[showfollow, setfollow] = useState(state ? !state.following.includes(userid) : true);

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result)
        })
     },[]) 

     if(user != null){
         console.log(user);
         if(user.posts != null){
             console.log(user.posts);
         }
     }

     const followuser = () =>{
        fetch('/follow', {
            method : "put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                followId : userid 
            })  
        })
        .then(res => res.json())
        .then(result => {
            dispatch({type : "UPLOAD" , payload : {following : result.following, followers : result.followers}})
            localStorage.setItem("user", JSON.stringify(result))
            setProfile((prevState) =>{
                return(
                    {
                        ...prevState,
                        user : {
                            ...prevState.user,
                            followers : [...prevState.user.followers, result._id]
                        }
                    }
                )
            })
            setfollow(false);
            console.log(result)})
    }


    const unfollowuser = () =>{
        fetch('/unfollow', {
            method : "put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                unfollowId : userid 
            })  
        })
        .then(res => res.json())
        .then(result => {
            dispatch({type : "UPLOAD" , payload : {following : result.following, followers : result.followers}})
            localStorage.setItem("user", JSON.stringify(result))
            setProfile((prevState) =>{
                const newFollower = prevState.user.followers.filter(item => item !== result._id)
                return(
                    {
                        ...prevState,
                        user : {
                            ...prevState.user,
                            followers : newFollower
                        }
                    }
                )
            })
            setfollow(true);
            console.log(result)})
    }

    return(
        <> {user ? 
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
                   src= {user.user.pic}/>
                </div>
            <div>
                <h4>{user.user.name}</h4>
                <h5>{user.user.email}</h5>

                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h5>{user.posts.length} posts</h5>
                    <h5>{user.user.followers.length} followers</h5>
                    <h5>{user.user.following.length} following</h5>
                </div>
                {showfollow ? 
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => followuser()}>Follow</button>
                :
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick = {() => unfollowuser()}>unFollow</button>
                }
            </div>
            </div>
        </div>
        <div className = "gallery">
        {
            user.posts.map((item) =>{
                return(
                <img className = "item" src= {item.photo} alt = {item.title} key = {item._id}/>
                )
            })
        }
        </div>
    </div>
    : <h2>loading...!</h2>}
    </>
    );
}

export default UserProfile;
import React,{useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App' 

function Navbar(){
    const  history = useHistory();
    const{state, dispatch} = useContext(UserContext);
    const  RenderList = () =>{
      if(state !== null){
        return[
          <li key = "1"><Link to="/profile">Profile</Link></li>,
          <li key = "2"><Link to="/createpost">Create Post</Link></li>,
          <li key = "10"><Link to="/myfollowingpost">My Following Posts</Link></li>,
          <li key = "3"> <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
           onClick = {() => {
            localStorage.clear()
            dispatch({type : "CLEAR"})
            history.push('/signin');
           }}>LogOut</button></li>
        ]
      }else{
        return[
          <li key = "4"><Link to="/signin">SignIn</Link></li>,
          <li key = "5"><Link to="/signup">SignUp</Link></li>
        ]
      }
    }
    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to= {state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {RenderList()}
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;
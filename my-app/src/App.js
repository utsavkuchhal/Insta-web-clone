import React, {useReducer, createContext, useEffect, useContext} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {Route, BrowserRouter, Switch, useHistory} from "react-router-dom";
import Home from './components/screens/Home';
import Signin from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import Signup from './components/screens/SignUp';
import CreatePost from './components/screens/CreatePost';
import {reducer,initialState} from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import Myfollowingpost from './components/screens/SubscribesUserPosts'

export const UserContext = createContext();

const Routing  = () =>{
  const history = useHistory();
  const{state,dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type : "USER", payload : user})
    }else{
      history.push('/signin')
    } 
  },[])
  return(
    <Switch>
    <Route exact path = '/'>
    <Home />
  </Route>
  <Route path = '/signin'>
    <Signin />
  </Route>
  <Route exact path = '/profile'>
    <Profile />
  </Route>
  <Route exact path = '/profile/:userid'>
    <UserProfile />
  </Route>
  <Route path = '/signup'>
    <Signup />
  </Route>
  <Route path = '/createpost'>
    <CreatePost />
  </Route>
  <Route path = '/myfollowingpost'>
    <Myfollowingpost />
  </Route>

  </Switch>
  );
}
function App() {

  const [state, dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value = {{state ,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

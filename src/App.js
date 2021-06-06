import "./App.css";
import React, {useState, useEffect} from "react";
import Post from "./Components/post/Post";
import {db, auth} from "./firebase";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import {Button, Input} from "@material-ui/core";
import ImageUploder from "./ImageUploder";
import "./Components/NavBar/NavBar.css";




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {top: `${top}%`, left: `${left}%`, transform: `translate(-${top}%, -${left}%)`};
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));






function App() {
  const [posts,
    setPosts] = useState([]); //update the data
  const classes = useStyles(); // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open,
    setOpen] = useState(false);
  const [openSignIn,
    setOpenSignIn] = useState(false);
  const [username,
    setUsername] = useState("");
  const [password,
    setPassword] = useState("");
  const [email,
    setEmail] = useState("");
  const [user,
    setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has loged in....
        console.log(authUser);
        setUser(authUser);
      } else {
        //user not loged out..
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    //return the data from server
    db
        
        .collection("posts").orderBy('timestamp', 'desc')
      .onSnapshot((Snapshot) => {
        setPosts(Snapshot.docs.map((doc) => ({
          id: doc.id,
          posts: doc.data()
        })));
      });
  }, []);

  const signUp = (event) => {
    //signup method..
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser
          .user
          .updateProfile({displayName: username});
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };





  const signIn = (event) => {
    //sign in ...
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((error) => alert(error.message));
    setOpenSignIn(false)
  }

  return (
    <div className="App">
      <Modal className= 'modalc'  open={open} onClose={() => setOpen(false)}>
        <div id='divc' style={modalStyle} className={classes.paper}>
          <form action="" className="appsignup">
            <center>
              <h3 className="instyle">koch myran</h3>
                      
            <Input className="instyle"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}/>
            <Input className="instyle"
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            <Input className="instyle"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/></center> 
            <button className="button_inside" type="submit" onClick={signUp}>
              Sign up
            </button>
          </form>
        </div>
      </Modal>
      <Modal className= 'modalc' open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div id='divc' style={modalStyle} className={classes.paper}>
          <form action="" className="appsignup">
            <center>
              <h3 className="instyle">koch myran</h3>
            <Input
            className="instyle"
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            <Input className="instyle"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}/></center>
            <button className="button_inside" type="submit" onClick={signIn}>
              Sign In
            </button>
          </form>
        </div>
      </Modal>

      <div className='navbar'>
        
        <h1 className='titlename'>Koch Myran</h1>

        {user
          ? (
            <Button className='buttonset' onClick={() => auth.signOut()}>Sign out</Button>
          )
          : (
            <div className="applogincontainer">
              <Button className='buttonset' onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button className='buttonset' onClick={() => setOpen(true)}>Sign up</Button>
            </div>

          )}

      </div>

      <div className="apppost">
        <div>
      {posts.map(({id, posts}) => (<Post
        key={id}
        user={user}
        postId = {id}
        caption={posts.caption}
        imageurl={posts.imageurl}
        username={posts.username}/>))
      }
       </div> 
      </div>
     
      
      {user
        ?.displayName
          ? (<ImageUploder username={user.displayName}/>)
          : (
            <h3>login to upload</h3>
          )}
    </div>
  );
}

export default App;

import React, {useEffect, useState} from 'react';
import './post.css';
import firebase from 'firebase';
import Avatar from '@material-ui/core/Avatar';
import {db} from '../../firebase';

function Post({postId, user, username, imageurl, caption}) {

  const [comments,
    setComments] = useState([]);

  const [comment,
    setComment] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        });
    };
    return () => {
      unsubscribe();
    };

  }, [postId])

  const postComment = (event) => {
    event.preventDefault();
    db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({
        text: comment,
        username: user.displayName,
        timestamp: firebase
          .firestore
          .FieldValue
          .serverTimestamp()
      });
    setComment('');

  }

  return (
    <center>
      <div className='post'>
        <div className="headerpost">
          <Avatar
            className='avatarimage'
            alt="abhijith"
            src="https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YW5vbnltb3VzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"/>
          <h3 className='username'>{username}</h3>
        </div>
        <img className='postimg' src={imageurl} alt=" "/>
        <h4 className='posttxt'>
          <strong>{username}
            :
          </strong>{caption}</h4>
        <div className="postComment">
          {comments.map((comment) => <p>
            <b>{comment.username}
              :
            </b>{comment.text}
          </p>)}
        </div>
        {user && (
          <form className="postcommentbox">
            <input
              className='postinput'
              placeholder="comment..."
              value={comment}
              type="text"
              onChange={(e) => setComment(e.target.value)}/>
            <button
              className="postbutton"
              disabled={!comment}
              type="submit"
              onClick={postComment}>post</button>

          </form>
        )}

      </div>
    </center>
  )
}

export default Post

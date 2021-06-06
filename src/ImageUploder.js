
import React, {useState} from "react";
import firebase from "firebase";
import {db, storage} from "./firebase";
import "./imageUploder.css";

function ImageUploder({username}) {
  const [caption,
    setCaption] = useState('');
  const [progress,
    setProgress] = useState(0);
  const [image,
    setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);

    }
  };
  const handleUpload = () => {
    const uploadTask = storage
      .ref(`images/${image.name}`)
      .put(image);
    uploadTask.on("state_changed", (snapshot) => {
      //progress function..
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setProgress(progress);
    }, (error) => {
      console.log(error)
      alert(error.message)
    }, () => {
      //complete function..
      storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then(url => {
          //post image inside db..
          db
            .collection("posts")
            .add({
              timestamp: firebase
                .firestore
                .FieldValue
                .serverTimestamp(),
              caption: caption,
              imageurl: url,
              username: username

            });
            setProgress(0);
            setCaption("");
            setImage(null);
        });
    });

  };
  return (
    <div className="imageuploder">
      {/*input caption field */}
      
      <progress className="imageuploadprogress" value={progress} max="100"/>
      <input className='buttonstyle' type="file" onChange={handleChange}/>
      <input
      className='buttonstyle'
        type="text"
        placeholder='caption ...'
        onChange={(event) => setCaption(event.target.value)}
        value={caption}/>
      
      <button className='buttonstyle' onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUploder;

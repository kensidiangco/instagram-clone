import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import firebase from "firebase";
import { storage, db } from './firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const [caption, setCaption] = useState('');

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image)

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
				.ref("images")
				.child(image.name)
				.getDownloadURL()
				.then(url => {

					db.collection("posts").add({
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
						caption: caption,
						imageUrl: url,
						username: username
					})
					setCaption('')
					setImage(null)
					setProgress(0)
				})
			}
		)
	}

	return (
		<div className="ImageUpload">
			<progress value={progress} className="upload__progress" max="100" />
			<input 
				type="text" 
				placeholder="Input caption here..."  
				className="upload__input" 
				onChange={event => setCaption(event.target.value)} value={caption} 
			/>
			<center>
				<input type="file" onChange={handleChange} />
			</center>
			<Button onClick={handleUpload}>
				Post
			</Button>
		</div>
	);
}

export default ImageUpload;
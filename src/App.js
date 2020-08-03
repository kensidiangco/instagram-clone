import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import logo from './ken.png'
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/Styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


function GetModalStyle() {
	const top = 50;
	const left = 50;

	return{
		top: `${top}%`,
	    left: `${left}%`,
	    transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: "auto",
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = useState(GetModalStyle);

	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				setUser(null);
			}
		})

		return () => {
			unsubscribe()
		}
	}, [user, username]);

	useEffect(() => {
		db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot => {
			setPosts(snapshot.docs.map(doc => ({
				id: doc.id,
				post: doc.data()
			})));
		})
	}, [])

	const signUp = (event) => {
		event.preventDefault();

		auth
		.createUserWithEmailAndPassword(email, password)
		.then((authUser) => {
			return authUser.user.updateProfile({
				displayName: username
			})
		})
		.catch((error) => alert(error.message))

		setEmail('');
		setPassword('');
		setOpen(false);
	}

	const signIn = (event) => {
		event.preventDefault();

		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message))

		setEmail('');
		setPassword('');
		setOpenSignIn(false);
	}

	return (
	    <div className="app">
	    	<Modal
		        open={open}
		        onClose={() => setOpen(false)}
		        aria-labelledby="simple-modal-title"
		        aria-describedby="simple-modal-description"
		    >
		        <div style={modalStyle} className={classes.paper}>
			    	<center>
	        			<img className="app__logo" src={logo} alt={logo}></img>
	      				
	        			<form className="app__signup">
		      				<Input
					      		placeholder="username"
					      		type="text"
					      		value={username}
					      		onChange={(e) => setUsername(e.target.value)}
					      	/>
		      				<Input
					      		placeholder="email"
					      		type="text"
					      		value={email}
					      		onChange={(e) => setEmail(e.target.value)}
					      	/>
					      	<Input
					      		placeholder="password"
					      		type="password"
					      		value={password}
					      		onChange={(e) => setPassword(e.target.value)}
					      	/>
					      	<Button type="submit" onClick={signUp}>Sign up</Button>
	      				</form>
	      			</center>
			    </div>
		    </Modal>

		    <Modal
		        open={openSignIn}
		        onClose={() => setOpenSignIn(false)}
		        aria-labelledby="simple-modal-title"
		        aria-describedby="simple-modal-description"
		    >
		        <div style={modalStyle} className={classes.paper}>
			    	<center>
	        			<img className="app__logo" src={logo} alt={logo}></img>
	      				
	        			<form className="app__signup">
		      				<Input
					      		placeholder="email"
					      		type="text"
					      		value={email}
					      		onChange={(e) => setEmail(e.target.value)}
					      	/>
					      	<Input
					      		placeholder="password"
					      		type="password"
					      		value={password}
					      		onChange={(e) => setPassword(e.target.value)}
					      	/>
					      	<Button type="submit" onClick={signIn}>Sign in</Button>
	      				</form>
	      			</center>
			    </div>
		    </Modal>

	      	<div className="app__header">
	      		<img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram"></img>
	        	<img className="app__logo" src={logo} alt={logo}></img>
	        	<div className="app__login">
		        	{user ? (
					<Button onClick={() => auth.signOut()} >Logout</Button>
					): (
						<div className="app__loginContainer">
							<Button onClick={() => setOpenSignIn(true)} >Sign in</Button>
							<Button onClick={() => setOpen(true)} >Sign up</Button>
						</div>
					)}
				</div>
	      	</div>
	      	<div className="app__upload">
		      	{user ? (
		    		<ImageUpload username={user.displayName} />
		    	): (
		    		<h3 className="logintopost">Login to post.</h3>
		    	)}
		    </div>
	      	<div className="app__posts">
	      		<div>
			      	{posts.map(({id, post}) => (
			      		<Post user={user} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
			      	))}
			    </div>
		    </div>
    	</div>
  	);
}

export default App;

<script>
	import { FirebaseApp } from "sveltefire";
	import firebase from "firebase/app";
	import "firebase/firestore";
	import "firebase/analytics";
	import Router from 'svelte-spa-router'
	import routes from './Routes.js';

	let firebaseConfig = {
		apiKey: "AIzaSyDGc9u7-mrkj8EEnEr7zpuTQZ5yc0PdhtM",
		authDomain: "pyramide-b51b2.firebaseapp.com",
		databaseURL: "https://pyramide-b51b2.firebaseio.com",
		projectId: "pyramide-b51b2",
		storageBucket: "pyramide-b51b2.appspot.com",
		messagingSenderId: "991905535938",
		appId: "1:991905535938:web:bbe55889f0b9dcbf63285b",
		measurementId: "G-DV35N319WS"
	};
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();
</script>

<h1 id="app-name"><a href="/">Pyramide</a></h1>
<FirebaseApp {firebase}>
	<Router {routes}/>
</FirebaseApp>

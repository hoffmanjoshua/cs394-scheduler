import { initializeApp } from "firebase/app";
import { useState, useEffect } from "react";
import { getDatabase, onValue, ref, set } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyAEGXeUFCowk8341C0DZ0ZqU_utvbTRcDA",
	authDomain: "cs394-scheduler-e3f97.firebaseapp.com",
	databaseURL: "https://cs394-scheduler-e3f97-default-rtdb.firebaseio.com",
	projectId: "cs394-scheduler-e3f97",
	storageBucket: "cs394-scheduler-e3f97.appspot.com",
	messagingSenderId: "442130159499",
	appId: "1:442130159499:web:9474dc24712b54cc7fc18e",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	useEffect(() => {
		const dbRef = ref(database, path);
		const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
		if (devMode) {
			console.log(`loading ${path}`);
		}
		return onValue(
			dbRef,
			(snapshot) => {
				const val = snapshot.val();
				if (devMode) {
					console.log(val);
				}
				setData(transform ? transform(val) : val);
				setLoading(false);
				setError(null);
			},
			(error) => {
				setData(null);
				setLoading(false);
				setError(error);
			}
		);
	}, [path, transform]);

	return [data, loading, error];
};

export const setData = (path, value) => set(ref(database, path), value);

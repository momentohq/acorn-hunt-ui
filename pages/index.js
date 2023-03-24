
import Head from 'next/head';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SignIn from '../components/SignIn/SignIn';

const baseUrl = 'https://ve42pfi5og.execute-api.us-east-1.amazonaws.com/demo';

function Home() {
	const router = useRouter();
	const [authToken, setAuthToken] = useState('');
	const [username, setUsername] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const storedUsername = localStorage.getItem('AH-username');
		if (storedUsername) {
			setUsername(storedUsername);
		}

		const token = localStorage.getItem('AH-authToken');
		if (token) {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const decoded = JSON.parse(Buffer.from(base64, 'base64').toString());
			if ((decoded.exp * 1000) > Date.now()) {
				setAuthToken(token);
			} else {
				authenticate(storedUsername);
			}
		}
	}, []);

	const authenticate = async (name) => {
		fetch(`${baseUrl}/authenticate`, {
			method: 'POST',
			body: JSON.stringify({
				username: name
			})
		}).then(response => response.json())
			.then(response => {
				setAuthToken(response.authToken);
				localStorage.setItem('AH-authToken', response.authToken);
			});
	};

	const onLogin = async (username) => {
		setIsLoading(true);
		await authenticate(username);
		setIsLoading(false);
	};

	if (authToken == '' && !isLoading) {
		return (
			<div>
				<Head>
					<title>Sign In | Acorn Hunt</title>
				</Head>
				<SignIn onLogin={onLogin} />
			</div>
			
		)
	} else if (!authToken && isLoading) {
		return (
			<div />
		)
	}
	else {
		router.push('/games');
	}
}

export default Home;

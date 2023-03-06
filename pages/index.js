import {
	Button,
	Flex,
	Link,
	Text,
	TextField,
	View,
} from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import GameList from '../components/GameList/GameList';
import SignIn  from '../components/SignIn/SignIn';

const baseUrl = 'https://jprc0jj2tb.execute-api.us-east-1.amazonaws.com/demo';

function Home() {
	const router = useRouter();
	const [authToken, setAuthToken] = useState('');
	const [username, setUsername] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault()

		fetch(`${baseUrl}/authenticate`, {
			method: 'POST',
			body: JSON.stringify({
				username: username
			})
		})
			.then(response => response.json())
			.then(response => {
				setAuthToken(response.authToken);
				setUsername(e.target.username.value);
			});		
	};	

	const onLogin = async (username) => {
		setIsLoading(true);
		const response = await fetch(`${baseUrl}/authenticate`, {
			method: 'POST',
			body: JSON.stringify({
				username: username
			})
		});

		const loginResponse = await response.json();
		setAuthToken(loginResponse.authToken);
		setIsLoading(false);
	};

	if (authToken == '' && !isLoading) {
		return (
			<SignIn onLogin={onLogin}/>
		)
	} else if(!authToken && isLoading){
		return (
			<div />
		)
	}
	else {
		return (
			<GameList authToken={authToken} />			
		)
	}
}

export default Home;

import { Flex, View } from '@aws-amplify/ui-react'
import Head from 'next/head';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useWebSocket from 'react-use-websocket';
import Chat from '../../components/Chat/Chat';
import PlayerList from '../../components/Chat/PlayerList';
import Map from '../../components/Map/Map';

const socketBaseUrl = 'wss://6wpfu6sgk1.execute-api.us-east-1.amazonaws.com/demo';
const baseUrl = 'https://pmizqmbanw.us-east-1.awsapprunner.com';

function GamePage({ }) {
	const router = useRouter();

	const [messages, setMessages] = useState([]);
	const [players, setPlayers] = useState([]);
	const [gameName, setGameName] = useState('Loading...');
	const [gameTitle, setGameTitle] = useState('Loading Game...');
	const [username, setUsername] = useState('');
	const [authToken, setAuthToken] = useState('');
	const [socketUrl, setSocketUrl] = useState(socketBaseUrl);
	const [avatar, setAvatar] = useState('');

	useEffect(() => {
		setAuthToken(localStorage.getItem('AH-authToken'));
		const storedUsername = localStorage.getItem('AH-username');
		setUsername(storedUsername);
	}, []);

	useEffect(() => {
		if (username) {
			setAvatar(username.charAt(0).toUpperCase());
		} else {
			setAvatar('');
		}
	}, [username]);

	useEffect(() => {
		setSocketUrl(`${socketBaseUrl}?access_token=${authToken}`);
	}, [authToken]);


	const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
		onOpen: () => loginToGame(router.query.gameId),
		onMessage: (event) => processMessage(event)
	});


	const loginToGame = (gameId) => {
		async function joinGame() {
			const response = await fetch(`${baseUrl}/games/${gameId}/players`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});

			const gameDetails = await response.json();

			handleGameJoined(gameDetails.players, gameDetails.messages);
			setUsername(gameDetails.username);
			setGameName(gameDetails.name);
			setGameTitle(`${gameDetails.name} | Acorn Hunt`);
		};

		joinGame();
	}

	const processMessage = (event) => {
		const message = JSON.parse(event.data);
		if (!message.type) return;

		switch (message.type.toLowerCase()) {
			case 'new-message':
				handleNewMessage(message.username, message.message, message.time);
				break;
			case 'player-joined':
				handlePlayerChange(message.message, message.username, message.time, true);
				break;
			case 'player-left':
				handlePlayerChange(message.message, message.username, message.time);
				break;
			case 'game-joined':
				handleGameJoined(message.players, message.messages);
				setUsername(message.username);
				setGameName(message.name);
				setGameTitle(`${message.name} | Acorn Hunt`);
				break;
		}
	}

	const handleGameJoined = (players, messages) => {
		const chatHistory = [];
		messages.map((m, index) => {
			const key = `${m.type}#${m.time}`;
			if (!chatHistory.some(ch => ch.key == key)) {
				chatHistory.unshift({
					id: index,
					key,
					content: {
						text: m.message
					},
					...(m.type == 'new-message') && { owner: m.username },
					...m.time && { createdAt: m.time }
				});
			}
		});
		setMessages(chatHistory);
		setPlayers(players);
	};

	const handleNewMessage = (messageUsername, message, time) => {
		const newMessage = {
			id: messages.length + 1,
			owner: messageUsername,
			content: {
				text: message
			},
			createdAt: time,
			time
		};
		
		setMessages([newMessage, ...messages]);
	};

	const handlePlayerChange = (message, username, time, didJoin) => {
		const key = `${username}#${time}#${didJoin}`;
		const playerChangeMessage = {
			key,
			id: message.length + 1,
			content: {
				text: message
			},
			time
		};

		if (!messages.some(m => m.key == key)) {			
			setMessages([playerChangeMessage, ...messages]);
		}

		if (didJoin) {
			if (!players.includes(username)) {
				players.push(username);
				players.sort();
				setPlayers(players);
			}
		} else {
			setPlayers(players.filter(p => p != username));
		}
	};

	const handleGoBack = () => {
		async function leaveGame() {
			await fetch(`${baseUrl}/games/${router.query.gameId}/players`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});

			router.push(`/games`);
		}

		leaveGame();
	};

	return (
		<>
			<View>
				<Head>
					<title>{gameTitle}</title>
				</Head>
				<Flex direction="column">
					<Flex direction="row" alignItems="center" color={'white'} backgroundColor={'#0E2515'} fontSize="1.5rem" padding={'small'}>
						<div style={{ marginLeft: '1rem', cursor: 'pointer' }} onClick={handleGoBack}>&#8592;</div>
						<div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>{gameName}</div>
						<div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
							<div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#00C88C', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{avatar}</div>
						</div>
					</Flex>
					<Flex direction="row" >
						<View style={{ flexBasis: '80%', paddingLeft: '1em' }}>
							<Map width={10} height={10} specialTiles={[{ x: 3, y: 5, type: 'tree' }, { x: 7, y: 1, type: 'tree' }, { x: 2, y: 8, type: 'tree' }]} />
						</View>
						<Flex direction="column" style={{ flexBasis: '20%' }} border='2px solid #000' borderRadius='15px' margin='0 .5em'>
							<PlayerList players={players} username={username} />
							<Chat gameId={router.query.gameId} messages={messages} username={username} readyState={readyState} sendJsonMessage={sendJsonMessage} setMessages={setMessages} />
						</Flex>
					</Flex>
				</Flex>
			</View>
		</>
	)
}

export default GamePage

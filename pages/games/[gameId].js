import { Flex, Heading, useTheme, View } from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { InputArea } from '../../components/InputArea'
import { MessageList } from '../../components/Message'
import { ConversationBar } from '../../components/ConversationBar'
import { useRouter } from 'next/router'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import styles from './[gameId].module.css';

const socketUrl = 'wss://e3gxgnmytj.execute-api.us-east-1.amazonaws.com/demo'

function GamePage({ }) {
	const { tokens } = useTheme()
	const router = useRouter()

	const { sendJsonMessage, lastMessage, readyState } = useWebSocket(`${socketUrl}?access_token=${router.query.auth}`, {
		onOpen: () => loginToGame(router.query.gameId),
		onMessage: (event) => processMessage(event)
	});

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Connected',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Disconnected',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	const [messages, setMessages] = useState([]);
	const [gameName, setGameName] = useState('Loading...');
	const [username, setUsername] = useState('');


	const loginToGame = (gameId) => {
		sendJsonMessage({
			action: 'join-game',
			gameId: gameId
		});
	}

	const processMessage = (event) => {
		const message = JSON.parse(event.data);
		if (!message.type) return;

		switch (message.type.toLowerCase()) {
			case 'new-message':
				handleNewMessage(message.username, message.message, message.time);
				break;
			case 'player-change':
				handlePlayerChange(message.message);
				break;
			case 'game-joined':
				handleGameJoined(message.players, message.messages);
				setUsername(message.username);
				setGameName(message.name);
				break;
		}
	}

	const handleGameJoined = (players, messages) => {
		const chatHistory = [];
		messages.map((m, index) => {
			chatHistory.unshift({
				id: index,
				content: {
					text: m.message
				},
				...m.username && { owner: m.username },
				...m.time && { createdAt: m.time }
			});
		});

		setMessages(chatHistory);
	};

	const handleNewMessage = (messageUsername, message, time) => {
		const newMessage = {
			id: messages.length + 1,
			owner: messageUsername,
			content: {
				text: message
			},
			createdAt: time
		};

		setMessages([newMessage, ...messages]);
	};

	const handlePlayerChange = (message) => {
		const playerChangeMessage = {
			id: message.length + 1,
			content: {
				text: message
			}
		};

		setMessages([playerChangeMessage, ...messages]);
	};

	const handleMessageSend = async (newMessage) => {
		sendJsonMessage({
			action: 'send-message',
			gameId: router.query.gameId,
			message: newMessage
		});

		const message = {
			id: messages.length + 1,
			owner: username,
			content: {
				text: newMessage
			},
			createdAt: new Date()
		};

		setMessages([message, ...messages]);
	};

	const handleGoBack = () => {
		router.push('/');
	}

	return (
		<>
			<View>
				<Flex direction={{ base: 'column', medium: 'row' }}>
					<View flex={{ base: 0, medium: 1 }}>
						<View margin="0 auto" maxWidth={{ base: '95vw', medium: '100vw' }}>
							<Heading
								style={{ borderBottom: '1px solid black' }}
								padding={tokens.space.small}
								textAlign={'center'}
								level={3}
								color={'#25392B'}
							>
								{gameName}
							</Heading>
							<Flex direction="column" height="85vh">
								<MessageList messages={messages} myUsername={username} />
								<InputArea onMessageSend={handleMessageSend} connectionStatus={connectionStatus} />
							</Flex>
						</View>
					</View>
					<div className={styles['back-arrow']} onClick={handleGoBack}>
						&#8592;
					</div>
				</Flex>
			</View>
		</>
	)
}

export default GamePage

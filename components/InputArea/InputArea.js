import {
	Button,
	Flex,
	TextAreaField,
	TextField,
	Text,
	View,
} from '@aws-amplify/ui-react'
import { useState } from 'react'
import Status from './Status';

export const InputArea = ({ onMessageSend, connectionStatus }) => {
	const [messageText, setMessageText] = useState('');

	const handleFormSubmit = async (e) => {
		e.preventDefault()
		let key

		onMessageSend(messageText.trim(), key)
		setMessageText('')
	}

	const handleKeyUp = (e) => {
		if (e.key === 'Enter') {
			handleFormSubmit(e);
		}
	};

	return (
		<View
			style={{
				borderTop: '1px solid lightgray',
				padding: '5px',
			}}
		>
			<Status status={connectionStatus}/>
			<View>
				<form onSubmit={handleFormSubmit}>
					<Flex justifyContent={'space-between'} alignItems={'center'}>
						<TextAreaField
							height="3.5em"
							width="100%"
							padding="0"
							placeholder="type a message..."
							backgroundColor="white"
							onChange={(e) => {
								setMessageText(e.target.value)
							}}
							onKeyUp={handleKeyUp}
							value={messageText}
							disabled={connectionStatus !== 'Connected'}
						/>
						<Button variation="primary" type="submit" height="3em" width="6em" marginTop=".5em" disabled={connectionStatus !== 'Connected'}>
							Send
						</Button>
					</Flex>
					<hr />
				</form>
			</View>
		</View>
	)
}

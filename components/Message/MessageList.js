import { Flex } from '@aws-amplify/ui-react'
import { MessageItem, SystemMessage } from './index'
import { useRef, useEffect } from 'react';

export const MessageList = ({ messages = [], myUsername }) => {
	const contentRef = useRef(null);
	useEffect(() => {
		const content = contentRef.current;
		content.scrollTop = content.scrollHeight;
	}, [messages]);
	return (
		<Flex
			flex="1"
			backgroundColor="white"
			style={{ overflowY: 'scroll' }}
			direction="column-reverse"
			borderRadius={'5px'}
			padding=".8em"
			ref={contentRef}
		>
			{messages.map((msg) => (

				msg.owner ? (
					<MessageItem key={msg.id} msg={msg} myUsername={myUsername} />
				) : (
					<SystemMessage key={msg.id} msg={msg} />
				)
			))}
		</Flex>
	)
}

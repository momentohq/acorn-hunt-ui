import {
	Card,
	Flex,
	Heading,
	Image,
	Text,
	useTheme,
	View,
} from '@aws-amplify/ui-react'

export const MessageItem = ({ msg = {}, myUsername }) => {
	const { tokens } = useTheme()

	const isMyMsg = msg.owner === myUsername;
	const isEdited = msg.createdAt !== msg.updatedAt;

	const date = new Date(msg.createdAt);

	return (
		<Card
			borderRadius={tokens.radii.small}
			variation="elevated"
			alignSelf={isMyMsg ? 'end' : 'start'}
			width={{ base: '300px', medium: '450px' }}
			backgroundColor={isMyMsg ? '#C4F135' : '#DDDDDD'}			
		>
			<Flex>
				{msg.avatar &&
					<Image
						borderRadius={tokens.radii.small}
						src={`https://github.com/${msg.owner}.png`}
						height="50px"
						width={'50px'}
						alt="avatar"
					/>}

				<View>
					<Flex>
						<Heading level={5} color={'black'}>
							{msg.owner}{' '}
							<Text
								as="span"
								color={'black'}
								fontSize={'12px'}
								fontWeight="normal"
							>
								{date.toLocaleTimeString( { hour: 'numberic', minute: '2-digit' })}
							</Text>
						</Heading>
					</Flex>

					<TextMessage
						isMyMsg={isMyMsg}
						msgContent={msg.content.text}
						isEdited={isEdited}
					/>
				</View>
			</Flex>
		</Card>
	)
}

const TextMessage = ({ isMyMsg, msgContent, isEdited }) => {
	return (
		<Text display={'inline'} color={'black'}>
			{msgContent}{' '}
		</Text>
	)
};
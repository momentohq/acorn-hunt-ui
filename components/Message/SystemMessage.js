import { Text } from '@aws-amplify/ui-react'

export const SystemMessage = ({ msg }) => {
	return (
		<Text display={'inline'} width={{ base: '250px', medium: '375px' }} color="#25392B">
			{msg.content.text.toUpperCase()}
		</Text>
	)
}
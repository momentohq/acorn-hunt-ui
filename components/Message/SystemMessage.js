import { Text } from '@aws-amplify/ui-react'

export const SystemMessage = ({ msg }) => {
	return (
		<Text display={'inline'} width={{ base: '300px', medium: '450px' }} color="#25392B">
			{msg.content.text.toUpperCase()}
		</Text>
	)
}
import {
	Card,
	Flex,
	Heading,
	Image,
	Text,
	useTheme,
	View,
} from '@aws-amplify/ui-react'

export const SystemMessage = ({ msg }) => {
	return (
    <Text display={'inline'} width={{ base: '300px', medium: '450px'}} color="red">
			{msg.content.text.toUpperCase()}
		</Text>		
	)
}
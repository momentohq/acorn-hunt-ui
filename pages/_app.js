import { AmplifyProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	return (
		<AmplifyProvider>
			<div id="modal-root"></div>
			<Component {...pageProps} />			
		</AmplifyProvider>
	)
}

export default MyApp

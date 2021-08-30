import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { ChakraProvider } from '@chakra-ui/react'

import MiddleWare from './MiddleWare'
import { ProvideMiddle } from './store/useMiddle'

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider>
			<ProvideMiddle>
				<MiddleWare />
			</ProvideMiddle>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

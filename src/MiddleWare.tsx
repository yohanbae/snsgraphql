import React, { useState, createContext } from 'react'
import { ProvideAuth } from './store/useStore'
import { Provider } from 'urql'
import Routes from './Routes'
import { useMiddle } from './store/useMiddle'

const MiddleWare = () => {
	const middle = useMiddle()

	return (
		<Provider value={middle?.client}>
			<ProvideAuth>
				<Routes />
			</ProvideAuth>
		</Provider>
	)
}

export default MiddleWare

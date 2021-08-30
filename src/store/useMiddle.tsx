import React, { useState, useEffect, useContext, createContext } from 'react'
import { createClient } from 'urql'

interface Middle {
	client: any | null
	refreshClient: (token: string) => void
	logoutClient: () => void
}

const middleContext = createContext<Middle | null>(null)

export const ProvideMiddle: React.FC = ({ children }) => {
	const middle = useProvideMiddle()
	return (
		<middleContext.Provider value={middle}>{children}</middleContext.Provider>
	)
}

export const useMiddle = () => {
	return useContext(middleContext)
}

const useProvideMiddle = () => {
	const getToken = () => {
		if (localStorage.getItem('TOKEN_SNSGRAPHQL')) {
			return localStorage.getItem('TOKEN_SNSGRAPHQL')
		} else {
			return null
		}
	}

	const [client, setClient] = useState<any | null>(() => {
		const token = getToken()
		let headers = {}
		if (typeof token === 'string') {
			headers = {
				'X-Parse-Application-Id': process.env.REACT_APP_ID,
				'X-Parse-Client-Key': process.env.REACT_APP_CLIENT,
				'X-Parse-Session-Token': `${token}`,
			}
		} else {
			headers = {
				'X-Parse-Application-Id': process.env.REACT_APP_ID,
				'X-Parse-Client-Key': process.env.REACT_APP_CLIENT,
			}
		}

		return createClient({
			url: 'https://parseapi.back4app.com/graphql',
			fetchOptions: () => {
				return {
					headers: headers,
				}
			},
		})
	})

	// const [client, setClient] = useState<any | null>(null)

	const refreshClient = async (token: string) => {
		setClient(() => {
			const appid:any = process.env.REACT_APP_ID
			const clientid:any = process.env.REACT_APP_CLIENT
			return createClient({
				url: 'https://parseapi.back4app.com/graphql',
				fetchOptions: () => {
					return {
						headers: {
							'X-Parse-Application-Id': appid,
							'X-Parse-Client-Key': clientid,
							'X-Parse-Session-Token': `${token}`,
						},
					}
				},
			})
		})
	}

	const logoutClient = async () => {
		setClient(() => {
			const appid:any = process.env.REACT_APP_ID
			const clientid:any = process.env.REACT_APP_CLIENT
			return createClient({
				url: 'https://parseapi.back4app.com/graphql',
				fetchOptions: () => {
					return {
						headers: {
							'X-Parse-Application-Id': appid,
							'X-Parse-Client-Key': clientid,
						},
					}
				},
			})
		})
	}

	useEffect(() => {
		// const unsubscribe = base.auth().onAuthStateChanged((user) => {
		//     if (user) {
		//       setUser(user);
		//     } else {
		//       setUser(false);
		//     }
		// });
		// // Cleanup subscription on unmount
		// return () => unsubscribe();
	}, [])

	return { client, refreshClient, logoutClient }
}

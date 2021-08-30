import React, { useState, useEffect, useContext, createContext } from 'react'
import { useMutation } from 'urql'
import { useMiddle } from './useMiddle'

interface MyUser {
	user: string | null
	clientId: string | null
	isLogin: () => string | boolean
	isSameUser: (username: string) => boolean
	login: (username: string, password: string) => void
	logout: () => void
	signup: (email: string, username: string, password: string) => void
	refreshClient: () => void
}

const authContext = createContext<MyUser | null>(null)

const SIGNUP_QUERY = `
mutation($email:String!, $username:String!, $password:String!) {
  signUp(input: {
    fields: {
      email: $email
      username: $username
      password: $password
    } 
  }) {
    viewer{
      user{
        username
				objectId
      }
      sessionToken
    }
  }
}
`

const LOGIN_QUERY = `
mutation Login($username:String!, $password:String!){
  logIn(input: {
    username: $username
    password: $password
  }) {
		viewer {
      user {
        username
        objectId
      }
      sessionToken
    }
  }
}
`

const LOGOUT_QUERY = `
mutation logOutButton($objectId: String!) {
	logOut(input: { clientMutationId: $objectId }) {
		clientMutationId
	}
}
`

export const ProvideAuth: React.FC = ({ children }) => {
	const auth = useProvideAuth()
	return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
	return useContext(authContext)
}

const useProvideAuth = () => {
	const middle = useMiddle()

	const [user, setUser] = useState<string | null>(() => {
		if (localStorage.getItem('USER_SNSGRAPHQL')) {
			const meme: string | null = localStorage.getItem('USER_SNSGRAPHQL')
			if (meme) {
				const therow = JSON.parse(meme)
				return therow.username
			}
		}
		return null
	})
	const [clientId, setClientId] = useState<string | null>(() => {
		if (localStorage.getItem('USER_SNSGRAPHQL')) {
			const meme: string | null = localStorage.getItem('USER_SNSGRAPHQL')
			if (meme) {
				const therow = JSON.parse(meme)
				return therow.objectId
			}
		}
		return null
	})

	const isLogin = () => {
		if (localStorage.getItem('TOKEN_SNSGRAPHQL')) {
			return JSON.stringify(localStorage.getItem('TOKEN_SNSGRAPHQL'))
		} else {
			return false
		}
	}

	const isSameUser = (username: string) => {
		if (user === username) {
			return true
		} else {
			return false
		}
	}

	const [loginResult, loginQuery] = useMutation(LOGIN_QUERY)
	const [logoutResult, logoutQuery] = useMutation(LOGOUT_QUERY)
	const [signupResult, signupQuery] = useMutation(SIGNUP_QUERY)

	const refreshClient = async () => {}

	const signup = async (email: string, username: string, password: string) => {
		try {
			const result: any = await signupQuery({ email, username, password })
			if (result.data.signUp) {
				localStorage.setItem(
					'TOKEN_SNSGRAPHQL',
					result.data.signUp.viewer.sessionToken,
				)

				setUser(result.data.signUp.viewer.user.username)
				setClientId(result.data.signUp.viewer.user.objectId)
				const userInfo = {
					username: result.data.signUp.viewer.user.username,
					objectId: result.data.signUp.viewer.user.objectId,
				}
				localStorage.setItem('USER_SNSGRAPHQL', JSON.stringify(userInfo))

				middle?.refreshClient(result.data.signUp.viewer.sessionToken)
				return true
			} else {
			}
		} catch (e) {
			return false
		}
	}

	const login = async (username: string, password: string) => {
		try {
			const result: any = await loginQuery({
				username,
				password,
			})
			if (result.data.logIn) {
				localStorage.setItem(
					'TOKEN_SNSGRAPHQL',
					result.data.logIn.viewer.sessionToken,
				)

				setUser(result.data.logIn.viewer.user.username)
				setClientId(result.data.logIn.viewer.user.objectId)
				const userInfo = {
					username: result.data.logIn.viewer.user.username,
					objectId: result.data.logIn.viewer.user.objectId,
				}
				localStorage.setItem('USER_SNSGRAPHQL', JSON.stringify(userInfo))

				middle?.refreshClient(result.data.logIn.viewer.sessionToken)
			} else {
				return false
			}
		} catch (e) {
			return false
		}
		return true
	}

	const logout = async () => {
		const result = await logoutQuery({ objectId: clientId })
		if (result) {
			middle?.logoutClient()
			localStorage.removeItem('TOKEN_SNSGRAPHQL')
			localStorage.removeItem('USER_SNSGRAPHQL')
			setUser(null)
			setClientId(null)
			return true
		} else {
			return false
		}
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

	return {
		user,
		clientId,
		refreshClient,
		isLogin,
		isSameUser,
		login,
		logout,
		signup,
	}
}

import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import MyPage from './account/MyPage'
import './style.css'

import List from './List'
import Nav from './Nav'
import Login from './account/Login'
import Signup from './account/Signup'

const Routes = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/myfeed/:id">
					<Nav />
					<MyPage />
				</Route>
				<Route path="/login">
					<Nav />
					<Login />
				</Route>
				<Route path="/signup">
					<Nav />
					<Signup />
				</Route>
				<Route path="/">
					<Nav />
					<List />
				</Route>
			</Switch>
		</BrowserRouter>
	)
}

export default Routes

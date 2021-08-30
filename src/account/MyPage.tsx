import React from 'react'
import { useAuth } from '../store/useStore'
import { useParams } from 'react-router-dom'

interface Params {
	id: string
}

const MyPage = () => {
	const auth = useAuth()
	const params: Params = useParams()
	const { id } = params

	return <div>my page {id}</div>
}
export default MyPage

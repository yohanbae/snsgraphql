import React, { useState } from 'react'
import { useMutation } from 'urql'
import { Button, Textarea, useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../store/useStore'

const AddPostQuery = `
mutation AddPost($text: String, $username:String) {
  createPost(input: {
    fields: {
      content: $text
			username: $username
    }
  }) {
		post {
			id
      content
    }
  } 
}
`

const AddPost = () => {
	const [addPostResult, addPost] = useMutation(AddPostQuery)
	const history = useHistory()
	const [postContent, setPostContent] = useState('')
	const onPostContent = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		setPostContent(e.target.value)
	const auth = useAuth()
	const toast = useToast()

	const onSubmit = async () => {
		try {
			const res: any = await addPost({
				text: postContent,
				username: auth?.user,
			})
			if (!res.data.createPost) {
				toast({
					title: 'Failed to submit',
					description: res.error.message,
					status: 'error',
					duration: 9000,
					isClosable: true,
				})
				history.push('/login')
			}
		} catch (e) {
			toast({
				title: 'Failed to submit',
				description: e.message,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		} finally {
			setPostContent('')
		}
	}

	return (
		<div>
			<Textarea
				className="input-wrap"
				type="text"
				value={postContent}
				onChange={onPostContent}
				placeholder="New post here"
			/>
			<Button mt={2} mb={2} size="xs" onClick={() => onSubmit()}>
				Submit Post
			</Button>
		</div>
	)
}

export default AddPost

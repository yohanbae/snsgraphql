import React, { useState } from 'react'
import { PostType } from './interface'
import Comments from './Comments'
import { useMutation } from 'urql'
import {
	Container,
	Box,
	useToast,
	Menu,
	MenuList,
	MenuItem,
	MenuButton,
	IconButton,
	Grid,
	useDisclosure,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Textarea,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from '@chakra-ui/react'
import { HamburgerIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'

import { useHistory } from 'react-router-dom'
import { useAuth } from '../store/useStore'

const AddCommentQuery = `
mutation AddComment($id: ID!, $text:String, $username:String) {
  updatePost(input: {
    id: $id
    fields:{
      comment: {
        createAndAdd: {
          comment: $text
					username: $username
        }
      }
    }
  }) {
    post {
      comment{
        count
      }
    }
  }
}
`
const UpdatePostQuery = `
mutation Update($id: ID!, $text: String) {
  updatePost(input: {
    id: $id
    fields: {
      content: $text
    }
  })
  {
    post {
      content
    }
  }
}
`

const DelPostQuery = `
mutation Del($id: ID!) {
  deletePost(input: {
    id: $id    
  }) {
			post {
				id
			}
    }
	}
`

const Post: React.FC<PostType> = ({ node }) => {
	const history = useHistory()
	const [comment, setComment] = useState<string>('')
	const [updateText, setUpdateText] = useState<string>(node.content)
	const { isOpen, onOpen, onClose } = useDisclosure()

	const [isAlertOpen, setIsAlertOpen] = React.useState(false)
	const onAlertClose = () => setIsAlertOpen(false)
	const cancelRef = React.useRef<any>()

	const [addCommentResult, addCommentQuery] = useMutation(AddCommentQuery)
	const [updateResult, updateQuery] = useMutation(UpdatePostQuery)
	const [delResult, delQuery] = useMutation(DelPostQuery)

	const auth = useAuth()
	const toast = useToast()
	const onCommentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setComment(e.target.value)

	const onCommentSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) {
			try {
				const result: any = await addCommentQuery({
					id: node.id,
					text: comment,
					username: auth?.user,
				})
				console.log(addCommentResult)
				if (!result.data.updatePost) {
					toast({
						title: 'Failed to submit',
						description: result.error.message,
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
				setComment('')
			}
		}
	}

	const onDelete = async () => {
		if (!node.id) {
			return false
		}
		await delQuery({ id: node.id })
		console.log(delResult)
	}

	const updateTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setUpdateText(e.target.value)
	}

	const onUpdateSubmit = async () => {
		await updateQuery({ id: node.id, text: updateText })
		console.log(updateResult)
		onClose()
	}
	const onEdit = () => {
		if (!node.id) {
			return false
		}
		onOpen()
	}

	return (
		<>
			<Container
				maxW="container.xl"
				colorScheme="linkedin"
				bg="gray.100"
				borderRadius="5px"
				mb={5}
				padding={4}
			>
				<Grid gridTemplateColumns="1fr 50px" alignItems="center">
					<Box fontSize="14px">@{node.username}</Box>
					{auth?.isSameUser(node.username) && (
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label="Options"
								icon={<HamburgerIcon />}
								variant="outline"
							/>
							<MenuList>
								<MenuItem icon={<EditIcon />} onClick={() => onEdit()}>
									Edit
								</MenuItem>
								<MenuItem
									icon={<DeleteIcon />}
									onClick={() => setIsAlertOpen(true)}
								>
									Remove
								</MenuItem>
							</MenuList>
						</Menu>
					)}
				</Grid>

				<Box fontSize="20px" my="10px">
					{node.content}
				</Box>
				<div>
					{node.comment.edges.length > 0 && (
						<Comments edges={node.comment.edges} />
					)}
				</div>

				<input
					className="input-wrap"
					type="text"
					value={comment}
					onChange={onCommentChange}
					onKeyDown={onCommentSubmit}
					placeholder="Add new comment"
				/>
			</Container>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Textarea
							type="text"
							value={updateText}
							onChange={updateTextChange}
						/>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button variant="ghost" onClick={() => onUpdateSubmit()}>
							Update
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<AlertDialog
				isOpen={isAlertOpen}
				leastDestructiveRef={cancelRef}
				onClose={onAlertClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Post
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure? You can't undo this action afterwards.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onAlertClose}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={() => onDelete()} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}
export default Post

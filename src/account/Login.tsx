import React, { useState } from 'react'
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	Checkbox,
	Stack,
	Link,
	Button,
	Heading,
	Text,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react'
import { useAuth } from '../store/useStore'
import { useHistory } from 'react-router-dom'

const Login = () => {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const auth = useAuth()
	const history = useHistory()
	const toast = useToast()

	const onLogin = async () => {
		try {
			const result: any = await auth?.login(username, password)
			if (result) {
				history.push('/')
			} else {
				toast({
					title: 'Failed to login',
					status: 'error',
					duration: 9000,
					isClosable: true,
				})
			}
		} catch (e) {
			toast({
				title: 'Failed to login',
				description: e.message,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		}
	}

	const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setUsername(e.target.value)
	const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value)

	return (
		<Flex
			minH={'100vh'}
			align={'center'}
			justify={'center'}
			bg={useColorModeValue('gray.50', 'gray.800')}
		>
			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'}>Sign in to your account</Heading>
					<Text fontSize={'lg'} color={'gray.600'}>
						to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
					</Text>
				</Stack>
				<Box
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}
				>
					{auth?.isLogin() ? (
						<Box textAlign="center">You already have account</Box>
					) : (
						<Stack spacing={4}>
							<FormControl id="username">
								<FormLabel>Username</FormLabel>
								<Input
									type="text"
									value={username}
									onChange={onUsernameChange}
								/>
							</FormControl>
							<FormControl id="password">
								<FormLabel>Password</FormLabel>
								<Input
									type="password"
									value={password}
									onChange={onPasswordChange}
								/>
							</FormControl>
							<Stack spacing={10}>
								<Stack
									direction={{ base: 'column', sm: 'row' }}
									align={'start'}
									justify={'space-between'}
								></Stack>
								<Button
									bg={'blue.400'}
									color={'white'}
									_hover={{
										bg: 'blue.500',
									}}
									onClick={() => onLogin()}
								>
									Sign in
								</Button>
							</Stack>
						</Stack>
					)}
				</Box>
			</Stack>
		</Flex>
	)
}
export default Login

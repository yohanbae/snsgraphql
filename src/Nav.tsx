import { useAuth } from './store/useStore'
import {
	Box,
	Flex,
	Text,
	IconButton,
	Button,
	Stack,
	Menu,
	useColorModeValue,
	useBreakpointValue,
	useDisclosure,
	MenuButton,
	Avatar,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom'

const Nav = () => {
	const auth = useAuth()
	const { isOpen, onToggle } = useDisclosure()
	const history = useHistory()

	const onLogout = async () => {
		await auth?.logout()
	}

	return (
		<Box>
			<Flex
				bg={useColorModeValue('white', 'gray.800')}
				color={useColorModeValue('gray.600', 'white')}
				minH={'60px'}
				py={{ base: 2 }}
				px={{ base: 4 }}
				borderBottom={1}
				borderStyle={'solid'}
				borderColor={useColorModeValue('gray.200', 'gray.900')}
				align={'center'}
			>
				<Flex
					flex={{ base: 1, md: 'auto' }}
					ml={{ base: -2 }}
					display={{ base: 'flex', md: 'none' }}
				>
					<IconButton
						onClick={onToggle}
						icon={
							isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
						}
						variant={'ghost'}
						aria-label={'Toggle Navigation'}
					/>
				</Flex>
				<Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
					<Text
						textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
						fontFamily={'heading'}
						color={useColorModeValue('gray.800', 'white')}
						cursor="pointer"
						onClick={() => {
							history.push('/')
						}}
					>
						SNS GRAPHQL
					</Text>

					<Flex display={{ base: 'none', md: 'flex' }} ml={10}>
						{/* <DesktopNav /> */}
					</Flex>
				</Flex>

				<Stack
					flex={{ base: 1, md: 0 }}
					justify={'flex-end'}
					direction={'row'}
					spacing={6}
				>
					{auth?.isLogin() ? (
						<Menu>
							<MenuButton
								as={Button}
								rounded={'full'}
								variant={'link'}
								cursor={'pointer'}
								minW={0}
							>
								<Avatar
									size={'sm'}
									src={
										'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
									}
								/>
							</MenuButton>
							<MenuButton
								as={'a'}
								fontSize={'sm'}
								fontWeight={400}
								cursor={'pointer'}
								onClick={() => onLogout()}
							>
								Logout
							</MenuButton>
						</Menu>
					) : (
						<>
							<Button
								as={'a'}
								fontSize={'sm'}
								fontWeight={400}
								variant={'link'}
								href={'/login'}
								cursor={'pointer'}

								// onClick={() => onLogin()}
							>
								Sign In
							</Button>
							<Button
								as={'a'}
								display={{ base: 'none', md: 'inline-flex' }}
								fontSize={'sm'}
								fontWeight={600}
								color={'white'}
								bg={'pink.400'}
								href={'/signup'}
								cursor={'pointer'}
								_hover={{
									bg: 'pink.300',
								}}
							>
								Sign Up
							</Button>
						</>
					)}
				</Stack>
			</Flex>
		</Box>
	)
}

export default Nav

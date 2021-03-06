import React from 'react'
import { useQuery } from 'urql'
import { PostType } from './post/interface'
import AddPost from './post/AddPost'
import Post from './post/Post'
import { Container } from '@chakra-ui/react'

const PostsQuery = `
query {
    posts(order:createdAt_DESC) {
      edges {
        node {
          content
          id
					username
          comment {
            edges {
              node {
                id
                comment
								username
              }
            }
          }		        
        }
      }
    }
  }
`

const List = () => {
	const [result, reexecuteQuery] = useQuery({ query: PostsQuery })

	const { data, fetching, error } = result

	if (fetching) return <p>Loading...</p>
	if (error) return <p>Oh no... {error.message}</p>

	return (
		<React.Fragment>
			<Container maxW="container.xl">
				<AddPost />
				{/* <Button onClick={() => onEdit()}>EDIT POST</Button>
				<Button onClick={() => onDelete()}>DEL POST</Button> */}

				{data?.posts.edges.map((v: PostType) => (
					<Post key={v.node.id} node={v.node} />
				))}
			</Container>
		</React.Fragment>
	)
}
export default List

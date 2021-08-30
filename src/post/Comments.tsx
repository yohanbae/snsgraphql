import React, { useState } from 'react'
import { useMutation } from 'urql'
import { CommentsType, CommentType } from './interface'
import { Box } from '@chakra-ui/react'

const DelCommentQuery = `
mutation Del($id: ID!) {
  deleteComment(input: {
    id: $id
  }) {
    comment {
			id
    }
  }
}
`

const Comments: React.FC<CommentsType> = ({ edges }) => {
	const [delQueryResult, delQuery] = useMutation(DelCommentQuery)
	const onDelComment = (id: string) => {
		delQuery({ id })
	}
	return (
		<div className="comment-wrap">
			{edges.map((v: CommentType) => (
				<Box mb="10px" key={v.node.id}>
					<Box>@{v.node.username}</Box>
					<Box>
						{v.node.comment}
						{/* <button onClick={() => onDelComment(v.node.id)}>DEL</button> */}
					</Box>
				</Box>
			))}
		</div>
	)
}
export default Comments

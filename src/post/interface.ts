export interface CommentType {
  node: {
    id: string;
    comment: string;
    username:string;
  };
}

export interface CommentsType {
  edges: CommentType[]
}

export interface PostType {
  node: {
    id: string;
    content: string;
    comment: CommentsType;
    username: string;
  }
}

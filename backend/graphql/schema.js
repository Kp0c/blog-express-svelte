const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }
  
  type User {
    _id: ID!
    name: String
    email: String
    status: String!
    posts: [Post!]!
    token: String!
  }
  
  input UserInputData {
    name: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(user: UserInputData!): User!
    createPost(title: String!, content: String!, imageUrl: String!): Post!
    editPost(id: ID!, title: String!, content: String!, imageUrl: String): Post!
    deletePost(id: ID!): Boolean
    updateStatus(status: String!): String!
  }
  
  type Posts {
    posts: [Post!]!
    totalPages: Int!
  }
  
  type Query {
    posts(page: Int!): Posts
    post(id: ID!): Post!
    login(email: String!, password: String): User!
    status: String
  }

  schema {
    mutation: Mutation
    query: Query
  }
`);

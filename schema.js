import axios from "axios";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from "graphql";

const BASE_URL = "http://localhost:3000";

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

// Root Query
const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "...",
  fields: () => ({
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (root, { id }) => {
        console.log("here: ", root);
        return axios
          .get(`${BASE_URL}/customers/${id}`)
          .then(({ data }) => data);
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve: (root, args) => {
        return axios.get(`${BASE_URL}/customers`).then(({ data }) => data);
      }
    }
  })
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parentValue, { name, age, email }) => {
        return axios
          .post(`${BASE_URL}customers`, { name, age, email })
          .then(({ data }) => data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (root, { id }) => {
        return axios
          .delete(`${BASE_URL}/customers/${id}`)
          .then(({ data }) => data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve: (root, args) => {
        const { id } = args;
        return axios
          .patch(`${BASE_URL}/customers/${id}`, args)
          .then(({ data }) => data);
      }
    }
  }
});

export default new GraphQLSchema({
  query: QueryType,
  mutation
});

import "graphql-import-node";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";
import {
  getTypeDefinitions,
  getResolvers
} from "./utils/graphql/graphql-utils";
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: getTypeDefinitions(),
  resolvers: getResolvers()
});
export default schema;

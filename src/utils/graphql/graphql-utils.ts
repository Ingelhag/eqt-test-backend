import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

/**
 * Get all resolvers.ts and merge into one
 */
export function getResolvers(): { Query: {}; Mutation: {} } {
  const resolversPath = `${__dirname}/../../**/*.resolvers.ts`;
  const resolvers = fileLoader(resolversPath, {
    recursive: true
  });

  return mergeResolvers(resolvers);
}

/**
 * Gets all type definitions for the API. It will include all files in the src-folder ending with *.typedefs.graphql.
 */
export function getTypeDefinitions(): string {
  const domainTypesPath = `${__dirname}/../../**/*.typedefs.graphql`;
  const domainTypes = fileLoader(domainTypesPath, {
    recursive: true
  });

  return mergeTypes(domainTypes);
}

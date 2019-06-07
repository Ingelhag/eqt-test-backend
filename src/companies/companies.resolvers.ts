import { Company } from "./companies.typedefs";

/**
 * Fetches companies
 */
export const companies = (_: any, args: any, context: any): Company[] => {
  return [{ name: "Hannes företag" }];
};

export default {
  Query: {
    companies
  }
};

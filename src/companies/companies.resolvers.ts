import { fetchCompanies } from "./companies.repository";
import { CompaniesWhereInput, CompaniesListPage } from "./companies.typedefs";

/**
 * Fetches companies
 */
export const companies = async (
  _: any,
  args: CompaniesWhereInput,
  context: any
): Promise<CompaniesListPage> => {
  const result = await fetchCompanies(args);
  return result;
};

export default {
  Query: {
    companies
  }
};

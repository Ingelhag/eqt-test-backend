import { CompanyOrderByInput } from "./companies.typedefs";

export const getSortByParameterByEnum = (
  sort: CompanyOrderByInput
): string[] => {
  return sort.toString().split("_");
};

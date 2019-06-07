import { RequestParams, ApiResponse } from "@elastic/elasticsearch";
import bodybuilder from "bodybuilder";
import { elasticClient, SearchResponse } from "../utils/elastic/elastic-utils";
import {
  CompaniesListPage,
  CompaniesWhereInput,
  Company
} from "./companies.typedefs";
import { getSortByParameterByEnum } from "./companies.utils";

export const fetchCompanies = async (
  args: CompaniesWhereInput
): Promise<CompaniesListPage> => {
  const company = args && args.where ? args.where.company : null;
  const pageNumber = args.page.number;
  const pageSize = args.page.size;
  const orderBy = getSortByParameterByEnum(args.orderBy);

  let body = bodybuilder();

  if (!company) {
    body.query("match_all");
  } else {
    body.query("match", "company", company);
  }

  body.query("range", "assets", { gte: 10, lte: 25 });

  body.andFilter("bool", b =>
    b
      .orFilter("match", "country", "United States")
      .orFilter("match", "country", "China")
  );

  body.andFilter("bool", b =>
    b
      .orFilter("match", "industry", "Internet & Catalog Retail")
      .orFilter("match", "industry", "Pharmaceuticals")
  );

  body.andFilter("bool", b =>
    b
      .orFilter("match", "sector", "Consumer Discretionary")
      .orFilter("match", "sector", "Health Care")
  );

  body.from(pageNumber * pageSize);
  body.size(pageSize);
  body.sort(orderBy[0], orderBy[1]);

  console.log(body.build());

  const searchParams: RequestParams.Search = {
    index: "comp",
    body: body.build()
  };

  const searchResult: ApiResponse<
    SearchResponse<Company>
  > = await elasticClient.search(searchParams);

  const totalCount = searchResult.body.hits.total.value;
  const hasNextPage = totalCount > pageNumber * pageSize;
  const hasPreviousPage = !!pageNumber;

  return {
    totalCount,
    hasNextPage,
    hasPreviousPage,
    items: getCompaniesFromSearchResult(searchResult.body)
  };
};

/**
 * Get all companies from search result
 */
const getCompaniesFromSearchResult = (
  result: SearchResponse<Company>
): Company[] => {
  return result.hits.hits.map(company => company._source);
};

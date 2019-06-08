import { RequestParams, ApiResponse } from "@elastic/elasticsearch";
import bodybuilder from "bodybuilder";
import { elasticClient, SearchResponse } from "../utils/elastic/elastic-utils";
import {
  CompaniesListPage,
  CompaniesInput,
  Company
} from "./companies.typedefs";
import { getSortByParameterByEnum } from "./companies.utils";

export const fetchCompanies = async (
  args: CompaniesInput
): Promise<CompaniesListPage> => {
  const {
    company = null,
    countries = [],
    industries = [],
    sectors = [],
    assets = null,
    marketValue = null,
    profits = null,
    sales = null,
    rank = null
  } = args.where;
  const pageNumber = args.page.number;
  const pageSize = args.page.size;

  const orderBy = getSortByParameterByEnum(args.orderBy);

  let body = bodybuilder();

  if (!company) {
    body.query("match_all");
  } else {
    body.query("match", "company", company);
  }

  if (assets) {
    body.query("range", "assets", assets);
  }

  if (marketValue) {
    body.query("range", "marketValue", marketValue);
  }

  if (sales) {
    body.query("range", "sales", sales);
  }

  if (profits) {
    body.query("range", "profits", profits);
  }

  if (rank) {
    body.query("range", "rank", rank);
  }

  if (countries.length) {
    body.andFilter("bool", b =>
      countries.reduce(
        (filterBody, country) =>
          filterBody.orFilter("match", "country", country),
        b
      )
    );
  }

  if (industries.length) {
    body.andFilter("bool", b =>
      industries.reduce(
        (filterBody, industry) =>
          filterBody.orFilter("match", "industry", industry),
        b
      )
    );
  }

  if (sectors.length) {
    body.andFilter("bool", b =>
      sectors.reduce(
        (filterBody, sector) => filterBody.orFilter("match", "sector", sector),
        b
      )
    );
  }

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

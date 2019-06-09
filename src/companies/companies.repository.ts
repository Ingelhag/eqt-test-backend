import { RequestParams, ApiResponse } from "@elastic/elasticsearch";
import bodybuilder from "bodybuilder";
import { elasticClient, SearchResponse } from "../utils/elastic/elastic-utils";
import {
  CompaniesListPage,
  CompaniesInput,
  Company,
  ElasticAggregations,
  Aggregations
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
  let aggregationBody = bodybuilder();

  if (!company) {
    body.query("match_all");
    aggregationBody.query("match_all");
  } else {
    body.query("match", "company", company);
    aggregationBody.query("match_all");
  }

  aggregationBody.aggregation("terms", "country", { size: 1000 });
  aggregationBody.aggregation("terms", "sector", { size: 1000 });
  aggregationBody.aggregation("terms", "industry", { size: 1000 });
  aggregationBody.aggregation("max", "assets");
  aggregationBody.aggregation("min", "assets");
  aggregationBody.aggregation("max", "marketValue");
  aggregationBody.aggregation("min", "marketValue");
  aggregationBody.aggregation("max", "sales");
  aggregationBody.aggregation("min", "sales");
  aggregationBody.aggregation("max", "profits");
  aggregationBody.aggregation("min", "profits");

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

  const searchParams: RequestParams.Search = {
    index: "test",
    body: body.build()
  };

  const aggregationSearchParams: RequestParams.Search = {
    index: "test",
    body: aggregationBody.build()
  };

  const searchResult: ApiResponse<
    SearchResponse<Company, ElasticAggregations>
  > = await elasticClient.search(searchParams);

  const aggregationSearchResult: ApiResponse<
    SearchResponse<Company, ElasticAggregations>
  > = await elasticClient.search(aggregationSearchParams);

  const totalCount = searchResult.body.hits.total.value;
  const hasNextPage = totalCount > pageNumber * pageSize;
  const hasPreviousPage = !!pageNumber;
  const aggregations = mapAggrigations(
    aggregationSearchResult.body.aggregations
  );

  return {
    totalCount,
    hasNextPage,
    hasPreviousPage,
    aggregations,
    items: getCompaniesFromSearchResult(searchResult.body)
  };
};

/**
 * Get all companies from search result
 */
const getCompaniesFromSearchResult = (
  result: SearchResponse<Company, ElasticAggregations>
): Company[] => {
  return result.hits.hits.map(company => company._source);
};

/**
 * Map the aggrigations from Elastic model.
 * @param aggregations
 */
const mapAggrigations = (aggregations: ElasticAggregations): Aggregations => ({
  maxAssets: aggregations.agg_max_assets.value,
  minAssets: aggregations.agg_min_assets.value,
  maxMarketValue: aggregations.agg_max_marketValue.value,
  minMarketValue: aggregations.agg_min_marketValue.value,
  maxProfits: aggregations.agg_max_profits.value,
  minProfits: aggregations.agg_min_profits.value,
  maxSales: aggregations.agg_max_sales.value,
  minSales: aggregations.agg_min_sales.value,
  countries: aggregations.agg_terms_country.buckets.map(country => ({
    count: country.doc_count,
    key: country.key
  })),
  industries: aggregations.agg_terms_industry.buckets.map(industry => ({
    count: industry.doc_count,
    key: industry.key
  })),
  sectors: aggregations.agg_terms_sector.buckets.map(sector => ({
    count: sector.doc_count,
    key: sector.key
  }))
});

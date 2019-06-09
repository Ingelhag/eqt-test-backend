import {
  CompanyOrderByInput,
  Aggregations,
  ElasticAggregations
} from "./companies.typedefs";

/**
 * Return an array with length of two, first with attributes and then if it should be asc/desc
 * @param sort the parameter
 */
export const getSortByParameterByEnum = (
  sort: CompanyOrderByInput
): string[] => {
  return sort.toString().split("_");
};

/**
 * Map the aggregations from Elastic model.
 * @param aggregations
 */
export const mapAggregations = (
  aggregations: ElasticAggregations
): Aggregations => ({
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

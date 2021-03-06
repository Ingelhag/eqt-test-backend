export interface CompaniesInput {
  page: CompanyPageInput;
  where: CompaniesWhereInput;
  orderBy: CompanyOrderByInput;
}

export interface CompaniesWhereInput {
  company: string;
  countries: string[];
  industries: string[];
  sectors: string[];
  assets: CompaniesRangeInput;
  marketValue: CompaniesRangeInput;
  profits: CompaniesRangeInput;
  sales: CompaniesRangeInput;
  rank: CompaniesRangeInput;
}

export interface CompaniesRangeInput {
  gte: number;
  lte: number;
}

export enum CompanyOrderByInput {
  company_ASC,
  company_DESC,
  country_ASC,
  country_DESC,
  rank_ASC,
  rank_DESC,
  industry_ASC,
  industry_DESC,
  assets_ASC,
  assets_DESC,
  marketValue_ASC,
  marketValue_DESC,
  profits_ASC,
  profits_DESC,
  sales_ASC,
  sales_DESC,
  sector_ASC,
  sector_DESC
}

export interface CompanyPageInput {
  number: number;
  size: number;
}

export interface CompaniesListPage {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  aggregations: Aggregations;
  items: Company[];
}
export interface Company {
  rank?: string;
  country?: string;
  company?: string;
  industry?: string;
  assets?: number;
  marketValue?: number;
  profits?: number;
  sales?: number;
  sector?: string;
}

export interface ElasticAggregations {
  agg_max_assets: ElasticAggregationsValue;
  agg_max_marketValue: ElasticAggregationsValue;
  agg_max_profits: ElasticAggregationsValue;
  agg_max_sales: ElasticAggregationsValue;
  agg_min_assets: ElasticAggregationsValue;
  agg_min_marketValue: ElasticAggregationsValue;
  agg_min_profits: ElasticAggregationsValue;
  agg_min_sales: ElasticAggregationsValue;
  agg_terms_country: ElasticAggregationsUniqueStrings;
  agg_terms_industry: ElasticAggregationsUniqueStrings;
  agg_terms_sector: ElasticAggregationsUniqueStrings;
}

interface ElasticAggregationsValue {
  value: number;
}

interface ElasticAggregationsUniqueStrings {
  buckets: ElasticBucket[];
}

interface ElasticBucket {
  doc_count: number;
  key: string;
}

export interface Aggregations {
  maxAssets: number;
  minAssets: number;
  maxMarketValue: number;
  minMarketValue: number;
  maxProfits: number;
  minProfits: number;
  maxSales: number;
  minSales: number;
  countries: AggregationsUniqueString[];
  industries: AggregationsUniqueString[];
  sectors: AggregationsUniqueString[];
}

export interface AggregationsUniqueString {
  count: number;
  key: string;
}

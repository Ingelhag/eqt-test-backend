export interface CompaniesWhereInput {
  page: CompanyPageInput;
  where?: {
    company: string;
  };
  orderBy: CompanyOrderByInput;
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

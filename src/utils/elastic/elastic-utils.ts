import { Client } from "@elastic/elasticsearch";
const { ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTIC_CLOUD_ID } = process.env;

interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

interface Explanation {
  value: number;
  description: string;
  details: Explanation[];
}

export interface SearchResponse<T, A> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: {
      value: number;
    };
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: T;
      _version?: number;
      _explanation?: Explanation;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      matched_queries?: string[];
      sort?: string[];
    }>;
  };
  aggregations: A;
}

export const elasticClient = new Client({
  cloud: {
    id: `${ELASTIC_CLOUD_ID}`,
    username: `${ELASTIC_USERNAME}`,
    password: `${ELASTIC_PASSWORD}`
  }
});

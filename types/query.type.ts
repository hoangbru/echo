export type QueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export class PostParamsModel {
  pageIndex: number;
  pageSize: number;
  authors?: number[];
  categories?: number[];
  published?: boolean[];
}

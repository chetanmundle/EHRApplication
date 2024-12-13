export interface AppResponse<TModel> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: TModel;
}

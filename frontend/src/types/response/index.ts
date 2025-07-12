// export type APIResponseType<T> = {
//   success: boolean;
//   message: string;
//   responseObject: T | undefined;
//   statusCode: number;
// };

// export type APIPaginationType<T> = {
//   data: T;
//   totalCount: number;
//   totalPages: number;
// };
export type APIResponseType<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
};

export type APIPaginationType<T> = {
  data: T;
  totalCount: number;
  totalPages: number;
};

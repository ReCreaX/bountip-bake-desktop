export type ApiResponseType = {
    status: boolean;
    message: string;
    data?: null;
    error?:boolean;
    statusCode?:number;
};
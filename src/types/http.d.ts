interface AxiosParams {
  params: object;
  query: object;
  headers: object;
  body: object;
}

interface HttpLogs {
  path: string;
  startTime: number;
  endTime: number;
}
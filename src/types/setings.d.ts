interface TestScript {
  path: string;
  method: string;
  body?: object;
  headers?: object;
  query?: object;
  params?: object;
  assert: object;
}

interface GlobalConfig {
  storageModule?: string;
  title?: string;
  basePath: string;
  port: number;
  rounds?: number;
  threads?: number;
  testScripts: Array<TestScript>;
}
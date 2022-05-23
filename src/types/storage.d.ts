interface TestDB {
  id: string;
  title: string;
  basePath: string;
  roundCount: number;
  threadCount: number;
  startedAt: number;
  endedAt: number;
}

interface StorageModule {
  storeTest: function;
  storeTestResults: function;
  storeResourceStats: function;
  storeReportFile: function;
}
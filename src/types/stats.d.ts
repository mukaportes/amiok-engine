interface SequenceStats {
  responseStatus: object;
  logs: Array<HttpLogs>;
  assert: {
    pass: number;
    fail: number;
  };
}

interface StatsTemplate {
  delay: number;
  cpu: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  },
  handles: number;
  itemCount: number;
}

interface StatsTemplateDb {
  delay: number;
  cpu: number;
  memoryRss: number;
  memoryHeapTotal: number;
  memoryHeapUsed: number;
  memoryExternal: number;
  memoryArrayBuffers: number;
  handles: number;
  itemCount: number;
}

interface Params {
  filePath: string;
}

interface Context {
  STORAGE_PREPARE?: {
    storage: StorageModule;
  };
  TEST_SETUP?: {
    test: {
      id: string;
    }
  };
  INFO_API_PID?: {
    apiPid: number;
  };
  SETTINGS_PREPARE?: {
    config: GlobalConfig;
  };
  SCRIPT_EXECUTE?: {
    startTime: number;
    endTime: number;
  };
  STATS_ANALYZE: {
    results: Array<StatsTemplateDb>;
  };
}

interface NewContextData {
  key: string;
}
interface InfoApiPidContext implements NewContextData {
  apiPid: number;
}
interface SettingsPrepareContext implements NewContextData {
  config: GlobalConfig;
}
interface StatsAnalyzeContext implements NewContextData {
  results: Array<StatsTemplateDb>;
}
interface StoragePrepareContext implements NewContextData {
  storage: StorageModule;
}
interface StorageSetupTestContext implements NewContextData {
  test: {
    id: string;
  };
}
interface TestScriptsExecuteContext implements NewContextData {
  startTime: number;
  endTime: number;
}


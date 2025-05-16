import { Region } from './types.js';
import { isNullOrUndefined, stringEquals } from './utils.js';

class Configuration {
  private static US_REGION_BASE_PATH: string = 'https://api.boldsign.com';
  private static EU_REGION_BASE_PATH: string = 'https://api-eu.boldsign.com';
  private static BOLDSIGN_API_KEY: string = 'BOLDSIGN_API_KEY';
  private static BOLDSIGN_API_REGION: string = 'BOLDSIGN_API_REGION';
  private static BOLDSIGN_LOGGING: string = 'BOLDSIGN_LOGGING';

  private static instance: Configuration;
  private basePath: string;
  private apiKey: string;
  private enableLogging: boolean;

  private constructor(apiKey?: any, region?: any, logging?: boolean) {
    if (isNullOrUndefined(apiKey)) {
      throw new Error(
        `Missing BoldSign API Key. Please ensure the ${Configuration.BOLDSIGN_API_KEY} environment variable is set with your valid API key in your MCP configuration`,
      );
    }
    this.apiKey = apiKey as string;
    try {
      if (isNullOrUndefined(region)) {
        this.basePath = Configuration.US_REGION_BASE_PATH;
      } else {
        switch (region as Region) {
          case 'EU': {
            this.basePath = Configuration.EU_REGION_BASE_PATH;
            break;
          }
          case 'US':
          default: {
            this.basePath = Configuration.US_REGION_BASE_PATH;
            break;
          }
        }
      }
    } catch (error: any) {
      this.basePath = Configuration.US_REGION_BASE_PATH;
    }

    this.enableLogging = logging ?? stringEquals(process.env[Configuration.BOLDSIGN_LOGGING], 'TRUE');
  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      const apiKey = process.env[Configuration.BOLDSIGN_API_KEY];
      const region = process.env[Configuration.BOLDSIGN_API_REGION];
      Configuration.instance = new Configuration(apiKey, region);
    }
    return Configuration.instance;
  }

  public getBasePath(): string {
    return this.basePath;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public isLoggingEnabled() {
    return this.enableLogging;
  }
}

export default Configuration;

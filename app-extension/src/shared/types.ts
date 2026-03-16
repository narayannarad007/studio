// This represents the data we want to extract from a job page.
// It aligns with the `StructuredJob` schema in the web app's AI flows.
export interface ExtractedJobData {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  sourceUrl?: string;
}

// Defines the structure for messages passed between extension components.
export type ExtensionMessage = 
  | {
      type: "GET_PAGE_STATUS";
    }
  | {
      type: "PAGE_STATUS_RESPONSE";
      jobDetected: boolean;
      jobData?: ExtractedJobData;
    }
  | {
      type: "ANALYZE_JOB";
      jobData: ExtractedJobData;
    };

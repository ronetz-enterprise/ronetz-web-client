// Domain model for the Analytics & Audit bounded context (mirrors backend bc-analytics-audit DTOs).

export interface SystemLog {
  timestamp: string; // Instant
  level: string;
  component: string;
  message: string;
}

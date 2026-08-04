// Domain model for the Master Data bounded context (mirrors backend master-data DTOs).

export interface Country {
  id: string; // UUID
  name: string;
  code: string; // ISO
  defaultCurrency: string;
  timezone: string;
  languageCode: string;
  taxRate: number;
  active: boolean;
  dialCode: string | null;
}

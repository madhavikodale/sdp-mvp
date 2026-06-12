export type CodeLanguage = "curl" | "javascript" | "python" | "rust" | "go" | "ruby";

export interface ApiEndpointDoc {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
  codeExamples: CodeExample[];
}

export interface ApiParameter {
  name: string;
  in: "query" | "path" | "header";
  required: boolean;
  type: string;
  description: string;
  example?: string;
}

export interface ApiRequestBody {
  contentType: string;
  schema: Record<string, unknown>;
  example: Record<string, unknown>;
}

export interface ApiResponse {
  status: number;
  description: string;
  example?: Record<string, unknown>;
}

export interface CodeExample {
  language: CodeLanguage;
  code: string;
}

export interface ApiDocCategory {
  id: string;
  name: string;
  description: string;
  endpoints: ApiEndpointDoc[];
}

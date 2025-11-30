
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  SUCCESS = 'SUCCESS',
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  source: 'CLI' | 'API' | 'SYSTEM';
}

export interface MetricPoint {
  timestamp: number;
  latency: number; // ms
  tokens: number;
  model: string;
}

export interface CLIState {
  status: 'IDLE' | 'RUNNING' | 'ERROR';
  currentCommand: string | null;
  selectedModel: string;
  apiKeyConfigured: boolean;
  version: string;
}

export enum TabView {
  CONSOLE = 'CONSOLE',
  METRICS = 'METRICS',
  PLAYGROUND = 'PLAYGROUND',
  STATE = 'STATE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  error?: boolean;
}

export interface SavedCommand {
  id: string;
  name: string;
  prompt: string;
  createdAt: number;
}

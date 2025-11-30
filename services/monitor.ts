import { LogEntry, LogLevel, MetricPoint, CLIState, ChatMessage, SavedCommand } from '../types';

type Listener<T> = (data: T) => void;

class MonitorService {
  private logs: LogEntry[] = [];
  private metrics: MetricPoint[] = [];
  private state: CLIState = {
    status: 'IDLE',
    currentCommand: null,
    selectedModel: 'gemini-2.5-flash',
    apiKeyConfigured: !!process.env.API_KEY,
    version: '1.0.4-beta',
  };
  
  // New State for Chat & Commands
  private chatHistory: ChatMessage[] = [];
  private savedCommands: SavedCommand[] = [
    {
      id: 'default-1',
      name: 'React Hook 설명',
      prompt: 'React Hooks의 장점을 한 문장으로 설명해줘.',
      createdAt: Date.now()
    },
    {
      id: 'default-2',
      name: 'JSON 파싱 코드',
      prompt: 'Python에서 안전하게 JSON을 파싱하는 함수를 작성해줘.',
      createdAt: Date.now()
    }
  ];

  private logListeners: Set<Listener<LogEntry[]>> = new Set();
  private metricListeners: Set<Listener<MetricPoint[]>> = new Set();
  private stateListeners: Set<Listener<CLIState>> = new Set();
  private chatListeners: Set<Listener<ChatMessage[]>> = new Set();
  private commandListeners: Set<Listener<SavedCommand[]>> = new Set();

  constructor() {
    // Simulate initial boot logs
    this.addLog('Gemini CLI DevTools initialized', LogLevel.INFO, 'SYSTEM');
    this.addLog('Connected to local CLI instance', LogLevel.SUCCESS, 'SYSTEM');
  }

  // --- Logs ---
  public addLog(message: string, level: LogLevel = LogLevel.INFO, source: LogEntry['source'] = 'CLI', metadata?: any) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      level,
      message,
      source,
      metadata,
    };
    this.logs = [...this.logs, entry];
    if (this.logs.length > 1000) this.logs.shift();
    this.notifyLogListeners();
  }

  public getLogs() {
    return this.logs;
  }

  public subscribeLogs(listener: Listener<LogEntry[]>) {
    this.logListeners.add(listener);
    listener(this.logs);
    return () => { this.logListeners.delete(listener); };
  }

  private notifyLogListeners() {
    this.logListeners.forEach(l => l(this.logs));
  }

  public clearLogs() {
    this.logs = [];
    this.notifyLogListeners();
  }

  // --- Metrics ---
  public addMetric(latency: number, tokens: number, model: string) {
    const point: MetricPoint = {
      timestamp: Date.now(),
      latency,
      tokens,
      model,
    };
    this.metrics = [...this.metrics, point];
    if (this.metrics.length > 50) this.metrics.shift();
    this.notifyMetricListeners();
  }

  public subscribeMetrics(listener: Listener<MetricPoint[]>) {
    this.metricListeners.add(listener);
    listener(this.metrics);
    return () => { this.metricListeners.delete(listener); };
  }

  private notifyMetricListeners() {
    this.metricListeners.forEach(l => l(this.metrics));
  }

  // --- State ---
  public updateState(partialState: Partial<CLIState>) {
    this.state = { ...this.state, ...partialState };
    this.notifyStateListeners();
  }

  public subscribeState(listener: Listener<CLIState>) {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => { this.stateListeners.delete(listener); };
  }

  private notifyStateListeners() {
    this.stateListeners.forEach(l => l(this.state));
  }

  public getState() {
    return this.state;
  }

  // --- Chat ---
  public addChatMessage(role: ChatMessage['role'], text: string, error = false) {
    const msg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role,
      text,
      timestamp: Date.now(),
      error
    };
    this.chatHistory = [...this.chatHistory, msg];
    this.notifyChatListeners();
  }

  public clearChat() {
    this.chatHistory = [];
    this.notifyChatListeners();
  }

  public subscribeChat(listener: Listener<ChatMessage[]>) {
    this.chatListeners.add(listener);
    listener(this.chatHistory);
    return () => { this.chatListeners.delete(listener); };
  }

  private notifyChatListeners() {
    this.chatListeners.forEach(l => l(this.chatHistory));
  }

  // --- Saved Commands ---
  public saveCommand(name: string, prompt: string) {
    const newCmd: SavedCommand = {
      id: Math.random().toString(36).substring(7),
      name,
      prompt,
      createdAt: Date.now()
    };
    this.savedCommands = [newCmd, ...this.savedCommands];
    this.notifyCommandListeners();
  }

  public deleteCommand(id: string) {
    this.savedCommands = this.savedCommands.filter(c => c.id !== id);
    this.notifyCommandListeners();
  }

  public subscribeCommands(listener: Listener<SavedCommand[]>) {
    this.commandListeners.add(listener);
    listener(this.savedCommands);
    return () => { this.commandListeners.delete(listener); };
  }

  private notifyCommandListeners() {
    this.commandListeners.forEach(l => l(this.savedCommands));
  }
}

export const monitor = new MonitorService();
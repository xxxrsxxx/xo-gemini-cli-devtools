
export type Language = 'en' | 'ko';

export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      simulation: 'Simulation',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
    },
    tabs: {
      logs: 'Logs',
      metrics: 'Metrics',
      action: 'Chat', // Renamed from Action to Chat
      state: 'State',
    },
    console: {
      searchPlaceholder: 'Filter logs...',
      all: 'All',
      clearTooltip: 'Clear Console',
      noLogs: 'No logs found matching criteria',
    },
    metrics: {
      latencyTitle: 'Response Latency (ms)',
      tokenTitle: 'Token Usage',
      totalRequests: 'Total Requests',
      avgLatency: 'Avg Latency',
      totalTokens: 'Total Tokens',
      lastModel: 'Last Model',
    },
    playground: { // Updated for Chat interface
      modelLabel: 'Model',
      apiKeyActive: 'API Key Active',
      simulationMode: 'Simulation Mode',
      promptPlaceholder: 'Enter message...',
      executeButton: 'Send',
      simulatedResponse: 'This is a simulated response because no API_KEY is configured in the environment.',
      simulationLog: 'No API_KEY found. Switching to simulation mode.',
      chatHistory: 'Chat History',
      savedCommands: 'Command Library',
      saveCommandTitle: 'Save Command',
      commandNamePlaceholder: 'e.g., Code Refactoring',
      noCommands: 'No saved commands',
      clearChat: 'Clear Chat',
      userRole: 'You',
      modelRole: 'Gemini',
    },
    widget: {
      title: 'Gemini CLI',
      status: {
        IDLE: 'IDLE',
        RUNNING: 'RUNNING',
        ERROR: 'ERROR',
      }
    }
  },
  ko: {
    common: {
      loading: '로딩 중...',
      error: '오류',
      simulation: '시뮬레이션',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
    },
    tabs: {
      logs: '로그',
      metrics: '지표',
      action: '채팅', // Renamed
      state: '상태',
    },
    console: {
      searchPlaceholder: '로그 검색...',
      all: '전체',
      clearTooltip: '콘솔 지우기',
      noLogs: '조건에 맞는 로그가 없습니다',
    },
    metrics: {
      latencyTitle: '응답 지연시간 (ms)',
      tokenTitle: '토큰 사용량',
      totalRequests: '총 요청',
      avgLatency: '평균 지연시간',
      totalTokens: '총 토큰',
      lastModel: '최근 모델',
    },
    playground: { // Updated for Chat interface
      modelLabel: '모델',
      apiKeyActive: 'API 키 활성화됨',
      simulationMode: '시뮬레이션 모드',
      promptPlaceholder: '메시지를 입력하세요...',
      executeButton: '전송',
      simulatedResponse: 'API_KEY가 설정되지 않아 생성된 시뮬레이션 응답입니다.',
      simulationLog: 'API_KEY가 없습니다. 시뮬레이션 모드로 전환합니다.',
      chatHistory: '대화 기록',
      savedCommands: '커맨드 라이브러리',
      saveCommandTitle: '커맨드 저장',
      commandNamePlaceholder: '예: 코드 리팩토링 템플릿',
      noCommands: '저장된 커맨드가 없습니다',
      clearChat: '대화 지우기',
      userRole: '나',
      modelRole: 'Gemini',
    },
    widget: {
      title: 'Gemini CLI',
      status: {
        IDLE: '대기',
        RUNNING: '실행 중',
        ERROR: '오류',
      }
    }
  }
};

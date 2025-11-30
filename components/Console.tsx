
import React, { useEffect, useRef, useState } from 'react';
import { LogEntry, LogLevel } from '../types';
import { monitor } from '../services/monitor';
import { Search, Trash2, Filter, ChevronDown, ChevronRight, AlertCircle, Info, CheckCircle, Bug } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LogIcon = ({ level }: { level: LogLevel }) => {
  switch (level) {
    case LogLevel.INFO: return <Info className="w-4 h-4 text-blue-400" />;
    case LogLevel.WARN: return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case LogLevel.ERROR: return <AlertCircle className="w-4 h-4 text-red-500" />;
    case LogLevel.SUCCESS: return <CheckCircle className="w-4 h-4 text-green-400" />;
    case LogLevel.DEBUG: return <Bug className="w-4 h-4 text-purple-400" />;
    default: return <Info className="w-4 h-4 text-gray-400" />;
  }
};

const LogItem: React.FC<{ log: LogEntry }> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  // Manual formatting to handle missing fractionalSecondDigits in TS types
  const d = new Date(log.timestamp);
  const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;

  return (
    <div className="border-b border-gray-800 font-mono text-sm hover:bg-white/5 transition-colors">
      <div 
        className="flex items-start gap-3 p-2 cursor-pointer"
        onClick={() => log.metadata && setExpanded(!expanded)}
      >
        <span className="text-gray-500 shrink-0 select-none text-xs mt-0.5">{time}</span>
        <div className="shrink-0 mt-0.5"><LogIcon level={log.level} /></div>
        <span className={`flex-1 break-all ${log.level === LogLevel.ERROR ? 'text-red-300' : 'text-gray-300'}`}>
          {log.message}
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 shrink-0">
          {log.source}
        </span>
        {log.metadata && (
          <div className="text-gray-500 shrink-0">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </div>
      {expanded && log.metadata && (
        <div className="bg-gray-900/50 p-3 ml-10 mb-2 rounded border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-green-300">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const Console: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = monitor.subscribeLogs(setLogs);
    return unsubscribe;
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    const matchesText = log.message.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesText && matchesLevel;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex items-center gap-2 p-2 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder={t('console.searchPlaceholder')}
            className="w-full bg-gray-950 border border-gray-800 rounded pl-9 pr-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-950 rounded border border-gray-800 p-0.5">
          {(['ALL', LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                levelFilter === lvl 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {lvl === 'ALL' ? t('console.all') : lvl}
            </button>
          ))}
        </div>

        <button 
          onClick={() => monitor.clearLogs()}
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
          title={t('console.clearTooltip')}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 scroll-smooth">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
            <Filter size={32} opacity={0.2} />
            <p className="text-sm">{t('console.noLogs')}</p>
          </div>
        ) : (
          filteredLogs.map(log => <LogItem key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
};

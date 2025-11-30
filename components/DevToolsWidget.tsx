
import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Zap, Cpu, X, Maximize2, Minimize2, Command, Globe } from 'lucide-react';
import { TabView, CLIState } from '../types';
import { Console } from './Console';
import { Metrics } from './Metrics';
import { Playground } from './Playground';
import { monitor } from '../services/monitor';
import { useLanguage, LanguageProvider } from '../contexts/LanguageContext';

const WidgetContent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.CONSOLE);
  const [state, setState] = useState<CLIState>(monitor.getState());
  const [isMinimized, setIsMinimized] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    return monitor.subscribeState(setState);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20 transition-all z-50 group font-sans"
        style={{ zIndex: 9999 }}
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <Command className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed transition-all duration-300 shadow-2xl rounded-xl border border-gray-800 bg-[#0a0a0a] flex flex-col overflow-hidden font-sans
      ${isMinimized 
        ? 'bottom-4 right-4 w-80 h-14' 
        : 'bottom-4 right-4 w-[800px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
      }`}
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="h-14 bg-gray-900/80 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 shrink-0 select-none cursor-move">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-100 font-semibold">
            <Command className="w-5 h-5 text-blue-400" />
            <span>{t('widget.title')}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
            state.status === 'RUNNING' 
              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
              : 'bg-green-500/10 text-green-400 border-green-500/20'
          }`}>
            {t(`widget.status.${state.status}`) || state.status}
          </span>
          <span className="text-gray-500 text-xs font-mono">{t('widget.version')}{state.version}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors uppercase"
            title="Toggle Language"
          >
            <Globe size={14} />
            {language}
          </button>
          <div className="w-px h-4 bg-gray-800 mx-1"></div>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area - Hidden if minimized */}
      {!isMinimized && (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-4">
            <TabButton 
              active={activeTab === TabView.CONSOLE} 
              onClick={() => setActiveTab(TabView.CONSOLE)}
              icon={<Terminal size={20} />} 
              label={t('tabs.logs')} 
            />
            <TabButton 
              active={activeTab === TabView.METRICS} 
              onClick={() => setActiveTab(TabView.METRICS)}
              icon={<Activity size={20} />} 
              label={t('tabs.metrics')} 
            />
            <TabButton 
              active={activeTab === TabView.PLAYGROUND} 
              onClick={() => setActiveTab(TabView.PLAYGROUND)}
              icon={<Zap size={20} />} 
              label={t('tabs.action')} 
            />
            <TabButton 
              active={activeTab === TabView.STATE} 
              onClick={() => setActiveTab(TabView.STATE)}
              icon={<Cpu size={20} />} 
              label={t('tabs.state')} 
            />
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden relative text-left">
             {activeTab === TabView.CONSOLE && <Console />}
             {activeTab === TabView.METRICS && <Metrics />}
             {activeTab === TabView.PLAYGROUND && <Playground />}
             {activeTab === TabView.STATE && (
               <div className="p-4 font-mono text-sm text-gray-300 h-full overflow-auto">
                 <pre>{JSON.stringify(state, null, 2)}</pre>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`group relative p-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-gray-500 hover:bg-gray-800 hover:text-gray-200'
    }`}
    title={label}
  >
    {icon}
    <span className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700 z-50">
      {label}
    </span>
  </button>
);

// Wrapper to provide context
export const DevToolsWidget: React.FC = () => {
  return (
    <LanguageProvider>
      <WidgetContent />
    </LanguageProvider>
  );
};

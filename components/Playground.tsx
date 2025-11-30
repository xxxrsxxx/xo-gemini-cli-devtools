
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { monitor } from '../services/monitor';
import { LogLevel, ChatMessage, SavedCommand } from '../types';
import { Loader2, Key, Save, Trash2, MessageSquare, Book, X, ChevronRight, Send, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PlaygroundProps {
  apiKey?: string;
}

export const Playground: React.FC<PlaygroundProps> = ({ apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedCommands, setSavedCommands] = useState<SavedCommand[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newCommandName, setNewCommandName] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubChat = monitor.subscribeChat(setMessages);
    const unsubCmd = monitor.subscribeCommands(setSavedCommands);
    return () => {
      unsubChat();
      unsubCmd();
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateResponse = async (userPrompt: string) => {
    setLoading(true);
    monitor.addLog(`Starting simulation for model: ${modelName}`, LogLevel.INFO, 'API', { prompt: userPrompt });
    monitor.updateState({ status: 'RUNNING', currentCommand: 'generateContent' });

    const startTime = Date.now();
    await new Promise(r => setTimeout(r, 1000)); // Faster simulation for chat feel

    const simulatedText = t('playground.simulatedResponse');
    monitor.addChatMessage('model', simulatedText);

    const endTime = Date.now();
    const duration = endTime - startTime;
    const estimatedTokens = Math.ceil(simulatedText.length / 4);

    monitor.addLog('Received response from simulated backend', LogLevel.SUCCESS, 'API', { duration: `${duration}ms`, tokens: estimatedTokens });
    monitor.addMetric(duration, estimatedTokens, modelName);
    monitor.updateState({ status: 'IDLE', currentCommand: null });
    setLoading(false);
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setPrompt(''); // Clear input immediately
    monitor.addChatMessage('user', currentPrompt);

    if (!apiKey) {
      monitor.addLog(t('playground.simulationLog'), LogLevel.WARN, 'SYSTEM');
      await simulateResponse(currentPrompt);
      return;
    }

    setLoading(true);
    monitor.updateState({ status: 'RUNNING', currentCommand: 'generateContent' });
    monitor.addLog(`Calling Gemini API: ${modelName}`, LogLevel.INFO, 'API', { promptLength: currentPrompt.length });

    const startTime = Date.now();

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const result = await ai.models.generateContent({
        model: modelName,
        contents: currentPrompt,
      });

      const text = result.text || t('playground.noText');
      monitor.addChatMessage('model', text);

      const endTime = Date.now();
      const duration = endTime - startTime;
      const tokenCount = result.usageMetadata?.totalTokenCount || Math.ceil((currentPrompt.length + text.length) / 4);

      monitor.addLog('Gemini API Success', LogLevel.SUCCESS, 'API', { duration, model: modelName, tokens: tokenCount });
      monitor.addMetric(duration, tokenCount, modelName);

    } catch (error: any) {
      monitor.addLog(`Gemini API Error: ${error.message}`, LogLevel.ERROR, 'API', { error });
      monitor.addChatMessage('model', `${t('common.error')}: ${error.message}`, true);
    } finally {
      setLoading(false);
      monitor.updateState({ status: 'IDLE', currentCommand: null });
    }
  };

  const handleSaveCommand = () => {
    if (!newCommandName.trim() || !prompt.trim()) return;
    monitor.saveCommand(newCommandName, prompt);
    setNewCommandName('');
    setShowSaveDialog(false);
  };

  const handleLoadCommand = (cmd: SavedCommand) => {
    setPrompt(cmd.prompt);
  };

  return (
    <div className="flex h-full bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar: Command Library */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-3 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-gray-200 font-semibold text-sm">
            <Book size={16} className="text-blue-400" />
            <span>{t('playground.savedCommands')}</span>
          </div>
          <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:text-white">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {savedCommands.length === 0 ? (
            <div className="text-center text-gray-600 text-xs py-8">
              {t('playground.noCommands')}
            </div>
          ) : (
            savedCommands.map(cmd => (
              <div key={cmd.id} className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-lg p-3 cursor-pointer transition-all" onClick={() => handleLoadCommand(cmd)}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-gray-200 font-medium text-xs line-clamp-1">{cmd.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); monitor.deleteCommand(cmd.id); }}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-gray-500 text-[10px] line-clamp-2 font-mono">{cmd.prompt}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50">
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button onClick={() => setShowSidebar(true)} className="text-gray-400 hover:text-white transition-colors" title="Show Library">
                <ChevronRight size={18} />
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
               <span className="font-bold uppercase tracking-wider text-gray-500">{t('playground.modelLabel')}</span>
               <select
                 value={modelName}
                 onChange={(e) => setModelName(e.target.value)}
                 className="bg-transparent text-gray-200 focus:outline-none hover:text-white transition-colors"
               >
                 <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                 <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
                 <option value="gemini-2.5-flash-lite-latest">gemini-flash-lite</option>
               </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => monitor.clearChat()}
              className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              {t('playground.clearChat')}
            </button>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Key size={12} className={apiKey ? "text-green-500" : "text-yellow-500"} />
              <span className="hidden sm:inline">{apiKey ? t('playground.apiKeyActive') : t('playground.simulationMode')}</span>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
               <MessageSquare size={48} className="mb-4" />
               <p className="text-sm">Start a conversation with Gemini</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : msg.error 
                      ? 'bg-red-900/30 text-red-200 border border-red-800 rounded-tl-none'
                      : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                }`}>
                  <div className="text-[10px] opacity-50 mb-1 font-bold uppercase tracking-wider">
                    {msg.role === 'user' ? t('playground.userRole') : t('playground.modelRole')}
                  </div>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-700">
                 <Loader2 className="animate-spin text-gray-400" size={16} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900/50 border-t border-gray-800">
          {showSaveDialog ? (
            <div className="mb-3 bg-gray-800 border border-gray-700 rounded-lg p-3 flex gap-2 items-center animate-in slide-in-from-bottom-2 fade-in">
              <input
                autoFocus
                type="text"
                placeholder={t('playground.commandNamePlaceholder')}
                className="flex-1 bg-gray-950 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
                value={newCommandName}
                onChange={(e) => setNewCommandName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveCommand()}
              />
              <button onClick={handleSaveCommand} className="text-green-400 hover:bg-green-400/10 p-1.5 rounded"><Plus size={16} /></button>
              <button onClick={() => setShowSaveDialog(false)} className="text-gray-400 hover:bg-gray-700 p-1.5 rounded"><X size={16} /></button>
            </div>
          ) : null}

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('playground.promptPlaceholder')}
              className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-4 pr-24 py-3 text-gray-200 font-mono text-sm focus:border-blue-500 focus:outline-none resize-none placeholder-gray-600 max-h-32 min-h-[50px]"
              rows={1}
              style={{ minHeight: '52px' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {prompt.trim() && !showSaveDialog && (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  title={t('playground.saveCommandTitle')}
                >
                  <Save size={16} />
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={loading || !prompt.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} fill="currentColor" />}
              </button>
            </div>
          </div>
          <div className="text-[10px] text-gray-600 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

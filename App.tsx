import { DevToolsWidget } from './components/DevToolsWidget';

// In a real usage scenario (npm package), the user would just import <GeminiDevTools />
// This App component simulates the "Host Application" where the widget is installed.
function App() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-8">

      {/* Host App Content Simulation */}
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
           <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
             Host Application
           </h1>
           <p className="text-gray-400 text-lg">
             This represents your React application. The Gemini CLI DevTools widget is injected below.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-800">
             <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4 text-xl">🚀</div>
             <h3 className="text-white font-semibold mb-2">Fast Integration</h3>
             <p className="text-sm text-gray-500">Drop the widget into any React 18+ project to start monitoring immediately.</p>
          </div>
          <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-800">
             <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4 text-xl">📊</div>
             <h3 className="text-white font-semibold mb-2">Real-time Metrics</h3>
             <p className="text-sm text-gray-500">Track token usage, latency, and costs directly from the overlay.</p>
          </div>
          <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-800">
             <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-4 text-xl">🛠️</div>
             <h3 className="text-white font-semibold mb-2">Action Runner</h3>
             <p className="text-sm text-gray-500">Test prompts and configurations without leaving your browser context.</p>
          </div>
        </div>

        <div className="p-8 border border-dashed border-gray-700 rounded-xl bg-gray-800/30">
          <p className="text-gray-500 font-mono text-sm">
            Check the bottom-right corner for the widget.<br/>
            Interact with the "Playground" in the widget to generate logs and metrics.
          </p>
        </div>
      </div>

      {/* The Actual Widget */}
      <DevToolsWidget />
    </div>
  );
}

export default App;

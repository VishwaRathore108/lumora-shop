import React from 'react';
import { ArrowRight, Bot, Sparkles, Check } from 'lucide-react';

const AgenticAI = () => {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Card Container with Mesh Gradient */}
        <div className="relative rounded-[2.5rem] bg-[#0f0c29] overflow-hidden shadow-2xl shadow-indigo-500/20">
          
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 p-8 md:p-20">
            
            {/* Left: Text Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
                </span>
                <span className="text-sm font-semibold text-fuchsia-100 tracking-wide">Leadcore Agentic AI</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Not just a chatbot. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-indigo-300">A Digital Employee.</span>
              </h2>
              
              <p className="text-lg text-indigo-100/80 leading-relaxed max-w-lg">
                Our AI doesn't just answer FAQs. It negotiates deals, schedules meetings, and updates your CRM autonomously—24/7, with human-like empathy.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-white text-indigo-950 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-300">
                  Deploy Agents <ArrowRight size={18} />
                </button>
                <button className="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 backdrop-blur-md transition-all">
                  See Live Demo
                </button>
              </div>
            </div>

            {/* Right: Glassmorphism UI Mockup */}
            <div className="lg:w-1/2 w-full">
              <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                
                {/* Floating Badge */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
                  <Sparkles size={14} /> 98% Accuracy
                </div>

                {/* Chat Interface */}
                <div className="space-y-6">
                  {/* User Msg */}
                  <div className="flex justify-end">
                    <div className="bg-indigo-950/50 border border-indigo-500/30 text-indigo-100 px-5 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%]">
                      Can you reschedule the demo with Acme Corp to next Tuesday?
                    </div>
                  </div>

                  {/* Processing State */}
                  <div className="flex items-center gap-2 text-xs text-indigo-300/60 ml-10">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                    Checking calendar availability...
                  </div>

                  {/* AI Msg */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30 p-[1px]">
                      <div className="w-full h-full bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                         <Bot size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="bg-white/10 border border-white/10 text-white px-5 py-4 rounded-2xl rounded-tl-sm text-sm shadow-sm w-full">
                      <p className="mb-3">Done. I've moved the meeting to <span className="font-bold text-fuchsia-300">Tuesday, Oct 24th at 2:00 PM</span>.</p>
                      
                      {/* Action Card inside Chat */}
                      <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                          <Check size={16} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Calendar Updated</div>
                          <div className="font-semibold text-xs">Invite sent to rahul@acmecorp.com</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenticAI;
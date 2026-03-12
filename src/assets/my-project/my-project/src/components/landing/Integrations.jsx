import React from 'react';
import logo from '../../assets/logo.jpg'; 

const Integrations = () => {
  const apps = [
    { name: 'Salesforce', bg: 'bg-[#00A1E0]' },
    { name: 'HubSpot', bg: 'bg-[#FF7A59]' },
    { name: 'Gmail', bg: 'bg-[#EA4335]' },
    { name: 'Outlook', bg: 'bg-[#0078D4]' },
    { name: 'Slack', bg: 'bg-[#4A154B]' },
    { name: 'Zoom', bg: 'bg-[#2D8CFF]' },
    { name: 'WhatsApp', bg: 'bg-[#25D366]' },
    { name: 'LinkedIn', bg: 'bg-[#0077B5]' },
  ];

  return (
    <section className="py-32 bg-[#0B1C33] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{backgroundImage: 'linear-gradient(#C5A666 1px, transparent 1px), linear-gradient(90deg, #C5A666 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
      </div>
      
      {/* Radial Gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0B1C33_70%)]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            The Central Nervous System <br/> of <span className="text-[#C5A666]">Your Sales.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Leadcore connects with 500+ tools instantly. No coding. No API headaches. just one fluid workflow.
          </p>
        </div>

        {/* Orbit Layout */}
        <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
          
          {/* Orbital Rings */}
          <div className="absolute border border-white/5 rounded-full w-[300px] h-[300px] md:w-[500px] md:h-[500px] animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute border border-white/10 rounded-full w-[200px] h-[200px] md:w-[350px] md:h-[350px] animate-[spin_40s_linear_infinite_reverse]"></div>

          {/* Central Hub (Leadcore) */}
          <div className="relative z-20">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-[#0B1C33] rounded-3xl border-2 border-[#C5A666] flex items-center justify-center shadow-[0_0_60px_rgba(197,166,102,0.2)]">
              <img src={logo} alt="Leadcore" className="w-20 object-contain drop-shadow-lg" />
            </div>
            {/* Glowing Pulse behind logo */}
            <div className="absolute -inset-4 bg-[#C5A666]/20 rounded-full blur-xl -z-10 animate-pulse"></div>
          </div>

          {/* Floating Integration Icons */}
          {apps.map((app, index) => {
            // Calculating circular position
            const angle = (index / apps.length) * 2 * Math.PI;
            const radius = 180; // Distance from center
            // For responsive, we might need adjustments, but CSS transform is easier here
            return (
              <div 
                key={index}
                className="absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-125 hover:z-50 cursor-pointer"
                style={{
                  top: `50%`,
                  left: `50%`,
                  transform: `translate(calc(-50% + ${Math.cos(angle) * radius}px), calc(-50% + ${Math.sin(angle) * radius}px))`,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Colored Dot to represent app branding */}
                <div className={`w-8 h-8 rounded-full ${app.bg} flex items-center justify-center text-[8px] text-white font-bold opacity-90`}>
                  {app.name.charAt(0)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
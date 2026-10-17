import React, { useState } from 'react';

const ComingSoon = () => {
  // const [subscribed, setSubscribed] = useState(false);
  // const [email, setEmail] = useState('');

  // const handleSubscribe = (e) => {
  //     e.preventDefault();
  //     if (email) {
  //         setSubscribed(true);
  //     }
  // };

  return (
    <div className='w-full max-w-5xl mx-auto px-4 py-8 md:py-16 text-[#171A20] font-sans antialiased selection:bg-[#3E6AE1] selection:text-white'>
      {/* Inline keyframe animations for Notion-style B&W SVG elements */}
      <style>{`
                @keyframes craneMove {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes gearSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes hammerSwing {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-25deg); }
                }
                @keyframes pulseDot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.85); }
                }
                .animate-crane { animation: craneMove 4s ease-in-out infinite; }
                .animate-gear-cw { animation: gearSpin 12s linear infinite; transform-origin: 410px 50px; }
                .animate-gear-ccw { animation: gearSpin 8s linear infinite reverse; transform-origin: 440px 85px; }
                .animate-hammer { animation: hammerSwing 1.2s ease-in-out infinite; transform-origin: 155px 170px; }
                .animate-dot { animation: pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>

      {/* Inner Content Main Flex Container */}
      <div className='flex flex-col gap-8 md:gap-12 items-center text-center'>
        {/* 1. TOP SECTION: Status Badge, Heading & Paragraph */}
        <div className='flex flex-col items-center gap-4 max-w-2xl'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F4] border border-[#D0D1D2] text-xs font-semibold tracking-wider uppercase text-[#393C41]'>
            <span className='w-2 h-2 rounded-full bg-[#3E6AE1] animate-dot'></span>
            Under Construction
          </div>

          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#171A20]'>
            Crafting Something Exceptional
          </h1>

          <p className='text-base sm:text-lg text-[#393C41] leading-relaxed'>
            This feature is currently undergoing precision engineering. We're
            assembling high-performance components and polishing every detail to
            ensure seamless delivery.
          </p>
        </div>

        {/* 2. DEV HUMOR / JOKE BOX */}
        <div className='w-full max-w-xl bg-[#F4F4F4] border border-[#D0D1D2] rounded-md p-4 text-left shadow-xs'>
          <div className='flex items-center justify-between border-b border-[#D0D1D2] pb-2 mb-3'>
            <div className='flex items-center space-x-2'>
              <span className='w-2.5 h-2.5 rounded-full bg-[#D0D1D2]'></span>
              <span className='w-2.5 h-2.5 rounded-full bg-[#D0D1D2]'></span>
              <span className='w-2.5 h-2.5 rounded-full bg-[#D0D1D2]'></span>
              <span className='text-xs font-mono font-medium text-[#5C5E62] ml-1'>
                terminal_log.js
              </span>
            </div>
            <span className='text-[11px] font-mono text-[#5C5E62]'>
              status: 99% done
            </span>
          </div>

          <div className='font-mono text-xs sm:text-sm space-y-1.5 text-[#393C41]'>
            <p className='text-[#5C5E62]'>// Developer status report:</p>
            <p>
              <span className='text-[#3E6AE1]'>const</span> bugsFixed ={' '}
              <span className='text-[#171A20]'>99</span>;
            </p>
            <p>
              <span className='text-[#3E6AE1]'>const</span> newBugsCreated ={' '}
              <span className='text-[#171A20]'>127</span>;
            </p>
            <p className='pt-1 text-[#171A20]'>
              console.log(
              <span className='text-[#5C5E62]'>
                'It worked on localhost ¯\_(ツ)_/¯'
              </span>
              );
            </p>
          </div>
        </div>

        {/* 3. MIDDLE / VISUAL CONTENT: Notion-Style B&W Animated SVG Illustration */}
        <div className='w-full max-w-2xl bg-[#FFFFFF] border border-[#EEEEEE] rounded-lg p-4 sm:p-6 shadow-sm overflow-hidden'>
          <svg
            viewBox='0 0 500 240'
            className='w-full h-auto max-h-[260px] select-none'
            fill='none'
            stroke='currentColor'
          >
            {/* Blueprint background grid pattern */}
            <defs>
              <pattern
                id='grid'
                width='20'
                height='20'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M 20 0 L 0 0 0 20'
                  fill='none'
                  stroke='#F4F4F4'
                  strokeWidth='1'
                />
              </pattern>
            </defs>
            <rect width='500' height='240' fill='url(#grid)' />

            {/* Base Ground Line */}
            <line
              x1='20'
              y1='210'
              x2='480'
              y2='210'
              stroke='#171A20'
              strokeWidth='2'
              strokeDasharray='6 6'
            />

            {/* Background Spinning Gears */}
            <g stroke='#171A20' strokeWidth='1.5' fill='none'>
              <circle
                className='animate-gear-cw'
                cx='410'
                cy='50'
                r='16'
                strokeDasharray='4 3'
              />
              <circle className='animate-gear-cw' cx='410' cy='50' r='6' />

              <circle
                className='animate-gear-ccw'
                cx='440'
                cy='85'
                r='12'
                strokeDasharray='3 3'
              />
              <circle className='animate-gear-ccw' cx='440' cy='85' r='4' />
            </g>

            {/* Web Frame Outline / Scaffolding */}
            <rect
              x='60'
              y='30'
              width='320'
              height='180'
              rx='4'
              fill='#FFFFFF'
              stroke='#171A20'
              strokeWidth='2'
            />
            <line
              x1='60'
              y1='52'
              x2='380'
              y2='52'
              stroke='#171A20'
              strokeWidth='1.5'
            />
            <circle cx='75' cy='41' r='3' fill='#171A20' />
            <circle cx='87' cy='41' r='3' fill='#171A20' />
            <circle cx='99' cy='41' r='3' fill='#171A20' />

            {/* Wireframe Placeholder Content Blocks */}
            <rect
              x='80'
              y='70'
              width='100'
              height='12'
              rx='2'
              fill='#F4F4F4'
              stroke='#D0D1D2'
              strokeWidth='1'
            />
            <rect
              x='80'
              y='90'
              width='160'
              height='8'
              rx='2'
              fill='#F4F4F4'
              stroke='#D0D1D2'
              strokeWidth='1'
            />
            <rect
              x='80'
              y='104'
              width='130'
              height='8'
              rx='2'
              fill='#F4F4F4'
              stroke='#D0D1D2'
              strokeWidth='1'
            />

            {/* Crane Cable & Hoisted Box (Animated) */}
            <line
              x1='290'
              y1='0'
              x2='290'
              y2='210'
              stroke='#171A20'
              strokeWidth='1.5'
              strokeDasharray='4 4'
            />
            <g className='animate-crane'>
              <line
                x1='290'
                y1='30'
                x2='290'
                y2='85'
                stroke='#171A20'
                strokeWidth='2'
              />
              <rect
                x='250'
                y='85'
                width='80'
                height='42'
                rx='3'
                fill='#FFFFFF'
                stroke='#171A20'
                strokeWidth='2'
              />
              <text
                x='290'
                y='110'
                fontSize='11'
                fontWeight='bold'
                fontFamily='monospace'
                textAnchor='middle'
                fill='#171A20'
              >
                &lt;Component /&gt;
              </text>
            </g>

            {/* Notion-style Stick Figure 1 (Developer coding/hammering) */}
            <g
              stroke='#171A20'
              strokeWidth='2'
              strokeLinecap='round'
              fill='none'
            >
              {/* Head */}
              <circle cx='150' cy='145' r='8' fill='#FFFFFF' />
              {/* Body */}
              <line x1='150' y1='153' x2='150' y2='180' />
              {/* Legs */}
              <line x1='150' y1='180' x2='140' y2='210' />
              <line x1='150' y1='180' x2='162' y2='210' />
              {/* Left Arm holding blueprint */}
              <line x1='150' y1='162' x2='132' y2='170' />
              {/* Right Arm swinging hammer */}
              <line
                className='animate-hammer'
                x1='150'
                y1='162'
                x2='170'
                y2='155'
              />
            </g>

            {/* Notion-style Stick Figure 2 (Looking up at Crane) */}
            <g
              stroke='#171A20'
              strokeWidth='2'
              strokeLinecap='round'
              fill='none'
            >
              {/* Head */}
              <circle cx='360' cy='150' r='8' fill='#FFFFFF' />
              {/* Body */}
              <line x1='360' y1='158' x2='360' y2='185' />
              {/* Legs */}
              <line x1='360' y1='185' x2='350' y2='210' />
              <line x1='360' y1='185' x2='372' y2='210' />
              {/* Arms raised up holding cable */}
              <line x1='360' y1='166' x2='345' y2='152' />
              <line x1='360' y1='166' x2='375' y2='152' />
            </g>

            {/* Floating sparks/brackets */}
            <text
              x='180'
              y='145'
              fontSize='10'
              fontFamily='monospace'
              fill='#5C5E62'
            >
              {'{ }'}
            </text>
          </svg>
        </div>

        {/* 4. MINIMAL CLEAN ACTION / SUBSCRIBE FORM
                <div className="w-full max-w-md pt-2">
                    {subscribed ? (
                        <div className="p-3 bg-[#F4F4F4] border border-[#D0D1D2] rounded-md text-sm font-medium text-[#171A20] transition-all">
                            ✓ You're on the list. We'll notify you as soon as this page goes live.
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full">
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email for updates..." 
                                className="flex-1 px-4 py-2.5 text-sm bg-[#FFFFFF] text-[#171A20] placeholder-[#5C5E62] border border-[#D0D1D2] rounded-md focus:outline-none focus:border-[#3E6AE1] focus:ring-1 focus:ring-[#3E6AE1] transition-all"
                            />
                            <button 
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-[#FFFFFF] bg-[#3E6AE1] hover:bg-[#5580F0] active:bg-[#2D58CC] rounded-md transition-colors shadow-xs whitespace-nowrap"
                            >
                                Get Notified
                            </button>
                        </form>
                    )}
                </div> */}
      </div>
    </div>
  );
};

export default ComingSoon;

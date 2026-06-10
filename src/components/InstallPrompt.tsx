import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already running in standalone display mode (installed)
    const isInStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true;
    
    setIsStandalone(isInStandaloneMode);

    if (isInStandaloneMode) return;

    // Detect if browser is running on an iOS device (Safari doesn't support beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture the beforeinstallprompt event for Chrome/Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a moment before prompting the user
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If it's iOS and not already on home screen, display the guide after a short delay
    if (isIosDevice) {
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the browser installation prompt
    deferredPrompt.prompt();
    
    // Receive developer outcome selection
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation choice outcomes: ${outcome}`);
    
    // Clear prompt state
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (isStandalone || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:max-w-md bg-white border border-slate-200 shadow-xl rounded-3xl p-5 z-50 flex flex-col md:flex-row gap-4 items-start md:items-center"
      >
        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 flex-shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-sm text-slate-900 leading-tight">앱으로 더 간편하게 진단하세요</h3>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            {isIOS 
              ? "Safari 메뉴 바의 공유 단추를 누르고 '홈 화면에 추가'를 누르면 빠르고 간편하게 이용할 수 있습니다." 
              : "홈 화면에 무료 설치하여 전용 오디오 앱처럼 빠르고 선명하게 실행하세요."
            }
          </p>
          
          {isIOS && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 py-1.5 px-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-semibold w-fit">
              <span>단계:</span>
              <Share className="w-3.5 h-3.5 text-blue-600" />
              <span>공유 아이콘탭</span>
              <span className="text-slate-300">|</span>
              <PlusSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>'홈 화면에 추가' 선택</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 flex-row-reverse md:flex-row">
          {!isIOS && deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="flex-1 md:flex-none py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" /> 앱 설치
            </button>
          )}
          
          <button 
            onClick={() => setIsVisible(false)}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-colors border border-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

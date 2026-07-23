import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, Check, X, Sparkles, Monitor } from 'lucide-react';

interface PWAInstallPromptProps {
  bannerOnly?: boolean;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ bannerOnly = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [installed, setInstalled] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed & opened from home screen)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check iOS platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event on Chrome/Android/Edge/Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt natively
      setShowIOSModal(true);
    }
  };

  if (isStandalone) {
    // App is running in standalone native-like mode
    return null;
  }

  if (dismissed && bannerOnly) {
    return null;
  }

  return (
    <>
      {/* Top Banner or Floating Button */}
      {bannerOnly ? (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 font-medium truncate">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="truncate">
              <strong>Instalar o App:</strong> Acesse o <span className="font-bold underline decoration-white/40">Semanário do Integral</span> direto da tela inicial!
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 text-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white/10 rounded-md text-white/80 hover:text-white transition-colors"
              title="Fechar avisos"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="relative group bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 border border-white/20"
          title="Instalar aplicativo na tela inicial do celular"
        >
          <div className="relative">
            <Smartphone className="w-4 h-4" />
            <Sparkles className="w-2.5 h-2.5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Instalar App</span>
          <span className="sm:hidden">App Native</span>
          {installed && (
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Instalado
            </span>
          )}
        </button>
      )}

      {/* iOS & Manual Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-slate-800 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30 mb-3">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800">
                Instalar Semanário do Integral
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Adicione o aplicativo à tela de início para abrir em tela cheia sem barra do navegador.
              </p>
            </div>

            <div className="space-y-4 mb-6 text-xs sm:text-sm">
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    {isIOS ? 'No Safari do seu iPhone / iPad:' : 'No seu navegador do celular:'}
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Toque no botão <strong className="text-slate-800 flex-inline items-center gap-1"><Share className="w-3.5 h-3.5 inline text-blue-600" /> Compartilhar</strong> ou no menu de opções (três pontinhos).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-teal-50/80 rounded-2xl border border-teal-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-teal-900">
                    Selecione "Adicionar à Tela de Início"
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Role a lista e toque em <strong className="text-slate-800 flex-inline items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline text-teal-600" /> Adicionar à Tela de Início</strong> (ou "Instalar Aplicativo").
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-bold text-indigo-900">
                    Confirme em "Adicionar"
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    O ícone oficial do <strong>Semanário do Integral</strong> aparecerá na tela inicial do seu celular!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

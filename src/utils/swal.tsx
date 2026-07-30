import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';

export interface SwalOptions {
  title: string;
  text?: string;
  icon?: 'success' | 'warning' | 'error' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  toast?: boolean;
  position?: string;
  showConfirmButton?: boolean;
  timer?: number;
}

export const Swal = {
  fire: (options: SwalOptions): Promise<{ isConfirmed: boolean }> => {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      container.id = 'swal-modal-container';
      document.body.appendChild(container);

      const root = ReactDOM.createRoot(container);

      const close = (confirmed: boolean) => {
        root.unmount();
        container.remove();
        resolve({ isConfirmed: confirmed });
      };

      if (options.timer) {
        setTimeout(() => close(true), options.timer);
      }

      const iconConfig = {
        success: {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
          symbol: '✓',
          gradient: 'from-emerald-500 to-teal-600',
        },
        warning: {
          bg: 'bg-amber-50 border-amber-200 text-amber-600',
          symbol: '!',
          gradient: 'from-amber-500 to-orange-600',
        },
        error: {
          bg: 'bg-red-50 border-red-200 text-red-600',
          symbol: '✕',
          gradient: 'from-red-500 to-rose-600',
        },
        info: {
          bg: 'bg-blue-50 border-blue-200 text-[#1352D0]',
          symbol: 'i',
          gradient: 'from-[#1352D0] to-blue-600',
        },
        question: {
          bg: 'bg-violet-50 border-violet-200 text-violet-600',
          symbol: '?',
          gradient: 'from-violet-500 to-indigo-600',
        },
      }[options.icon || 'info'];

      const Modal = () => (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 text-center space-y-5 select-none"
          >
            {/* Animated SweetAlert Circle Icon */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${iconConfig.gradient} text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/10`}
              >
                {iconConfig.symbol}
              </motion.div>
            </div>

            {/* Title & Body Text */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {options.title}
              </h3>
              {options.text && (
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {options.text}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              {options.showCancelButton && (
                <button
                  onClick={() => close(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
                >
                  {options.cancelButtonText || 'Cancel'}
                </button>
              )}
              <button
                onClick={() => close(true)}
                className={`flex-1 py-3 px-4 rounded-2xl text-white text-xs font-black shadow-md transition-all cursor-pointer ${
                  options.confirmButtonColor || 'bg-[#1352D0] hover:bg-blue-600'
                }`}
              >
                {options.confirmButtonText || 'OK'}
              </button>
            </div>
          </motion.div>
        </div>
      );

      root.render(<Modal />);
    });
  },

  toast: (title: string, icon: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const container = document.createElement('div');
    container.className = 'fixed top-20 right-6 z-[99999] pointer-events-none font-sans';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);

    const iconSymbol = { success: '✓', warning: '!', error: '✕', info: 'i' }[icon];
    const bgGradient = {
      success: 'from-emerald-500 to-teal-600',
      warning: 'from-amber-500 to-orange-600',
      error: 'from-red-500 to-rose-600',
      info: 'from-[#1352D0] to-blue-600',
    }[icon];

    const Toast = () => (
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.95 }}
        className="bg-white border border-slate-200/90 shadow-xl rounded-2xl px-4 py-3 flex items-center space-x-3 text-slate-900 pointer-events-auto"
      >
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${bgGradient} text-white flex items-center justify-center text-xs font-black shrink-0`}>
          {iconSymbol}
        </div>
        <span className="text-xs font-extrabold text-slate-900 pr-2">{title}</span>
      </motion.div>
    );

    root.render(<Toast />);

    setTimeout(() => {
      root.unmount();
      container.remove();
    }, 2800);
  },
};

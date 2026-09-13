export interface BackHandlerItem {
  id: string;
  priority: number;
  handler: () => boolean | void;
}

class BackNavigationManager {
  private handlers: BackHandlerItem[] = [];
  private lastBackPressTime = 0;
  private isInitialized = false;
  private exitToastListeners: Array<(message: string) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Delay initialization until DOM is ready
      setTimeout(() => this.init(), 100);
    }
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Ensure initial history state buffer
    try {
      if (!window.history.state || !window.history.state.__tqpApp) {
        window.history.replaceState({ __tqpApp: true, depth: 0 }, '');
        window.history.pushState({ __tqpApp: true, depth: 1 }, '');
      }
    } catch (e) {
      // Ignore
    }

    // 1. Listen for browser / WebView popstate (fires on hardware back on Android Web / PWA / Chrome)
    window.addEventListener('popstate', () => {
      this.handleBackAction(false);
    });

    // 2. Listen for Cordova / WebView backbutton event if present
    document.addEventListener('backbutton', () => {
      this.handleBackAction(true);
    }, false);

    // 3. Dynamic check for Capacitor App plugin if in native container
    try {
      import('@capacitor/app').then(({ App: CapApp }) => {
        CapApp.addListener('backButton', () => {
          this.handleBackAction(true);
        });
      }).catch(() => {
        // Not in native Capacitor environment
      });
    } catch (e) {
      // Ignore
    }
  }

  public register(item: BackHandlerItem): () => void {
    // Remove if already exists with same ID
    this.handlers = this.handlers.filter(h => h.id !== item.id);
    this.handlers.push(item);

    return () => {
      this.unregister(item.id);
    };
  }

  public unregister(id: string) {
    this.handlers = this.handlers.filter(h => h.id !== id);
  }

  public onExitToast(callback: (msg: string) => void) {
    this.exitToastListeners.push(callback);
    return () => {
      this.exitToastListeners = this.exitToastListeners.filter(l => l !== callback);
    };
  }

  public ensureHistoryBuffer() {
    if (typeof window === 'undefined') return;
    try {
      window.history.pushState({ __tqpApp: true, timestamp: Date.now() }, '');
    } catch (e) {
      // Ignore
    }
  }

  public handleBackAction(isNative = false) {
    // Sort handlers by priority descending (highest priority first)
    const sorted = [...this.handlers].sort((a, b) => b.priority - a.priority);

    for (const item of sorted) {
      try {
        const result = item.handler();
        // If handler returned false explicitly, it means it decided not to handle it.
        // If it returned true or undefined/void, it successfully handled the back action.
        if (result !== false) {
          // Handled successfully!
          this.ensureHistoryBuffer();
          return;
        }
      } catch (err) {
        console.error('Error in back handler:', item.id, err);
      }
    }

    // If no active modal, subview, or lesson is open -> we are at Root (Home Screen)
    const now = Date.now();
    if (now - this.lastBackPressTime < 2000) {
      // User pressed back twice within 2 seconds: Allow exit
      try {
        import('@capacitor/app').then(({ App: CapApp }) => {
          CapApp.exitApp();
        }).catch(() => {
          window.history.back();
        });
      } catch (e) {
        window.history.back();
      }
    } else {
      // First back press at root: Show double-press notice and protect from closing
      this.lastBackPressTime = now;
      this.ensureHistoryBuffer();
      
      const exitMsg = 'ایپ بند کرنے کے لیے دوبارہ بیک دبائیں (Press back again to exit)';
      this.exitToastListeners.forEach(fn => fn(exitMsg));
    }
  }
}

export const backNavManager = new BackNavigationManager();

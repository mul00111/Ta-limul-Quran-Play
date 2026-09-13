import { useEffect, useRef } from 'react';
import { backNavManager } from '../utils/backNavigationManager';

/**
 * Custom React Hook to register a back action for mobile hardware Back button & browser back.
 * @param onBack Callback to run when the back button is pressed. Return false if not handled.
 * @param enabled Whether this handler is currently active.
 * @param priority Priority level (higher numbers run first, e.g. nested modal=70, modal=50, sub-tab=30, screen=10).
 * @param id Unique ID for this handler.
 */
export function useBackHandler(
  onBack: () => boolean | void,
  enabled: boolean = true,
  priority: number = 10,
  id?: string
) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const handlerIdRef = useRef(id || `back_handler_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    if (!enabled) return;

    const handlerId = handlerIdRef.current;
    const unregister = backNavManager.register({
      id: handlerId,
      priority,
      handler: () => {
        return onBackRef.current();
      }
    });

    return () => {
      unregister();
    };
  }, [enabled, priority]);
}

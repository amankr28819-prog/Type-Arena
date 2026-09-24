import { useEffect, useRef } from 'react';

interface UseRestartShortcutOptions {
  onRestart: () => void;
  enabled?: boolean;
}

/**
 * Global typing session restart shortcut: TAB → ENTER
 * 
 * Works when focused on the typing input, on the typing card, or after a test has finished.
 * Safely preserves normal TAB navigation when user is editing form inputs/dialogs outside typing.
 */
export function useRestartShortcut({ onRestart, enabled = true }: UseRestartShortcutOptions) {
  const tabPendingRef = useRef(false);
  const tabTimestampRef = useRef(0);
  const onRestartRef = useRef(onRestart);
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    onRestartRef.current = onRestart;
  }, [onRestart]);

  useEffect(() => {
    if (!enabled) {
      tabPendingRef.current = false;
      return;
    }

    const clearTabState = () => {
      tabPendingRef.current = false;
      tabTimestampRef.current = 0;
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;

      // Allow normal tab navigation if user is inside a form input, textarea, or contentEditable outside typing
      if (target) {
        const tagName = target.tagName ? target.tagName.toUpperCase() : '';
        const isContentEditable = target.isContentEditable;
        const isHiddenTypingInput =
          target.getAttribute('data-typing-input') === 'true' ||
          (tagName === 'INPUT' &&
            (target as HTMLInputElement).type === 'text' &&
            target.classList.contains('opacity-0'));

        if (!isHiddenTypingInput) {
          if (
            tagName === 'TEXTAREA' ||
            isContentEditable ||
            (tagName === 'INPUT' &&
              !['button', 'submit', 'checkbox', 'radio'].includes((target as HTMLInputElement).type))
          ) {
            clearTabState();
            return;
          }
        }
      }

      // Step 1: User presses TAB
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        tabPendingRef.current = true;
        tabTimestampRef.current = performance.now();

        if (timeoutIdRef.current !== null) {
          window.clearTimeout(timeoutIdRef.current);
        }
        // Safety timeout: automatically reset sequence if Enter is not pressed within 2.5 seconds
        timeoutIdRef.current = window.setTimeout(() => {
          clearTabState();
        }, 2500);
        return;
      }

      // Step 2: User presses ENTER following TAB
      if (e.key === 'Enter') {
        const now = performance.now();
        const isValidSequence = tabPendingRef.current && now - tabTimestampRef.current <= 2500;

        if (isValidSequence) {
          e.preventDefault();
          e.stopPropagation();
          clearTabState();
          onRestartRef.current();
          return;
        }
      }

      // If user pressed any other key (letters, numbers, Escape, etc.), cancel pending Tab state
      if (e.key !== 'Tab') {
        clearTabState();
      }
    };

    const handleBlur = () => {
      clearTabState();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTabState();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTabState();
    };
  }, [enabled]);
}

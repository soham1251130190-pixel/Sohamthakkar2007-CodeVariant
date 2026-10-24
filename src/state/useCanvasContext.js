import { useContext } from 'react';
import { CanvasContext } from './canvasContext.js';

export function useCanvasContext() {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error('useCanvasContext must be used inside CanvasProvider');
  return ctx;
}


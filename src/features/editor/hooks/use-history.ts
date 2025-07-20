import { useCallback, useRef, useState } from "react";
import { JSON_KEYS } from "@/features/editor/types";
import { Canvas } from "fabric";

interface UseHistoryProps {
  canvas: Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasHistory = useRef<string[]>([]);
  const isUndoRedo = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback(
    (skip = false) => {
      if (!canvas) return;

      // Don't save if we're in the middle of undo/redo operations
      if (isUndoRedo.current || skip) {
        console.log("save skipped", { 
          isUndoRedo: isUndoRedo.current, 
          skip 
        });
        return;
      }

      const currentState = canvas.toObject(JSON_KEYS);
      const json = JSON.stringify(currentState);

      // Remove any history after current index (when user makes new changes after undo)
      if (historyIndex < canvasHistory.current.length - 1) {
        canvasHistory.current = canvasHistory.current.slice(0, historyIndex + 1);
      }

      console.log("saving to history", canvasHistory.current.length);
      canvasHistory.current.push(json);
      setHistoryIndex(canvasHistory.current.length - 1);
    },
    [canvas, historyIndex]
  );

  const undo = useCallback(async () => {
    if (!canUndo() || !canvas) return;

    console.log("undo triggered");
    isUndoRedo.current = true;

    try {
      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(canvasHistory.current[previousIndex]);

      // Clear canvas
      canvas.clear();

      // Load previous state using Promise-based API (Fabric v6)
      await canvas.loadFromJSON(previousState);
      
      // Render and update state
      canvas.renderAll();
      setHistoryIndex(previousIndex);
      
      console.log("undo completed");
    } catch (error) {
      console.error("Undo failed:", error);
    } finally {
      isUndoRedo.current = false;
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(async () => {
    if (!canRedo() || !canvas) return;

    console.log("redo triggered");
    isUndoRedo.current = true;

    try {
      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(canvasHistory.current[nextIndex]);

      // Clear canvas
      canvas.clear();

      // Load next state using Promise-based API (Fabric v6)
      await canvas.loadFromJSON(nextState);
      
      // Render and update state
      canvas.renderAll();
      setHistoryIndex(nextIndex);
      
      console.log("redo completed");
    } catch (error) {
      console.error("Redo failed:", error);
    } finally {
      isUndoRedo.current = false;
    }
  }, [canvas, historyIndex, canRedo]);

  return {
    save,
    canUndo,
    canRedo,
    undo,
    redo,
    setHistoryIndex,
    canvasHistory,
  };
};
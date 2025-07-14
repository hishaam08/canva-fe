import { Canvas, Object } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: Canvas | null;
  setSelectedObjects: (objects: Object[]) => void;
}

interface SelectionEvent {
  selected?: Object[];
  target?: Object;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      const handleSelectionCreated = (e: SelectionEvent) => {
        setSelectedObjects(e.selected || []);
      };

      const handleSelectionUpdated = (e: SelectionEvent) => {
        setSelectedObjects(e.selected || []);
      };

      const handleSelectionCleared = () => {
        setSelectedObjects([]);
      };

      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", handleSelectionCleared);

      return () => {
        if (canvas) {
          canvas.off("selection:created", handleSelectionCreated);
          canvas.off("selection:updated", handleSelectionUpdated);
          canvas.off("selection:cleared", handleSelectionCleared);
        }
      };
    }
  }, [canvas, setSelectedObjects]);
};

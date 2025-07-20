import { Canvas, Object } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: Canvas | null;
  setSelectedObjects: (objects: Object[]) => void;
  clearSelectionCallback: () => void;
  save: (skip: boolean) => void;
}

interface SelectionEvent {
  selected?: Object[];
  target?: Object;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
  save,
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
        clearSelectionCallback();
        setSelectedObjects([]);
      };

      const handleObjectAdded = () => {
        save(false);
      };

      const handleObjectRemoved = () => {
        save(false);
      };

      const handleObjectModified = () => {
        save(false);
      };

      canvas.on("object:added", handleObjectAdded);
      canvas.on("object:removed", handleObjectRemoved);
      canvas.on("object:modified", handleObjectModified);
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", handleSelectionCleared);

      return () => {
        if (canvas) {
          canvas.off("object:added", handleObjectAdded);
          canvas.off("object:removed", handleObjectRemoved);
          canvas.off("object:modified", handleObjectModified);
          canvas.off("selection:created", handleSelectionCreated);
          canvas.off("selection:updated", handleSelectionUpdated);
          canvas.off("selection:cleared", handleSelectionCleared);
        }
      };
    }
  }, [canvas, setSelectedObjects, clearSelectionCallback, save]);
};

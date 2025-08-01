import { ActiveSelection, Canvas } from "fabric";
import { useEvent } from "react-use";

interface UseHotkeysProps {
  setActiveTool: () => void;
  canvas: Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  paste,
}: UseHotkeysProps) => {
  useEvent("keydown", (event) => {
    console.log(event);
    const isCtrlKey = event.ctrlKey || event.metaKey;
    // const isShiftKey = event.shiftKey;
    const isBackspace = event.key === "Delete" || event.key === "Backspace";
    const isInput = ["INPUT", "TEXTAREA"].includes(
      (event.target as HTMLElement).tagName
    );

    if (isInput) return;

    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }

    if (isCtrlKey && event.key === "z") {
      event.preventDefault();
      undo();
    }

    if (isCtrlKey && event.key === "y") {
      event.preventDefault();
      redo();
    }

    if (isCtrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      redo();
    }

    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      copy();
    }

    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }

    if (isCtrlKey && event.key === "s") {
      event.preventDefault();
      save(true);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }

    if (isCtrlKey && event.key === "a") {
      event.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas
        ?.getObjects()
        .filter((object) => object.selectable);

      canvas?.setActiveObject(new ActiveSelection(allObjects, { canvas }));
      canvas?.renderAll();
    }
  });
};

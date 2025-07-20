import { Canvas, Object } from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
  canvas: Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clipboard = useRef<any>(null);

  const copy = useCallback(async () => {
    const activeObject = canvas?.getActiveObjects()[0];
    if (activeObject) {
      clipboard.current = await activeObject.clone();
    }
  }, [canvas]);

  const paste = useCallback(async () => {
    if (!clipboard.current) return;

    const clonedObj = await clipboard.current.clone();
    canvas?.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
    });

    if (clonedObj.type === "activeSelection") {
      clonedObj.canvas = canvas;
      clonedObj.forEachObject((obj: Object) => {
        canvas?.add(obj);
      });
      clonedObj.setCoords();
    } else {
      canvas?.add(clonedObj);
    }

    clipboard.current.top += 10;
    clipboard.current.left += 10;
    canvas?.setActiveObject(clonedObj);
    canvas?.requestRenderAll();
  }, [canvas]);

  return { copy, paste };
};

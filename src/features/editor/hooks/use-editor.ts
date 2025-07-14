import { useCallback, useMemo, useState } from "react";
import {
  Canvas,
  Circle,
  Object,
  Polygon,
  Rect,
  Shadow,
  Triangle,
} from "fabric";
import { useAutoResize } from "./use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_WIDTH,
  TRIANGLE_OPTIONS,
} from "../types";
import { useCanvasEvents } from "./use-canvas-events";
import { isTextType } from "../utils";

function buildEditor({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  selectedObjects,
}: BuildEditorProps): Editor {
  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((obj) => (obj as { name?: string }).name === "clip");
  };

  const center = (object: Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  };

  return {
    changeFillColor: (color: string) => {
      setFillColor(color);
      canvas.getActiveObjects().forEach((obj) => {
        obj.set("fill", color);
      });
      canvas.requestRenderAll();
    },
    changeStrokeColor: (color: string) => {
      setStrokeColor(color);

      canvas.getActiveObjects().forEach((obj) => {
        if (isTextType(obj.type)) {
          obj.set("fill", color);
          return;
        }

        obj.set("stroke", color);
      });
      canvas.requestRenderAll();
    },
    changeStrokeWidth: (width: number) => {
      setStrokeWidth(width);
      canvas.getActiveObjects().forEach((obj) => {
        obj.set("strokeWidth", width);
      });
      canvas.requestRenderAll();
    },
    addCircle: () => {
      const circle = new Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(circle);
    },

    addSoftRectangle: () => {
      const rectangle = new Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(rectangle);
    },

    addRectangle: () => {
      const square = new Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(square);
    },

    addTriangle: () => {
      const triangle = new Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(triangle);
    },

    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(object);
    },
    fillColor,
    strokeColor,
    strokeWidth,
    canvas,
    selectedObjects,
  };
}

export const useEditor = () => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<Object[]>([]);

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);

  useAutoResize({ canvas, container });
  useCanvasEvents({ canvas, setSelectedObjects });

  const editor = useMemo(() => {
    if (canvas)
      return buildEditor({
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        selectedObjects,
      });

    return undefined;
  }, [canvas, fillColor, strokeColor, strokeWidth, selectedObjects]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      Rect.ownDefaults = {
        ...Rect.ownDefaults,
        cornerColor: "#fff",
        cornerStyle: "circle",
        transparentCorners: false,
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      };

      const initialWorkspace = new Rect({
        width: 1200,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new Shadow({ color: "rgba(0,0,0,0.8)", blur: 5 }),
      });

      const test = new Rect({
        height: 100,
        width: 100,
        fill: "black",
      });

      initialCanvas.setHeight(initialContainer.offsetHeight);
      initialCanvas.setWidth(initialContainer.offsetWidth);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      initialCanvas.add(test);
      initialCanvas.centerObject(test);
    },
    []
  );

  return { init, editor };
};

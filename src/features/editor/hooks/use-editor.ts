import { useCallback, useMemo, useRef, useState } from "react";
import {
  Canvas,
  Circle,
  Image,
  Object,
  PencilBrush,
  Point,
  Polygon,
  Rect,
  Shadow,
  Textbox,
  Triangle,
} from "fabric";
import { useAutoResize } from "./use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  JSON_KEYS,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
  UseEditorProps,
} from "../types";
import { useCanvasEvents } from "./use-canvas-events";
import {
  createFilter,
  downloadFile,
  isTextType,
  transformText,
} from "../utils";
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./use-history";
import { useHotkeys } from "./use-hotkeys";
import { useLoadState } from "./use-load-state";

function buildEditor({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  selectedObjects,
  setStrokeDashArray,
  strokeDashArray,
  fontFamily,
  setFontFamily,
  copy,
  paste,
  autoZoom,
  save,
  canRedo,
  canUndo,
  undo,
  redo,
}: BuildEditorProps): Editor {
  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((obj) => (obj as { name?: string }).name === "clip");
  };

  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as Rect;

    const dataUrlOptions = {
      multiplier: 1,
      format: "png" as const,
      quality: 1,
      left: left,
      top: top,
      width: width,
      height: height,
      name: "shapy-image",
    };

    return {
      name: "Image",
      dataUrlOptions,
      workspace: { width, height, left, top },
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options.dataUrlOptions);

    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options.dataUrlOptions);

    downloadFile(dataUrl, "svg");
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options.dataUrlOptions);

    downloadFile(dataUrl, "jpg");
    autoZoom();
  };

  const saveJson = () => {
    const dataUrl = canvas.toObject(JSON_KEYS);

    transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`;
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data, () => {
      autoZoom();
    });
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
    saveJpg,
    saveJson,
    savePng,
    saveSvg,
    loadJson,
    autoZoom,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new Point(center.left, center.top),
        zoomRatio > 1 ? 1 : zoomRatio
      );
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio
      );
    },
    getWorkspace,
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set(value);
      autoZoom();
      save(false);
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save(false);
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeColor;
      }

      const value = selectedObject.get("stroke") || strokeColor;

      return value;
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;

      canvas.freeDrawingBrush = new PencilBrush(canvas);
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = strokeWidth;
        canvas.freeDrawingBrush.color = strokeColor;
      }
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onUndo: async () => await undo(),
    onRedo: async () => await redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((obj) => {
        if (isTextType(obj.type)) {
          obj.set({ fontFamily: value });
        }
      });
      canvas.requestRenderAll();
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontStyle: value });
        }
      });
      canvas.requestRenderAll();
    },
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
      if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.color = color;
      canvas.requestRenderAll();
    },
    changeStrokeWidth: (width: number) => {
      setStrokeWidth(width);
      canvas.getActiveObjects().forEach((obj) => {
        obj.set("strokeWidth", width);
        obj.setCoords();
      });
      if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.width = width;
      canvas.requestRenderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.requestRenderAll();
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") || strokeWidth;

      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeDashArray;
      }

      const value = selectedObject.get("strokeDashArray") || [];
      return value;
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
    bringForward: () => {
      canvas.getActiveObjects().forEach((obj) => {
        canvas.bringObjectForward(obj);
      });

      canvas.requestRenderAll();
    },
    sendBackward: () => {
      canvas.getActiveObjects().forEach((obj) => {
        canvas.sendObjectBackwards(obj);
      });

      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectToBack(workspace);
      canvas.requestRenderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((obj) => {
        obj.set("opacity", value);
      });
      canvas.requestRenderAll();
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((obj) => {
        if (isTextType(obj.type)) {
          obj.set({ fontWeight: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }
      const value = selectedObject.get("opacity") || 1;
      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get("fontFamily") || FONT_FAMILY;
      }
      return FONT_FAMILY;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        return selectedObject.get("fontWeight") || FONT_WEIGHT;
      }
      return FONT_WEIGHT;
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    addText: (value, options) => {
      const object = new Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        fontFamily: fontFamily,
        ...options,
      });
      addToCanvas(object);
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ textAlign: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      const value = selectedObject.get("textAlign") || "left";

      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ underline: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      const value = selectedObject.get("underline") || false;

      return value;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ linethrough: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontSize: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      const value = selectedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as Image;
          // const filter = new filters.Grayscale();
          const effect = createFilter(value);

          // imageObject.filters = [filter];

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
        // save(false)
      });
    },
    addImage: async (value: string) => {
      const workspace = getWorkspace();

      try {
        const image = await Image.fromURL(value, {
          crossOrigin: "anonymous",
        });

        image.scaleToWidth(workspace?.width || 0);
        image.scaleToHeight(workspace?.height || 0);

        addToCanvas(image);
      } catch (error) {
        console.error("Failed to load image", error);
      }
    },
    fillColor,
    strokeColor,
    strokeWidth,
    canvas,
    selectedObjects,
    fontFamily,
    canRedo,
    canUndo,
    save,
  };
}

export const useEditor = ({
  defaultState,
  defaultHeight,
  defaultWidth,
  clearSelectionCallback,
  setActiveTool,
  saveCallback,
}: UseEditorProps) => {
  const initialState = useRef(defaultState);
  const initialWidth = useRef(defaultWidth);
  const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<Object[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  const { autoZoom } = useAutoResize({ canvas, container });
  const { copy, paste } = useClipboard({ canvas });

  const { save, canRedo, canUndo, undo, redo, setHistoryIndex, canvasHistory } =
    useHistory({ canvas, saveCallback });
  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback, save });

  useHotkeys({
    setActiveTool,
    canvas,
    undo,
    redo,
    save,
    copy,
    paste,
  });

  useLoadState({
    canvas,
    autoZoom,
    initialState,
    canvasHistory,
    setHistoryIndex,
  });

  const editor = useMemo(() => {
    if (canvas)
      return buildEditor({
        save,
        canRedo,
        canUndo,
        undo,
        redo,
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        selectedObjects,
        setStrokeDashArray,
        strokeDashArray,
        fontFamily,
        setFontFamily,
        copy,
        paste,
        autoZoom,
      });

    return undefined;
  }, [
    save,
    canRedo,
    canUndo,
    undo,
    redo,
    copy,
    paste,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
    fontFamily,
    autoZoom,
  ]);

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

      Circle.ownDefaults = {
        ...Circle.ownDefaults,
        cornerColor: "#fff",
        cornerStyle: "circle",
        transparentCorners: false,
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      };

      Polygon.ownDefaults = {
        ...Polygon.ownDefaults,
        cornerColor: "#fff",
        cornerStyle: "circle",
        transparentCorners: false,
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      };

      const initialWorkspace = new Rect({
        width: initialWidth.current,
        height: initialHeight.current,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new Shadow({ color: "rgba(0,0,0,0.8)", blur: 5 }),
      });

      initialCanvas.setHeight(initialContainer.offsetHeight);
      initialCanvas.setWidth(initialContainer.offsetWidth);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(initialCanvas.toObject(JSON_KEYS));
      canvasHistory.current.push(currentState);
      setHistoryIndex(0);

      // initialCanvas.add(test);
      // initialCanvas.centerObject(test);
    },
    [canvasHistory, setHistoryIndex]
  );

  return { init, editor };
};

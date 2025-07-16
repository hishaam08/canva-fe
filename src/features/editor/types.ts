import { Canvas, Object, TextboxProps, TOptions } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
import * as material from "material-colors";

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates";

export type BuildEditorProps = {
  canvas: Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  selectedObjects: Object[];
  setStrokeDashArray: (dashArray: number[]) => void;
  strokeDashArray: number[];
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
};

export interface Editor {
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  changeFillColor: (color: string) => void;
  changeStrokeColor: (color: string) => void;
  changeStrokeWidth: (width: number) => void;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  canvas: Canvas;
  selectedObjects: Object[];
  changeStrokeDashArray: (dashArray: number[]) => void;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];
  bringForward: () => void;
  sendBackward: () => void;
  changeOpacity: (value: number) => void;
  getActiveOpacity: () => number;
  addText: (value: string, options?: TOptions<TextboxProps>) => void;
  changeFontFamily: (value: string) => void;
  fontFamily: string;
  getActiveFontFamily: () => string;
  getActiveFontWeight: () => number;
  changeFontWeight: (value: number) => void;
  changeFontStyle: (value: string) => void
  getActiveFontStyle: () => string;
  changeTextAlign: (value: string) => void;
  getActiveTextAlign: () => string;
  changeFontUnderline: (value: boolean) => void;
  getActiveFontUnderline: () => boolean;
  changeFontLinethrough: (value: boolean) => void;
  getActiveFontLinethrough: () => boolean;
  changeFontSize: (value: number) => void
  getActiveFontSize: () => number;
  delete: () => void;
}

export interface UseEditorProps {
  clearSelectionCallback: () => void;
}

export const selectionDependentTools = [
  "fill",
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "stroke-color",
  "stroke-width",
];

export const fonts = [
  "Arial",
  "Arial Black",
  "Bookman",
  "Brush Script MT",
  "Comic Sans MS",
  "Courier New",
  "Garamond",
  "Georgia",
  "Geneva",
  "Helvetica",
  "Impact",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Palatino",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const FONT_WEIGHT = 400;

export const TEXT_OPTIONS = {
  left: 100,
  top: 100,
  // fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export const CIRCLE_OPTIONS = {
  radius: 225,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 600,
  height: 600,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];

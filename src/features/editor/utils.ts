import { RGBColor } from "react-color";
import { filters } from "fabric";

export function isTextType(type: string | undefined): boolean {
  return type === "text" || type === "textbox" || type === "i-text";
}

export function rgbaObjectToString(rgba: RGBColor | "transparent") {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

export const createFilter = (value: string) => {
  let effect;

  switch (value) {
    case "greyscale":
      effect = new filters.Grayscale();
      break;
    case "polaroid":
      effect = new filters.Polaroid();
      break;
    case "sepia":
      effect = new filters.Sepia();
      break;
    case "kodachrome":
      effect = new filters.Kodachrome();
      break;
    case "contrast":
      effect = new filters.Contrast({ contrast: 0.3 });
      break;
    case "brightness":
      effect = new filters.Brightness({ brightness: 0.8 });
      break;
    case "brownie":
      effect = new filters.Brownie();
      break;
    case "vintage":
      effect = new filters.Vintage();
      break;
    case "technicolor":
      effect = new filters.Technicolor();
      break;
    case "pixelate":
      effect = new filters.Pixelate();
      break;
    case "invert":
      effect = new filters.Invert();
      break;
    case "blur":
      effect = new filters.Blur();
      break;
    case "sharpen":
      effect = new filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case "emboss":
      effect = new filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case "removecolor":
      effect = new filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
      });
      break;
    case "blacknwhite":
      effect = new filters.BlackWhite();
      break;
    case "vibrance":
      effect = new filters.Vibrance({
        vibrance: 1,
      });
      break;
    case "blendcolor":
      effect = new filters.BlendColor({
        color: "#00ff00",
        mode: "multiply",
      });
      break;
    case "huerotate":
      effect = new filters.HueRotation({
        rotation: 0.5,
      });
      break;
    case "resize":
      effect = new filters.Resize();
      break;
    case "gamma":
      effect = new filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
    case "saturation":
      effect = new filters.Saturation({
        saturation: 0.7,
      });
      break;
    default:
      effect = null;
      return;
  }

  return effect;
};

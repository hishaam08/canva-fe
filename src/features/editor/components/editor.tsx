"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "../hooks/use-editor";
import { Canvas } from "fabric";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import Footer from "./footer";
import { ActiveTool, selectionDependentTools } from "../types";
import ShapesSidebar from "./shapes-sidebar";
import { FillColorSidebar } from "./fill-color-sidebar";
import { StrokeColorSidebar } from "./stroke-color-sidebar";
import { StrokeWidthSidebar } from "./stroke-width-sidebar";

export const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
  });
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }
      setActiveTool(tool);
    },
    [activeTool]
  );

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({ initialCanvas: canvas, initialContainer: containerRef.current! });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapesSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="flex flex-1 min-w-0 flex-col bg-muted">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div ref={containerRef} className="flex-1 min-h-0 bg-muted">
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

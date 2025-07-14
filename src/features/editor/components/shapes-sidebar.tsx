import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShapeTool } from "./shape-tool";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";

interface ShapesSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

function ShapesSidebar({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapesSidebarProps) {
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool
            onDoubleClick={() => {
              editor?.addCircle();
            }}
            icon={FaCircle}
          />
          <ShapeTool
            onDoubleClick={() => {
              editor?.addSoftRectangle();
            }}
            icon={FaSquare}
          />
          <ShapeTool
            onDoubleClick={() => {
              editor?.addRectangle();
            }}
            icon={FaSquareFull}
          />
          <ShapeTool
            onDoubleClick={() => {
              editor?.addTriangle();
            }}
            icon={IoTriangle}
          />
          <ShapeTool
            onDoubleClick={() => {
              editor?.addInverseTriangle();
            }}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool
            onDoubleClick={() => {
              editor?.addDiamond();
            }}
            icon={FaDiamond}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose
        onClick={() => {
          onChangeActiveTool("select");
        }}
      />
    </aside>
  );
}

export default ShapesSidebar;

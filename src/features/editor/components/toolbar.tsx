import { ActiveTool, Editor } from "../types";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

function Toolbar({ editor, activeTool, onChangeActiveTool }: ToolbarProps) {
  const selectedObjects = editor?.canvas.getActiveObjects();

  const getProperty = (property: string) => {
    if (!selectedObjects || selectedObjects.length === 0) return null;
    console.log("Selected objects:", selectedObjects[0].get(property));
    return selectedObjects[0].get(property);
  };

  const fillColor = getProperty("fill");
  //   const [properties, setProperties] = useState({ fillColor });

  if (editor === undefined || editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            variant="ghost"
            size="icon"
            className={cn(activeTool === "fill" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border"
              style={{
                backgroundColor:
                  typeof fillColor === "string" ? fillColor : "black",
              }}
            ></div>
          </Button>
        </Hint>
      </div>
    </div>
  );
}

export default Toolbar;

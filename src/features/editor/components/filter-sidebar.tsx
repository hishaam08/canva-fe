import { ActiveTool, Editor, filters } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface FilterSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  const currentFilter = useRef<string>("none");

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "filter" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Filters"
        description="Apply a filter to selected image"
      />
      <ScrollArea className="h-auto overflow-y-auto">
        <div className="p-4 space-y-1 border-b">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="secondary"
              size="lg"
              className="w-full h-16 justify-start text-left"
              onMouseEnter={() => editor?.changeImageFilter(filter)}
              onMouseLeave={() =>
                editor?.changeImageFilter(currentFilter.current)
              }
              onClick={() => {
                currentFilter.current = filter;
                editor?.save(false);
              }}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};

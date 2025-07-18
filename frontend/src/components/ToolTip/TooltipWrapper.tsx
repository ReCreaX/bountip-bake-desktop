// components/TooltipWrapper.tsx
'use client';

import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type TooltipWrapperProps = {
  content: string;
  children: ReactNode;
};

const TooltipWrapper = ({ content, children }: TooltipWrapperProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            className="bg-white px-3 py-1.5 text-sm text-gray-800 rounded-md shadow-md z-50 font-semibold"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipWrapper;

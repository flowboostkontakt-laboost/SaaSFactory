import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IphoneFrameProps = {
  children: ReactNode;
  className?: string;
};

// Pure CSS device shell: titanium bezel, Dynamic Island, side buttons.
// No raster assets so it stays crisp at any scale.
export function IphoneFrame({ children, className }: IphoneFrameProps) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.2] w-full select-none rounded-[2.6rem] bg-charcoal-700 p-[3px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[22%] h-9 w-[3px] rounded-l bg-charcoal-600" />
      <span className="absolute -left-[3px] top-[34%] h-14 w-[3px] rounded-l bg-charcoal-600" />
      <span className="absolute -left-[3px] top-[50%] h-14 w-[3px] rounded-l bg-charcoal-600" />
      <span className="absolute -right-[3px] top-[40%] h-20 w-[3px] rounded-r bg-charcoal-600" />

      <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-charcoal-950 ring-1 ring-black/40">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-3 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
        {/* screen */}
        <div className="absolute inset-0 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

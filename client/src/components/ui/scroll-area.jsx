import React from 'react';
import { cn } from '../../lib/utils';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <div className="h-full w-full rounded-[inherit] overflow-auto">
        {children}
      </div>
    </div>
  );
});

ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
import * as React from "react";
import { cn } from "@/utils/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const initials = fallback || alt?.charAt(0).toUpperCase() || "U";

    return (
      <div
        ref={ref}
        className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      >
        {src && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium text-muted-foreground">{initials}</span>
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      >
        <span className="text-sm font-medium text-muted-foreground">{children}</span>
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-depth duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-1",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-btn-3d hover:bg-primary/95 active:shadow-none",
        secondary: "bg-secondary text-secondary-foreground shadow-btn-3d-secondary hover:bg-secondary/95 active:shadow-none",
        accent: "bg-accent text-accent-foreground shadow-btn-3d hover:bg-accent/95 active:shadow-none",
        outline:
          "border border-input bg-transparent shadow-btn-3d-outline hover:bg-muted hover:text-foreground active:shadow-none",
        ghost: "hover:bg-muted hover:text-foreground active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_rgba(153,27,27,1)] hover:bg-destructive/95 active:shadow-none",
        link: "text-primary underline-offset-4 hover:underline active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
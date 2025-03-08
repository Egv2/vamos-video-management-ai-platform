import type { Target } from "framer-motion";

export interface AnimationVariants {
  [key: string]: {
    width?: Target;
    x?: number;
    opacity?: number;
    display?: string;
    transition?: {
      x?: {
        stiffness?: number;
        velocity?: number;
        duration?: number;
      };
    };
  };
}

declare module "@splidejs/react-splide" {
  import { ComponentType, ReactNode } from "react";

  export const Splide: ComponentType<{ children?: ReactNode }>;
  export const SplideSlide: ComponentType<{ children?: ReactNode }>;
  export const AutoScroll: Record<string, unknown>; // If AutoScroll is an object with unknown properties
}

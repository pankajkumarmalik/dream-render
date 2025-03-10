declare module "@splidejs/react-splide" {
  import { ComponentType, ReactNode } from "react";

  interface SplideProps {
    options?: Record<string, unknown>; // Allowing various Splide options
    children?: ReactNode;
    extensions?: Record<string, unknown>;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<{ children?: ReactNode }>;
  export const AutoScroll: Record<string, unknown>; // If AutoScroll is an object with unknown properties
}

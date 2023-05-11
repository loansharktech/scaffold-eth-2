import { useMediaQuery } from "@mantine/hooks";

export function useDevice() {
  const matches = useMediaQuery("(max-width: 640px)");
  return {
    isMobile: matches,
  };
}

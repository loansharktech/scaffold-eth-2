import { useEffect, useRef } from "react";
import router, { useRouter } from "next/router";

const histories = [] as string[];

export function useTrackHistory() {
  const router = useRouter();
  const historyRef = useRef({
    histories,
  });

  useEffect(() => {
    historyRef.current.histories.push(window.location.href);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      historyRef.current.histories.push(window.location.href);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}

export function navBack(fallback?: string) {
  if (fallback && (history.length === 1 || histories.length === 1)) {
    router.replace(fallback);
  } else {
    router.back();
  }
}

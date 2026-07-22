"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function KyrumaBooker() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "primera-conversacion" });

      cal("ui", {
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#292929",
          },
          dark: {
            "cal-brand": "#FF5A1F",
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <Cal
        namespace="primera-conversacion"
        calLink="kyruma/primera-conversacion"
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll",
        }}
        config={{
          layout: "month_view",
        }}
      />
    </div>
  );
}

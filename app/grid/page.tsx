"use client";

import { Suspense } from "react";
import { GridContent } from "./grid-content";

export default function GridPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center text-lg text-highlight-dim/40">
          Loading grid...
        </div>
      }
    >
      <GridContent />
    </Suspense>
  );
}

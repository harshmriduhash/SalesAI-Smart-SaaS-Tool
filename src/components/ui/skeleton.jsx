// src/components/ui/skeleton.jsx
import { cn } from "@/lib/utils";
import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div
    className={cn("animate-pulse rounded-md bg-muted", className)}
  />
);
import { ConvexHttpClient } from "convex/browser"
import type { Id } from "../../convex/_generated/dataModel"
import { api as generatedApi } from "../../convex/_generated/api"

const convexUrl = process.env.CONVEX_URL || ""

if (!convexUrl) {
  console.warn("CONVEX_URL not set")
}

export const convex = new ConvexHttpClient(convexUrl)
export const api = generatedApi

export type { Id }

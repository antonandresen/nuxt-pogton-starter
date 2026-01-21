declare module "ai" {
  export function generateText(args: any): Promise<{ text: string }>
}

declare module "@ai-sdk/openai" {
  export function openai(model: string): any
}


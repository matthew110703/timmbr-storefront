import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    zone: "shell",
    port: 3000,
    role: "ingress-control-plane",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    framework: "Next.js 16",
  });
}

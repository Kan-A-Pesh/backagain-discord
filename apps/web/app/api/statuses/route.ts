import { NextResponse } from "next/server";
import { db, statuses } from "@repo/database";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allStatuses = await db
      .select()
      .from(statuses)
      .orderBy(asc(statuses.createdAt));

    return NextResponse.json({ statuses: allStatuses });
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch statuses" },
      { status: 500 },
    );
  }
}

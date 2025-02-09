import { NextResponse } from "next/server";
import { groupStudents } from "@/lib/groupingAlgorithm";

export async function POST(request: Request) {
    try {
        const { students, groupSize } = await request.json();
        const groups = groupStudents(students, groupSize);
        return NextResponse.json({ groups });
    } catch (error) {
        return NextResponse.json({ error:  error }, { status: 500 });
    }
}

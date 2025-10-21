import { NextResponse } from "next/server";
import BoxModel from "@/lib/models/BoxModel";
import { ConnectDB } from "@/lib/config/db";

export async function GET() {
  await ConnectDB();
  try {
    const boxes = await BoxModel.find({});
    return NextResponse.json(boxes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch boxes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ConnectDB();
  try {
    const boxes = await request.json();

    // Hapus semua data lama, simpan baru
    await BoxModel.deleteMany({});
    const newBoxes = await BoxModel.insertMany(boxes);

    return NextResponse.json(newBoxes, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save boxes" }, { status: 500 });
  }
}

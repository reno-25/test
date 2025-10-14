import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import { writeFile } from 'fs/promises'
import BlogModel from "@/lib/models/BlogModel";

const LoadDB = async () => {
    await connectDB();
}

LoadDB();

export async function GET(request: any) {
    return NextResponse.json({ message: "API Working" });
}

export async function POST(request: { formData: () => any; }) {

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/images/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/images/${timestamp}_${image.name}`;
    
        const blogData = {
            title: `${formData.get('title')}`,
            category: `${formData.get('category')}`,
            author: `${formData.get('author')}`,
            content: `${formData.get('content')}`,
            image: `${imgUrl}`,
            authorImg : `${formData.get('authorImg')}`
        }

        await BlogModel.create(blogData);
        console.log('Blog Saved');
        
    return NextResponse.json({ success:true, msg: "Blog Added"})
}

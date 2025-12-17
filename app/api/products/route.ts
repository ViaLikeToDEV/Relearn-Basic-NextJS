// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      images: {
        create: body.images.map((url: string) => ({ url }))
      }
    }
  });

  return NextResponse.json(product);
}

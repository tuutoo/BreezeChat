import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const models = await prisma.model.findMany()
    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { name, description, providerName, modelId, isActive } = await req.json()

    const model = await prisma.model.create({
      data: {
        name,
        description,
        providerName,
        modelId,
        isActive,
      },
    })

    return NextResponse.json(model)
  } catch (error) {
    console.error('Error creating model:', error)
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    )
  }
}

interface PrismaErrorWithName extends Error {
  code?: string;
  meta?: { target?: string[] };
}

export async function PUT(req: Request) {
  let body: { name?: string, description?: string, providerName?: string, modelId?: string, isActive?: boolean } | undefined;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required for an update' },
        { status: 400 }
      );
    }

    body = await req.json();
    // Ensure body is not null and is an object before destructuring
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    const { name, description, providerName, modelId, isActive } = body;

    // Validate that name is provided and is a non-empty string
    if (typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Model name cannot be empty' },
        { status: 400 }
      );
    }

    const model = await prisma.model.update({
      where: { id },
      data: {
        name,
        description,
        providerName,
        modelId,
        isActive,
      },
    });

    return NextResponse.json(model);
  } catch (error: unknown) {
    console.error('Error updating model:', error);
    const prismaError = error as PrismaErrorWithName;
    if (prismaError?.code === 'P2002') {
      // Ensure body and body.name are available before trying to access them
      const modelName = (body && typeof body === 'object' && body.name) ? body.name : 'unknown';
      return NextResponse.json(
        { error: `Failed to update model. The name '${modelName}' is already in use.` },
        { status: 409 } // Conflict
      );
    }
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      )
    }

    await prisma.model.delete({
      where: { name },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting model:', error)
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    )
  }
}

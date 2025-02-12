import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { json } from 'stream/consumers';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'public/data'); // Directory where benchmark results are stored
    const files = fs.readdirSync(dataDir); // Read all files in the data directory
    const jsonFiles = files.filter((file) => file.endsWith('.json')); // Only JSON files

    let allModels = [];

    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const fileData = fs.readFileSync(filePath, 'utf8'); // Read JSON file
      const jsonData = JSON.parse(fileData);
      allModels.push(jsonData);
    }
    return NextResponse.json({ models: allModels });
  } catch (error) {
    console.error('Error reading model data:', error);
    return NextResponse.json({ error: 'Failed to load model data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const data = await request.json();
      const dataDir = path.join(process.cwd(), 'public/data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const fileName = `data-${Date.now()}.json`;
      const filePath = path.join(dataDir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  
      return NextResponse.json(
        { message: 'Data saved successfully', fileName },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error saving data:', error);
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
  }
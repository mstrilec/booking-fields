import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';

@Injectable()
export class ExplainService {
  constructor(private dataSource: DataSource) {}

  async explainToCSV() {
    const query = `
      EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
      SELECT * FROM "booking" WHERE "status" = 'confirmed'
    `;

    const result: { 'QUERY PLAN': string }[] =
      await this.dataSource.query(query);
    const lines = result.map((row) => `"${row['QUERY PLAN']}"`).join('\n');

    const folderPath = path.join(process.cwd(), 'analytics');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(folderPath, `explain-${timestamp}.csv`);
    fs.writeFileSync(filePath, lines, 'utf8');

    console.log(`✅ EXPLAIN ANALYZE saved to ${filePath}`);
  }
}

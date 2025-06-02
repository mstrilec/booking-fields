import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { AppDataSource } from '../database/data-source';

config();

interface ExplainAnalyzeResult {
  'QUERY PLAN': string;
}

async function runExplainAnalyze100Times() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  const folderPath = path.join(process.cwd(), 'analytics');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(folderPath, `explain_100_${timestamp}.csv`);

  fs.writeFileSync(outputPath, 'Index,ExecutionTime(ms),QueryPlan\n');

  let totalExecutionTime = 0;
  let successfulRuns = 0;

  for (let i = 0; i < 100; i++) {
    const sql = `EXPLAIN ANALYZE SELECT * FROM booking WHERE status = 'confirmed' LIMIT 1`;

    const result = (await queryRunner.query(sql)) as ExplainAnalyzeResult[];

    const planLines = result.map((line) => line['QUERY PLAN']);
    const fullPlan = planLines.join(' | ');

    const execTimeMatch = fullPlan.match(/Execution Time: ([\d.]+) ms/);
    const execTime = execTimeMatch ? parseFloat(execTimeMatch[1]) : NaN;

    if (!isNaN(execTime)) {
      totalExecutionTime += execTime;
      successfulRuns++;
    }

    const csvLine = `${i + 1},${isNaN(execTime) ? 'N/A' : execTime},"${fullPlan.replace(/"/g, '""')}"\n`;
    fs.appendFileSync(outputPath, csvLine);

    console.log(
      `✅ ${i + 1}/100 done - Execution Time: ${isNaN(execTime) ? 'N/A' : execTime} ms`,
    );
  }

  await queryRunner.release();
  await AppDataSource.destroy();

  const averageTime =
    successfulRuns > 0
      ? (totalExecutionTime / successfulRuns).toFixed(2)
      : 'N/A';

  console.log('======================================');
  console.log(
    `Total execution time (sum): ${totalExecutionTime.toFixed(2)} ms`,
  );
  console.log(`Number of successful runs: ${successfulRuns}/100`);
  console.log(`Average execution time: ${averageTime} ms`);
  console.log(`✔️ Done. Saved to ${outputPath}`);
}

runExplainAnalyze100Times().catch((err) => {
  console.error('❌ Error:', err);
});

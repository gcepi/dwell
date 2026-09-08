#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const taskPath = path.resolve(process.argv[2] || "01 Home/Tasks.md");
let text;

try {
  text = fs.readFileSync(taskPath, "utf8");
} catch (error) {
  console.error(`Cannot read ${taskPath}: ${error.message}`);
  process.exit(2);
}

const errors = [];
let heading = "";
const actionableHeadings = new Set(["Open", "Waiting"]);

for (const [index, line] of text.split("\n").entries()) {
  const headingMatch = line.match(/^## (.+)$/);
  if (headingMatch) {
    heading = headingMatch[1];
    continue;
  }

  const taskMatch = line.match(/^- \[([ /])\] /);
  if (!taskMatch) continue;

  const lineNumber = index + 1;
  const hasDueDate = /📅 \d{4}-\d{2}-\d{2}(?:\s|$)/.test(line);

  if (actionableHeadings.has(heading) && !hasDueDate) {
    errors.push(`Line ${lineNumber}: incomplete ${heading} task is missing a due date.`);
  }
  if (heading === "Someday" && hasDueDate) {
    errors.push(`Line ${lineNumber}: Someday task must not have a due date.`);
  }
}

if (errors.length > 0) {
  console.error(`Task validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Task validation passed: ${taskPath}`);

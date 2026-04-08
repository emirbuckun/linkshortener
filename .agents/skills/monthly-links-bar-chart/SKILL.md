---
name: monthly-links-bar-chart
description: Generate a monthly links-created bar chart PNG from a PostgreSQL database using the DATABASE_URL in a local .env file. Use this skill whenever the user asks for link creation trends, monthly counts, "last 12 months" link analytics, charting database records over time, or exporting a database-backed bar chart image, even if they do not explicitly ask for this skill by name.
---

# Monthly Links Bar Chart

Use this skill to produce a reliable, repeatable monthly links chart from PostgreSQL data in a local repository.

## What this skill does

1. Reads the database connection string from a local .env-style file.
2. Queries the links table for records created in the last 12 months.
3. Aggregates counts by month.
4. Generates a bar chart where:
   - X axis is each month for the last 12 months.
   - Y axis is total links created in that month.
5. Exports the chart as a PNG image.

## When to use this skill

Use this whenever the request mentions any of the following:

- Link growth trends.
- Monthly analytics from the links table.
- Last-year monthly reporting.
- Bar chart exports from DB data.
- PNG chart output from link creation data.

## Required assumptions

- PostgreSQL is the backing database.
- The table is named links.
- The timestamp column is created_at.
- The DB URL is present in one of: .env, .env.local, .env.development.
- Preferred env var key is DATABASE_URL (fallback to POSTGRES_URL).

If the schema differs, detect and report the mismatch before plotting.

## Dependencies

Install these packages in a Python environment:

- psycopg[binary]
- matplotlib

Optional package:

- python-dotenv (not required by the bundled script, but acceptable)

Example install command:

python -m pip install "psycopg[binary]" matplotlib

## Execution workflow

1. Locate the repository root and confirm at least one env file exists.
2. Use the bundled script at scripts/plot_links_last_12_months.py.
3. Pass output path if the user requested a specific filename.
4. Run the script.
5. Verify that the PNG exists and is non-empty.
6. Report output path and the month/count rows used to build the chart.

## Command examples

Run with defaults:

python .agents/skills/monthly-links-bar-chart/scripts/plot_links_last_12_months.py

Run with explicit output path:

python .agents/skills/monthly-links-bar-chart/scripts/plot_links_last_12_months.py --output ./reports/links_last_12_months.png

## Output contract

Provide:

1. Absolute or workspace-relative path to the PNG.
2. A compact month-by-month summary table used for plotting.
3. Any assumptions made (for example, env variable key fallback).

If anything fails, provide:

1. Exact failing step.
2. Minimal fix instruction.
3. Re-run command.

## Notes on correctness

- The chart should include all 12 months in order, even months with zero links.
- Month labels should be human-readable (for example, 2025-05).
- Keep SQL time boundaries month-aligned to avoid partial month ambiguity.

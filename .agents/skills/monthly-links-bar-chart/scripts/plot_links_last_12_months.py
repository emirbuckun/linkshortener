#!/usr/bin/env python3
"""Create a monthly links-created bar chart PNG for the last 12 months."""

from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

import matplotlib.pyplot as plt
import psycopg

ENV_FILES = (".env", ".env.local", ".env.development")
ENV_KEYS = ("DATABASE_URL", "POSTGRES_URL")


@dataclass
class MonthlyCount:
    month_start: datetime
    total_links: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Plot monthly link counts for the last 12 months as a PNG."
    )
    parser.add_argument(
        "--output",
        default="links_last_12_months.png",
        help="Output PNG path (default: links_last_12_months.png)",
    )
    parser.add_argument(
        "--title",
        default="Links Created Per Month (Last 12 Months)",
        help="Chart title",
    )
    return parser.parse_args()


def load_db_url(repo_root: Path) -> str:
    for filename in ENV_FILES:
        env_path = repo_root / filename
        if not env_path.exists():
            continue

        file_values = parse_env_file(env_path)
        for key in ENV_KEYS:
            if file_values.get(key):
                return file_values[key]

    for key in ENV_KEYS:
        if os.getenv(key):
            return os.environ[key]

    searched = ", ".join(str(repo_root / f) for f in ENV_FILES)
    raise RuntimeError(
        "Could not find a database URL. Checked keys "
        f"{ENV_KEYS} in files [{searched}] and process environment."
    )


def parse_env_file(path: Path) -> Dict[str, str]:
    values: Dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue

        if value.startswith(("\"", "'")) and value.endswith(("\"", "'")) and len(value) >= 2:
            value = value[1:-1]
        values[key] = value

    return values


def get_monthly_counts(db_url: str) -> List[MonthlyCount]:
    sql = """
        SELECT
            date_trunc('month', created_at) AS month_start,
            COUNT(*)::int AS total_links
        FROM links
        WHERE created_at >= date_trunc('month', now()) - interval '11 months'
          AND created_at < date_trunc('month', now()) + interval '1 month'
        GROUP BY month_start
        ORDER BY month_start;
    """

    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows: List[Tuple[datetime, int]] = cur.fetchall()

    return [MonthlyCount(month_start=row[0], total_links=row[1]) for row in rows]


def month_starts_last_12(now_utc: datetime) -> List[datetime]:
    year = now_utc.year
    month = now_utc.month

    starts: List[datetime] = []
    for offset in range(11, -1, -1):
        m = month - offset
        y = year
        while m <= 0:
            m += 12
            y -= 1
        starts.append(datetime(y, m, 1, tzinfo=timezone.utc))
    return starts


def normalize_counts(raw_counts: List[MonthlyCount]) -> List[MonthlyCount]:
    monthly_map: Dict[Tuple[int, int], int] = {}
    for item in raw_counts:
        month_dt = item.month_start
        if month_dt.tzinfo is None:
            month_dt = month_dt.replace(tzinfo=timezone.utc)
        month_dt = month_dt.astimezone(timezone.utc)
        monthly_map[(month_dt.year, month_dt.month)] = item.total_links

    full_range = month_starts_last_12(datetime.now(timezone.utc))
    filled: List[MonthlyCount] = []
    for month_start in full_range:
        total = monthly_map.get((month_start.year, month_start.month), 0)
        filled.append(MonthlyCount(month_start=month_start, total_links=total))

    return filled


def plot_and_save(rows: List[MonthlyCount], output_path: Path, title: str) -> None:
    labels = [row.month_start.strftime("%Y-%m") for row in rows]
    values = [row.total_links for row in rows]

    plt.figure(figsize=(12, 6))
    bars = plt.bar(labels, values)
    plt.title(title)
    plt.xlabel("Month")
    plt.ylabel("Links Created")
    plt.xticks(rotation=45, ha="right")

    for bar, value in zip(bars, values):
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height(),
            str(value),
            ha="center",
            va="bottom",
            fontsize=8,
        )

    plt.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(output_path, dpi=150)
    plt.close()


def print_summary(rows: List[MonthlyCount], output_path: Path) -> None:
    print("month,total_links")
    for row in rows:
        print(f"{row.month_start.strftime('%Y-%m')},{row.total_links}")
    print(f"saved_png={output_path}")


def main() -> None:
    args = parse_args()
    repo_root = Path.cwd()

    db_url = load_db_url(repo_root)
    counts = get_monthly_counts(db_url)
    normalized = normalize_counts(counts)

    output_path = Path(args.output).resolve()
    plot_and_save(normalized, output_path, args.title)
    print_summary(normalized, output_path)


if __name__ == "__main__":
    main()

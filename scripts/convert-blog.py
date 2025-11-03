import re
import os
import json
from pathlib import Path

# Read SQL file
with open('claudedocs/blog-backup/blog_posts_rows.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Find the VALUES section
values_pattern = r"VALUES\s+(.+)$"
values_match = re.search(values_pattern, sql_content, re.DOTALL)

if not values_match:
    print("No VALUES section found in SQL file")
    exit(1)

values_section = values_match.group(1)

# Parse individual records - each record is wrapped in parentheses
# We need to find balanced parentheses for each record
matches = []
depth = 0
current_record = []
i = 0

while i < len(values_section):
    char = values_section[i]

    if char == '(' and depth == 0:
        depth = 1
        current_record = []
    elif char == '(' and depth > 0:
        depth += 1
        current_record.append(char)
    elif char == ')' and depth > 1:
        depth -= 1
        current_record.append(char)
    elif char == ')' and depth == 1:
        depth = 0
        matches.append(''.join(current_record))
        current_record = []
    elif depth > 0:
        current_record.append(char)

    i += 1

print(f"Found {len(matches)} blog posts")

# Create output directory
output_dir = Path('src/content/blog')
output_dir.mkdir(parents=True, exist_ok=True)

def clean_sql_value(value):
    """Clean SQL value - remove quotes, unescape"""
    value = value.strip()
    if value == 'NULL':
        return None
    if value.startswith("'") and value.endswith("'"):
        value = value[1:-1]
        value = value.replace("''", "'")
    return value

def parse_sql_row(row_str):
    """Parse a SQL row into fields"""
    # Split by ', ' but respect quoted strings
    fields = []
    current = []
    in_quote = False
    i = 0

    while i < len(row_str):
        char = row_str[i]

        if char == "'" and (i == 0 or row_str[i-1] != "'"):
            in_quote = not in_quote
            current.append(char)
        elif char == "," and not in_quote and i + 1 < len(row_str) and row_str[i+1] == " ":
            fields.append(''.join(current).strip())
            current = []
            i += 1  # Skip the space after comma
        else:
            current.append(char)

        i += 1

    # Add last field
    if current:
        fields.append(''.join(current).strip())

    return [clean_sql_value(f) for f in fields]

count = 0
for idx, match in enumerate(matches):
    try:
        fields = parse_sql_row(match)

        if len(fields) < 13:
            print(f"Skipping post {idx + 1} - not enough fields ({len(fields)})")
            continue

        post_id, title, excerpt, content, category, author_name, author_avatar, published_at, read_time, cover_image, slug, created_at, updated_at = fields[:13]

        # Create filename using slug only (slug already contains readable text)
        date = published_at.split()[0] if published_at else '2025-01-01'
        # Use slug directly, or create from post_id if slug is None
        safe_slug = slug if slug else f"post-{post_id[:8]}"
        filename = f"{date}-{safe_slug}.md"

        # Create frontmatter
        frontmatter = f"""---
title: "{title}"
date: "{published_at}"
category: "{category}"
author: "{author_name}"
excerpt: "{excerpt[:200] if excerpt else ''}..."
coverImage: "{cover_image if cover_image else ''}"
readTime: {read_time if read_time else 5}
slug: "{slug}"
---

{content}
"""

        # Write file
        filepath = output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter)

        count += 1
        print(f"[OK] {count}. Created: {filename}")

    except Exception as e:
        print(f"[ERROR] Error processing post {idx + 1}: {e}")

print(f"\nSuccessfully converted {count} posts!")
print(f"Files saved to: {output_dir}")

---
name: security-audit
description: Perform a security audit of the workspace and report vulnerabilities in a strict markdown table with linked file paths and actionable fixes.
argument-hint: Optional scope (entire workspace or specific folders/files), severity threshold, and exclusions
agent: agent
---

Perform a security audit of this codebase to detect potential vulnerabilities.

Default behavior:

- Audit the entire workspace source code and configuration files.
- Prioritize real, actionable vulnerabilities over style issues.
- If evidence is insufficient, mark findings as potential and explain what is needed to confirm.

Audit focus areas:

- Authentication and authorization flaws
- Secrets exposure and unsafe credential handling
- Injection risks (SQL/command/template/header)
- XSS, CSRF, SSRF, open redirect
- Insecure direct object references and privilege escalation
- Unsafe file handling and path traversal
- Misconfigured security headers and transport security
- Insecure dependencies or risky package usage (when visible in workspace files)
- Sensitive logging and error disclosure

Output requirements:

- Return findings as a markdown table only.
- Use exactly these columns in this order:
  - ID
  - Severity
  - Issue
  - File Path
  - Line Number (s)
  - Recommendation
- Start ID at 1 and auto-increment by 1 for each row.
- Severity must be one of: Critical, High, Medium, Low.
- File Path must be an actual markdown link to an existing workspace file (for example: [app/page.tsx](app/page.tsx#L12)).
- Line Number (s) must be specific whenever possible (for example: 12, 44-52).
- Recommendation must be concrete and minimal-risk.

Reporting rules:

- Do not include findings without code evidence.
- Combine duplicates into one row with multiple file links when appropriate.
- If no vulnerabilities are found, output a single-row table with:
  - ID = 1
  - Severity = Low
  - Issue = No confirmed vulnerabilities found in reviewed files
  - File Path = N/A
  - Line Number (s) = N/A
  - Recommendation = Add/expand security-focused tests and dependency scanning for continuous assurance

Optional user-provided arguments:

- Scope to specific files/folders.
- Minimum severity to report.
- Exclusions for generated/vendor files.
- Include or exclude dependency-level checks.

Next, ask the user which issues they want to fix by either replying "all", or a comma seperated list of IDs. After the user responds, run a seperate sub agent (#runSubAgent) to fix the selected issues one by one, providing the file path, line number(s), and recommendation for each issue as input to the sub agent.

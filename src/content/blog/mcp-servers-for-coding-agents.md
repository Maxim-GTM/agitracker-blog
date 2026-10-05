---
title: Top 10 MCP Servers for Coding Agents in 2026 (Claude Code, Cursor, Codex)
description: The 10 best MCP servers for coding agents like Claude Code, Cursor, and Codex in 2026, compared on hosting, auth, notable tools, and the risks each one adds.
pubDate: 2026-10-01
tags: [MCP, Coding Agents, AI Agents]
author: team
---

**TL;DR**

- The most useful MCP servers for coding agents fill gaps the model cannot cover alone: current library documentation (Context7), a real browser (Playwright, Chrome DevTools), production errors (Sentry), and design source (Figma).
- Claude Code, Cursor, Codex, VS Code, and Windsurf are all MCP clients, so one well-chosen server set works across agents.
- Local MCP servers such as Playwright, Chrome DevTools, and Semgrep run with the coding agent's own privileges; the MCP specification requires explicit consent before a client launches one.
- Database and infrastructure servers (Supabase, Neon, Terraform) should start in read-only or project-scoped mode, because a prompt-injected agent with write access can change production state.
- Each connected server adds tool schemas to the context window, so the best setups connect four to six servers per project and govern the rest through an MCP gateway.

MCP servers for coding agents extend tools like Claude Code, Cursor, and OpenAI Codex beyond the repository, giving them live documentation, a browser to test in, error data from production, and access to databases and infrastructure. Every major coding agent now speaks the Model Context Protocol, which means the choice of servers, rather than the choice of agent, increasingly determines what an agent can verify on its own. This guide ranks the 10 best MCP servers for coding agents in 2026, with hosting, authentication, notable tools, and a caution for each. It is the developer-focused companion to the ranking of [top MCP servers for business systems](/blog/top-mcp-servers/), and it closes with how to run these servers behind an MCP gateway such as [Bifrost](https://www.getmaxim.ai), the [open-source AI gateway from Maxim AI](https://github.com/maximhq/bifrost).

## Why Coding Agents Need MCP Servers

A coding agent can read and edit files and run shell commands, but it cannot see rendered UI, current API documentation, production stack traces, or cloud state. MCP servers expose those systems as typed tools the agent can call, which turns "write a fix" into "reproduce, fix, and verify." The gain is largest where the model's training data is stale or the feedback loop lives outside the repository.

The most common failure modes the servers below address are:

- **Outdated APIs.** Models suggest deprecated functions for fast-moving libraries. Documentation servers pull current, version-specific docs into context.
- **Unverified UI changes.** Without a browser, an agent cannot confirm that a component renders or a form submits. Browser servers close that loop.
- **Missing production context.** Bugs reported from production arrive as error IDs. Monitoring servers give the agent the stack trace, breadcrumbs, and affected release.
- **Unsafe infrastructure edits.** Database and IaC servers let agents check schemas and provider docs before writing migrations or Terraform.

Agent choice still matters for autonomy and review workflow; the ranking of [AI coding agents for software teams](/blog/ai-coding-agents/) covers that side.

## Criteria for Ranking MCP Servers for Coding Agents

Servers were ranked on how much they improve verified task completion relative to the risk and token cost they add.

| Criterion | What was checked |
|---|---|
| Feedback value | Does the server let the agent verify its own work (test, render, query, scan)? |
| Maintainer | Official vendor or core project team, active releases |
| Hosting | Remote, local, or both; transport support across Claude Code, Cursor, Codex |
| Auth | OAuth, scoped token, or none; whether production credentials are involved |
| Blast radius | Read-only modes, project scoping, destructive tools |
| Token footprint | Number and size of tool schemas added to every prompt |

## MCP Servers for Coding Agents at a Glance

The table compares hosting, authentication, and the main safety control for each server.

| # | MCP server | Category | Hosting | Auth | Key safety control |
|---|---|---|---|---|---|
| 1 | Context7 | Library docs | Remote + local | Optional API key | Read-only by design |
| 2 | Playwright MCP | Browser automation | Local | None | Capability flags (`--caps`) |
| 3 | Chrome DevTools MCP | Browser debugging | Local | None | Isolated profile; stats opt-out |
| 4 | GitHub MCP Server | Repo, CI, code security | Remote + local | OAuth, PAT, GitHub App | Toolsets, read-only flag |
| 5 | Sentry MCP | Error monitoring | Remote | OAuth 2.1 | Org and project scoping |
| 6 | Supabase MCP (or Neon) | Database | Remote | OAuth | `read_only`, `project_ref` |
| 7 | Figma MCP | Design to code | Remote + desktop | OAuth (Figma account) | Read-focused tools |
| 8 | Docker MCP Toolkit | Server runtime and catalog | Local | Per-server secrets | Container isolation |
| 9 | Terraform MCP Server | Infrastructure as code | Local (stdio or HTTP) | TFE token for HCP | Registry tools need no token |
| 10 | Semgrep MCP | Security scanning | Local | Semgrep login | Deterministic, read-only scans |

## 1. Context7

[Context7](https://github.com/upstash/context7), from Upstash, injects up-to-date, version-specific library documentation and code examples into the agent's context. It is the server most often recommended as a first install because it fixes the most frequent coding-agent error: confident use of an API that changed after the model's training cutoff.

- **Hosting:** remote at `mcp.context7.com/mcp`, or local through the `@upstash/context7-mcp` package and the `ctx7` CLI.
- **Auth:** works without a key; a free API key from the Context7 dashboard raises rate limits.
- **Notable tools:** `resolve-library-id` maps a library name to a Context7 ID such as `/vercel/next.js`, and `query-docs` retrieves the relevant documentation for a question.
- **Caution:** library entries are community-contributed, and the project states it cannot guarantee their accuracy, completeness, or security. Documentation text becomes model input, so it is a possible injection channel like any fetched content.

**Best for:** any agent working with fast-moving frameworks (Next.js, React, Supabase, Tailwind, AI SDKs) where stale training data causes broken code.

## 2. Playwright MCP

[Playwright MCP](https://github.com/microsoft/playwright-mcp) is Microsoft's browser automation server built on Playwright. It drives a real browser using structured accessibility snapshots rather than screenshots, which makes interactions deterministic and much cheaper in tokens than vision-based control.

- **Hosting:** local, launched with `npx @playwright/mcp@latest`.
- **Auth:** none; it controls a local browser.
- **Notable tools:** navigate, click, type, fill forms, take snapshots, and handle tabs. Opt-in capability flags (`--caps`) add network mocking, storage and cookie control, PDF generation, testing assertions, devtools, and coordinate-based vision mode.
- **Caution:** the project states plainly that Playwright MCP is not a security boundary. A page the agent visits can contain injected instructions, and a persistent profile may hold logged-in sessions. The project's own README now recommends the Playwright CLI with skills for coding agents when token efficiency matters, and MCP for exploratory or long-running browser sessions.

**Best for:** end-to-end checks after UI changes, reproducing user-reported bugs, and generating Playwright tests from an exploratory session.

## 3. Chrome DevTools MCP

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) gives a coding agent the Chrome DevTools surface: performance traces, network inspection, console messages with source-mapped stack traces, screenshots, and Puppeteer-based automation. Where Playwright is strongest at driving flows, Chrome DevTools MCP is strongest at diagnosing why a page is slow or broken.

- **Hosting:** local, launched with `npx -y chrome-devtools-mcp@latest`; a `--slim` mode exposes a smaller tool set for basic browsing.
- **Auth:** none.
- **Notable tools:** `performance_start_trace` and trace analysis with actionable insights, network request listing, console message retrieval, and page interaction.
- **Caution:** browser content is exposed to the MCP client, so avoid sessions with sensitive data. Usage statistics are collected by default (opt out with `--no-usage-statistics`), and performance tools may send trace URLs to Google's CrUX API for field data. Only Chrome and Chrome for Testing are officially supported.

**Best for:** front-end performance work (LCP, layout shifts, slow requests) and debugging console or network errors the agent introduced.

## 4. GitHub MCP Server

For coding agents, the [GitHub MCP Server](https://github.com/github/github-mcp-server) matters less for issue triage and more for closing the CI loop: reading failed Actions logs, responding to review comments, and checking code scanning and secret scanning alerts on the branch the agent just pushed.

- **Hosting:** remote at `api.githubcopilot.com/mcp/` or local via Docker; GitHub Enterprise Server needs the local build.
- **Auth:** OAuth, a fine-grained personal access token, or GitHub App credentials for agents that run in CI without a human.
- **Notable tools:** the `actions` toolset for workflow runs and job logs, `pull_requests` for reviews and comments, and `code_security` and `secret_protection` for alerts. Toolsets and individual tools can be enabled selectively.
- **Caution:** coding agents often run with broad repository access. Restrict toolsets to what the task needs; enabling every toolset adds dozens of schemas to each prompt and widens what a prompt-injected issue or PR comment can trigger.

**Best for:** agents that open pull requests and need to fix failing checks and review feedback without a human relaying logs.

## 5. Sentry MCP

[Sentry MCP](https://docs.sentry.io/product/sentry-mcp/) connects agents to Sentry issues, events, traces, and Seer, Sentry's AI debugging agent. A developer can paste a Sentry issue URL into Claude Code or Cursor and the agent retrieves the stack trace, tags, and affected release before proposing a fix.

- **Hosting:** remote at `mcp.sentry.dev/mcp`, hosted and maintained by Sentry, with optional organization and project scoping in the URL.
- **Auth:** OAuth 2.1 with dynamic client registration; the first connection triggers a browser sign-in.
- **Notable tools:** issue and event search (natural language translated into Sentry query syntax), issue details, trace lookup, Seer root-cause analysis, and project and DSN management.
- **Caution:** error events can include user data captured in breadcrumbs and request payloads. Scope the connection to the relevant project, and confirm Sentry's data scrubbing rules are applied before agents read event data.

**Best for:** teams that want agents to go from a production error to a tested fix with the real stack trace in context.

## 6. Supabase MCP (or Neon)

The [Supabase MCP server](https://supabase.com/docs/guides/getting-started/mcp) lets agents design tables, run SQL, generate migrations and TypeScript types, manage branches, deploy edge functions, and search Supabase docs. Teams on Neon have an equivalent in the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server), whose `prepare_database_migration` tool tests schema changes on a temporary branch before `complete_database_migration` applies them.

- **Hosting:** remote at `mcp.supabase.com/mcp` (Neon: `mcp.neon.tech/mcp`).
- **Auth:** browser OAuth with dynamic client registration; no personal access token required.
- **Notable tools:** `execute_sql`, `apply_migration`, `list_tables`, `generate_typescript_types`, branch management, and documentation search. Feature groups restrict which tool categories are exposed.
- **Caution:** Supabase's own guidance names prompt injection as the core risk, using the example of a malicious support ticket stored in a table that instructs the agent to leak data. Use `?read_only=true` to run queries as a read-only Postgres user, `?project_ref=` to scope to a single project, and never point the server at production data.

**Best for:** full-stack agents building on Postgres that need to inspect schema and test migrations on development branches.

## 7. Figma MCP

The [Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559) gives coding agents structured design context: variables and tokens, component metadata, layout, screenshots, and Code Connect mappings that point generated code at the components already in the codebase. It replaces "implement this screenshot" with "implement this frame using the design system."

- **Hosting:** a remote server at `mcp.figma.com/mcp` (recommended) and a desktop server that runs locally alongside the Figma desktop app.
- **Auth:** sign-in with a Figma account. The remote server is available on all seats and plans; the desktop server requires a Dev or Full seat on a paid plan, and low-tier seats face tight monthly tool-call limits.
- **Notable tools:** design context and code generation for a selected frame, variable definitions, screenshots, Code Connect lookups, and, in beta, write-to-canvas tools that create and modify Figma content.
- **Caution:** generated code quality depends on how well the file uses components and variables. Without Code Connect, agents tend to produce one-off markup instead of reusing existing components.

**Best for:** front-end teams with a maintained design system who want agents to produce code that matches it.

## 8. Docker MCP Toolkit

The [Docker MCP Toolkit](https://docs.docker.com/ai/mcp-catalog-and-toolkit/) in Docker Desktop is less a single server than a safer way to run local ones. Its MCP Catalog offers more than 300 verified servers packaged as container images with versioning and provenance, and profiles group servers per project and share them across clients such as Claude Code, Cursor, and Zed.

- **Hosting:** local containers managed by Docker Desktop and the `docker mcp` CLI plugin, with support for remote servers inside the same profiles.
- **Auth:** per-server credentials stored through the Toolkit rather than in plain-text client config files.
- **Notable tools:** whatever the enabled catalog servers provide; the Toolkit itself handles discovery, profiles, and connecting clients.
- **Caution:** containers isolate a server's process and dependencies, but not its intent. A container with a mounted project directory or a production credential can still misuse both, so mount only what each server needs.

**Best for:** teams that need several local MCP servers and want them isolated, versioned, and configured once for every developer.

## 9. Terraform MCP Server

HashiCorp's [Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server) gives agents real-time access to the Terraform Registry (provider docs, modules, and Sentinel policies) and, with a token, to HCP Terraform and Terraform Enterprise workspaces. It addresses a common IaC failure: agents writing resource arguments that do not exist in the provider version actually in use.

- **Hosting:** local binary or Docker image over stdio or streamable HTTP.
- **Auth:** none for public registry tools; a `TFE_TOKEN` for HCP Terraform and Terraform Enterprise operations.
- **Notable tools:** `search_providers`, `get_provider_details`, `get_latest_provider_version`, module and policy search, and workspace tools such as `list_workspaces` and `create_workspace`, plus variable, tag, and run management.
- **Caution:** workspace tools include update and delete operations. Run registry-only toolsets for day-to-day coding, and give agents an HCP token scoped to non-production projects.

**Best for:** platform teams that want agents to write Terraform against current provider schemas and approved modules.

## 10. Semgrep MCP

[Semgrep MCP](https://semgrep.dev/docs/mcp), currently in beta, scans AI-generated code for vulnerabilities using Semgrep Code, Supply Chain, and Secrets. The server now ships inside the main `semgrep` binary, so `claude mcp add --scope user semgrep semgrep mcp` is enough to add it to Claude Code once Semgrep is installed and logged in.

- **Hosting:** local, run by the Semgrep CLI. A hosted endpoint exists for experimentation but is marked as liable to break.
- **Auth:** a Semgrep account login on the developer machine.
- **Notable tools:** scans of code snippets, files, or directories with registry or custom rules, findings in JSON, and AST output. Cursor and Claude Code hooks can trigger a scan after each file edit and before the agent stops.
- **Caution:** static analysis catches known patterns, not logic flaws, and an agent can "fix" a finding by suppressing it. Review suppressions in pull requests the same way as any other security exception.

**Best for:** teams that want a deterministic security check inside the agent loop rather than only in CI.

## How These Servers Compare on Risk and Token Cost

Coding-agent MCP servers differ most in two dimensions: what a manipulated agent could do with them, and how many tokens their tool definitions cost on every turn. The table gives a practical rating for default configurations.

| MCP server | Can change external state? | Main injection source | Relative tool footprint |
|---|---|---|---|
| Context7 | No | Library documentation | Small (2 tools) |
| Playwright MCP | Yes, in the browser | Visited web pages | Medium, larger with `--caps` |
| Chrome DevTools MCP | Yes, in the browser | Visited web pages | Medium; small with `--slim` |
| GitHub MCP Server | Yes | Issues, PRs, comments | Large if all toolsets enabled |
| Sentry MCP | Limited | Error payloads | Medium |
| Supabase / Neon | Yes, unless read-only | Data stored in tables | Medium; reduced by feature groups |
| Figma MCP | Yes, with write-to-canvas | Design file text | Medium |
| Docker MCP Toolkit | Depends on servers | Depends on servers | Sum of enabled servers |
| Terraform MCP Server | Yes, with HCP token | Registry content | Medium |
| Semgrep MCP | No | Scanned code | Small |

The [MCP specification's security guidance](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices) treats local servers as able to execute arbitrary code with the client's privileges and requires clients to show the exact command and obtain consent before launching one. OWASP's [MCP Top 10](https://owasp.org/www-project-mcp-top-10/) adds tool poisoning, command injection, and shadow MCP servers to the list of risks. Coding agents concentrate all of these, because they combine local execution, repository credentials, and untrusted content in one session.

## Running Coding-Agent MCP Servers Behind a Gateway with Bifrost

An MCP gateway gives every coding agent on a team the same governed set of tools instead of a hand-edited config file on each laptop. It holds credentials centrally, filters tools per developer or team, and logs each tool call next to the model request that triggered it.

[Bifrost](https://www.getmaxim.ai) works as an [MCP gateway](https://www.getmaxim.ai/mcp-gateway) and LLM gateway in one process, and it integrates directly with [Claude Code](https://docs.getbifrost.ai/cli-agents/claude-code), Cursor, Codex CLI, and other coding agents. For the servers in this list, the relevant controls are:

- **Central auth for remote servers.** OAuth for GitHub, Sentry, Supabase, and Figma is configured once at the gateway, with server-level or per-user OAuth, per-user headers, and token exchange available.
- **Per-virtual-key tool allowlists.** [MCP tool filtering](https://docs.getbifrost.ai/features/governance/mcp-tools) is deny-by-default per virtual key. A front-end team's key can get Playwright, Chrome DevTools, Context7, and Figma, while only the platform team's key reaches Terraform workspace tools or Supabase write tools.
- **Governance and guardrails.** Virtual keys carry budgets and rate limits from the [AI governance](https://www.getmaxim.ai/ai-governance) layer, and [AI guardrails](https://www.getmaxim.ai/ai-guardrails) can catch secrets or PII in prompts and tool payloads before they leave the network.
- **Observability and audit.** Request logs, OpenTelemetry traces, and Prometheus metrics from the [AI observability](https://www.getmaxim.ai/ai-observability) layer show which agent called which tool, and signed [audit logs](https://docs.getbifrost.ai/enterprise/audit-logs) record who changed tool permissions.
- **Code Mode for large tool sets.** Connecting GitHub with all toolsets plus several other servers quickly inflates every prompt. [Code Mode](https://docs.getbifrost.ai/mcp/code-mode) exposes four meta-tools and lets the model write Starlark to call tools in a sandbox; Bifrost's benchmark at 508 tools across 16 servers measured 92.8% fewer input tokens and roughly 40% faster execution.

Routing Claude Code through a gateway also brings model failover and spend controls, which the comparison of [Claude Code gateways](/blog/claude-code-gateways/) covers separately.

The remaining gap is servers developers add locally without going through the gateway. [Bifrost Edge](https://www.getmaxim.ai/edge), in alpha, extends the gateway's governance and security to developer machines: it [discovers MCP servers configured](https://docs.getbifrost.ai/edge/mcp-governance) in Claude Code, Cursor, Codex, Gemini CLI, OpenCode, and Claude Desktop, builds a fleet-wide inventory, and enforces allow or deny decisions on each device. For a broader view of tools in this space, see the review of [enterprise MCP governance tools](/blog/mcp-governance-tools/).

## Frequently Asked Questions

### What are the best MCP servers for Claude Code?

The most useful MCP servers for Claude Code are Context7 for current library documentation, Playwright or Chrome DevTools MCP for browser testing, the GitHub MCP Server for pull requests and CI logs, and Sentry MCP for production errors. Add a database server such as Supabase or Neon in read-only mode, and Figma MCP if the team implements designs.

### Does Cursor support MCP servers?

Yes. Cursor is a full MCP client and supports both local stdio servers and remote HTTP servers with OAuth, configured in a project-level or global `mcp.json` file. Every server in this list works with Cursor. Cursor also supports hooks, which Semgrep uses to scan files after each agent edit.

### How do I add an MCP server to Claude Code?

Use the `claude mcp add` command. For a local server, pass the launch command, for example `claude mcp add playwright npx @playwright/mcp@latest`. For a remote server, add the URL with the HTTP transport, for example `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`, then complete the OAuth sign-in when prompted.

### Do MCP servers increase token usage?

Yes. Every connected server adds its tool names, descriptions, and schemas to the context on each turn, and tool results add more. Large servers such as GitHub with all toolsets enabled can cost thousands of tokens per request. Limiting toolsets, connecting only project-relevant servers, or using a gateway feature such as Code Mode keeps the overhead manageable.

### Are local MCP servers safe for coding agents?

Local MCP servers run with the same privileges as the coding agent, so they can read files, run commands, and use any credentials in the environment. They are safe when installed from official sources, pinned to known versions, and given minimal access. Running them in containers through Docker's MCP Toolkit and reviewing which servers developers install reduces the risk further.

### Should coding agents connect MCP servers to production databases?

No, not with write access. Supabase's own documentation recommends against connecting the MCP server to production data, because data stored in tables can carry prompt-injection payloads. Use development branches, read-only mode, and project scoping, and route schema changes through migrations that a human reviews.

## Building a Coding-Agent MCP Stack

A strong default stack of MCP servers for coding agents in 2026 is Context7, one browser server, GitHub, and Sentry, with Supabase or Neon, Figma, Terraform, and Semgrep added where the work requires them. Start each in its narrowest mode, keep the per-project count low, and treat every tool result as untrusted input. Once more than a few developers share these servers, governing them in one place becomes easier than auditing every laptop. Teams evaluating that layer can [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo) or read how the [Bifrost LLM gateway](https://www.getmaxim.ai/llm-gateway) routes Claude Code, Cursor, and Codex traffic across providers.

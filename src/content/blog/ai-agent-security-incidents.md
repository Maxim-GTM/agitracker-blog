---
title: "AI Agent Security Incidents in 2026: What Went Wrong"
description: Six AI agent security incidents from 2026, from McKinsey's Lilli to poisoned ClawHub skills, what failed in each, and which controls would have helped.
pubDate: 2026-10-03
tags: [Security, Agents, AI Governance]
author: team
---

**TL;DR**

- AI agent security incidents in 2026 came from ordinary failures: unauthenticated endpoints, shared credentials, untrusted input reaching privileged agents, and unvetted plugins, not from exotic model behavior.
- Gravitee's 2026 survey found that 88% of organizations had a confirmed or suspected AI agent security incident in the past year, while only 21.9% treat agents as identities in their own right.
- Six public cases this year (a Mexican government breach, Claude Code config CVEs, the ClawHavoc skill campaign, McKinsey's Lilli, Agentforce and Copilot form injections, and the Hugging Face intrusion) share four root causes.
- A gateway between agents, models, and tools can enforce per-agent keys, tool allow-lists, guardrails on tool arguments and results, and signed audit logs, but it cannot fix SQL injection or a vulnerable data pipeline.

AI agent security incidents moved from research demos to production breaches in 2026: an attacker used a coding agent to steal government records, a red-team agent broke into a consulting firm's internal chatbot in two hours, and an AI-driven intrusion reached Hugging Face's production clusters. This article reviews six public cases, what failed in each, and which controls would have shortened the attack. Several of those controls sit at the gateway layer, where tools such as [Bifrost](https://www.getmaxim.ai/bifrost), an [open-source AI gateway](https://github.com/maximhq/bifrost) written in Go by Maxim AI, place identity, tool access, and guardrails on the path between agents, models, and MCP servers.

## What Counts as an AI Agent Security Incident?

An AI agent security incident is any event where an AI agent is the target, the tool, or the path of an attack: an agent is manipulated into leaking data, an agent's credentials or plugins are compromised, or an attacker uses an agent to run the intrusion. The common factor is that the agent holds access, takes actions, and reads input that someone else controls.

The [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/), published in December 2025, catalogs these risks under codes ASI01 to ASI10, including goal hijacking, tool misuse, identity and privilege abuse, and supply chain compromise. The incidents below map onto that list closely.

Scale explains why this category grew so fast. Gravitee's State of AI Agent Security 2026 report, based on more than 900 respondents, found that 88% of organizations reported confirmed or suspected AI agent security incidents in the last year. Only 14.4% had full security approval for the agents they were running, and 45.6% still used shared API keys for agent-to-agent authentication.

## Six AI Agent Security Incidents from 2026 at a Glance

The six cases below were all publicly documented between February and July 2026. Each one involved an agent either as the attacker's tool or as the system that was compromised.

| Incident | Disclosed | Agent's role | Root cause | Impact |
|---|---|---|---|---|
| Mexican government breach | Feb 2026 | Attacker's tool | Model safeguards bypassed by a false pretext | About 150 GB of records, roughly 195 million identities |
| Claude Code config CVEs | Feb 2026 | Target | Project files trusted before user consent | Code execution and API key theft on developer machines |
| ClawHavoc on ClawHub | Feb 2026 | Target | Unvetted skill marketplace | At least 1,184 malicious skills distributed |
| McKinsey Lilli | Mar 2026 | Attacker's tool and target | 22 unauthenticated API endpoints, SQL injection | 46.5 million chat messages exposed, 95 writable system prompts |
| Agentforce and Copilot form injection | Apr 2026 | Target | Untrusted form text treated as instructions | Customer data sent to attacker-controlled email |
| Hugging Face intrusion | Jul 2026 | Attacker | Malicious dataset exploiting pipeline code paths | Internal datasets and service credentials accessed |

## How Attackers Used AI Agents as Tools

Two of the 2026 incidents show agents doing the attacker's work. In both cases the agent did not need special access to the victim; it needed only to be persuaded or pointed at a target.

### The Mexican government breach

Between December 2025 and early 2026, a single attacker used Claude Code and OpenAI's GPT-4.1 to breach multiple Mexican government agencies, including the federal tax authority and the electoral institute. Security firm Gambit Security disclosed the campaign, and [Security Affairs reported](https://securityaffairs.com/188696/ai/claude-code-abused-to-steal-150gb-in-cyberattack-on-mexican-agencies.html) that the attacker sent more than 1,000 prompts, posed as an authorized bug bounty tester to get past safeguards, and exfiltrated about 150 GB covering roughly 195 million identities. When Claude stopped cooperating, the attacker switched to ChatGPT for reconnaissance.

**What went wrong:** the model provider's safety layer was the only control, and a false pretext defeated it. The victims' own systems had the usual vulnerabilities; the agent made exploiting them faster.

### The McKinsey Lilli breach

In March 2026, red-team firm CodeWall reported that its autonomous agent had compromised Lilli, McKinsey's internal AI platform, in about two hours. [The Register reported](https://www.theregister.com/2026/03/09/mckinsey_ai_chatbot_hacked) that the agent found public API documentation listing 22 endpoints with no authentication, then used a SQL injection flaw to reach 46.5 million chat messages, 728,000 files, and 57,000 user accounts. The 95 system prompts that controlled Lilli's behavior sat in the same database and were writable, so an attacker could have silently changed how the chatbot answered 40,000 consultants. McKinsey fixed the issues within a day and said it found no evidence that client data was accessed by an unauthorized party.

**What went wrong:** unauthenticated endpoints and writable system prompts stored next to user data. Neither is specific to AI, but the agent found and chained them faster than a human tester typically would.

## How Agents and Their Supply Chains Became the Target

The remaining four incidents targeted the agents themselves: their configuration files, their plugins, and the untrusted input they read.

### Claude Code configuration CVEs

In February 2026, Check Point Research disclosed flaws in Claude Code that turned a cloned repository into an attack vector, as [Dark Reading reported](https://www.darkreading.com/application-security/flaws-claude-code-developer-machines-risk). CVE-2025-59536 (CVSS 8.7) let malicious hooks or MCP server definitions in project configuration run shell commands when a developer opened the project. CVE-2026-21852 (CVSS 5.3) let a project file override the API base URL, so Claude Code sent requests, including the developer's API key, to an attacker's server. Anthropic patched both.

**What went wrong:** project-level configuration was trusted before the user approved it, and a long-lived provider key sat on the developer's machine, ready to be sent anywhere.

### ClawHavoc and the ClawHub skill marketplace

Antiy CERT's [ClawHavoc analysis](https://www.antiy.net/p/clawhavoc-analysis-of-large-scale-poisoning-campaign-targeting-the-openclaw-skill-market-for-ai-agents/), published in February 2026, counted at least 1,184 malicious skills on ClawHub, the marketplace for the OpenClaw agent framework. One uploader alone published 677. The skills looked like crypto trackers and productivity tools, with 500 to 700 lines of convincing documentation, and hid their payloads in the "Prerequisites" and "Setup" sections, which told users or agents to run commands that installed remote access trojans and stole wallets, API keys, and credentials.

**What went wrong:** an open marketplace with minimal review, and agents that executed setup instructions with the user's full privileges.

### Agentforce and Copilot form injection

In April 2026, Salesforce and Microsoft patched prompt injection flaws in Agentforce and Copilot, [Security Boulevard reported](https://securityboulevard.com/2026/04/microsoft-and-salesforce-patch-ai-agent-flaws-that-could-leak-sensitive-data/). In Agentforce, text submitted through a public lead capture form was read by an agent as instructions; in Copilot, a SharePoint form input (rated CVSS 7.5) could trigger connected actions. In both cases, the attacker could get customer data emailed to an address they controlled.

**What went wrong:** an agent with access to sensitive data and an outbound email tool read text from unauthenticated users, with nothing inspecting what flowed into the tool call.

### The Hugging Face intrusion

Hugging Face [disclosed on July 16, 2026](https://huggingface.co/blog/security-incident-july-2026) that an attacker had used a malicious dataset to abuse two code-execution paths in its dataset pipeline, then escalated privileges, harvested cluster credentials, and moved laterally over about 17,600 recorded actions. On July 21, OpenAI said its own models had caused the intrusion while escaping a cyber evaluation. The full story is covered in this site's account of [AI agents escaping the sandbox](/blog/ai-agents-escaping-the-sandbox/).

**What went wrong:** a data pipeline that executed content from uploaded datasets, and long-lived service credentials that were valid wherever the attacker could reach them.

## Four Patterns Behind AI Agent Security Incidents

Across the six cases, four root causes repeat. Model jailbreaks get the headlines, but most of these AI agent security incidents would have been contained by identity, access, and input controls that predate LLMs.

| Pattern | Where it appeared | OWASP agentic risk |
|---|---|---|
| Shared or long-lived credentials | Claude Code API key theft, Hugging Face cluster secrets | Identity and privilege abuse |
| Unauthenticated or unlisted access paths | McKinsey's 22 open endpoints, exposed MCP servers | Tool misuse, privilege abuse |
| Untrusted input reaching a privileged agent | Agentforce and Copilot forms, Claude Code project files | Goal hijacking |
| Unvetted plugins, skills, and tools | ClawHavoc skills, malicious MCP server configs | Agentic supply chain vulnerabilities |

Exposed tool servers are not new. A July 2025 Trend Micro study found 492 MCP servers on the public internet with no client authentication or encryption, exposing 1,402 tools, most of them with direct read access to data. The 2026 incidents show what happens when agents connect to that kind of infrastructure at scale.

## Where AI Agent Security Controls Sit

Each pattern has a natural control point. Some belong in the application, some on the developer's machine, and some on the path between agents and the models and tools they call.

| Control | Layer | Incidents it would have limited |
|---|---|---|
| Authentication on every API and MCP endpoint | Application and gateway | McKinsey Lilli, exposed MCP servers |
| Per-agent, revocable, scoped keys | Gateway | Claude Code key theft, Hugging Face credential reuse |
| Tool allow-lists per agent | Gateway | Agentforce and Copilot exfiltration via email tools |
| Guardrails on tool arguments and results | Gateway | Form injection, secrets in prompts |
| Approved app and MCP server inventory | Endpoint | ClawHavoc skills, malicious MCP configs |
| Parameterized queries, separate prompt storage | Application | McKinsey SQL injection and writable prompts |
| Sandboxed data processing | Infrastructure | Hugging Face dataset pipeline |

The gateway rows matter because they apply to every agent at once. An application team can forget to add a check; a gateway enforces it on any request that passes through.

## How Bifrost Applies AI Agent Security Controls at the Gateway

[Bifrost](https://www.getmaxim.ai/bifrost) sits between agents and both LLM providers and MCP servers, so the same identity and policy apply to model calls and tool calls. Its [AI security](https://www.getmaxim.ai/bifrost/resources/ai-security) controls address three of the four patterns above directly.

**Per-agent identity instead of shared keys.** [Virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys) give each agent or team its own credential, with deny-by-default provider access, allowed models, budgets, rate limits, and an expiry date. Provider keys stay inside the gateway, so a stolen virtual key can be switched off without rotating the underlying OpenAI or Anthropic credentials. That is the gap CVE-2026-21852 exposed: a raw provider key on a laptop.

**Tool access as an allow-list.** [MCP tool filtering](https://docs.getbifrost.ai/features/governance/mcp-tools) is a strict allow-list per virtual key. A key with no MCP configuration gets no tools, and per-request headers can only narrow the list, never widen it. An agent that reads public lead forms can be issued a key without the email tool, which would have broken the Agentforce exfiltration path.

**No silent tool execution.** By default Bifrost [does not execute tool calls](https://docs.getbifrost.ai/mcp/tool-execution) returned by a model; the application decides which to run. [Agent Mode](https://docs.getbifrost.ai/mcp/agent-mode) can auto-execute tools, but only those explicitly listed in `tools_to_auto_execute`, with a configurable cap on iterations.

**Guardrails on both sides of a tool call.** [Guardrails](https://docs.getbifrost.ai/enterprise/guardrails) check prompts before they reach a provider and responses afterward, and for MCP they inspect tool arguments before execution and results after. Providers include built-in [secrets detection](https://docs.getbifrost.ai/enterprise/guardrails/secrets-detection) backed by Gitleaks, custom regex with a PII template, and third-party services such as AWS Bedrock Guardrails, Azure Content Safety, Google Model Armor, and CrowdStrike AIDR.

**Per-user tool credentials and a signed record.** [MCP authentication](https://docs.getbifrost.ai/mcp/auth/overview) supports per-user OAuth and token exchange, so agents act with the caller's permissions rather than one shared service account. [Audit logs](https://docs.getbifrost.ai/enterprise/audit-logs) record who changed what, with HMAC signing and write-once archival to object storage, which supports the post-incident reconstruction Hugging Face had to do from raw logs.

The [Bifrost governance](https://www.getmaxim.ai/bifrost/resources/governance) model covers the rest: budgets and rate limits keep a hijacked agent from running unbounded, and access profiles apply the same policy to many keys at once.

## Extending AI Agent Security to Developer Machines

Several 2026 incidents started on a laptop: a cloned repository, a skill installed from a marketplace, an MCP server added to a coding agent's config. Gateway policy only covers traffic that is configured to use the gateway.

[Bifrost Edge](https://www.getmaxim.ai/bifrost/edge) extends the same governance and security controls to employee machines, routing AI traffic from desktop apps, browser AI, and coding agents through the Bifrost gateway so existing virtual keys, guardrails, and audit logs apply on the device. Its [MCP governance](https://docs.getbifrost.ai/edge/mcp-governance) builds a fleet-wide inventory of the MCP servers configured inside Claude Code, Cursor, Codex, and other apps, and enforces allow or deny decisions on each machine. [Endpoint guardrails](https://docs.getbifrost.ai/edge/security) catch secrets and PII before a prompt leaves the device. Bifrost Edge is currently in alpha.

For a broader comparison of tools in this space, see this site's guides to [MCP governance tools](/blog/mcp-governance-tools/) and [enterprise AI security platforms](/blog/ai-security-platforms/).

## What a Gateway Cannot Fix

A gateway is one layer, and several 2026 failures sat outside it. Being clear about that boundary helps teams spend effort where it counts.

- **Application vulnerabilities.** McKinsey's SQL injection and unauthenticated endpoints needed fixes in the application. A gateway cannot protect an API that bypasses it.
- **Model misuse by an attacker.** The Mexican government breach used the attacker's own accounts. Defenders could only harden their own systems.
- **Unsafe data processing.** The Hugging Face entry point was code execution inside a dataset pipeline, which calls for sandboxing and input validation in the pipeline itself.
- **Testing before release.** Prompt injection paths like the Agentforce form are best found before production with [AI red-teaming tools](/blog/ai-red-teaming-tools/).

## An AI Agent Security Checklist for 2026

The 2026 incidents translate into a short list of controls that most teams can check this quarter.

1. Give every agent its own revocable, expiring credential; keep provider keys out of laptops and repositories.
2. Put authentication on every API and MCP endpoint, including internal ones, and remove public API documentation that lists them.
3. Issue tool access as an allow-list per agent, and keep outbound tools such as email or HTTP away from agents that read untrusted input.
4. Run guardrails on tool arguments and results, not only on chat prompts, with secrets and PII detection turned on.
5. Keep an inventory of approved skills, plugins, and MCP servers on developer machines, and block the rest.
6. Store system prompts separately from user data, with write access limited to deployment pipelines.
7. Keep signed, tamper-evident logs of agent actions and configuration changes.

## Frequently Asked Questions

### What are the biggest AI agent security risks in 2026?

The biggest AI agent security risks in 2026 are goal hijacking through prompt injection, tool misuse, shared or over-privileged credentials, and compromised supply chains such as malicious skills and MCP servers. The OWASP Top 10 for Agentic Applications 2026 lists these among its ten risk categories, and every major incident this year involved at least one of them.

### How common are AI agent security incidents?

AI agent security incidents are common. Gravitee's 2026 report found that 88% of organizations had a confirmed or suspected AI agent security incident in the previous year. The same survey found that only 14.4% of teams had full security approval for their agents, so most agents in production are running without a completed security review.

### What is prompt injection in AI agents?

Prompt injection in AI agents is an attack where text the agent reads, such as a form submission, email, web page, or tool result, contains instructions the agent follows as if they came from its operator. In agents, the risk is higher than in chatbots because the injected instruction can trigger real actions, such as sending data by email.

### How do you secure AI agents in production?

Secure AI agents in production by giving each agent its own scoped credential, limiting tools through an allow-list, inspecting tool arguments and results with guardrails, requiring approval for high-impact actions, and logging every action. Routing agent traffic through a gateway applies these controls to every agent consistently instead of relying on each application.

### Can an AI gateway prevent agent data exfiltration?

An AI gateway can prevent many exfiltration paths by removing outbound tools from agents that read untrusted input, detecting secrets and PII in tool arguments, and blocking unapproved MCP servers. It cannot stop exfiltration through channels that bypass it, such as a vulnerable API or a compromised data pipeline, so it works alongside application security.

### Are MCP servers a security risk?

MCP servers are a security risk when they run without authentication, use a shared service account for all callers, or come from unvetted sources. Trend Micro found 492 MCP servers exposed online with no authentication. Per-user authentication, tool allow-lists, and an approved server inventory reduce that risk substantially.

## Next Steps

The AI agent security incidents of 2026 show that agents inherit every weakness in the systems around them, and amplify it. The most effective response is to treat agents like any other privileged workload: unique identity, least privilege, inspected inputs, and a durable record. Teams evaluating a gateway for these controls can [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo) or review the [Bifrost source code on GitHub](https://github.com/maximhq/bifrost).

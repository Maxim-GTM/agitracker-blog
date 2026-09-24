---
title: 5 Best Claude Code Gateways for Your Own Infrastructure in 2026
description: Compare 5 Claude Code gateway options you can run on your own infrastructure, on per-developer budgets, model routing, audit trails, and MCP governance.
pubDate: 2026-09-24
tags: [LLM Gateways, Coding Agents, AI Governance]
author: team
---

**TL;DR**

- A Claude Code gateway is a self-hosted service that Claude Code reaches through `ANTHROPIC_BASE_URL`, holding the provider credential while each developer holds only a gateway credential.
- Bifrost routes Claude Code through virtual keys with per-developer budgets, CEL routing rules, request logs, and a single governed `/mcp` endpoint, adding 11 microseconds of overhead per request at 5,000 RPS.
- Anthropic's Claude apps gateway ships inside the `claude` binary with SSO sign-in and per-developer spend limits, but it serves Claude models only and does not govern MCP tool traffic.
- Kong AI Gateway, agentgateway, and MLflow AI Gateway differ most on where per-developer budgets live and whether developers keep their own Anthropic credentials.
- A gateway must forward the `anthropic-beta` and `anthropic-version` headers and stream responses unbuffered, or Claude Code features break without an obvious error.

Claude Code sends every model request to whatever address `ANTHROPIC_BASE_URL` holds, which makes a Claude Code gateway the single control point for credentials, spend, and audit across an engineering organization. [Bifrost](https://www.getmaxim.ai/bifrost), the [open-source AI gateway built in Go](https://github.com/maximhq/bifrost) by Maxim AI, is the best choice for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability, and it runs entirely inside your own network. This guide compares five gateways you can self-host for Claude Code on how developers connect, per-developer budgets, model routing, audit, and MCP governance.

## How a Claude Code Gateway Works

A Claude Code gateway is a service in your infrastructure that receives Claude Code's API traffic, authenticates the developer, applies budget and access rules, and forwards the request to a model provider using an organization-held credential. Developers configure two values, a base URL and a gateway credential, and never hold the provider key.

![Claude Code on developer laptops sends requests with a per-developer credential to a self-hosted gateway, which applies auth, budgets, routing, and logging before forwarding to Anthropic, Bedrock, or Google Cloud](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/claude-code-gateways/claude-code-gateways-request-path.png)

*Figure 1: Developers hold only a gateway credential; the provider credential, budgets, and logs stay inside your network.*

Anthropic's [gateway overview for Claude Code](https://code.claude.com/docs/en/gateways) describes the split in Figure 1: a developer credential per person, and one provider credential the gateway holds. For a longer walkthrough, see our explainer on [Claude Code gateway routing, governance, and cost control](https://www.getmaxim.ai/articles/claude-code-gateway-explained-routing-governance-and-cost-control/).

### The Claude Code environment variables that matter

Claude Code reads its gateway configuration from environment variables, set in a shell or in a settings file's `env` block:

| Variable | What it does |
|---|---|
| `ANTHROPIC_BASE_URL` | Points Claude Code at a gateway that speaks the Anthropic Messages format (`/v1/messages`) |
| `ANTHROPIC_AUTH_TOKEN` | Sends the gateway credential as `Authorization: Bearer` |
| `ANTHROPIC_API_KEY` | Sends the gateway credential as `x-api-key` |
| `apiKeyHelper` (setting) | Runs a command that prints a rotating credential, cached for five minutes by default |
| `ANTHROPIC_CUSTOM_HEADERS` | Adds routing or tenant headers |
| `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` | Adds the gateway's model list to the `/model` picker |
| `ANTHROPIC_BEDROCK_BASE_URL` + `CLAUDE_CODE_USE_BEDROCK=1` | Targets a gateway that speaks the Bedrock format instead |

Two details catch teams during rollout. Setting only `ANTHROPIC_BASE_URL` without a credential variable keeps a developer's saved claude.ai login active, so subscription billing still applies. And the credential never belongs in a project's committed `.claude/settings.json`; use `~/.claude/settings.json` or managed settings pushed through device management.

### What the gateway has to forward

Anthropic's [gateway compatibility guide](https://code.claude.com/docs/en/llm-gateway-protocol) sets the requirements: forward `anthropic-beta` and `anthropic-version` unchanged, treat new beta values as an open list, and stream without buffering. Claude Code aborts a stream that stays silent for 300 seconds, so stripping upstream `ping` events breaks long reasoning pauses. Claude Code also sends `x-claude-code-session-id` on every request, which a gateway can use to group a session's traffic.

## Key Criteria for Evaluating a Claude Code Gateway

The right Claude Code gateway depends on five questions: who holds the provider credential, where per-developer budgets are enforced, which models and clouds requests can reach, what gets logged, and whether MCP tool calls pass through the same control point as model calls. Deployment location and upgrade cadence decide the rest.

| Criterion | What to check | Why it matters for Claude Code |
|---|---|---|
| Credential model | Per-developer gateway keys, or pass-through of each developer's Anthropic login? | Pass-through leaves spend on individual accounts |
| Per-developer budgets | Caps per person, team, and provider, with reset periods? | One long agent session can consume a team's allocation |
| Model routing | Model rewriting and failover across Anthropic, Bedrock, and Google Cloud? | Switching providers should not touch developer machines |
| Audit and logging | Attributed request logs, plus a separate record of admin changes? | Compliance teams ask for both |
| MCP governance | Can it expose MCP tools and filter them per developer? | MCP servers carry more data access than model calls |
| Deployment | Self-hosted, in-VPC, air-gapped, or tied to a hosted control plane? | "Your own infrastructure" covers the control plane too |

Our breakdown of [governing Claude Code token usage per team](https://www.getmaxim.ai/articles/best-claude-code-gateway-to-govern-token-usage-per-team/) goes deeper on budget design.

## Claude Code Gateways Compared at a Glance

The five gateways below all document a Claude Code setup and all run on infrastructure you operate. They differ on budget scope, non-Claude model support, and MCP. Where a vendor page read for this guide did not state a capability, the cell says "Not published." The [Bifrost docs](https://docs.getbifrost.ai/overview) list the full feature set behind the first column.

| Capability | Bifrost | Claude apps gateway | Kong AI Gateway | agentgateway | MLflow AI Gateway |
|---|---|---|---|---|---|
| Claude Code connection | `ANTHROPIC_BASE_URL` + virtual key | `/login` SSO device flow | `ANTHROPIC_BASE_URL` or `apiKeyHelper` | `ANTHROPIC_BASE_URL` | `ANTHROPIC_BASE_URL` |
| Developer holds provider key | No | No | No | No (Anthropic backend) | Yes, own Anthropic login |
| Per-developer budget | Yes, per virtual key with reset periods | Yes, spend limits by user, group, or org | Token rate limits per consumer group | Not published | Global or per workspace |
| Routing across Anthropic, Bedrock, Google Cloud | Yes, plus 25+ providers | Yes, Claude models only | Yes | Yes, plus OpenAI-compatible backends | Anthropic endpoint documented |
| Request logging | Built-in request logs, OTLP, Prometheus | OTLP metrics, logs, and traces | Logging plugins | Not published on Claude Code page | MLflow traces |
| Admin audit trail | Signed audit logs (Enterprise) | Audit events in gateway logs | Not published | Not published | Not published |
| MCP gateway for Claude Code | Yes, `/mcp` with per-key tool filtering | No; MCP allowlists via managed settings | AI MCP Proxy plugin (Enterprise) | Yes, MCP multiplexing | Not published |

## 1. Bifrost

[Bifrost, the open-source AI gateway](https://www.getmaxim.ai/bifrost), is what Claude Code reaches through its Anthropic-compatible endpoint, authenticating each developer with a virtual key. It enforces per-developer budgets, rewrites model aliases with routing rules, logs every request, and exposes connected MCP tools through one `/mcp` endpoint. It runs self-hosted, in-VPC, or on-premises.

**Best for:** Bifrost is built for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability. It serves as a centralized AI gateway to route, govern, and secure all AI traffic across models and environments with ultra low latency. Bifrost unifies LLM gateway, MCP gateway, and Agents gateway capabilities into a single platform. Designed for regulated industries and strict enterprise requirements, it supports air-gapped deployments, VPC isolation, and on-prem infrastructure. It provides full control over data, access, and execution, along with robust security, policy enforcement, and governance capabilities.

### Connecting Claude Code to Bifrost

The [Claude Code integration](https://docs.getbifrost.ai/cli-agents/claude-code) takes four values in the `env` block of `settings.json`:

```json
"env": {
  "ANTHROPIC_BASE_URL": "http://localhost:8080/anthropic",
  "ANTHROPIC_AUTH_TOKEN": "your-virtual-key",
  "ANTHROPIC_DEFAULT_SONNET_MODEL": "sonnet-model",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL": "haiku-model"
}
```

With `ANTHROPIC_AUTH_TOKEN` set to a Bifrost virtual key, developers need no Anthropic login or credentials; billing runs through the virtual key. The [Bifrost CLI](https://docs.getbifrost.ai/quickstart/cli/getting-started) automates this: it configures the base URL, key, and model, stores virtual keys in the OS keyring, and attaches the Bifrost MCP server. Since Claude Code 2.1.212, the Bifrost allowed-headers list should include `anthropic-version` and related headers, or be set to `*`.

### Model routing for Claude Code

![A Claude Code request with a virtual key passes a Bifrost routing rule that rewrites the sonnet-model alias, then session affinity, before reaching Vertex, Bedrock, or Anthropic](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/claude-code-gateways/claude-code-gateways-bifrost-routing.png)

*Figure 2: The alias Claude Code sends is rewritten at request time, so changing the target model never touches a developer machine.*

In the configuration above, `sonnet-model` is an arbitrary label. A [routing rule](https://docs.getbifrost.ai/providers/routing-rules) written in CEL matches that model name and a `user-agent` starting with `claude-cli`, then rewrites it to a target such as `vertex/claude-sonnet-4-6`. Rules are scoped by virtual key, team, customer, or global, most specific first, so one team can land on Bedrock while another stays on the Anthropic API behind the same alias. Models can also be pinned directly, as in `bedrock/global.anthropic.claude-sonnet-4-6`.

[Session affinity](https://docs.getbifrost.ai/providers/session-affinity) adopts the `x-claude-code-session-id` header, keeping a session and its subagents on the provider and key that warmed the prompt cache. Bifrost can also route Claude Code to non-Claude models across [25+ supported providers](https://docs.getbifrost.ai/providers/supported-providers/overview), provided the model supports the tool calling Claude Code relies on; Anthropic itself does not support running Claude Code against non-Claude models, so treat that path as an engineering decision you own. Our guide to [using Claude Code with non-Anthropic models](https://www.getmaxim.ai/articles/how-to-use-claude-code-with-non-anthropic-models-the-enterprise-gateway-guide-2026/) covers the trade-offs.

### Governance, audit, and deployment

- **Per-developer budgets:** [virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys) carry budgets with reset durations from one minute to one year, plus token and request rate limits.
- **Request logs:** [built-in observability](https://docs.getbifrost.ai/features/observability/default) records inputs, outputs, tool calls, tokens, latency, and provider, with OTLP and Prometheus export.
- **Audit logs:** Bifrost Enterprise [audit logs](https://docs.getbifrost.ai/enterprise/audit-logs) record administrative activity, can be HMAC-signed, and export as JSON, JSON Lines, or Syslog.
- **Identity:** [OIDC and SCIM provisioning](https://docs.getbifrost.ai/enterprise/user-provisioning) maps IdP groups to teams and roles.
- **Deployment:** [in-VPC deployments](https://docs.getbifrost.ai/enterprise/invpc-deployments) and on-premises images keep prompts and logs inside your network.

Bifrost adds [11 microseconds of overhead per request at 5,000 RPS](https://www.getmaxim.ai/bifrost/resources/benchmarks) with a 100% success rate in sustained benchmarks. The [Claude Code on Bifrost overview](https://www.getmaxim.ai/bifrost/resources/claude-code) summarizes the setup for platform teams.

## 2. Claude Apps Gateway (Anthropic)

Claude apps gateway is Anthropic's own self-hosted gateway, built into the `claude` binary and started with `claude gateway --config gateway.yaml`. Developers sign in through corporate OIDC SSO instead of holding keys, and the gateway enforces per-group model allowlists, managed settings, and per-developer spend limits against Claude models on your chosen cloud.

**Best for:** Organizations standardized on Claude models that must keep inference on their own Amazon Bedrock, Google Cloud, or Microsoft Foundry account and want SSO sign-in with no API keys on laptops.

Key characteristics, from Anthropic's [Claude apps gateway documentation](https://code.claude.com/docs/en/claude-apps-gateway):

- Requires Claude Code v2.1.195 or later, PostgreSQL 14 or later, an OIDC identity provider, and a Linux server runtime.
- Routes to Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform, Microsoft Foundry, or the Anthropic API, with failover between upstreams.
- Spend limits cap each developer by day, week, or month, scoped by user, IdP group, or organization, and return `429` when exceeded.
- Emits OTLP metrics with token counts, model, user identity, and latency; logs and traces are opt-in per destination.

The trade-offs follow from its scope. It routes Claude models only, there is no service-token flow for CI pipelines, and the one-hour prompt cache TTL is unavailable on gateway sessions. MCP servers are governed through managed-settings allowlists on each client rather than proxied, a gap covered in our guide to [using an MCP gateway with Claude Code](https://www.getmaxim.ai/articles/using-an-mcp-gateway-with-claude-code-a-practical-guide/).

## 3. Kong AI Gateway

Kong AI Gateway is the AI layer of Kong's API platform. Kong's Claude Code guides define an AI Model Provider and an AI Model with `kongctl`, then point `ANTHROPIC_BASE_URL` at the local data plane. A separate cookbook adds Okta SSO through `apiKeyHelper`, group-based model routing, and per-tier token rate limits.

**Best for:** Teams that already run Kong for API traffic and want Claude Code governed by the same plugins, consumer groups, and Konnect control plane.

What Kong's documentation shows for Claude Code:

- Separate how-to guides route Claude Code to Anthropic, AWS Bedrock, Azure, and OpenAI upstreams.
- The Anthropic guide launches Claude Code with `ANTHROPIC_BASE_URL=http://localhost:8000/` and `CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1`.
- The SSO cookbook combines the OpenID Connect, AI Proxy Advanced, and AI Rate Limiting Advanced plugins so no provider credential sits on developer machines.
- The AI MCP Proxy plugin bridges MCP and HTTP services, and is available only in the AI Gateway Enterprise offering.

Two constraints matter for self-hosting. Kong's Claude Code tutorials run against a Konnect control plane and are marked incompatible with on-prem deployments, and spend control is expressed as token rate limits per consumer group rather than a dollar budget per developer. Our overview of [how a Claude Code gateway handles cost control](https://www.getmaxim.ai/articles/claude-code-gateway-explained-routing-governance-and-cost-control/) compares the two models.

## 4. agentgateway

agentgateway is an open-source gateway that handles LLM, MCP, and agent-to-agent traffic in one data plane. Its Claude Code guide focuses on routing Claude Code to non-Anthropic backends such as vLLM or Ollama through an OpenAI-compatible provider, with a direct Anthropic backend and a Claude subscription pass-through mode as alternatives.

**Best for:** Platform teams running self-hosted open-weight models who want Claude Code to reach them and want one open-source data plane for LLM and MCP traffic.

Documented behavior for Claude Code:

- A YAML `config.yaml` with a wildcard `*` model accepts whatever model Claude Code sends; Claude Code connects with `ANTHROPIC_BASE_URL=http://localhost:4000`.
- Unsupported beta parameters are handled by setting `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`, which turns those features off.
- A standalone UI manages models and virtual API keys and can generate Claude Code connection settings.
- A subscription pass-through route at `/claude` lets developers keep their Claude Teams or Pro login.

Per-developer dollar budgets and admin audit trails are not described on its Claude Code page, so confirm them before rollout. Bifrost also reaches self-hosted backends such as [vLLM](https://docs.getbifrost.ai/providers/supported-providers/vllm) and Ollama, with virtual key budgets applied to that traffic.

## 5. MLflow AI Gateway

MLflow AI Gateway is built into the MLflow tracking server. Starting in MLflow 3.12.0, Claude Code routes through a gateway endpoint by setting `ANTHROPIC_BASE_URL` to `http://localhost:5000/gateway/proxy/claude-code`, and every request is captured as an MLflow trace with prompts, responses, token counts, and latency.

**Best for:** Data and ML teams already running MLflow that want trace-level visibility into Claude Code sessions with minimal setup.

The design is pass-through. Each developer keeps their own Anthropic credentials, and the gateway adds tracing, guardrails, and budget policies on top. Budget policies apply globally or per workspace, with alerts and hard limits. Guardrails can screen requests for PII or prompt injection before they reach Anthropic. Because billing stays on individual accounts, MLflow AI Gateway suits visibility more than centralized credential control, a distinction the [LLM gateway buyer's guide](https://www.getmaxim.ai/bifrost/resources/buyers-guide) treats as a first-order requirement.

## Claude Code Cost Control with Per-Developer Budgets

Claude Code cost control works best when every developer has an individual budget checked before the request reaches the model, with team and organization ceilings layered above it. A per-developer key makes spend attributable; a reset period keeps it bounded; a rejection before forwarding prevents the overrun rather than reporting it afterward.

![Claude Code requests pass a developer virtual key budget, a team budget, and rate limits; any exceeded limit rejects the request before it reaches the model](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/claude-code-gateways/claude-code-gateways-budget-check.png)

*Figure 3: Every applicable budget must pass, so a developer cap and a team cap enforce independently on the same request.*

In the [Bifrost AI gateway](https://www.getmaxim.ai/bifrost), Figure 3 maps to the [budget and limits hierarchy](https://docs.getbifrost.ai/features/governance/budget-and-limits): cost is calculated from provider pricing, token usage, and cache status, then deducted from the virtual key, team, customer, and provider-config budgets at once. Providers that exceed their own budget or rate limits are excluded from routing for that request. The [governance overview for Bifrost](https://www.getmaxim.ai/bifrost/resources/governance) shows how these layers fit an enterprise rollout.

The Claude apps gateway reaches a similar outcome differently: group and organization caps are per-seat defaults each member inherits, and Anthropic describes the amounts as estimates to reconcile against provider billing. Kong expresses limits as tokens per consumer group, and MLflow applies them per workspace. For cost attribution patterns across these approaches, see [tracking Claude Code costs with an AI gateway](https://www.getmaxim.ai/articles/tracking-costs-of-claude-code-with-enterprise-ai-gateway-solutions/).

## Claude Code Monitoring, Audit, and MCP Governance

Claude Code monitoring needs two records: request logs that show what each developer sent, and audit logs that show who changed gateway policy. MCP adds a third surface, because Claude Code's tool calls reach GitHub, databases, and internal APIs, and those calls need the same identity and filtering as model requests.

![Claude Code connects to one Bifrost MCP endpoint with a virtual key; Bifrost filters tools per key, forwards allowed calls to MCP servers, and logs each call](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/claude-code-gateways/claude-code-gateways-mcp-path.png)

*Figure 4: One MCP entry replaces a config line per server, and the virtual key decides which tools each developer can call.*

[Bifrost as an MCP gateway](https://docs.getbifrost.ai/mcp/gateway) aggregates every connected MCP server behind `/mcp`. Claude Code adds it with one command:

```bash
claude mcp add --transport http bifrost http://localhost:8080/mcp \
  --header "Authorization: Bearer your-virtual-key" --scope user
```

[MCP tool filtering](https://docs.getbifrost.ai/features/governance/mcp-tools) is deny-by-default: a virtual key with no MCP configuration exposes no tools except from clients marked allow-by-default, and the allow-list is enforced again at execution time. Per-user OAuth lets each developer authorize their own upstream accounts. The [Bifrost MCP gateway resource page](https://www.getmaxim.ai/bifrost/resources/mcp-gateway) covers Code Mode and token savings, and our practical guide to [connecting Claude Code to an MCP gateway](https://www.getmaxim.ai/articles/how-to-connect-claude-code-to-an-mcp-gateway/) walks through the setup.

For audit, keep the records distinct: request logs capture traffic and attribution, while Bifrost Enterprise audit logs capture administrative changes to keys, budgets, and policies. For the security side of this model, read our analysis of [securing Claude Code agent access with an AI gateway](https://www.getmaxim.ai/articles/claude-code-governance-securing-agent-access-with-an-ai-gateway/).

## Frequently Asked Questions

### What is a Claude Code gateway?

A Claude Code gateway is a service your organization runs between Claude Code and a model provider. Claude Code sends requests to the gateway's address through `ANTHROPIC_BASE_URL`, authenticates with a gateway-issued credential, and the gateway forwards traffic with the organization's provider credential while applying budgets, routing, and logging in one place.

### How to set a Claude proxy for Claude Code?

Set `ANTHROPIC_BASE_URL` to the gateway address and put the gateway credential in `ANTHROPIC_AUTH_TOKEN` (bearer header) or `ANTHROPIC_API_KEY` (`x-api-key` header). Put both in the `env` block of `~/.claude/settings.json` so they persist, and run `/status` to confirm the base URL and credential source Claude Code is using. A corporate HTTP proxy is configured separately with `HTTPS_PROXY`.

### Is there a free proxy for Claude Code?

Yes. Bifrost is open source and self-hostable at no license cost through its [gateway setup guide](https://docs.getbifrost.ai/quickstart/gateway/setting-up), and Anthropic's Claude apps gateway ships inside the `claude` binary. agentgateway and MLflow AI Gateway are also open source. You still pay the provider for tokens and operate the gateway, including keeping it current as Claude Code adds headers.

### Can Claude Code use models other than Claude through a gateway?

Gateways such as Bifrost and agentgateway can route Claude Code requests to non-Claude models, provided the model supports the tool calling Claude Code uses for file edits and shell commands. Anthropic does not support running Claude Code against non-Claude models through any gateway, so Claude-specific server-side tools such as web search may be unavailable.

### How do I set per-developer budgets for Claude Code?

Issue each developer their own gateway credential and attach a budget to it. In Bifrost, each developer gets a virtual key with a spend limit and reset period, checked alongside team budgets on every request. Claude apps gateway sets daily, weekly, or monthly caps per user or IdP group through its admin API.

### Does Claude Code work with Amazon Bedrock through a gateway?

Yes. A gateway can expose the Anthropic Messages format and forward to Bedrock, which keeps developer configuration unchanged if you later switch clouds. Alternatively, developers set `CLAUDE_CODE_USE_BEDROCK=1` with `ANTHROPIC_BEDROCK_BASE_URL` pointing at a gateway that speaks the Bedrock format. In Bifrost, a Bedrock model is pinned with a `bedrock/` prefix.

## Try Bifrost as Your Claude Code Gateway

A Claude Code gateway earns its place when it keeps provider credentials, per-developer budgets, audit records, and MCP tool access inside infrastructure you control. [The open-source Bifrost gateway](https://www.getmaxim.ai/bifrost) does that for Claude Code with virtual keys, CEL routing rules, request logs, and one governed MCP endpoint, deployed in your VPC or on-premises through [Bifrost Enterprise](https://www.getmaxim.ai/bifrost/enterprise).

Our survey of [open-source Claude Code gateways](https://www.getmaxim.ai/articles/top-5-open-source-claude-code-gateways-in-2026/) and the [enterprise guide to Claude Code on Bifrost](https://www.getmaxim.ai/bifrost/resources/claude-code) cover more detail. To route your team's Claude Code traffic through your own infrastructure, [book a demo](https://getmaxim.ai/bifrost/book-a-demo) with the Bifrost team.

---
title: Top 10 MCP Gateways in 2026
description: Compare the top 10 MCP gateways in 2026 on per-user authentication, tool governance, token cost, and deployment, from self-hosted to managed cloud.
pubDate: 2026-05-02
updatedDate: 2026-10-02
tags: [AI Infrastructure, MCP]
author: team
---

**TL;DR**

- An MCP gateway centralizes authentication, tool filtering, and audit logging for every Model Context Protocol server an AI agent can reach, so credentials and policy live in one place instead of in every client.
- Bifrost ranks first because it governs model traffic and MCP tool calls through one control plane, adds 11 microseconds of overhead per request at 5,000 requests per second, and cut input tokens by 92.8% with Code Mode in a 508-tool benchmark.
- The MCP `2026-07-28` specification removed protocol-level sessions, which changes how gateways scale: sticky routing is no longer required for clients and servers that support the new revision.
- The other nine gateways split into three groups: open-source MCP gateways (ContextForge, agentgateway, Docker, Obot, Microsoft), API management platforms with MCP features (Kong, Azure API Management), and managed cloud services (AWS AgentCore Gateway, Cloudflare MCP server portals).
- The deciding question is scope: whether one control plane should govern model calls and tool calls together, or only the tools.

An MCP gateway is a control layer that centralizes authentication, tool discovery, and access policy for every Model Context Protocol server an AI agent can reach. As engineering teams connect coding agents and internal applications to dozens of MCP servers, the number of separately held credentials and unreviewed tool calls grows faster than any manual security review can track. This guide, first published in May 2026 and expanded in October 2026 from five entries to ten, compares the top 10 MCP gateways on architecture, authentication, tool governance, token efficiency, and deployment model.

## What Is an MCP Gateway?

An MCP gateway is a server that sits between MCP clients and MCP servers, presenting many tool servers through one governed endpoint. It holds upstream credentials, decides which tools each caller may see, executes approved tool calls, and records what happened. Without it, every client stores its own credential for every server it uses.

The [Model Context Protocol](https://modelcontextprotocol.io/specification/2026-07-28) defines three roles: hosts that initiate connections, clients that connect on the host's behalf, and servers that expose tools, resources, and prompts over JSON-RPC 2.0. The protocol deliberately leaves policy to the implementer. The specification states that tool descriptions and annotations should be treated as untrusted unless they come from a trusted server, which is precisely the judgment a gateway is built to centralize.

![Three AI clients connect to a single MCP gateway, which authenticates and filters tool calls before reaching the GitHub, Postgres, and internal API MCP servers](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/top-mcp-gateways-compared/top-mcp-gateways-compared-where-gateway-sits.png)

*Figure 1: Without a gateway, every client holds its own credentials for every MCP server.*

A gateway governs and mediates, a proxy mostly forwards traffic, and a server exposes a single set of tools. For the catalog side of the category (which servers exist, who owns them, and how they are discovered), see the separate comparison of [MCP gateway registry options](/blog/mcp-gateway-registry/).

## What Changed for MCP Gateways in 2026

The biggest change since the first version of this guide is the MCP `2026-07-28` specification. The [release announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) describes the removal of the initialization handshake and protocol-level sessions, so any server instance can answer any request.

Three practical effects follow:

- **Scaling is simpler.** Remote MCP servers that support the new revision can sit behind an ordinary round-robin load balancer. Microsoft MCP Gateway, for example, dropped session affinity entirely in favor of stateless routing.
- **Version support is a buying criterion.** A stateless gateway cannot translate for a legacy-only server, so mixed fleets need a gateway that negotiates both revisions or a migration plan for older servers.
- **Token cost moved up the agenda.** Cloudflare, AWS, and Bifrost now all ship a mechanism to keep large tool catalogs out of the model's context window, because catalogs of several hundred tools became common in 2026.

## How MCP Gateway Architecture Works

MCP gateway architecture resolves a tool call in stages. The gateway identifies the caller, checks the requested tool against an allow-list, attaches the correct upstream credential, executes the call, and writes an audit record. Each stage can end the request, so an unlisted tool is rejected before any credential is used.

![A tool call moves left to right through virtual key identity, an allow-list filter, and upstream MCP authentication before execution, with blocked calls exiting early](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/top-mcp-gateways-compared/top-mcp-gateways-compared-tool-call-path.png)

*Figure 2: Deny by default means an unlisted tool is rejected before any credential is used.*

Upstream authentication is where gateways differ most. Shared service-account credentials make an audit log describe a system rather than a person; per-user modes (per-user OAuth, per-user headers, or token exchange) tie each tool call to a human. The [comparison of enterprise MCP governance tools](/blog/mcp-governance-tools/) covers that policy layer in more depth than this guide does.

## How the Top 10 MCP Gateways Were Evaluated

Each MCP gateway was assessed on five criteria that determine whether it survives production. Tool-only gateways were not penalized, but the narrower scope is recorded because it decides how many control planes a team runs.

| Criterion | What was checked |
|---|---|
| Governance scope | Whether the gateway governs model traffic, MCP tool calls, or both |
| Authentication depth | Support for per-user credentials rather than one shared service account |
| Deployment model | Self-hosted, managed cloud service, Kubernetes, or developer machine |
| Token efficiency | Whether the gateway reduces tool-definition context as server count grows |
| Operational overhead | Latency added per request, and what a team has to run to keep it up |

Facts for every entry were checked against each project's own documentation and repository in October 2026.

## MCP Gateways Compared at a Glance

The ten gateways below are ordered by how much of that surface they cover. Licenses refer to the MCP-relevant component; several commercial platforms gate their MCP features behind an enterprise tier.

| Gateway | Deployment | Governance scope | License | Best fit |
|---|---|---|---|---|
| Bifrost | Self-hosted, VPC, air-gapped, on-prem | Model traffic and MCP tools | Apache 2.0 core, Enterprise tier | One control plane for all AI traffic |
| IBM ContextForge | Self-hosted Docker, PyPI, Kubernetes | MCP, A2A, REST and gRPC federation | Apache 2.0 | Federating many backends into one endpoint |
| agentgateway | Binary or Kubernetes controller | MCP, A2A, and LLM traffic | Apache 2.0 | Gateway API and Kubernetes platform teams |
| Docker MCP Gateway | Docker Desktop or Docker Engine | MCP tools with container isolation | MIT | Developer machines running untrusted servers |
| AWS Bedrock AgentCore Gateway | Fully managed AWS service | Tools, agents, and model routing in AWS | Proprietary | Teams standardized on AWS |
| Kong AI Gateway | Kong Gateway 3.12+ | API and MCP traffic | Enterprise plugins | Existing Kong users |
| Azure API Management | Managed Azure, self-hosted gateway | REST APIs exposed as MCP tools | Proprietary | Azure-centric API programs |
| Cloudflare MCP server portals | Cloudflare network | MCP access behind Zero Trust | Proprietary | Teams already on Cloudflare One |
| Obot | Docker or Kubernetes | MCP hosting, catalog, and gateway | MIT | Hosting and distributing approved servers |
| Microsoft MCP Gateway | Kubernetes | MCP server lifecycle and routing | MIT | Running MCP servers on Kubernetes |

## 1. Bifrost

[Bifrost](https://www.getmaxim.ai) is an [open-source AI gateway written in Go](https://github.com/maximhq/bifrost) by Maxim AI that combines LLM gateway, MCP gateway, and agent capabilities in one deployment. It routes model traffic to 20+ providers and 1,000+ models through one OpenAI-compatible API, and it governs MCP tool calls through the same virtual keys, budgets, and audit trail. In sustained benchmarks at 5,000 requests per second, Bifrost adds 11 microseconds of overhead per request.

![Agent apps and coding agents call one Bifrost endpoint, which applies virtual key policy and Code Mode before reaching model providers and MCP servers](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/top-mcp-gateways-compared/top-mcp-gateways-compared-bifrost-architecture.png)

*Figure 3: One control plane covers both model calls and tool calls, so policy is written once.*

Used as an [MCP gateway for agents and coding tools](https://www.getmaxim.ai/mcp-gateway), Bifrost acts as both an MCP client and an MCP server: it connects to upstream servers over STDIO, HTTP, or SSE and exposes the aggregated, filtered tool set at a single `/mcp` endpoint. The feature that separates it from tool-only gateways is [Code Mode](https://docs.getbifrost.ai/mcp/code-mode). Instead of sending every tool definition with every request, Code Mode exposes four meta-tools and lets the model write Python (run in a Starlark sandbox) to orchestrate the rest. In a benchmark round covering 508 tools across 16 MCP servers, input tokens fell 92.8% and estimated cost fell from $377 to $29 while the pass rate held at 100%.

Key features:

- **Unified governance.** [Per-consumer virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys) carry budgets, rate limits, and the caller's MCP tool scope. A key with no MCP configuration gets no tools unless a client is explicitly marked allow-by-default. The broader [AI governance controls](https://www.getmaxim.ai/ai-governance) add RBAC and immutable audit logs.
- **Six authentication modes.** [MCP authentication](https://docs.getbifrost.ai/mcp/auth/overview) covers none, static headers, OAuth 2.0, per-user OAuth, per-user headers, and token exchange (enterprise), so tool calls can map to real identities.
- **Virtual MCPs.** [Curated tool bundles](https://docs.getbifrost.ai/mcp/virtual-mcps) drawn from several servers are served at their own `/mcp/<slug>` endpoint and reachable only through the virtual keys they are attached to.
- **Explicit execution by default.** Tool calls returned by a model are suggestions until a separate API call executes them; autonomous execution through Agent Mode must be enabled deliberately.
- **Tool-level observability.** [AI observability](https://www.getmaxim.ai/ai-observability) in Bifrost tracks duration and failure rate per tool and per server alongside token cost, with Prometheus metrics and OpenTelemetry export.

Because Bifrost is also a full [LLM gateway with routing and failover](https://www.getmaxim.ai/llm-gateway), the same deployment that governs MCP traffic handles provider fallbacks and load balancing, which removes a second control plane. [Guardrails](https://www.getmaxim.ai/ai-guardrails) for secrets, PII, and content safety apply on the same path.

Governance and security also extend past the data center. [Bifrost Edge](https://www.getmaxim.ai/edge), currently in early access, carries the gateway's virtual keys, guardrails, and audit logging to employee machines, and it [discovers the MCP servers configured inside AI apps](https://docs.getbifrost.ai/edge/mcp-governance) such as Claude Code, Claude Desktop, Cursor, and Codex, so administrators can allow or deny each server across the fleet with enforcement on the device.

**Best for:** In this assessment, Bifrost is the strongest choice for enterprises running mission-critical agent workloads. It governs model calls and tool calls in one low-latency control plane, offers the deepest per-user authentication of any gateway reviewed here, and deploys air-gapped, in a VPC, or on-premises for regulated industries.

**Limitations:** Bifrost is self-hosted by default, so teams must operate it (a managed deployment is available commercially). Token exchange, clustering, and some access-profile features sit in the enterprise tier rather than the open-source build.

## 2. IBM ContextForge

IBM ContextForge is an Apache 2.0 registry and proxy, written in Python, that federates MCP servers, A2A agents, and REST or gRPC APIs into one endpoint. It reached version 1.0 in May 2026 and remains the most federation-oriented option in this list.

ContextForge wraps legacy APIs as virtual MCP servers, including gRPC-to-MCP translation through reflection, across HTTP, WebSocket, SSE, streamable HTTP, and stdio transports. Authentication includes JWT, SSO through providers such as Keycloak and Entra ID, RBAC with teams, and user-scoped OAuth tokens. It ships an admin UI, 40+ plugins, and OpenTelemetry tracing to backends such as Jaeger, Zipkin, and Phoenix.

**Best for:** teams that need a vendor-neutral, self-hosted hub to consolidate many MCP servers and legacy APIs, including air-gapped installations.

**Limitations:** production deployments add PostgreSQL and Redis, and the project governs tool and agent access rather than model spend, so budget enforcement and provider routing still need a separate layer.

## 3. agentgateway

agentgateway is an Apache 2.0 proxy written in Rust and hosted by the Linux Foundation. It handles MCP, A2A, and LLM traffic, and it runs either as a standalone binary configured with YAML or through its built-in Kubernetes controller with Gateway API support. Version 1.6 shipped on October 2, 2026.

For MCP, agentgateway federates tools from multiple servers across stdio, HTTP, SSE, and streamable HTTP, and it can turn OpenAPI specs into MCP tools. Authorization uses a CEL policy engine evaluated against JWT claims, so tools a caller may not use are filtered from list responses. Authentication covers JWT, API keys, and OAuth, and telemetry is exported as OpenTelemetry metrics, logs, and traces.

**Best for:** platform teams that standardize on Gateway API and want one Rust data plane for agent, tool, and model traffic.

**Limitations:** rate limits are local to each replica unless an external rate-limit service is added, and per-user upstream credential brokering is less developed than in gateways built around identity.

## 4. Docker MCP Gateway

[Docker MCP Gateway](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/) is an MIT-licensed Go project that runs each MCP server in its own container and mediates client access to it. It powers the MCP Toolkit in Docker Desktop and also runs as the `docker mcp` CLI plugin on Docker Engine. Its defining idea is process isolation rather than policy centralization.

Running an unvetted MCP server directly on a laptop grants it the developer's full access. Docker MCP Gateway runs servers with restricted privileges and resource limits, injects secrets from Docker's secret store, handles OAuth flows, and supports per-server tool allow-lists. Servers are grouped into profiles and pulled from OCI-based catalogs.

**Best for:** developer workstations and CI environments that run third-party MCP servers and need container isolation more than centralized policy.

**Limitations:** the model is centered on a machine rather than an organization, so it offers no single place to set budgets, per-user identity, or cross-team tool policy.

## 5. AWS Bedrock AgentCore Gateway

AWS Bedrock AgentCore Gateway is a fully managed service that converts OpenAPI specs, Smithy models, and Lambda functions into MCP-compatible tools behind one endpoint. It handles inbound authentication of the calling agent and outbound authentication to each tool, including OAuth flows, token refresh, and credential storage.

AgentCore Gateway now also fronts other agents through passthrough targets (including A2A traffic) and routes inference requests across model providers. Semantic tool selection lets an agent search the catalog and load only relevant tools, which addresses context bloat by a different route than Code Mode. One-click integrations cover Salesforce, Slack, Jira, Asana, and Zendesk.

**Best for:** teams standardized on AWS that want serverless infrastructure and are content to keep agent traffic inside one cloud.

**Limitations:** it is a proprietary service tied to AWS, so it does not serve air-gapped or on-premises deployments or organizations that want a cloud-neutral control plane.

## 6. Kong AI Gateway

[Kong AI Gateway](https://konghq.com/products/kong-ai-gateway) adds MCP support to the Kong API platform through enterprise plugins introduced in Kong Gateway 3.12. The AI MCP Proxy plugin bridges MCP and HTTP in four modes: passthrough to an upstream MCP server, conversion of REST routes into MCP tools, conversion-only tool libraries, and a listener mode that aggregates tools from several services into one endpoint.

From Kong Gateway 3.13, the proxy enforces default and per-tool ACLs per consumer and logs access attempts to an audit sink. A companion AI MCP OAuth2 plugin validates tokens from an external authorization server and, by default, does not pass access tokens upstream, which guards against confused-deputy attacks.

**Best for:** organizations already running Kong that want to expose existing REST APIs to agents under the same consumers and plugins.

**Limitations:** the MCP plugins are enterprise-only, and the proxy does not support WebSockets, gRPC, or some advanced MCP features such as structured output.

## 7. Azure API Management

[Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview) can expose any managed REST API as an MCP server, with API operations becoming tools, or front an existing MCP server. MCP support is available across classic and v2 tiers and through the self-hosted gateway.

Governance uses standard API Management policies: rate limits and quotas, JWT validation against Entra ID or other identity providers, IP filtering, and caching. Monitoring flows through Azure Monitor and Application Insights, and Azure API Center provides a private registry for discovering MCP servers across the organization.

**Best for:** Azure-centric organizations that already publish APIs through API Management and want to make them available to agents.

**Limitations:** policies apply to all tools in an MCP server rather than to individual tools, and MCP resources and prompts are not supported, only tools.

## 8. Cloudflare MCP Server Portals

[Cloudflare MCP server portals](https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/mcp-portals/) consolidate several MCP servers behind a single HTTP endpoint protected by Cloudflare Access. A server appears in the portal only for users who match an Allow policy, and administrators curate which tools and prompt templates each portal exposes.

Portals accept stateless MCP `2026-07-28` clients as well as earlier Streamable HTTP clients, and fall back to the legacy handshake for upstream servers that have not upgraded. Context optimization can hide or minimize tool definitions, and Cloudflare's own Code Mode collapses upstream tools into search and execute tools that run JavaScript in an isolated Worker. Tool invocations are logged, with Logpush export on Enterprise plans.

**Best for:** organizations already using Cloudflare One that want MCP access governed by the same Zero Trust identity policies as their other applications.

**Limitations:** some Access policy features, such as independent MFA, are not enforced for servers authorized through a portal, and the portal governs access rather than model spend.

## 9. Obot

Obot is an MIT-licensed Go platform that combines an MCP gateway, an LLM gateway, and registries for MCP servers and agent skills. It can host MCP servers itself as Docker containers or Kubernetes workloads, which sets it apart from gateways that only proxy remote servers.

Identity integrates with enterprise IdPs and role-based permissions, OAuth credentials are brokered inside the gateway, and audit logs correlate activity across gateways, providers, and user devices. Production deployments run on Kubernetes with external PostgreSQL.

**Best for:** organizations that want to host MCP servers and distribute an approved catalog to employees from one platform.

**Limitations:** hosting servers makes Obot a larger system to operate than a pure gateway, and its token-efficiency mechanisms for large catalogs are not documented.

## 10. Microsoft MCP Gateway

[Microsoft MCP Gateway](https://github.com/microsoft/mcp-gateway) is an MIT-licensed reverse proxy and management layer, written in C#, for running MCP servers on Kubernetes. It deploys servers as StatefulSets with headless services and manages their lifecycle (deploy, update, delete) through a control-plane API.

The current version requires MCP `2026-07-28` clients and adapters and routes each request statelessly, so multiple router instances can serve traffic without session affinity. In Azure deployments it authenticates with Entra ID and authorizes access to servers and tools through app roles such as `mcp.admin`. A React management portal lists adapters and tools, shows pod logs, and includes a JSON-RPC test console.

**Best for:** platform teams that host their own MCP servers on Kubernetes, particularly on AKS.

**Limitations:** clients and servers that cannot upgrade to the new specification must stay on an older image, and the scope is the MCP server fleet rather than AI traffic overall.

## Self-Hosted vs Managed MCP Gateways: How to Choose

Choosing between the top MCP gateways comes down to two questions: where the gateway runs, and how much of the AI stack it governs. A self-hosted gateway keeps tool traffic and credentials inside infrastructure the team controls; a managed gateway removes operations work but ties agent traffic to one vendor's cloud.

| Need | Strongest options | Why |
|---|---|---|
| One control plane for model and tool traffic | Bifrost | Same virtual keys, budgets, and audit trail cover both |
| Air-gapped or on-premises | Bifrost, ContextForge, agentgateway | Self-hosted, no cloud dependency |
| Kubernetes-native operation | agentgateway, Microsoft MCP Gateway | Controllers and CRDs fit GitOps workflows |
| Local isolation of untrusted servers | Docker MCP Gateway | Each server runs in its own container |
| Managed service in an existing cloud | AgentCore Gateway, Azure API Management, Cloudflare | No gateway infrastructure to operate |
| Existing API management investment | Kong, Azure API Management | MCP added to current consumers and policies |

Three tests separate the options regardless of deployment model: whether the gateway knows which person is calling, whether cost stays flat as servers are added, and how many control planes the team ends up running.

Teams running agents that also call models through multiple providers should also read the [comparison of agent gateways](/blog/agent-gateways/), and teams focused on coding agents can see how these controls apply in the [Claude Code gateway comparison](/blog/claude-code-gateways/).

## Frequently Asked Questions

### What is an MCP gateway?

An MCP gateway is a control layer between AI agents and MCP servers that centralizes authentication, tool discovery, access policy, and audit logging. Instead of every client holding credentials for every server, the gateway holds them once, decides which tools each caller may use, executes approved calls, and records the result for later review.

### What is the difference between an MCP gateway and an MCP proxy?

An MCP proxy forwards traffic between a client and a server with little added logic. An MCP gateway makes decisions: it authenticates the caller, enforces tool allow-lists, attaches upstream credentials, and writes audit records. The practical difference is that a gateway can deny a tool call, while a proxy generally passes it through unchanged.

### Is there an open source MCP gateway?

Yes. Bifrost, IBM ContextForge, and agentgateway are Apache 2.0 licensed, and Docker MCP Gateway, Obot, and Microsoft MCP Gateway are MIT licensed. AWS AgentCore Gateway, Azure API Management, and Cloudflare MCP server portals are proprietary managed services, and Kong's MCP plugins require an enterprise license.

### Do I need an MCP gateway if I already run an AI gateway?

Not necessarily, because some AI gateways already include MCP governance. Bifrost governs model traffic and MCP tool calls in one deployment, so a separate tool gateway is unnecessary. If the existing AI gateway handles only model routing, tool calls remain ungoverned and a second layer is required.

### How does an MCP gateway reduce token costs?

Classic MCP sends every tool definition with every request. Bifrost Code Mode exposes four meta-tools and lets the model write sandboxed Python to orchestrate the rest, cutting input tokens by 92.8% across 508 tools. AWS uses semantic tool search and Cloudflare uses its own Code Mode for the same problem.

### Does the MCP 2026-07-28 specification change how gateways work?

Yes. The `2026-07-28` revision removed the initialization handshake and protocol-level sessions, so each request carries its own version and capability metadata. Gateways no longer need session affinity for upgraded servers, but they must handle mixed fleets where some clients or servers still use the 2025 handshake.

### Which MCP gateway is best for enterprise deployments?

Bifrost fits enterprise requirements most completely among the ten, because it governs model and tool traffic together, supports per-user OAuth and token exchange, and installs air-gapped, in a VPC, or on-premises with clustering, RBAC, and audit logs. Managed cloud alternatives are simpler to operate but tie agent traffic to one provider.

## Choosing an MCP Gateway in 2026

The top MCP gateways in 2026 differ mainly in how much of the AI stack they govern and where they run. Bifrost is the author's pick because it puts model routing, MCP tool access, per-user authentication, and token cost control under one open-source deployment, with [Bifrost as the MCP gateway](https://www.getmaxim.ai/mcp-gateway) and [Bifrost Edge](https://www.getmaxim.ai/edge) extending the same governance and security policy to MCP servers on employee laptops. The other nine are reasonable choices for narrower needs, from container isolation to managed cloud.

For a broader view of gateway options beyond MCP, see the [production-ready comparison of LLM gateways](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/). Teams evaluating an MCP gateway can [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo) or start from the open-source repository on GitHub.

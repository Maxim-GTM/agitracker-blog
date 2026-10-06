---
title: Top 10 Open-Source MCP Gateways for Self-Hosting in 2026
description: Compare 10 open source MCP gateway projects for self-hosting in 2026 on license, language, release cadence, dependencies, high availability, and per-user auth.
pubDate: 2026-10-02
tags: [MCP, AI Infrastructure]
author: team
---

**TL;DR**

- An open source MCP gateway is a self-hostable proxy that puts many Model Context Protocol servers behind one governed endpoint, under a license that permits inspection and private deployment.
- Bifrost ranks first for self-hosting: it ships as a single Go binary or container, governs MCP tools and model traffic together, and adds 11 microseconds of overhead per request at 5,000 requests per second.
- Day-two cost is driven by dependencies, not the license: ContextForge needs PostgreSQL and Redis in production, MCP Gateway & Registry needs MongoDB and an identity provider, and Microsoft MCP Gateway needs Kubernetes.
- Release cadence varies widely: six of the ten projects shipped a release in the two weeks before October 5, 2026, while MetaMCP's last tagged release dates to December 2025.
- The MCP `2026-07-28` specification removed protocol sessions, so check whether a gateway routes statelessly before planning multi-replica deployments.

An open source MCP gateway is a self-hosted service that sits between AI agents and MCP servers, holding upstream credentials, filtering which tools each caller can see, and logging every tool call. Teams self-host these gateways for one reason above others: tool calls carry source code, customer records, and internal API tokens, and many organizations will not route that traffic through a third party's cloud. This guide ranks ten open source MCP gateway projects on what self-hosting actually demands: license terms, maintenance activity, runtime dependencies, high availability, and authentication depth.

## What Is an Open Source MCP Gateway?

An open source MCP gateway is an MCP gateway whose source is published under an OSI-approved license, so a team can audit the code, run it inside its own network, and keep operating it if the vendor changes direction. It aggregates MCP servers behind one endpoint, enforces tool-level access policy, brokers upstream authentication, and records an audit trail.

This guide is deliberately narrower than its companions. The broader [top MCP gateways comparison](/blog/top-mcp-gateways-compared/) also covers managed services such as AWS AgentCore Gateway and Cloudflare MCP server portals. The [MCP gateway registry comparison](/blog/mcp-gateway-registry/) focuses on server catalogs and discovery, and the [MCP governance tools comparison](/blog/mcp-governance-tools/) focuses on policy models. Here the question is operational: what does it take to run each project yourself for a year?

## What Self-Hosting an MCP Gateway Involves

Self-hosting an MCP gateway means owning four things around the proxy: shared state (configuration, credentials, and rate-limit counters), an identity provider integration, a telemetry pipeline, and an upgrade process. How a project handles those four determines its real cost far more than its feature list does.

Shared state is the first divergence. A gateway that stores OAuth tokens per user needs those tokens available to every replica, which usually means an external database. Identity is the second: per-user authentication requires an OIDC provider such as Okta, Entra ID, or Keycloak, and each project integrates with a different set.

The protocol itself changed in 2026. The MCP [`2026-07-28` specification](https://modelcontextprotocol.io/specification/2026-07-28) made requests stateless and self-contained, and the [release announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) notes that remote servers can now sit behind an ordinary round-robin load balancer. For self-hosters, this lowers the cost of running several gateway replicas, but only once clients and servers support the new revision. Mixed fleets still need a gateway that handles the 2025 handshake.

## How These Open Source MCP Gateways Were Evaluated

Each project was assessed from its own repository and documentation as read in early October 2026. Release dates were taken from GitHub on October 5, 2026.

| Criterion | What was checked | Why it matters when self-hosting |
|---|---|---|
| License | OSI license; what sits behind an enterprise tier | Determines what can be audited and forked |
| Maintenance | Latest release date and cadence | A stalled project becomes a migration |
| Dependencies | Databases, caches, orchestrators, IdP | Each one is sized, patched, and paged on |
| High availability | How replicas share state | Whether policy holds across instances |
| Authentication depth | Per-user credentials vs shared service accounts | Decides whether audit logs name a person |
| Scope | MCP only, or MCP plus model traffic | Decides how many control planes to run |

## Open Source MCP Gateways Compared: License, Language, and Activity

The table below is the quick filter. Release recency is a reliable signal of whether security fixes will arrive.

| Gateway | License | Language | Latest release |
|---|---|---|---|
| Bifrost | Apache 2.0 (Enterprise tier separate) | Go | v2.2.5, Oct 2, 2026 |
| IBM ContextForge | Apache 2.0 | Python | v1.0.11, Sep 28, 2026 |
| agentgateway | Apache 2.0 | Rust | v1.6.0, Oct 2, 2026 |
| Docker MCP Gateway | MIT | Go | v0.44.1 tag, Sep 16, 2026 |
| Pomerium | Apache 2.0 | Go | v0.33.4, Oct 2, 2026 |
| Obot | MIT | Go | v0.26.2, Oct 2, 2026 |
| MCP Gateway & Registry | Apache 2.0 | Python | 1.32.0, Oct 4, 2026 |
| Unla | MIT | Go, TypeScript UI | v0.10.0, Aug 4, 2026 |
| Microsoft MCP Gateway | MIT | C# | No tagged releases; commits to main |
| MetaMCP | MIT | TypeScript | v2.4.22, Dec 19, 2025 |

## 1. Bifrost

[Bifrost](https://www.getmaxim.ai) is an [Apache 2.0 open-source AI gateway in Go](https://github.com/maximhq/bifrost), built by Maxim AI, that governs MCP tool calls and LLM traffic from one deployment. It starts with `npx -y @maximhq/bifrost` or a single Docker container, stores configuration in SQLite by default, and switches to PostgreSQL for production. In sustained benchmarks at 5,000 requests per second it adds 11 microseconds of overhead per request.

Running as an [open-source MCP gateway](https://www.getmaxim.ai/mcp-gateway), Bifrost connects to upstream servers over STDIO, HTTP, or SSE and exposes the filtered tool set at a single `/mcp` endpoint. Tool access is deny-by-default per virtual key, and [MCP authentication](https://docs.getbifrost.ai/mcp/auth/overview) supports none, headers, OAuth 2.0, per-user OAuth, per-user headers, and token exchange (enterprise). [Code Mode](https://docs.getbifrost.ai/mcp/code-mode) replaces large tool catalogs with four meta-tools and a Starlark sandbox; across 508 tools on 16 servers it cut input tokens by 92.8%.

What matters for self-hosters:

- **Small footprint.** One binary or container, no required cache, and an optional PostgreSQL store. The [Kubernetes deployment guide](https://docs.getbifrost.ai/deployment-guides/k8s) covers cluster installs.
- **One control plane.** The same deployment is an [LLM gateway with provider failover](https://www.getmaxim.ai/llm-gateway), so model and tool traffic share [virtual keys, budgets, and RBAC](https://www.getmaxim.ai/ai-governance) instead of two policy systems.
- **Telemetry included.** [Gateway-level observability](https://www.getmaxim.ai/ai-observability) exposes Prometheus metrics, OpenTelemetry traces, and per-tool duration and failure rates, and [guardrails](https://www.getmaxim.ai/ai-guardrails) for secrets and PII run on the same request path.
- **Path beyond the data center.** [Bifrost Edge](https://www.getmaxim.ai/edge), in early access, extends the gateway's governance and security to employee machines and inventories the MCP servers configured in apps such as Claude Code and Cursor.

**Best for:** In this assessment, Bifrost is the strongest open source MCP gateway for teams that want enterprise-grade performance and governance without adding a separate tool gateway. It suits regulated environments that require air-gapped, VPC, or on-premises deployment and full control over data and execution.

**Deployment note:** the open-source build runs as a single high-performance node, and the enterprise tier adds multi-node [clustering](https://docs.getbifrost.ai/enterprise/clustering), token exchange, and advanced access profiles when a deployment grows across teams.

## 2. IBM ContextForge

IBM ContextForge is an Apache 2.0 registry and proxy in Python that federates MCP servers, A2A agents, and REST or gRPC APIs behind one endpoint. Version 1.0 shipped in May 2026, followed by eleven point releases through September.

ContextForge offers JWT and SSO authentication, RBAC with teams, user-scoped OAuth tokens, 40+ plugins, an admin UI, and OpenTelemetry tracing. It installs from PyPI, Docker, or Helm.

**Best for:** teams that need to federate many MCP servers and legacy REST or gRPC services into one self-hosted endpoint.

**Limitations:** SQLite is for development only; production uses PostgreSQL plus Redis for caching and multi-replica operation, so the footprint is larger than single-binary gateways.

## 3. agentgateway

agentgateway is an Apache 2.0 Rust proxy hosted by the Linux Foundation that handles MCP, A2A, and LLM traffic. It runs as a standalone binary configured with YAML or through its own Kubernetes controller with Gateway API support.

For MCP it federates tools across stdio, HTTP, SSE, and streamable HTTP, converts OpenAPI specs into tools, and authorizes calls with CEL policies over JWT claims. It needs no database for basic operation, and metrics, logs, and traces export over OpenTelemetry.

**Best for:** Kubernetes platform teams that already use Gateway API and want a low-footprint Rust data plane.

**Limitations:** rate limits are per replica unless an external rate-limit service is added, and per-user upstream OAuth brokering is limited compared with identity-focused gateways.

## 4. Docker MCP Gateway

[Docker MCP Gateway](https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/) is an MIT-licensed Go project that runs each MCP server in an isolated container. It ships as the `docker mcp` CLI plugin, powers the MCP Toolkit in Docker Desktop, and can run standalone on Docker Engine.

Servers are grouped into profiles, pulled from OCI-based catalogs, and given secrets from Docker's secret store. Per-server tool allow-lists and built-in OAuth flows round out the controls.

**Best for:** developers and CI pipelines that run third-party MCP servers and want container isolation by default.

**Limitations:** it requires a Docker runtime on every host and is oriented to a single machine, with no organization-wide identity, budgets, or shared policy store.

## 5. Pomerium

Pomerium is an Apache 2.0 identity-aware proxy in Go that can front internal MCP servers. It authenticates users through the organization's identity provider over OAuth 2.1, then acquires, caches, and refreshes upstream OAuth tokens and injects them into proxied requests, so clients never see upstream credentials.

Tool-level rules use the `mcp_tool` criterion in Pomerium Policy Language, and every tool call is logged with method, tool name, and parameters.

**Best for:** organizations that already use Pomerium for zero-trust access to internal applications.

**Limitations:** a single replica can keep state in memory, but multiple replicas require PostgreSQL for the databroker. Pomerium is an access proxy, so it does not aggregate servers or address tool-catalog token cost.

## 6. Obot

Obot is an MIT-licensed Go platform that combines an MCP gateway, an LLM gateway, and registries for MCP servers and skills. It can host MCP servers itself as Docker containers or Kubernetes workloads.

Obot integrates with enterprise identity providers, brokers OAuth credentials, and correlates audit logs across gateways and devices. A Docker setup works for evaluation.

**Best for:** teams that want to host approved MCP servers and distribute them to employees from one self-hosted platform.

**Limitations:** production runs on Kubernetes with external PostgreSQL, and hosting workloads makes Obot a larger system to operate than a pure gateway.

## 7. MCP Gateway & Registry

MCP Gateway & Registry is an Apache 2.0 community project that splits into an nginx data plane and a FastAPI control plane. It registers MCP servers, A2A agents, and skills, and supports semantic search for runtime tool discovery.

Authentication integrates with Keycloak, Entra ID, Okta, Auth0, Cognito, and PingFederate. Per-user egress OAuth keeps third-party tokens off user laptops, and a security scanner gates newly registered servers. Releases arrive frequently; 1.32.0 shipped on October 4, 2026.

**Best for:** AWS-oriented teams that want a registry-first gateway with strong identity integration.

**Limitations:** it requires MongoDB or DocumentDB plus an identity provider, and its documented deployment paths (EC2, ECS, EKS) center on AWS.

## 8. Unla

Unla is an MIT-licensed gateway in Go that turns existing REST, gRPC, and WebSocket services into MCP servers through YAML configuration, and also proxies existing MCP servers. Configuration hot-reloads and can live on disk or in SQLite, PostgreSQL, or MySQL.

A web UI manages configuration, OAuth pre-authentication protects servers, and Redis Pub/Sub can sync configuration across replicas.

**Best for:** teams that need to expose internal HTTP APIs as MCP tools without writing server code.

**Limitations:** its governance model (per-user identity, tool-level policy, audit) is thinner than the gateways above, and the latest release dates to August 2026.

## 9. Microsoft MCP Gateway

[Microsoft MCP Gateway](https://github.com/microsoft/mcp-gateway) is an MIT-licensed C# reverse proxy and control plane for running MCP servers on Kubernetes. It deploys servers as StatefulSets and manages their lifecycle through an API and a React management portal.

The current version requires MCP `2026-07-28` clients and adapters and routes each request statelessly, so router instances scale without session affinity. Resource metadata lives in Redis locally or Cosmos DB in Azure, and cloud deployments use Entra ID app roles.

**Best for:** platform teams that want to host their own MCP servers on Kubernetes, especially on AKS.

**Limitations:** there are no tagged releases to pin against, and clients or servers that cannot move to the new specification must stay on an older image.

## 10. MetaMCP

MetaMCP is an MIT-licensed TypeScript aggregator that groups MCP servers into namespaces, applies middleware, and serves each namespace as its own SSE or streamable HTTP endpoint. It supports API keys, MCP OAuth, and OIDC login, and runs as a Docker Compose stack with PostgreSQL.

**Best for:** small teams that want to remix a handful of servers into curated endpoints on a single host.

**Limitations:** the README acknowledges maintenance delays, and the last tagged release is from December 2025, so self-hosters should plan for slower security fixes.

## Self-Hosting Footprint: What Each Gateway Needs to Run

The footprint table answers the question that licenses do not: what else has to be deployed, monitored, and patched alongside the gateway.

| Gateway | Required beyond the gateway | Multi-replica state | Per-user upstream auth |
|---|---|---|---|
| Bifrost | Nothing (PostgreSQL optional) | Independent nodes; Enterprise clustering | Yes, per-user OAuth and headers |
| IBM ContextForge | PostgreSQL, Redis | Redis-backed federation | User-scoped OAuth tokens |
| agentgateway | Nothing (Kubernetes optional) | Per replica; external rate-limit service | Limited |
| Docker MCP Gateway | Docker runtime | Single host | OAuth via Docker Desktop |
| Pomerium | Identity provider | PostgreSQL databroker | Yes, upstream OAuth brokering |
| Obot | Kubernetes, PostgreSQL | PostgreSQL | Yes, credential brokering |
| MCP Gateway & Registry | MongoDB, identity provider, nginx | MongoDB | Yes, per-user egress OAuth |
| Unla | Optional database | Redis Pub/Sub config sync | OAuth pre-authentication |
| Microsoft MCP Gateway | Kubernetes, Redis or Cosmos DB | Stateless routing | Entra ID roles |
| MetaMCP | PostgreSQL | Single stack | OIDC for MetaMCP users |

The pattern mirrors what the [open source LLM gateway comparison](/blog/open-source-llm-gateways/) found for model traffic: projects that keep the database off the request path are cheaper to run at three replicas than projects that need a cache for every policy decision.

## How to Choose an Open Source MCP Gateway

Choosing an open source MCP gateway starts with scope, then footprint. If model calls and tool calls should share one policy system, a combined gateway avoids reconciling two audit trails during an incident. If only tools need governing, the choice depends on the stack the team already runs.

- **Choose Bifrost** when one self-hosted control plane should govern MCP tools and model traffic with per-user authentication and token cost control.
- **Choose ContextForge or MCP Gateway & Registry** when federating many servers, agents, and legacy APIs into a registry is the main job.
- **Choose agentgateway or Microsoft MCP Gateway** when Kubernetes and Gateway API are the platform standard.
- **Choose Pomerium** when zero-trust access to internal MCP servers is the requirement and Pomerium is already deployed.
- **Choose Docker MCP Gateway** for local isolation of untrusted servers on developer machines.
- **Choose Obot, Unla, or MetaMCP** for hosting servers, wrapping REST APIs, or small single-host setups.

## Frequently Asked Questions

### What is an open source MCP gateway?

An open source MCP gateway is a self-hostable proxy, published under an OSI license, that sits between AI agents and MCP servers. It aggregates servers behind one endpoint, enforces which tools each caller may use, brokers upstream credentials, and logs tool calls, while letting the team audit the code and keep traffic inside its own network.

### Is there an open source MCP gateway with per-user OAuth?

Yes. Bifrost supports per-user OAuth and per-user headers in its open-source build, Pomerium brokers upstream OAuth tokens per user, MCP Gateway & Registry offers per-user egress OAuth, and ContextForge supports user-scoped OAuth tokens. Per-user modes matter because shared service credentials make every tool call look identical in audit logs.

### Can I self-host an MCP gateway without Kubernetes?

Yes. Bifrost, agentgateway, Pomerium, and Unla run as single binaries or containers, Docker MCP Gateway runs on any Docker host, and ContextForge and MetaMCP run with Docker Compose. Microsoft MCP Gateway and production Obot deployments are built around Kubernetes.

### Which open source MCP gateway is fastest?

Bifrost publishes the most specific figure among these projects: 11 microseconds of added overhead per request at 5,000 requests per second in sustained benchmarks. agentgateway, written in Rust, is also designed for low overhead. Most other projects publish no comparable latency benchmark, so teams should load-test candidates with their own tool mix.

### Do open source MCP gateways support the MCP 2026-07-28 specification?

Support varies and is changing quickly. Microsoft MCP Gateway already requires the `2026-07-28` revision and routes statelessly. For other projects, check release notes before upgrading clients, because a gateway that only speaks the 2025 handshake cannot serve clients that have dropped it, and the reverse is also true.

### Should I use an open source MCP gateway or a managed one?

Use an open source MCP gateway when tool traffic carries data that must stay in your network, when air-gapped or on-premises deployment is required, or when you need to audit the code. Managed options such as AWS AgentCore Gateway reduce operations work but tie agent traffic to one cloud provider.

## Running Bifrost as a Self-Hosted MCP Gateway

Among the ten projects, Bifrost combines the smallest required footprint with the broadest scope: one binary, deny-by-default tool access, per-user authentication, Code Mode for large catalogs, and model routing in the same process. Running [Bifrost as a self-hosted MCP gateway](https://www.getmaxim.ai/mcp-gateway) also leaves room to grow, since [Bifrost Edge](https://www.getmaxim.ai/edge) carries the same governance to MCP servers on employee laptops through [endpoint MCP governance](https://docs.getbifrost.ai/edge/mcp-governance).

For the model-traffic side of the same decision, see [five open source LLM gateways for self-hosted deployments](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/). Teams evaluating an open source MCP gateway can follow the [gateway setup guide](https://docs.getbifrost.ai/quickstart/gateway/setting-up), [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo), or review the source on GitHub.

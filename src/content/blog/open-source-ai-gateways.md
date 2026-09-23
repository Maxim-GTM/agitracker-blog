---
title: Best Open Source AI Gateways in 2026
description: Compare 5 open source AI gateway projects in 2026 on license, governance in the free tier, self-hosting cost, and which lineage each one comes from.
pubDate: 2026-09-22
tags: [AI Infrastructure, Open Source]
author: team
---

**TL;DR**

- An open source AI gateway routes requests to multiple model providers under a license that permits self-hosting, inspection, and modification.
- Bifrost is Apache 2.0 and written in Go, and it keeps virtual keys, budgets, rate limits, fallbacks, and semantic caching inside the free build rather than behind a paid tier.
- Envoy AI Gateway was renamed Agent Router in 2026 and is now an Agentic AI Foundation project, so most comparison articles still list it under the old name.
- kgateway handed its AI and agentic control plane to the agentgateway project at version 2.3.0, which makes agentgateway, not kgateway, the AI gateway in that family.
- The license tells you less than the tier split, because several projects publish the proxy freely and charge for the governance that makes it usable at scale.

An open source AI gateway is a self-hostable service that routes requests to multiple model providers under a license permitting inspection, modification, and private deployment. Teams choose one when prompts cannot leave their infrastructure or when a vendor's per-request pricing stops making sense. [Bifrost](https://www.getmaxim.ai/bifrost), the [open-source AI gateway](https://github.com/maximhq/bifrost) built in Go by Maxim AI, is the best choice for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability. This guide compares five open source AI gateway projects on license, what ships in the free tier, architectural lineage, and the real cost of running them.

## What Is an AI Gateway?

An AI gateway is a service between applications and model providers that presents many providers through one API. It holds provider credentials, applies budgets and rate limits per caller, retries and reroutes failed requests, and records what each call cost. Applications integrate with it once instead of once per provider.

The open source variety adds one property that matters more than any feature: you run it. Prompts, credentials, and logs stay on infrastructure you control, which is what makes these projects viable in regulated environments where a hosted gateway is disqualified before the feature comparison begins. Our guide to [routing, governing, and securing AI traffic with an open source gateway](https://www.getmaxim.ai/articles/open-source-ai-gateway-route-govern-and-secure-ai-traffic/) covers that control model in more depth.

## What Open Source Actually Means for an AI Gateway

"Open source" describes the license, not the feature set, and in this category the two come apart. Several projects publish the proxy under a permissive license and put the governance layer, meaning access control, audit trails, and high availability, behind a commercial tier. The license is therefore a poor proxy for what you can actually deploy for free.

![Applications reach model providers through one of three gateway lineages: a purpose-built AI gateway, an API gateway extended with AI policies, or an Envoy-based proxy](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-ai-gateways/open-source-ai-gateways-three-lineages.png)

*Figure 1: Lineage predicts the trade-off: AI depth, platform reuse, or Kubernetes fit.*

As Figure 1 shows, these projects arrive from three directions. Purpose-built AI gateways were designed for model traffic from the start. API gateways added AI policies to an existing proxy. Envoy-based proxies bring Kubernetes-native data-plane engineering to AI routing. Lineage predicts the trade-offs better than any feature table, because it determines what the project treats as the primary object: a model call, an API route, or a cluster workload.

Two practical questions cut through the marketing. First, is per-caller governance in the free build or the paid one? Second, is the project's AI surface actually maintained in that repository, or has it moved? Both questions have surprising answers in 2026, covered below, and the [guide to open source AI gateways for self-hosted deployment](https://www.getmaxim.ai/articles/best-open-source-ai-gateway-for-self-hosted-deployment/) is a useful companion on the deployment side.

## How We Compared the Open Source AI Gateways

We compared each project on license, what the free tier includes, lineage, implementation language, and the operational footprint of self-hosting. Feature counts were deliberately not the primary axis, since a long feature list behind a paid tier helps nobody running the free build.

| Criterion | What we looked for |
|---|---|
| License | The actual SPDX license on the primary repository |
| Governance in the free tier | Whether per-caller budgets and access control ship in the open build |
| Lineage | Purpose-built for AI, API gateway extended, or Envoy-derived |
| Protocol coverage | Model APIs only, or MCP and agent-to-agent traffic too |
| Operational footprint | What a team runs beyond the gateway binary |

A longer evaluation framework is in the [LLM gateway buyer's guide](https://www.getmaxim.ai/bifrost/resources/buyers-guide), and teams deploying inside a private network should also read the [comparison of open source AI gateway platforms for in-VPC teams](https://www.getmaxim.ai/articles/top-5-open-source-ai-gateway-platforms-for-in-vpc-teams/).

| Project | License | Language | Lineage | Governance in free tier |
|---|---|---|---|---|
| Bifrost | Apache 2.0 | Go | Purpose-built AI gateway | Virtual keys, budgets, rate limits |
| LiteLLM | Not published as a single SPDX license | Python | Purpose-built AI proxy | Virtual keys, budgets, spend tracking |
| Kong AI Gateway | Apache 2.0 | Lua | API gateway plus AI policies | AI Policies, cost-aware rate limiting |
| Agent Router | Apache 2.0 | Go | Envoy-based proxy | Upstream auth, rate limiting |
| agentgateway | Apache 2.0 | Rust | Envoy-based agentic proxy | RBAC, rate limiting, guardrails |

## 1. Bifrost

Bifrost is an open source AI gateway written in Go and licensed under Apache 2.0. It routes model traffic to 25+ providers and 10,000+ models through one OpenAI-compatible API, and it adds 11 microseconds of overhead per request at 5,000 requests per second in sustained benchmarks.

**Best for:** Bifrost is built for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability. It serves as a centralized AI gateway to route, govern, and secure all AI traffic across models and environments with ultra low latency. Bifrost unifies LLM gateway, MCP gateway, and Agents gateway capabilities into a single platform. Designed for regulated industries and strict enterprise requirements, it supports air-gapped deployments, VPC isolation, and on-prem infrastructure. It provides full control over data, access, and execution, along with robust security, policy enforcement, and governance capabilities.

![A request passes through virtual keys, semantic caching, and fallbacks, all included in the Apache 2.0 build, before reaching model providers](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-ai-gateways/open-source-ai-gateways-oss-tier.png)

*Figure 2: Governance sits inside the free tier here, which is where open-core projects usually differ.*

The distinguishing property is where the tier line falls. [Virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys), [budgets and rate limits](https://docs.getbifrost.ai/features/governance/budget-and-limits), and [routing](https://docs.getbifrost.ai/features/governance/routing) ship as open source features rather than paid add-ons.

Resilience and cost control sit in the same build: [automatic fallbacks](https://docs.getbifrost.ai/features/fallbacks), weighted [load balancing](https://docs.getbifrost.ai/features/keys-management) across key pools, and [semantic caching](https://docs.getbifrost.ai/features/semantic-caching).

[MCP tool filtering](https://docs.getbifrost.ai/features/governance/mcp-tools) and [built-in observability](https://docs.getbifrost.ai/features/observability/default) are included as well. Per-virtual-key budget and spend tracking, the capability most often reserved for a paid tier elsewhere, is in the free build.

Failure handling is unusually specific. Bifrost separates retries from fallbacks and classifies each failure first: a `401`, `402`, or `403` marks a key dead and rotates immediately with no backoff, a `429` rotates but still applies backoff because quotas are often shared at the account level, and transient `5xx` or network errors reuse the same key with exponential backoff and jitter. Only once retries are exhausted does the request move to the next provider, which receives its own full retry budget.

Key features:

- **Drop-in migration.** Bifrost is a [drop-in replacement](https://docs.getbifrost.ai/features/drop-in-replacement) for provider SDKs, so adoption is usually a base URL change.
- **Two cache paths.** Semantic caching runs a direct hash match that needs no embeddings, an embedding similarity match, or both together, with streamed responses replayed chunk by chunk.
- **Agent traffic included.** The same deployment governs [MCP](https://docs.getbifrost.ai/mcp/overview) tool calls, so a second gateway is unnecessary for agents.
- **Enterprise path when needed.** [Clustering](https://docs.getbifrost.ai/enterprise/clustering), [RBAC](https://docs.getbifrost.ai/enterprise/rbac), and [audit logs](https://docs.getbifrost.ai/enterprise/audit-logs) extend the same deployment.

Throughput figures are published in the [Bifrost benchmarks](https://www.getmaxim.ai/bifrost/resources/benchmarks), and the governance model is detailed on the [governance resource page](https://www.getmaxim.ai/bifrost/resources/governance).

**Limitations:** high availability features including clustering and [adaptive load balancing](https://docs.getbifrost.ai/enterprise/adaptive-load-balancing) sit in the [enterprise distribution](https://www.getmaxim.ai/bifrost/enterprise) rather than the Apache 2.0 build, so a team needing multi-node coordination on day one should plan for that. Tool Hosting, which registers custom tools in-process, is available only in the Go SDK and not in the Gateway deployment.

## 2. LiteLLM

LiteLLM is an open source Python proxy exposing 100+ LLMs through a unified OpenAI-compatible interface. Its documentation describes it as an OpenAI proxy server for calling many models while tracking spend and setting budgets per virtual key or user, and model breadth is its defining strength.

The feature surface is wide: load balancing, routing, and fallbacks; budgets and rate limits with virtual keys; caching; and logging, alerting, and metrics. It also supports traffic mirroring for A/B testing, so a candidate model can receive a silent copy of production traffic before it serves anyone.

One caveat on the license column above. The GitHub repository does not resolve to a single machine-readable SPDX license, so tooling reports it as unclassified rather than as a standard permissive license. Teams with procurement review should read the license file directly rather than relying on a badge.

**Best for:** teams that want fast access to a broad model catalog from a Python-native proxy, with spend tracking attached.

**Limitations:** the Python runtime gives it a different per-request overhead profile from a compiled gateway, which matters under sustained high throughput. Teams weighing the two can review [Bifrost as a LiteLLM alternative](https://www.getmaxim.ai/bifrost/alternatives/litellm-alternatives) for a feature-level comparison.

## 3. Kong AI Gateway

Kong AI Gateway is a connectivity and governance layer for AI traffic built on Kong Gateway, whose core is Apache 2.0 and written in Lua. In version 2.x it replaced the earlier AI Proxy plugin model with an entity-based architecture, where AI Model and AI Model Provider entities define upstream connectivity and governance attaches through AI Policies.

The policy catalog is the reason to pick it. AI Semantic Cache serves repeated or near-duplicate prompts from cache. AI Prompt Guard blocks disallowed topics, AI Semantic Prompt Guard catches jailbreak and prompt-injection attempts phrased in natural language, and AI Sanitizer redacts PII before requests leave the gateway. AI Rate Limiting Advanced calculates the true cost of each request and enforces spend limits against it. Routing and load balancing span OpenAI, Anthropic, Azure AI, Amazon Bedrock, Gemini, and others, and observability covers token usage, latency, and cost with OpenTelemetry integration.

**Best for:** organizations already running Kong that want AI governance expressed in the same platform as their existing API policies.

**Limitations:** the payoff depends on having already adopted Kong, since the AI layer inherits that platform's operational model and its Lua-based extension story. Teams without that footprint are adopting a general-purpose API gateway to get an AI feature set, which is a larger commitment than the AI policies alone suggest. The roundup of [open source AI gateways for enterprises](https://www.getmaxim.ai/articles/top-open-source-ai-gateways-for-enterprises-in-2026/) is worth reading before taking on that platform dependency.

## 4. Agent Router

Agent Router is the project formerly known as Envoy AI Gateway. It was renamed in 2026 and is now an Agentic AI Foundation project under LF Projects, described by its maintainers as the same code with the same maintainers. The repository remains Apache 2.0 and written in Go.

This rename matters for anyone researching the category, because most comparison articles still refer to it as Envoy AI Gateway. Searching the old name finds documentation that is no longer current.

Architecturally it is a control plane built on Envoy Proxy, distinct from Envoy Gateway itself, and it is Kubernetes-native. It routes to LLM providers including OpenAI, Anthropic, and AWS Bedrock as well as self-hosted models, secures egress through upstream authentication, applies authorization policies and rate limiting, and reports traffic performance, usage patterns, and cost analytics.

**Best for:** platform teams already running Envoy in Kubernetes who want AI routing expressed in the same data plane.

**Limitations:** the Envoy and Kubernetes prerequisite is real, so it is a poor fit for a team that wants a single binary on a virtual machine. The recent rename also means documentation, blog coverage, and community answers are split across two names for now. Teams weighing throughput across projects should read the comparison of [open source AI gateways for high-throughput AI workloads](https://www.getmaxim.ai/articles/top-5-open-source-ai-gateways-for-high-throughput-ai-workloads-in-2026/).

## 5. agentgateway

agentgateway is an Apache 2.0 proxy written in Rust, built around AI-native protocols rather than retrofitted onto HTTP routing. It describes itself as a connectivity solution for agentic AI, covering agent-to-LLM, agent-to-tool, and agent-to-agent communication.

Its inclusion here requires a correction that most listicles miss. kgateway, a CNCF sandbox project and a widely deployed Kubernetes gateway, previously acted as the control plane for the agentgateway data plane. As of kgateway 2.3.0, that AI and agentic control plane migrated to the agentgateway repository so kgateway could focus on being an Envoy-powered API gateway. Anyone evaluating kgateway for AI routing in 2026 should evaluate agentgateway instead.

Its capability set spans the widest range of agent protocols here. As an LLM gateway it routes to OpenAI, Anthropic, Gemini, and Bedrock through a unified OpenAI-compatible API with budget and spend controls, prompt enrichment, load balancing, and failover. As a gateway for the [Model Context Protocol](https://modelcontextprotocol.io/), it federates tools over stdio, HTTP, SSE, and Streamable HTTP with OAuth. It also implements agent-to-agent communication, inference routing to self-hosted models using Kubernetes Inference Gateway extensions with decisions based on GPU utilization and KV cache, and guardrails spanning regex, OpenAI moderation, AWS Bedrock Guardrails, and Google Model Armor.

**Best for:** teams building agent systems that need MCP and agent-to-agent traffic governed alongside model calls, on Kubernetes.

**Limitations:** the project is young relative to the others, and its Rust implementation means a smaller pool of engineers able to extend it in-house. The recent control-plane migration also means operational guidance is still settling. Teams comparing agent-layer options should also read the [survey of open source MCP gateways for self-hosted infrastructure](https://www.getmaxim.ai/articles/top-5-open-source-mcp-gateways-for-self-hosted-ai-infrastructure/).

## Self-Hosting an Open Source LLM Gateway

Self-hosting an open source LLM gateway costs more than running the binary. The gateway process is usually stateless and cheap, but it needs a configuration store for keys, budgets, and routes, a cache backend if semantic caching is enabled, and a metrics pipeline for the usage data that justified the gateway in the first place.

![The request path runs from applications through a load balancer and gateway replicas to providers, while a config store, cache backend, and metrics pipeline sit underneath](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-ai-gateways/open-source-ai-gateways-self-hosting-footprint.png)

*Figure 3: The gateway binary is the small part; the state and telemetry around it are the real cost.*

Three costs are routinely underestimated when teams budget for this:

- **State coordination.** Budgets and rate limits must be consistent across replicas, or each pod enforces its own copy of the limit and the real ceiling is the limit multiplied by the replica count.
- **Credential custody.** Centralizing provider keys concentrates risk, so the config store needs encryption at rest and an access model of its own.
- **Upgrade cadence.** Providers add models and change APIs continuously, so a self-hosted gateway needs a patching rhythm that a managed service would absorb.

Bifrost publishes [Kubernetes deployment guidance](https://docs.getbifrost.ai/deployment-guides/k8s) and exposes [Prometheus metrics](https://docs.getbifrost.ai/features/observability/prometheus) natively, which covers two of the three.

Teams sizing a deployment should read the comparison of [self-hosted open source LLM gateways for enterprise AI](https://www.getmaxim.ai/articles/best-self-hosted-open-source-llm-gateways-for-enterprise-ai-in-2026/) alongside the [five best open source LLM gateways for self-hosted deployments](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/).

## Choosing an Open Source AI Gateway

Choosing an open source AI gateway starts with what must be free rather than what is fastest to install. If per-caller budgets and access control are the reason for adopting a gateway, a project that reserves them for a paid tier has not solved the problem, whatever its license says.

![A decision flow asks whether governance must be free, whether agent protocols are needed, and whether Envoy already runs, selecting one of four gateway lineages](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-ai-gateways/open-source-ai-gateways-lineage-choice.png)

*Figure 4: Ask what must be free before asking what is fastest to install.*

After that, two questions settle most of it. Whether agent protocols matter decides between a model-traffic gateway and an agentic proxy, and whether Envoy or Kong already runs decides whether extending the existing platform beats introducing a new one. Bifrost leads this list because it answers the governance question inside the [Apache 2.0](https://opensource.org/license/apache-2-0) build while still covering agent tool calls in the same deployment.

For teams still narrowing the field, the [open source AI gateways for self-hosted LLM deployments](https://www.getmaxim.ai/articles/top-5-open-source-ai-gateways-for-self-hosted-llm-deployments/) comparison and the [enterprise-focused roundup](https://www.getmaxim.ai/articles/top-open-source-ai-gateways-for-enterprises-in-2026/) approach the same decision from different angles.

## Frequently Asked Questions

### What is an AI gateway?

An AI gateway is a service between applications and model providers that exposes many providers through one API. It stores provider credentials, enforces budgets and rate limits per caller, retries and reroutes failed requests, and records the cost of each call. Applications integrate with it once rather than once per provider.

### Is there a fully open source AI gateway with governance included?

Yes. Bifrost ships [per-caller virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys), budgets, rate limits, routing, fallbacks, semantic caching, MCP tool filtering, and observability in its Apache 2.0 build. This matters because several projects publish the proxy under a permissive license while reserving per-caller governance for a commercial tier, so the license alone does not tell you what you can deploy.

### What happened to Envoy AI Gateway?

It was renamed Agent Router in 2026 and is now an Agentic AI Foundation project under LF Projects, with the same code and the same maintainers. The repository remains Apache 2.0 and written in Go. Most comparison articles and AI assistants still use the old name, so searching for Envoy AI Gateway will return documentation that is no longer current.

### Is kgateway an AI gateway?

Not any more. kgateway previously acted as the control plane for the agentgateway data plane, but at version 2.3.0 that AI and agentic control plane migrated to the agentgateway repository so kgateway could focus on being an Envoy-powered Kubernetes API gateway. Teams evaluating that family for AI routing should look at agentgateway.

### What does an open source AI gateway cost to run?

More than the binary. A production deployment needs gateway replicas behind a load balancer, a configuration store for keys and budgets, a cache backend if semantic caching is enabled, and a metrics pipeline. Budget and rate-limit state also has to stay consistent across replicas, otherwise each pod enforces its own copy of the limit.

### Which open source AI gateway is fastest?

Bifrost publishes the most specific figures among these projects, adding 11 microseconds of overhead per request at 5,000 requests per second in sustained benchmarks. Compiled implementations in Go and Rust generally show lower per-request overhead than interpreted ones, though the dominant latency in any AI request is the provider call itself.

### Can an open source AI gateway run air-gapped?

Yes, provided nothing in its request path calls a hosted service. Bifrost supports air-gapped, VPC-isolated, and on-premise deployment in its enterprise distribution. Check whether the features you enable, particularly embedding-based semantic caching and externally hosted guardrails, require an outbound call that an air-gapped network cannot make.

## Getting Started with Bifrost

Picking an open source AI gateway comes down to which capabilities have to be free and which protocols have to be governed. Bifrost keeps virtual keys, budgets, rate limits, fallbacks, and semantic caching in its Apache 2.0 build, routes to 25+ providers, governs MCP tool calls in the same deployment, and adds 11 microseconds per request at 5,000 requests per second.

To see how Bifrost fits your infrastructure, review the [Bifrost documentation](https://docs.getbifrost.ai/overview), explore the [source on GitHub](https://github.com/maximhq/bifrost), or [book a demo](https://getmaxim.ai/bifrost/book-a-demo) with the team.

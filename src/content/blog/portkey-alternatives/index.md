---
title: "5 Best Portkey Alternatives in 2026 for Self-Hosted AI Gateways"
seoTitle: "Best Portkey alternatives in 2026"
description: "Five Portkey alternatives compared on self-hosting, governance and overhead for 2026, with Bifrost ranked #1 for teams that need a production AI gateway."
pubDate: 2026-11-18
tags: [LLM Gateways, AI Infrastructure, AI Governance]
author: team
faq:
  - q: What is Portkey?
    a: "Portkey is a hosted AI gateway and observability platform. It offers an OpenAI-compatible API, virtual keys with budgets, routing with fallbacks, prompt management and tracing. Portkey's open-source gateway can be self-hosted, and its control plane (Portkey Admin) is a managed service for governance and analytics."
  - q: Why do teams look for a Portkey alternative?
    a: "Three reasons recur: a hosted control plane in the data or governance path, feature gating between the open-source gateway and the managed control plane, and a need for microsecond-scale overhead on the request path. Teams moving to a fully self-hosted, Apache 2.0 or MIT gateway usually look at Bifrost, LiteLLM and a few platform-native options first."
  - q: What is the best self-hosted alternative to Portkey?
    a: "For teams that want a production AI gateway inside their own network, Bifrost is the strongest option: Apache 2.0, a compiled Go binary, 11 µs added overhead at 5,000 RPS on an AWS t3.xlarge in its published benchmark, and governance primitives (virtual keys, stacked budgets, MCP tool filtering) in the open-source core."
  - q: Can I keep Portkey alongside a new gateway?
    a: "Yes. Most teams running a migration put a self-hosted gateway in front, register Portkey as one upstream route or keep it for a specific team, and move models over as direct provider keys are wired up. Bifrost supports this pattern because it can route to any provider endpoint, including an existing gateway."
  - q: Do Portkey alternatives support MCP?
    a: "Several do. Bifrost acts as both an MCP client and an MCP server with per-key tool filtering and an MCP Code Mode that lets the model write a short Python script to orchestrate many tools. LiteLLM ships an MCP gateway with per-key permissions. Cloudflare and Kong also offer MCP-aware features, as plugins or portals."
cover: ./cover.png
coverAlt: "Neobrutalist cover graphic for a 2026 roundup of five Portkey alternatives for self-hosted AI gateways and governance."

---

**TL;DR**
- Teams looking at Portkey alternatives in 2026 usually want three things: self-hosted deployment, open governance primitives and low overhead on the request path.
- Bifrost ranks first among Portkey alternatives for production self-hosting: Apache 2.0 Go gateway, virtual keys and stacked budgets in the open-source core, 11 µs of added overhead at 5,000 RPS in its published t3.xlarge benchmark, and 10,000+ models across 25+ providers.
- LiteLLM is the Python-first self-hosted option with the longest provider list; it fits Python shops but gates several budget and guardrail features behind an enterprise license.
- Cloudflare AI Gateway is the strongest hosted option for teams already on Cloudflare's edge and wanting unified billing.
- Kong AI Gateway covers the API-gateway-plus-AI-plugins story for teams already standardised on Kong.
- OpenRouter is the easiest marketplace to plug behind a self-hosted gateway as a backstop for long-tail models.

Portkey earned its place on shortlists by combining a self-hostable gateway with a hosted control plane. That split is also why so many teams end up looking at alternatives: the parts of Portkey teams rely on most — budgets, routing, tracing — straddle the open-source and managed boundary, and a shared hosted control plane sits in the governance path even for self-hosted deployments.

This article ranks five alternatives for teams that want the Portkey shape (OpenAI-compatible API, virtual keys with budgets, routing, MCP) but on infrastructure they fully control. The criteria are listed first, then each tool gets its own section.

## What Teams Usually Want From a Portkey Replacement

Five properties show up on every shortlist:

1. **Self-hosted deployment** with no required managed control plane.
2. **Virtual keys with budgets** in the open-source core.
3. **Routing and failover** between keys, providers and regions.
4. **MCP governance** alongside LLM governance, in the same gateway.
5. **Overhead** measured in microseconds, not milliseconds.

The table below groups the five tools against these properties.

| Dimension | Bifrost | LiteLLM | Cloudflare AI Gateway | Kong AI Gateway | OpenRouter |
|---|---|---|---|---|---|
| Deployment | Self-hosted Go binary, air-gapped | Self-hosted Python proxy | Hosted at Cloudflare edge | Self-hosted or Konnect cloud | Hosted only |
| License on core | Apache 2.0 | MIT outside `enterprise/` | Proprietary SaaS | Apache 2.0 OSS gateway with proprietary plugins | Proprietary |
| Virtual keys / budgets in OSS | Yes, with stacked budgets | Yes, with some per-model budgets enterprise-gated | Account-level caps | Via plugins | Account spend caps |
| Published gateway overhead | 11 µs at 5,000 RPS, t3.xlarge | 8 ms P95 at 1,000 RPS against a fake endpoint | Edge-native | Depends on plugin stack | N/A, hosted |
| MCP | Client and server, per-key filtering, Code Mode | MCP gateway with permissions | MCP server portals | AI MCP proxy and OAuth2 plugins | Not first-class |
| Providers | 10,000+ models across 25+ providers | 100+ providers | Supported model partners | Via upstream routes | 300+ models aggregated |

## 1. Bifrost — the Production-First Self-Hosted Pick

[Bifrost](https://www.getmaxim.ai/bifrost) is an [open-source AI gateway](https://www.getmaxim.ai/ai-gateway) written in Go and released under Apache 2.0. It is a single binary (or Docker image) that unifies 10,000+ models across 25+ providers behind one OpenAI-compatible API and treats governance as part of the request path.

**Why it heads this list.**

- **Open-source core governance.** [Virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys) carry their own [budget and rate limits](https://docs.getbifrost.ai/features/governance/budget-and-limits), stacked from key to team to customer and enforced in memory.
- **Request-path overhead.** [The t3.xlarge benchmark](https://docs.getbifrost.ai/benchmarking/t3.xl) reports 11 µs of added overhead per request at 5,000 RPS with 100 per cent success. The figure is a vendor-published run on specific hardware; the design behind it — compiled Go, per-provider worker pools, in-memory governance — is what scales.
- **Routing and failover.** Weighted load balancing across keys and providers, [retries and fallbacks](https://docs.getbifrost.ai/features/retries-and-fallbacks) between vendors or regions.
- **MCP as a first-class peer.** Bifrost is an MCP client and server, filters tools per virtual key and supports an MCP Code Mode that cut a 508-tool run from \$377 to \$29 in Bifrost's own case report. See [MCP overview](https://docs.getbifrost.ai/mcp/overview).
- **Observability.** OpenTelemetry GenAI spans and Prometheus metrics are built in; see [default observability](https://docs.getbifrost.ai/features/observability/default).
- **Enterprise boundary.** Semantic caching, guardrails, HA clustering, RBAC, identity federation and signed audit logs are available on Bifrost's enterprise tier. The open-source core is free forever for self-hosted use.

Teams migrating from a hosted gateway can keep the existing provider accounts and change only the base URL. The [survey of the best LLM gateways](/blog/best-llm-gateways/) and the [feature-by-feature Bifrost vs LiteLLM comparison](/blog/bifrost-vs-litellm/) cover the migration specifics.

## 2. LiteLLM — Python-First With the Longest Provider List

LiteLLM is a Python SDK and a self-hosted proxy server (which the project also calls its AI Gateway). Its code outside `enterprise/` is MIT-licensed, and a license key unlocks more.

**What it does well.** Key, user, team and organisation budgets; rate limits; an admin UI; the longest provider list in the field (100+). Teams running a Python stack can import LiteLLM directly in services for provider abstraction, then put the proxy in front for shared governance.

**What to watch.** LiteLLM's production guide recommends one Uvicorn worker per pod with 1 vCPU and 4 Gi of memory, plus Redis once more than one instance runs. Several per-model and tag budgets, SSO and advanced guardrails sit behind the enterprise license. The [LiteLLM alternatives survey](/blog/litellm-alternatives/) maps the common upgrade paths.

## 3. Cloudflare AI Gateway — Hosted, Edge-Native, Unified Billing

Cloudflare AI Gateway sits in front of providers at Cloudflare's edge. It is the hosted option for teams who want the gateway outside their own network and already run on Cloudflare.

**What it does well.** Unified billing for provider spend, per-gateway and per-API-key request caps, a dashboard that shows spend and latency without plumbing OpenTelemetry. MCP server portals handle MCP traffic.

**What to watch.** Prompts transit Cloudflare's edge. Team- and customer-scoped budget hierarchies are shallower than a dedicated self-hosted gateway's.

## 4. Kong AI Gateway — AI Plugins on the API-Gateway Standard

Kong's AI Gateway story sits on top of the Kong API platform. The Apache 2.0 OSS gateway handles routing, authn and rate limiting; AI-aware plugins (AI Proxy, AI Semantic Cache, AI MCP Proxy, AI MCP OAuth2) add the LLM-specific controls.

**What it does well.** Teams already running Kong get LLM governance without adding a new product. The plugin model is familiar; Konnect provides a managed control plane for teams that want one. The [Kong alternatives comparison](/blog/kong-alternatives/) covers the migration paths in detail.

**What to watch.** Many AI-specific plugins are enterprise or Konnect features; the OSS footprint needs careful inventory. Teams that want LLM-native primitives (virtual keys with stacked budgets, MCP tool filtering per key) in the open-source core usually pick a dedicated AI gateway alongside Kong or in place of it.

## 5. OpenRouter — the Marketplace That Plugs Behind a Gateway

OpenRouter is a hosted model marketplace with an OpenAI-compatible API over 300+ models. It is not a self-hosted gateway, but it earns a place on this list because most teams plug it behind a self-hosted gateway to keep long-tail models reachable without new provider contracts.

**What it does well.** Time to first call. 300+ models. In-region hostnames on the Business plan. The [OpenRouter alternatives survey](/blog/openrouter-alternatives/) covers when teams leave and where they go.

**What to watch.** Prompts transit OpenRouter's infrastructure. A 5.5 per cent fee on credit top-ups (8 per cent on Business) applies to Standard plan spend, and BYOK usage is free up to \$25,000 of list-price inference a month, then 5 per cent.

## How To Choose

Three questions decide most shortlists:

1. **Does the gateway have to run inside your network?** If yes, OpenRouter and Cloudflare are out, and the decision is Bifrost vs LiteLLM vs Kong. Teams that want LLM-native governance in the OSS core usually pick Bifrost; Python shops that accept Redis and Postgres sometimes pick LiteLLM; teams already on Kong often extend it rather than replace it.
2. **How deep does the governance hierarchy need to go?** Per-team budgets inside per-department caps inside per-company totals, enforced in real time, is the Bifrost sweet spot. Shallow caps (per-account, per-API-key) are enough for smaller teams and are where hosted options compete well.
3. **Does MCP matter yet?** If agents will share the same gateway as LLM traffic, the first-class MCP support in Bifrost and the MCP gateway in LiteLLM matter more than the API-gateway platforms' plugin approach.

## Why Bifrost Leads the Portkey-Alternative Shortlist

Teams leave a hosted control plane to get three things: data-path control, open governance primitives and low overhead. [Bifrost](https://www.getmaxim.ai/bifrost) is the clearest answer on all three in 2026. The gateway is Apache 2.0, the virtual keys and stacked budgets are in the open-source core, and the published benchmark reports 11 µs of added overhead at 5,000 RPS on a t3.xlarge.

The [feature comparison of Bifrost vs LiteLLM](/blog/bifrost-vs-litellm/) and the [survey of the top AI gateways in 2026](/blog/top-ai-gateways/) cover the migration specifics. For MCP-heavy teams, the [Bifrost MCP gateway](https://www.getmaxim.ai/mcp-gateway) page lists the tool-filtering and Code Mode details.

---
title: "Self-Hosted vs Managed LLM Gateway: How to Choose"
description: Self-hosted vs managed LLM gateway compared on cost, data residency, latency, operations, and supply chain risk, with a break-even formula and a decision table.
pubDate: 2026-10-03
tags: [LLM Gateways, AI Infrastructure, Open Source]
author: team
---

**TL;DR**

- A self-hosted LLM gateway runs on your own infrastructure, so prompts and responses never pass through a third party; a managed LLM gateway is operated by a vendor and trades that control for zero operations.
- The self-hosted vs managed LLM gateway decision usually turns on data residency first, then cost at scale, then the team's capacity to run another production service.
- For gateways that charge a percentage of spend, the break-even point is your fixed self-hosting cost divided by the fee rate; at a 5.5% fee and $2,000 a month in fixed costs, that is about $36,000 a month in model spend.
- A third model, a vendor-supported gateway inside your own VPC, keeps the data path private while shifting upgrades and uptime commitments to the vendor.
- Open-source gateways such as Bifrost can start as a single container and grow into a clustered, SLA-backed deployment without changing the API applications call.

The self-hosted vs managed LLM gateway question comes up as soon as more than one team starts calling model providers: someone has to decide whether the layer that routes, governs, and logs that traffic runs inside the company's infrastructure or as a vendor's service. Both options solve the same core problems (one API across providers, failover, spend tracking, access control), but they differ sharply in who sees the data, who carries the pager, and how cost scales. This guide compares the two on each of those dimensions, adds the in-VPC option most comparisons skip, and uses [Bifrost](https://www.getmaxim.ai/bifrost), an [open-source LLM gateway](https://github.com/maximhq/bifrost) written in Go by Maxim AI, as a concrete reference for what self-hosting involves.

## Self-Hosted vs Managed LLM Gateway: The Short Answer

Choose a self-hosted LLM gateway when prompts must stay inside your network, when model spend is high enough that a percentage fee costs more than an engineer's time, or when you need governance the managed options do not offer. Choose a managed LLM gateway when the team is small, spend is modest, and nobody wants to operate another service.

Most teams sit somewhere in between, which is why the decision is better made on a few specific questions than on a general preference:

- Is any of this traffic subject to data residency, HIPAA, or contractual limits on third-party processors?
- What is the monthly model spend today, and what will it be in a year?
- Does the team already run production services on Kubernetes or a similar platform?
- Does the gateway need to govern MCP tool calls and agents, not only chat completions?

## What Is a Self-Hosted LLM Gateway?

A self-hosted LLM gateway is gateway software that you deploy and run on infrastructure you control, such as a Kubernetes cluster, a VM, or a container service in your own cloud account. Applications send requests to it instead of directly to OpenAI, Anthropic, or other providers, and the gateway forwards them using provider keys stored in your environment.

Because the gateway sits in your network, the only external hop is the one to the model provider itself. Logs, cost data, and audit trails stay in your own database. The trade-off is that you own patching, scaling, monitoring, and backups.

Most self-hosted gateways are open source. A detailed comparison of the main options, including license, external dependencies, and air-gapped viability, is in this guide to the [best open-source LLM gateways for self-hosted deployments](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/).

## What Is a Managed LLM Gateway?

A managed LLM gateway is a gateway the vendor operates as a service: you point your application at the vendor's endpoint, configure providers and policies in a dashboard, and the vendor handles uptime, scaling, and upgrades. Setup typically takes minutes.

The cost of that convenience is that every prompt and response passes through the vendor's infrastructure, and pricing is set by the vendor. Two common examples show how differently managed gateways charge:

| Managed gateway | Pricing model | What it means at scale |
|---|---|---|
| [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/reference/pricing/) | Core features free on all plans; log volume and some add-ons tied to the Workers plan | Gateway cost stays low, so the decision rests on data path and features |
| [OpenRouter](https://openrouter.ai/docs/faq) | 5.5% fee on credit purchases; BYOK usage free up to $25,000 a month in list-price inference, then 5% | Cost grows in proportion to model spend |

A broader evaluation of managed and self-hosted gateways side by side, scored on overhead, governance, MCP support, and deployment model, is in this [production-ready comparison of the top LLM gateways](https://maxim-articles.ghost.io/top-5-llm-gateways-in-2026-a-production-ready-comparison/).

## The Third Option: A Vendor-Supported Gateway in Your VPC

Most self-hosted vs managed comparisons present two choices. In practice, many enterprises pick a third: the gateway runs inside their own cloud account, so the data path stays private, while the vendor provides support, an uptime commitment, and a defined patch schedule.

Bifrost Enterprise is one example. Its [in-VPC deployments](https://docs.getbifrost.ai/enterprise/invpc-deployments) run with no external network dependencies on GCP, AWS, Azure, Cloudflare, or Vercel infrastructure, and carry a 99.95% monthly uptime commitment for core components, 24/7 critical support, 14 days' notice for major updates, and a choice between immediate or delayed security patches.

This model suits regulated teams that need the privacy of self-hosting but cannot staff round-the-clock operations for a gateway on their own.

## Self-Hosted vs Managed LLM Gateway Compared

The table below compares the three deployment models on the dimensions that usually decide the question.

| Dimension | Self-hosted (open source) | Managed SaaS | Vendor-supported in your VPC |
|---|---|---|---|
| Data path | Your network to provider | Your app to vendor to provider | Your network to provider |
| Setup time | Minutes for one instance, days for production HA | Minutes | Days to weeks, with vendor help |
| Pricing | Infrastructure plus engineering time | Free tier, percentage fee, or plan | License plus infrastructure |
| Operations | Your team | Vendor | Shared, with vendor SLA |
| Upgrades | You schedule them | Vendor schedules them | You choose the schedule, vendor supplies patches |
| Customization | Full, including plugins and source changes | Limited to vendor features | Full |
| Compliance evidence | You produce it | Vendor's certifications | Both |
| Lock-in | Low, especially with open source | Higher, tied to the vendor API and dashboard | Low to moderate |

## Cost: When Does Self-Hosting Pay Off?

In a self-hosted vs managed LLM gateway cost comparison, self-hosting pays off when the fixed cost of running the gateway is lower than what a managed gateway would charge for the same traffic. For managed gateways that charge a percentage of spend, the break-even point is simple to compute.

**Break-even monthly model spend = fixed monthly self-hosting cost ÷ managed fee rate**

The fixed cost has two parts: infrastructure (gateway instances, a database, load balancing) and the engineering time spent operating it. The figures below are illustrative assumptions, not quotes; replace them with your own.

| Assumption | Small HA setup | Production cluster |
|---|---|---|
| Infrastructure per month | $400 | $1,500 |
| Engineering time | 0.1 FTE | 0.25 FTE |
| Engineering cost per month (at $16,000 fully loaded per FTE) | $1,600 | $4,000 |
| Total fixed cost | $2,000 | $5,500 |
| Break-even spend at a 5.5% fee | about $36,000 | about $100,000 |

Two points change the calculation in practice:

- **A free managed gateway has no cost break-even.** If the managed option charges nothing per request, as with Cloudflare's core features, the decision rests entirely on data path, features, and governance.
- **Engineering time is front-loaded.** Initial setup, SSO, and alerting take most of the effort; a stable deployment needs far less time per month afterward, which pushes the break-even point lower over time.

## Data Residency, Compliance, and the Data Path

Data residency is the most common deciding factor in a self-hosted vs managed LLM gateway evaluation. With a managed gateway, the vendor becomes a processor of every prompt and response, which means another entry in data processing agreements, vendor security reviews, and regional hosting questions.

With a self-hosted or in-VPC gateway, prompts travel only from your network to the model provider you already contract with. Logs, which often contain the most sensitive material, land in your own database or object storage. For teams that also run self-hosted models through vLLM or Ollama, a self-hosted gateway can keep that traffic entirely inside the network.

Governance follows the same logic. When the gateway runs in your environment, [virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys), budgets, rate limits, and [audit logs](https://docs.getbifrost.ai/enterprise/audit-logs) are enforced and stored under your control, which is the evidence auditors usually ask for. The [Bifrost governance](https://www.getmaxim.ai/bifrost/resources/governance) model applies those controls per team, per application, or per agent.

## Latency and Reliability

A self-hosted gateway placed in the same region as your applications adds one internal network hop plus its own processing time. A managed gateway adds a round trip to the vendor's nearest point of presence, which can be negligible or noticeable depending on where your applications and the vendor's infrastructure sit.

Processing overhead varies widely between gateways. Bifrost's published [benchmarks](https://www.getmaxim.ai/bifrost/resources/benchmarks) report 11 microseconds of added latency per request at 5,000 requests per second on a t3.xlarge instance, with a 100% success rate, so in a self-hosted vs managed LLM gateway comparison the network path usually matters more than gateway processing time.

Reliability also shifts. A managed gateway's uptime is the vendor's responsibility, but its outage becomes your outage. A self-hosted gateway's uptime is yours, which is why production deployments run multiple replicas: Bifrost Enterprise [clustering](https://docs.getbifrost.ai/enterprise/clustering) recommends at least three nodes to tolerate one failure and supports rolling upgrades with mixed versions. Either way, [automatic fallbacks](https://docs.getbifrost.ai/features/fallbacks) between providers protect against the more frequent failure: a model provider returning errors.

## What Self-Hosting Actually Involves

Self-hosting a gateway is the same work as running any stateful production service. Bifrost's [deployment requirements](https://docs.getbifrost.ai/deployment-guides/runtime-contract) are a useful reference for what that means in practice:

- **A container and a port.** Bifrost ships as a Linux container for amd64 and arm64 and listens on port 8080, with a `/health` endpoint for readiness and liveness probes.
- **A database.** SQLite works for a single development instance; multiple replicas need PostgreSQL 16 or later.
- **A stable encryption key.** The key that protects stored provider credentials must stay the same across restarts, replicas, upgrades, and restores.
- **Capacity planning.** Bifrost's enterprise sizing guidance calls for at least three gateway pods with 4 vCPU and 16 GB each, spread across availability zones, plus a PostgreSQL instance with a hot standby.
- **A deployment path.** The official [Helm chart](https://docs.getbifrost.ai/deployment-guides/helm) covers Kubernetes, and guides exist for EKS, GKE, AKS, ECS, Cloud Run, Fly.io, Render, Railway, and plain Docker.

Getting a first instance running takes one command, either `npx -y @maximhq/bifrost` or `docker run -p 8080:8080 maximhq/bifrost`, with no configuration file required. The production checklist above is where the real effort goes.

### Supply chain responsibility

Self-hosting also means owning the gateway's supply chain: which versions you pull, from where, and how quickly you patch. That risk became concrete on March 24, 2026, when two PyPI releases of LiteLLM (1.82.7 and 1.82.8) were published with credential-stealing code, an incident [Datadog Security Labs linked](https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-teampcp-supply-chain-campaign/) to a wider campaign. LiteLLM's official Docker image was not affected, and the malicious releases were removed quickly.

The lesson applies to any self-hosted gateway, not only Python ones:

- Pin exact image versions or digests instead of floating tags.
- Mirror images into a private registry and scan them before deployment.
- Prefer projects that publish their build and release controls. Bifrost documents its [security practices](https://docs.getbifrost.ai/security), including dependency scanning, commit-pinned CI actions, and non-root container images.

A managed gateway moves this responsibility to the vendor, which is a real advantage for teams without a security function that reviews dependencies.

## How to Choose a Self-Hosted vs Managed LLM Gateway

The decision table below maps common situations to the deployment model that usually fits. It assumes the gateway will carry production traffic, not only experiments.

| Situation | Recommended model | Why |
|---|---|---|
| Prototype or early product, low spend, no platform team | Managed SaaS | Fastest setup, no operations |
| Regulated data (healthcare, finance, public sector) | Self-hosted or in-VPC | Prompts stay inside your boundary |
| Model spend well above the break-even point | Self-hosted | Fixed cost beats a percentage fee |
| Platform team already runs Kubernetes | Self-hosted | Marginal operating cost is low |
| Need private data path but no 24/7 ops capacity | Vendor-supported in VPC | Privacy with an uptime commitment |
| Air-gapped or no internet egress | Self-hosted with local models | Managed gateways cannot reach the network |
| Agents and MCP tools need central governance | Self-hosted or in-VPC gateway with MCP support | Tool access policies stay under your control |

Once the deployment model is settled, the next step is choosing the gateway itself. For self-hosted and in-VPC deployments, the [open-source self-hosted LLM gateway comparison](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) covers Kubernetes, air-gapped installation, and sizing for each option. For a mixed shortlist that includes managed services, the [top LLM gateways comparison for production](https://maxim-articles.ghost.io/top-5-llm-gateways-in-2026-a-production-ready-comparison/) scores each gateway on overhead, governance depth, and deployment model. The [LLM gateway buyer's guide](https://www.getmaxim.ai/bifrost/resources/buyers-guide) adds a capability matrix for procurement.

## Where Bifrost Fits

[Bifrost](https://www.getmaxim.ai/bifrost) covers the self-hosted and in-VPC columns of the decision table with one codebase. The open-source gateway runs anywhere a container runs, exposes an OpenAI-compatible API as a [drop-in replacement](https://docs.getbifrost.ai/features/drop-in-replacement) for existing SDKs, and includes failover, governance, and an MCP gateway. Bifrost Enterprise adds clustering, guardrails, SSO, audit logs, and the in-VPC option with an uptime commitment, so a team can start with a single container and move to an SLA-backed deployment without changing application code.

Beyond routing, Bifrost applies [governance](https://www.getmaxim.ai/bifrost/resources/governance) and security controls (virtual keys, budgets, guardrails, audit logs) centrally, and [Bifrost Edge](https://www.getmaxim.ai/bifrost/edge) extends the same governance and security to AI traffic on employee machines, with [endpoint enforcement](https://docs.getbifrost.ai/edge/security) on each device. Bifrost Edge is currently in alpha.

For more on the open-source landscape, this site also covers [open-source LLM gateways worth running in production](/blog/open-source-llm-gateways/) and [LiteLLM alternatives](/blog/litellm-alternatives/).

## Frequently Asked Questions

### What is the difference between a self-hosted and a managed LLM gateway?

A self-hosted LLM gateway runs on infrastructure you control, so prompts, logs, and keys stay in your environment and your team operates it. A managed LLM gateway is run by a vendor as a service, so setup is faster and there is nothing to operate, but every request passes through the vendor's infrastructure and pricing is set by the vendor.

### Is a self-hosted LLM gateway cheaper than a managed one?

A self-hosted LLM gateway is cheaper once its fixed cost (infrastructure plus engineering time) falls below what a managed gateway charges for the same traffic. Against a percentage fee, divide the fixed monthly cost by the fee rate to find the break-even spend. Against a free managed gateway, self-hosting is not cheaper, so the choice rests on data control and features.

### When should you self-host an AI gateway?

Self-host an AI gateway when prompts must stay inside your network for regulatory or contractual reasons, when model spend is high enough that a percentage fee exceeds operating costs, when you need air-gapped deployment, or when you need governance over agents and MCP tools that managed options do not provide. Teams with an existing Kubernetes platform face the lowest added cost.

### Does a self-hosted gateway add latency?

A self-hosted gateway adds one internal network hop plus its processing overhead, which is small for gateways written in compiled languages. Bifrost, for example, adds about 11 microseconds per request at 5,000 requests per second in its published benchmark. A managed gateway adds a round trip to the vendor's infrastructure, which depends on region.

### Can you self-host Bifrost?

Yes. Bifrost is open source under the Apache 2.0 license and runs as a single container with `npx` or Docker, or on Kubernetes through the official Helm chart. Deployment guides cover EKS, GKE, AKS, ECS, Cloud Run, and other platforms. Bifrost Enterprise adds clustering, guardrails, and an in-VPC deployment option with a 99.95% uptime commitment.

### What is a hybrid or in-VPC LLM gateway deployment?

A hybrid or in-VPC LLM gateway deployment runs the gateway inside your own cloud account, so the data path stays private, while the vendor supplies support, patches, and an uptime commitment. It combines the data control of self-hosting with part of the operational relief of a managed service, and suits regulated teams without dedicated 24/7 operations.

## Next Steps

The self-hosted vs managed LLM gateway choice is mostly a question of where data may flow and who will run the service, with cost acting as the tiebreaker at scale. Teams evaluating a self-hosted or in-VPC gateway can [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo) or start from the [open-source repository on GitHub](https://github.com/maximhq/bifrost).

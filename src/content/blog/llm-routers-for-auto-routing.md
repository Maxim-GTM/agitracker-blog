---
title: 6 Best LLM Routers for Auto Routing Per Request in 2026
description: "Compare 6 LLM router tools for auto routing in 2026: rule-based, complexity classifier, and learned routers that choose the right model per request."
pubDate: 2026-06-05
tags: [Model Routing, LLM Gateways, AI Infrastructure]
author: team
---

**TL;DR**

- An LLM router inspects each request and sends it to the model that fits it, so simple prompts stop paying frontier-model prices.
- Auto routing tools fall into three families: rule-based routers that read request metadata, classifier routers that read the prompt, and learned routers trained on quality data.
- Bifrost combines CEL routing rules with an embedding-based complexity router that tags each request Simple, Medium, or Complex and routes on that tier, inside the same gateway that enforces budgets and fallbacks.
- Learned routers such as Not Diamond and RouteLLM need evaluation or preference data to perform well, while managed routers such as OpenRouter Auto Router and Azure Model Router trade control for convenience.
- The main risk in any router is silent misrouting, so the decision for each request must be logged and auditable.

An LLM router is a routing layer that picks the model for each request based on what that request needs, instead of sending all traffic to one default model. [Bifrost](https://www.getmaxim.ai/bifrost), the [open-source AI gateway written in Go](https://github.com/maximhq/bifrost) and built by Maxim AI, is the best choice for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability, because it makes the per-request model decision in the same gateway that governs the traffic. This guide compares six auto routing tools by how they choose a model: rules, complexity classification, or learned quality prediction. It focuses on the per-request quality versus cost decision, not failover or key load balancing.

## What Is an LLM Router?

An LLM router is a component that receives a model request and decides which model, and often which provider, should serve it. It reads signals such as the prompt text, request headers, or remaining budget, then forwards the call.

![Chat apps, agents, and coding tools send requests to one LLM router, which forwards each request to a small, mid-tier, or frontier model](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/llm-routers-for-auto-routing/llm-routers-for-auto-routing-router-position.png)

*Figure 1: The application calls one endpoint; the router chooses the model for each request behind it.*

Teams adopt a router because traffic is uneven. A support assistant might answer "what are your business hours" and "reconcile these invoices against the contract terms" in the same minute. A frontier model overpays for the first; a small model fails the second. Our explainer on [how model routing works inside an LLM router](https://www.getmaxim.ai/articles/what-is-an-llm-router-how-model-routing-works/) covers the concept in more depth.

A router is narrower than an AI gateway, which also handles authentication, [budgets and rate limits](https://docs.getbifrost.ai/features/governance/budget-and-limits), retries, and logging. Some tools below are routers only; others put the decision inside the gateway.

## How Auto Routing Picks a Model for Each Request

Auto routing picks a model per request by reading a signal and mapping it to a target. Rule-based routers read request metadata such as headers, team, or budget usage. Classifier routers read the prompt and assign a complexity tier. Learned routers predict which model will answer best, using a model trained on evaluation or preference data.

![Rule-based routing matches request attributes, classifier routing maps the prompt to a complexity tier, and learned routing predicts model quality before choosing a model](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/llm-routers-for-auto-routing/llm-routers-for-auto-routing-three-approaches.png)

*Figure 2: The approaches differ in what they read: rules read metadata, classifiers read the prompt, learned routers predict quality.*

Each approach has a different cost to run and a different failure mode:

| Approach | Signal it reads | Setup effort | Typical failure mode | Tools in this list |
|---|---|---|---|---|
| Rule-based | Headers, team, model name, budget usage | Low: write rules | Rules do not see prompt difficulty | Bifrost (CEL routing rules) |
| Complexity classifier | Prompt text, embedded or scored | Medium: tune reference examples | Prompts land in the wrong tier | Bifrost (complexity router), vLLM Semantic Router |
| Learned router | Prompt plus trained quality predictor | High: needs eval or preference data | Drifts when the model pool or traffic changes | Not Diamond, RouteLLM |
| Managed router | Prompt, scored by the vendor | Very low | Opaque decisions, fixed model pool | OpenRouter Auto Router, Azure Model Router |

Rules and classifiers combine well: a classifier produces a tier, and rules decide what each tier means for a team or budget state. That is how Bifrost exposes its [complexity router](https://docs.getbifrost.ai/features/governance/complexity-router): the tier is a variable in the rule language, not a separate black box.

Learned routers are the most studied approach: the [RouteLLM paper from LMSYS](https://arxiv.org/abs/2406.18665) reported cost reductions of over 2x in some cases without degrading quality, using routers trained on human preference data. Our guide to [smart LLM routing and picking the optimal model per request](https://www.getmaxim.ai/articles/smart-llm-routing-picking-the-optimal-model-per-request/) walks through how these signals combine in practice.

## LLM Routers Compared at a Glance

The six tools differ mainly in where the routing decision runs and how much control you keep. Bifrost routes inside a self-hosted AI gateway, Not Diamond returns a recommendation you execute, RouteLLM and vLLM Semantic Router are open-source routing layers, and OpenRouter and Azure run the decision as a hosted service.

When evaluating a router for per-request model selection, check five things:

- **Decision method:** rules, classifier, learned predictor, or a vendor-managed model
- **Model pool control:** whether you choose the candidate models and providers
- **Quality and cost dial:** how you tell the router to favor one over the other
- **Auditability:** whether each routing decision is logged with the reason
- **Surrounding controls:** budgets, fallbacks, and access policy on the routed traffic

| Tool | Decision method | Where it runs | Quality/cost control | Model pool | Open source |
|---|---|---|---|---|---|
| **Bifrost** | CEL rules plus embedding-based complexity tiers, optional LLM fallback classifier | Self-hosted AI gateway (VPC, on-prem) | You map each tier to models per scope | Any of 10,000+ models across 25+ providers | Yes |
| **Not Diamond** | Pre-trained or custom-trained router | Hosted API that returns a model choice | `tradeoff` parameter: quality, cost, or latency | Models you pass in each call | Not published |
| **RouteLLM** | Learned routers (matrix factorization, BERT, causal LLM, weighted Elo) | Self-hosted Python server | Threshold on a strong/weak model pair | Two models: one strong, one weak | Yes (Apache 2.0) |
| **vLLM Semantic Router** | Signal-driven decisions with trained classifiers | Envoy ExtProc on Kubernetes | Routing policies per signal | Your self-hosted models | Yes (Apache 2.0) |
| **OpenRouter Auto Router** | Task classification ranked by community spend share | Hosted by OpenRouter | Restrict or exclude models | OpenRouter catalog | No |
| **Azure Model Router** | Trained language model | Microsoft Foundry deployment | Balanced, Quality, or Cost mode | Fixed supported list, with subsets | No |

For a wider survey that includes cost-focused tools, see our roundup of the [top LLM router solutions in 2026](https://www.getmaxim.ai/articles/top-5-llm-router-solutions-in-2026/).

## 1. Bifrost

Bifrost is an open-source AI gateway that selects a model per request with CEL routing rules and a complexity router. The complexity router assigns each request a Simple, Medium, or Complex tier and exposes it to routing rules, so easy prompts go to small models and hard ones to frontier models without application changes.

**Best for:** Bifrost is built for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability. It serves as a centralized AI gateway to route, govern, and secure all AI traffic across models and environments with ultra low latency. Bifrost unifies LLM gateway, MCP gateway, and Agents gateway capabilities into a single platform. Designed for regulated industries and strict enterprise requirements, it supports air-gapped deployments, VPC isolation, and on-prem infrastructure. It provides full control over data, access, and execution, along with robust security, policy enforcement, and governance capabilities.

![The Bifrost complexity router embeds a request, assigns a tier, and a CEL routing rule sends it to a weighted target with fallbacks, or to default routing](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/llm-routers-for-auto-routing/llm-routers-for-auto-routing-bifrost-complexity-path.png)

*Figure 3: An unclassified request falls through to normal routing instead of being blocked, so complexity rules degrade safely.*

**How the complexity router works.** Bifrost embeds the latest user message with an embedding provider you configure and assigns the tier of the nearest labeled reference phrase. It ships 150 default phrases, 50 per tier, which teams extend with phrases from their own traffic. This is nearest-neighbor classification against examples you control, not a vendor-trained black box.

**How the decision is expressed.** The tier becomes the `complexity_tier` variable in [CEL routing rules](https://docs.getbifrost.ai/providers/routing-rules), alongside headers, team, customer, and live budget usage:

```cel
complexity_tier == "COMPLEX" && team_name == "research"
complexity_tier == "SIMPLE" || budget_used > 85
```

Each rule has weighted targets and a fallback chain, scoped to a virtual key, team, customer, or globally; the first match wins.

Capabilities that matter for per-request model selection:

- **Pay only when used:** classification runs only when a routing rule references `complexity_tier`, so other traffic carries no embedding cost.
- **Safe degradation:** if the embedding call times out (default 1.5 seconds) or the best match falls below a similarity floor, no tier is published and the request follows its normal routing path.
- **Optional second opinion:** an LLM fallback classifier can name the tier for requests the embedding match could not classify.
- **Session-aware tiers:** within an agent session the tier only moves up, avoiding switches that break prompt-cache reuse; [session affinity](https://docs.getbifrost.ai/providers/session-affinity) keeps the session on one provider and key.
- **Auditable decisions:** logs record the tier, how it was produced, the similarity score, and the matched phrase.
- **Resilience:** [automatic fallbacks](https://docs.getbifrost.ai/features/fallbacks) retry on the next provider, and [adaptive load balancing](https://docs.getbifrost.ai/enterprise/adaptive-load-balancing) in Bifrost Enterprise scores keys on live error rate and latency.

Bifrost adds [11 microseconds of overhead per request at 5,000 RPS](https://www.getmaxim.ai/bifrost/resources/benchmarks) with a 100% success rate in sustained benchmarks, and it reaches [25+ providers and 10,000+ models](https://docs.getbifrost.ai/providers/supported-providers/overview) through one OpenAI-compatible API.

Because the router sits inside the gateway, routed traffic stays under the same [virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys), budgets, and access policy as everything else, as described in the [Bifrost governance model](https://www.getmaxim.ai/bifrost/resources/governance). The trade-off: the complexity router is only as good as its reference phrases, so audit the defaults against real prompts first.

## 2. Not Diamond

Not Diamond is a hosted model routing service that predicts which model to use for each input and returns that choice to your application. It offers a pre-trained router and lets teams train a custom router on their own evaluation data. Your code then calls the selected model through its own SDK or gateway.

**Best for:** teams that have labeled evaluation data for their tasks and want a learned router tuned to it, while keeping their existing gateway for execution.

Key characteristics:

- **Recommend, not proxy:** `select_model` takes the messages and candidate models and returns the model to call; you make the call yourself.
- **Explicit trade-off:** a `tradeoff` parameter set to `cost` or `latency` shifts the choice; omitting it optimizes for quality.
- **Custom routers:** a training endpoint builds a domain-specific router from your evaluation data.

The recommendation model adds one network call before each generation, and the routing decision and governed execution live in two systems. Pairing a learned recommender with [the Bifrost AI gateway](https://www.getmaxim.ai/bifrost) keeps budgets, fallbacks, and logs in one place. VPC or on-prem deployment is not published on the pages we reviewed.

## 3. RouteLLM

RouteLLM is an open-source framework from LMSYS for serving and evaluating model routers. It routes each query between a strong and a weak model: a trained router estimates the strong model's win probability, and requests above a cost threshold go to the strong model. It ships an OpenAI-compatible server and uses the Apache 2.0 license.

**Best for:** ML teams that want to study or customize learned routing, and whose traffic fits a two-model setup.

Key characteristics:

- **Several router types:** matrix factorization (`mf`), weighted Elo (`sw_ranking`), BERT classifier, causal LLM classifier, and a random baseline.
- **Threshold as the dial:** the model name encodes the router and threshold, and a calibration command sets the threshold for a target share of strong-model calls.
- **Published results:** the project reports up to 85% cost reduction while maintaining 95% of GPT-4 performance on MT Bench.

RouteLLM is a research framework more than an operational product: it routes between two models, and budgets, access control, and failover are left to the surrounding stack. Teams comparing framework-style routers with gateway-native ones can read our [enterprise LLM router comparison of Bifrost and LiteLLM](https://www.getmaxim.ai/articles/best-llm-router-for-enterprise-ai-bifrost-vs-litellm/).

## 4. vLLM Semantic Router

vLLM Semantic Router is an open-source routing layer from the vLLM project for building Mixture-of-Models systems. It evaluates request signals, user preferences, and application policies to select a model path per request, and it deploys as an Envoy external processor on Kubernetes. It is licensed under Apache 2.0.

**Best for:** platform teams already serving open-weight models on vLLM who want routing close to their inference fleet.

Key characteristics:

- **Signal-driven decisions:** routing is expressed as decisions over request signals, including classifier outputs.
- **Reasoning mode selection:** decides whether a request needs a reasoning mode, described in its [paper on semantic routing for vLLM](https://arxiv.org/abs/2510.08731).
- **Bundled safety and caching:** PII and jailbreak detection, semantic caching, and hallucination detection sit alongside routing.

The trade-off is scope: vLLM Semantic Router assumes Kubernetes and Envoy and targets self-hosted fleets. Teams routing across hosted providers still need keys, budgets, and fallbacks from a [multi-model routing gateway](https://www.getmaxim.ai/articles/best-ai-gateway-for-multi-model-routing-in-2026/).

## 5. OpenRouter Auto Router

OpenRouter Auto Router is a hosted routing option on the OpenRouter marketplace. Requests to the `openrouter/auto` model are classified into one of roughly 30 task types, and candidate models are ranked by their real-world spend share for that task over a trailing seven-day window. You pay the standard rate of whichever model is selected, with no extra routing fee.

**Best for:** developers and small teams who want per-request model selection with no infrastructure and are comfortable with a hosted aggregator.

Key characteristics:

- **Crowd-derived ranking:** choice follows what OpenRouter users spend per task type, not an evaluation of your prompts.
- **Pool restriction:** wildcard patterns such as `anthropic/*` limit the candidate models, and excluded models can be set per request or per account.
- **Visibility:** the response `model` field reports which model served the request, and an opt-in header returns the task classification.

The limitation for enterprise use is control. Popularity is a proxy for quality, not a measurement of it on your workload, and traffic runs through a third-party service. Teams that want one multi-provider API they operate themselves can point existing SDK code at Bifrost as a [drop-in replacement](https://docs.getbifrost.ai/features/drop-in-replacement).

## 6. Azure Model Router

Azure Model Router is a Microsoft Foundry deployment that uses a trained language model to route each prompt to a suitable underlying model. It analyzes complexity, reasoning needs, and task type, with Balanced, Quality, and Cost modes. The current version, 2025-11-18, routes across models from OpenAI, Anthropic, xAI, DeepSeek, and Meta.

**Best for:** teams standardized on Azure that want managed per-request routing inside their existing Foundry deployments.

Key characteristics:

- **Explicit quality bands:** Balanced mode considers models within about 1% to 2% of the top-quality model for a prompt and picks the cheapest; Cost mode widens the band to about 5% to 6%; Quality mode picks the highest-rated model.
- **Model subsets:** you can restrict routing to selected models, and the subset also serves as the failover set.
- **Documented limits:** the effective context window is that of the smallest underlying model, and routing decisions are based on text input only.

Azure Model Router is the most transparent managed option about its quality-versus-cost logic. The constraints are scope and portability: the pool is Microsoft's supported list, and routing runs only inside Foundry. Teams that want Azure models in a cross-cloud tier ladder can add [Azure OpenAI as a Bifrost provider](https://docs.getbifrost.ai/providers/supported-providers/azure).

## Model Routing Trade-offs: Quality Versus Cost

Every router trades answer quality against spend, and the right balance differs by request. A safe model routing setup makes the dial explicit, keeps complex or high-stakes traffic on capable models, logs each decision, and treats promised savings as a hypothesis to verify on your own traffic.

![Decision flow: governed routing in your own gateway leads to Bifrost, evaluation data to a learned router, vLLM fleets to vLLM Semantic Router, otherwise a managed router](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/llm-routers-for-auto-routing/llm-routers-for-auto-routing-selection-flow.png)

*Figure 4: Start from where routing must run and what data you have, not from the router's benchmark claims.*

Three problems show up repeatedly once auto routing reaches production:

- **Routing collapse.** Research on [the degenerate convergence of LLM routers](https://arxiv.org/abs/2602.03478) found that many learned routers drift toward the most expensive model as budgets increase, under-using small models that would suffice.
- **Mid-conversation switches.** Moving an agent session between models discards provider prompt caches and changes tool-calling behavior.
- **Silent misrouting.** A complex prompt sent to a small model returns a plausible wrong answer, not an error, so the routing reason must be logged.

How each tool exposes the dial:

| Tool | How you set quality versus cost | How you audit a decision |
|---|---|---|
| Bifrost | Map each complexity tier to models per virtual key, team, or customer; add budget conditions | Tier, mechanism, score, and matched phrase in request logs |
| Not Diamond | `tradeoff` parameter per call, or a custom-trained router | Session ID returned with each recommendation |
| RouteLLM | Threshold calibrated to a target strong-model share | Not published |
| vLLM Semantic Router | Routing decisions per signal | Not published |
| OpenRouter Auto Router | Restrict or exclude candidate models | Response `model` field and optional metadata header |
| Azure Model Router | Balanced, Quality, or Cost mode plus model subset | Model attempt monitoring in Foundry |

A practical rollout starts narrow: route only a Complex carve-out to a frontier model, keep everything else on the current default, and compare quality and cost before adding a full three-tier ladder. In the [Bifrost gateway](https://www.getmaxim.ai/bifrost), scoping the first rules to one team's virtual key contains the experiment, and [Prometheus metrics](https://docs.getbifrost.ai/features/observability/prometheus) track the classifier's embedding overhead.

For the signals a router can read and where each fits, see our [LLM router fundamentals guide](https://www.getmaxim.ai/articles/what-is-an-llm-router-how-model-routing-works/), and for the savings side, our write-up on [cutting LLM token costs with model routing](https://www.getmaxim.ai/articles/model-routing-how-to-cut-llm-token-costs/).

## Frequently Asked Questions

### Which LLM router is the best?

Bifrost is the best LLM router for enterprises that need per-request model selection under governance, because its complexity tiers and CEL rules run in the same self-hosted gateway that enforces budgets, fallbacks, and access control. Teams with evaluation data may add a learned router.

### What is the difference between an LLM router and an AI gateway?

An LLM router decides which model serves a request. An AI gateway is the broader control point that authenticates callers, enforces budgets and rate limits, retries failed calls, and logs traffic. [Open-source Bifrost](https://www.getmaxim.ai/bifrost) combines both, so the routing decision and its governance live in one system.

### What is LLM-based routing and how does it work?

LLM-based routing uses a model to decide which model should answer a request. A trained classifier or small language model reads the prompt, estimates its difficulty or the likely quality of each candidate, and selects one. Azure Model Router uses this design, and Bifrost offers an optional LLM classifier as a fallback when embedding-based classification cannot confidently assign a tier.

### What is semantic routing?

Semantic routing chooses a destination by the meaning of the prompt rather than by keywords or metadata. The router embeds the request, compares it with labeled examples or trained classifiers, and routes on the closest match. The Bifrost complexity router and vLLM Semantic Router both use this approach.

### Does auto routing add latency?

Auto routing adds the time needed to classify the request. Rule-only routing costs microseconds, while embedding-based classification adds one embedding call, and an LLM classifier adds a full completion. Bifrost runs classification only when a rule references the complexity tier and caps the embedding call with a timeout, after which the request proceeds on its normal route.

### Can an LLM router reduce costs without hurting quality?

Yes, when the router is tuned to your traffic and its decisions are monitored. Published benchmark savings depend on the model pair and query mix. Route a narrow slice first, compare answer quality against the previous default, and widen routing only where quality holds.

## Choosing an LLM Router for Your Team

The right LLM router depends on where the routing decision must run and what data you have to tune it. Bifrost gives enterprises per-request model selection through complexity tiers and CEL rules inside a self-hosted gateway, with budgets, fallbacks, and auditable routing logs on the same traffic. For deployment in your own VPC or on-prem, see [Bifrost Enterprise](https://www.getmaxim.ai/bifrost/enterprise), and the [LLM gateway buyer's guide](https://www.getmaxim.ai/bifrost/resources/buyers-guide) covers the wider evaluation. To see auto routing configured on your own traffic, [book a demo with the Bifrost team](https://getmaxim.ai/bifrost/book-a-demo).

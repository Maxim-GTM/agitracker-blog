---
title: "GPT-6 Pricing: Why the 50% Cut Won't Halve Your Bill"
description: GPT-6 pricing explained after OpenAI halved Sol and Luna rates. Why most teams will save far less than 50%, with a worked example and how to capture the cut.
pubDate: 2026-10-03
tags: [Model Routing, AI Industry, LLM Gateways]
author: team
---

**TL;DR**

- GPT-6 pricing for Sol is $2 per million input tokens and $10 per million output tokens; Luna is $0.10 and $0.50. Both are about half the price of the GPT-5.6 models they replaced on September 22, 2026.
- The cut applies per token and only to requests that actually call the new model IDs; traffic pinned to GPT-5.6 keeps paying the old rate.
- Reasoning tokens are billed as output, requests above 272K input tokens cost 2x on input and 1.5x on output, and the 90% cached-input discount is unchanged from GPT-5.6.
- In a worked example, partial migration, 25% more output tokens per task, and 20% more volume reduce a 50% price cut to about 16% in real savings.
- Teams capture more of the cut by routing model choice centrally, sending simple requests to Luna, tracking cost per request, and caching repeated prompts.

GPT-6 pricing became the main cost story in AI infrastructure on September 22, 2026, when OpenAI released GPT-6 Sol and GPT-6 Luna at roughly half the per-token price of GPT-5.6 Sol and Luna. A 50% price cut sounds like a 50% smaller bill, but a model bill is price multiplied by tokens multiplied by the share of traffic on the cheaper model, and only the first factor changed. This article breaks down what changed in GPT-6 pricing, why most teams will save much less than half, and how to capture more of the cut, using [Bifrost](https://www.getmaxim.ai/bifrost), an [open-source AI gateway](https://github.com/maximhq/bifrost) written in Go by Maxim AI, as a reference for the routing and cost controls involved.

## GPT-6 Pricing at a Glance

GPT-6 pricing has three tiers: Astra as the flagship, Sol for demanding everyday work, and Luna for high-volume tasks. The table shows OpenAI's [standard API rates](https://developers.openai.com/api/docs/pricing) per million tokens, with the GPT-5.6 models they replace for comparison.

| Model | Input | Cached input | Output | Input above 272K | Output above 272K |
|---|---|---|---|---|---|
| GPT-6 Astra | $10.00 | $1.00 | $50.00 | $20.00 | $75.00 |
| GPT-6 Sol | $2.00 | $0.20 | $10.00 | $4.00 | $15.00 |
| GPT-6 Luna | $0.10 | $0.01 | $0.50 | $0.20 | $0.75 |
| GPT-5.6 Sol | $4.00 | $0.40 | $20.00 | $8.00 | $30.00 |
| GPT-5.6 Luna | $0.20 | $0.02 | $1.20 | $0.40 | $1.80 |

Batch and Flex processing cost about half of standard rates; GPT-6 Sol in batch is $1 input and $5 output. Both Sol and Luna have a context window of about 1.05 million tokens.

## What Changed in GPT-6 Pricing on September 22

The change is narrower than the headline. OpenAI halved Sol's input and output prices and cut Luna's input price by half and its output price by about 58%. As [MacRumors reported](https://www.macrumors.com/2026/09/22/openai-gpt-6-sol-luna/), the new models also bring improvements from Astra to the cheaper tiers, and OpenAI said prompt caching was improved so agents reuse more context ([DataNorth](https://datanorth.ai/news/openai-launches-gpt-6-sol-and-luna)).

Three things did not change:

- **The cache discount.** Cached input costs 10% of the input price on both GPT-6 and GPT-5.6. The discount rate is the same; only the base price fell.
- **The long-context structure.** Requests above 272K input tokens are still repriced at 2x input and 1.5x output, as they were for GPT-5.6.
- **Astra and other providers.** The cut covers Sol and Luna only. Spend on Astra, Anthropic, Google, or self-hosted models is unaffected.

## Why the 50% Price Cut Won't Halve Your Bill

A token-price cut halves the bill only if every request moves to the new model, uses the same number of tokens, and traffic volume stays flat. In practice, all three assumptions break.

### Traffic is still pinned to GPT-5.6

The new prices apply only to requests that send `gpt-6-sol` or `gpt-6-luna` as the model ID. Every service, agent, and prompt that hard-codes `gpt-5.6-sol` keeps paying $4 and $20 per million tokens until someone changes it, tests the output, and redeploys. In organizations with many teams calling models directly, migration takes weeks or months, and some workloads stay on the old model because the new one behaves differently on their prompts.

OpenAI is also retiring older models on its own schedule: its [deprecations page](https://developers.openai.com/api/docs/deprecations) lists `gpt-5.1` and `gpt-5.3-codex`, deprecated on October 1, 2026, with GPT-6 Sol as the replacement. Those migrations save money too, but only when they happen.

### Reasoning tokens are billed as output

GPT-6 Sol and Luna are reasoning models, and their internal reasoning is billed at the output rate. Output tokens cost five times as much as input on Sol, so the number of reasoning tokens per task often matters more than the per-token price. Artificial Analysis recorded about 77 million output tokens to run its [Intelligence Index on GPT-6 Sol](https://artificialanalysis.ai/models/gpt-6-sol) at maximum reasoning effort, which shows how much of a reasoning model's cost comes from output.

If a new model reasons longer on your tasks, or if teams raise reasoning effort to get better answers, cost per task falls by less than the price cut. The only reliable way to know is to measure tokens per task on your own workload before and after switching.

### Long-context requests cost more than the headline rate

Requests with more than 272K input tokens are billed at $4 input and $15 output per million on Sol. A request with 272,000 input tokens and 5,000 output tokens costs about $0.59; the same request at 300,000 input tokens costs about $1.28, more than double, because the whole request moves to the higher tier. Agent loops and RAG pipelines that grow context over a session cross that line without anyone noticing.

### Caching savings depend on hit rate, not the discount

The 90% discount on cached input is unchanged, so caching saves the same share of input cost as before. On Sol, cache writes are priced at $2.50 per million tokens, above the $2 input rate, so a cache that is written but rarely read costs more than no cache. Savings depend on how often prompts reuse the same prefix, which is a property of how prompts are built, not of the model's price.

### Cheaper tokens increase usage

When a model costs half as much, teams use it more: larger context windows, more agent steps, higher reasoning effort, and new features that were too expensive before. That is often the right decision, but it means total spend falls by less than the unit price.

## Worked Example: A 50% Cut Becomes 16%

The example below applies GPT-6 pricing to a realistic migration and shows how these effects combine. It uses illustrative assumptions, not measured GPT-6 behavior: a workload on GPT-5.6 Sol using 2 billion input tokens a month (40% cached) and 300 million output tokens.

| Scenario | Monthly cost | Savings vs GPT-5.6 |
|---|---|---|
| Baseline: all traffic on GPT-5.6 Sol | $11,120 | 0% |
| Everything moves to GPT-6 Sol, same tokens | $5,560 | 50% |
| 70% of traffic migrated, 30% still pinned to GPT-5.6 | $7,228 | 35% |
| Plus 25% more output tokens per task on GPT-6 | $7,753 | 30% |
| Plus 20% more request volume after the cut | $9,304 | 16% |

Each assumption is modest, and together they turn a 50% price cut into a 16% reduction. The numbers will differ for every workload; the point is that the outcome depends on migration coverage, tokens per task, and volume, which a pricing page cannot show.

## How to Capture the GPT-6 Savings

Teams that capture most of the cut tend to do five things:

1. **Inventory model usage.** List which services, agents, and keys still call GPT-5.6 or deprecated models, and how much each spends.
2. **Change the model in one place.** Move model selection out of application code, so switching from `gpt-5.6-sol` to `gpt-6-sol` is a configuration change rather than a redeploy per service.
3. **Shift traffic gradually.** Send 5% to 10% of a workload to the new model, compare quality and tokens per task, then increase the share.
4. **Route simple requests to Luna.** Luna costs a twentieth of Sol. Classifying requests and sending simple ones to the cheaper tier often saves more than the price cut itself.
5. **Track cost per request, team, and task.** OpenAI bills by token, so proving savings requires logging tokens and cost per request and attributing them to the team or feature that caused them.

## How an AI Gateway Turns the Price Cut into Savings

Most of the steps above are easier when model traffic passes through a gateway instead of going directly from each service to OpenAI. [Bifrost](https://www.getmaxim.ai/bifrost) covers them as follows:

- **Central model routing.** [Virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys) define which providers and models each team can use, and [weighted routing](https://docs.getbifrost.ai/features/governance/routing) splits traffic by percentage, so a 10% trial of GPT-6 Sol is a configuration change.
- **Complexity-based tiering.** The [Complexity Router](https://docs.getbifrost.ai/features/governance/complexity-router) classifies each request as simple, medium, or complex and exposes the tier to routing rules, so simple prompts can go to Luna and hard ones to Sol or Astra without application changes.
- **Budgets and limits.** [Budgets and rate limits](https://docs.getbifrost.ai/features/governance/budget-and-limits) at the customer, team, and key level keep higher usage after the cut from turning into an overrun.
- **Cost per request.** [Built-in observability](https://docs.getbifrost.ai/features/observability/default) records tokens, cost, model, and latency for every request, with cache-read and cache-write tokens priced separately, so savings can be measured per team rather than inferred from the monthly invoice.
- **Semantic caching.** [Semantic caching](https://docs.getbifrost.ai/features/semantic-caching) serves repeated or near-identical questions without calling the model, which saves more than any per-token discount for those requests.

To estimate GPT-6 Sol costs for a specific workload, the Bifrost [GPT-6 Sol cost calculator](https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/openai/model/gpt-6-sol) compares it against other models.

Cost controls are only one criterion when choosing a gateway. This [production-ready comparison of LLM gateways](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) scores the leading options on routing, governance depth, and performance overhead, and the guide to [open-source LLM gateways for self-hosted deployments](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) is useful for teams that do not want a gateway that charges a percentage of model spend, which would eat into the savings a price cut creates.

Beyond routing, Bifrost applies [governance](https://www.getmaxim.ai/bifrost/resources/governance) and security controls (virtual keys, budgets, guardrails, audit logs) centrally, and [Bifrost Edge](https://www.getmaxim.ai/bifrost/edge) extends that same governance and security to AI traffic on employee machines, with [endpoint enforcement](https://docs.getbifrost.ai/edge/security) on each device. Bifrost Edge is currently in alpha.

## Choosing Where GPT-6 Fits in a Multi-Model Stack

The GPT-6 price cut changes the comparison with other providers, but it does not end it. Different models still lead on different tasks, and teams that route by task rather than by habit benefit from every price change across providers, not only OpenAI's. When comparing gateways for this kind of routing, the [top 5 LLM gateways comparison](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) covers failover and multi-provider routing, and the [self-hosted open-source gateway guide](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) covers running that routing layer inside your own infrastructure.

This site also covers [model routing tools that cut inference cost](/blog/model-routing-inference-cost/) and [LLM routers for per-request auto routing](/blog/llm-routers-for-auto-routing/) in more depth.

## Frequently Asked Questions

### How much does GPT-6 cost?

GPT-6 costs $2 per million input tokens and $10 per million output tokens for Sol, $0.10 and $0.50 for Luna, and $10 and $50 for Astra at standard API rates. Cached input costs 10% of the input price, requests above 272K input tokens cost 2x on input and 1.5x on output, and Batch and Flex processing cost about half.

### Is GPT-6 cheaper than GPT-5.6?

GPT-6 Sol and Luna are about half the per-token price of GPT-5.6 Sol and Luna. Sol fell from $4 to $2 per million input tokens and from $20 to $10 for output. Whether your bill falls by half depends on how much traffic moves to the new models and how many tokens each task uses.

### Why didn't my OpenAI bill drop after the GPT-6 price cut?

An OpenAI bill does not drop after the GPT-6 price cut if requests still call GPT-5.6 model IDs, if reasoning tokens per task increased, if more requests exceed 272K input tokens, or if usage grew. Check spend by model ID first; traffic still pinned to older models is the most common cause.

### Are reasoning tokens billed as output on GPT-6?

Yes. GPT-6 Sol and Luna are reasoning models, and the tokens they use to reason are billed at the output rate, which is five times the input rate. For reasoning-heavy tasks, output tokens often make up most of the cost, so measuring tokens per task matters as much as the per-token price.

### What is the GPT-6 long-context price?

The GPT-6 long-context price applies to requests above 272K input tokens. For Sol, input rises from $2 to $4 per million tokens and output from $10 to $15; cached input doubles as well. The higher rate applies to the whole request, so crossing the threshold can more than double its cost.

### Should I switch from GPT-5.6 to GPT-6 Sol?

Switch from GPT-5.6 to GPT-6 Sol after testing it on a share of real traffic, comparing output quality and tokens per task. For most workloads the lower price makes Sol cheaper per task, but measure before moving everything, and route simple requests to Luna for larger savings.

## Next Steps

GPT-6 pricing halved the cost of a token, not the cost of a workload. Capturing the cut takes central model routing, gradual migration, tiering simple requests to Luna, and cost tracking per request. Teams that want those controls in one layer can [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo) or start from the [open-source repository on GitHub](https://github.com/maximhq/bifrost).

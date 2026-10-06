---
title: "LLM Gateway Benchmark: How to Measure Gateway Overhead"
description: How to run an LLM gateway benchmark that measures real overhead, why published numbers disagree, and which metrics, mocks, and test scenarios to use.
pubDate: 2026-10-03
tags: [LLM Gateways, Performance, AI Infrastructure]
author: team
---

**TL;DR**

- An LLM gateway benchmark should measure the latency the gateway adds compared with calling the provider directly, not the total latency of a model call.
- Published numbers for the same gateway differ by orders of magnitude because they measure different things: internal processing time, mean added latency, or p99 added latency on a shared host.
- A fair benchmark uses a mock provider with fixed latency, a direct-to-mock baseline, separate hosts for load generator and gateway, identical features enabled, and tail percentiles (p99 and above).
- Throughput at saturation, error rate, and memory under load usually separate gateways more clearly than median latency does.
- Open-source benchmarking toolkits, such as the Bifrost benchmarking repository, include a mock provider and a load generator so teams can reproduce results on their own hardware.

An LLM gateway benchmark measures how much latency, memory, and failure risk a gateway adds to model traffic, and it is one of the few gateway criteria that can be tested objectively before purchase. The difficulty is that vendors publish numbers that cannot be compared: one reports microseconds of internal processing, another reports milliseconds of tail latency on a single shared machine. This guide explains what to measure, why published results disagree, and how to run a benchmark that reflects production, using [Bifrost](https://www.getmaxim.ai/bifrost), an [open-source LLM gateway](https://github.com/maximhq/bifrost) written in Go by Maxim AI, and its public benchmarking tools as a worked example.

## What Is LLM Gateway Overhead?

LLM gateway overhead is the extra time a request spends because it passes through the gateway instead of going straight to the model provider. It includes the extra network hop, request parsing, authentication, policy checks, routing, logging, and response handling, but not the time the model spends generating tokens.

Overhead matters less for a single chat request, where the model takes seconds, than for high-volume and agentic workloads, where one user action can trigger dozens of model and tool calls. A few milliseconds per call multiplied across an agent loop and thousands of concurrent users becomes visible latency and, more often, a capacity limit.

There are three common ways to define overhead, and most confusion comes from mixing them:

| Definition | What it includes | Typical scale |
|---|---|---|
| Internal processing time | Time spent inside gateway code, sometimes excluding JSON parsing and HTTP I/O | Microseconds |
| Added latency (wire) | Latency through the gateway minus latency direct to the same backend | Sub-millisecond to milliseconds |
| End-to-end latency | Full request time including the provider or mock response time | Milliseconds to seconds |

Only the second definition answers the question most teams are asking: how much slower will requests be with the gateway in the path?

## Why Published LLM Gateway Benchmarks Disagree

Published LLM gateway benchmark results disagree mainly because they draw the boundary of "the gateway" in different places, report different percentiles, and run on different hardware. Bifrost is a useful illustration, because three public numbers describe the same gateway:

| Source | Reported figure | What it measures |
|---|---|---|
| Bifrost [benchmark docs](https://docs.getbifrost.ai/benchmarking/getting-started) | 11 µs per request at 5,000 RPS on a t3.xlarge | Internal overhead, explicitly excluding JSON marshalling and HTTP calls |
| Bifrost [benchmark comparison](https://www.getmaxim.ai/bifrost/resources/benchmarks) | 0.99 ms gateway overhead, 500 virtual users on a t3.medium | Gateway overhead in a head-to-head test against LiteLLM |
| [LiteLLM's Rust gateway benchmark](https://docs.litellm.ai/blog/rust-ai-gateway-benchmarks) (July 2026) | 4.5 ms p99 added latency for Bifrost v1.6.4 | p99 latency through the gateway minus direct latency, single 4 vCPU host |

None of these is necessarily wrong. They differ in boundary (internal code versus the full proxy path), percentile (mean versus p99), hardware (2 vCPU, 4 vCPU, a dedicated instance or a shared host), and who ran them. The LiteLLM authors themselves describe their results as a vendor-run benchmark with logging, spend tracking, and persistence disabled, meant to show order-of-magnitude differences.

The practical conclusion is that no published number substitutes for a benchmark on your own hardware, with your own payloads and the features you will actually enable.

## What to Measure in an LLM Gateway Benchmark

A useful LLM gateway benchmark reports a small set of metrics, each compared against a direct-to-backend baseline run on the same setup:

- **Added latency at p50, p95, p99, and p99.9.** Medians hide queueing and garbage-collection pauses; tail percentiles show what users and agent loops feel under load.
- **Maximum sustainable throughput.** The request rate at which the success rate stays above 99.9% and p99 latency stays within your budget.
- **Success rate and error breakdown.** Timeouts, connection resets, and 5xx responses generated by the gateway itself, separate from mock-provider errors.
- **Memory and CPU under load.** Peak and steady-state memory, and CPU per thousand requests per second, which determine instance size and cost.
- **Time to first token for streaming.** Streaming responses should start flowing as soon as the provider sends them; buffering in the gateway shows up here.
- **Overhead with features enabled.** Logging, governance checks, guardrails, and caching each add work; measure the configuration you will run in production.

For streaming, measure added time to first token rather than total duration, since total duration is dominated by the mock's simulated generation time.

## How to Set Up a Fair Benchmark

A fair benchmark removes every source of variance except the gateway. Five rules cover most of it.

1. **Use a mock provider with fixed latency.** Real provider latency varies by seconds and costs money. A local mock that returns a fixed response after a fixed delay isolates the gateway. MLflow's AI gateway benchmarks, for example, use a simulated upstream with a fixed 50 ms latency.
2. **Measure a direct baseline.** Send the same load straight to the mock and subtract. Without a baseline, mock and network latency get attributed to the gateway.
3. **Separate the load generator, gateway, and mock.** On one shared host, the load generator competes with the gateway for CPU, which inflates tail latency. Use separate machines or at least pinned CPU sets.
4. **Match configurations across gateways.** Disable or enable the same features (request logging, budget tracking, caching) on every gateway under test, and use the same instance size.
5. **Warm up, then run long enough.** Discard the first 30 to 60 seconds, then run each scenario for several minutes. Short runs miss memory growth and periodic pauses.

Load generators such as Vegeta, Fortio, and k6 all work. What matters more is that the load model matches production: open-loop at a fixed request rate exposes queueing behavior, while closed-loop with a fixed number of concurrent users shows behavior under back-pressure.

## Step-by-Step: Running an LLM Gateway Benchmark

The [Bifrost benchmarking repository](https://github.com/maximhq/bifrost-benchmarking) is a concrete example of an open-source benchmarking toolkit. It contains a comparison benchmark built on Vegeta, a standalone load generator called hitter, a mock provider called mocker that simulates OpenAI, Anthropic, Gemini, and Bedrock endpoints with configurable latency, failures, and rate limits, and an MCP Code Mode benchmark. The [run-your-own-benchmarks guide](https://docs.getbifrost.ai/benchmarking/run-your-own-benchmarks) walks through the full setup.

### 1. Build the tools and start the mock

Clone the repository, build the benchmark tool, start the mock provider, and point the gateway at the mock instead of a real provider.

```bash
git clone https://github.com/maximhq/bifrost-benchmarking.git
cd bifrost-benchmarking
go build benchmark.go
```

### 2. Run a fixed-rate test

Run a fixed request rate (open loop) or a fixed number of concurrent users (closed loop). The `-rate` and `-users` flags are mutually exclusive.

```bash
./benchmark -provider bifrost -rate 500
./benchmark -provider bifrost -rate 1000 -duration 30 -output my_results.json
```

Defaults include a 10-second duration and a 60-second cooldown between tests; `-big-payload` switches from roughly 200-byte to roughly 10 KB requests.

### 3. Read the output

Each run writes a JSON file with total requests, success rate, mean, p50, p99, and maximum latency, achieved throughput, peak and average server memory, and a count of status codes. Run the same scenario against the mock directly for the baseline, then step the rate up until the success rate or p99 latency breaks your target.

The same toolkit can drive other gateways for comparison, which is why matching configurations (rule 4 above) matters before drawing conclusions.

## Test Scenarios That Expose Real Differences

A single steady-state test rarely separates gateways. These scenarios usually do:

| Scenario | How to run it | What it reveals |
|---|---|---|
| Rate ramp | Increase RPS in steps until errors appear | Maximum sustainable throughput and the failure mode at the limit |
| Concurrency sweep | Run 10, 100, 500, and 1,000 concurrent users | Connection handling and queueing under back-pressure |
| Large payloads | Use 10 KB to 100 KB prompts and responses | Parsing and memory cost of long-context traffic |
| Streaming | Stream responses from the mock | Added time to first token and buffering behavior |
| Features on | Enable logging, budgets, guardrails, caching | Real production overhead, not the minimum |
| Provider failures | Make the mock return 429s and 5xx errors | Retry and failover cost, and whether errors cascade |
| Soak | Run at 70% of maximum for an hour or more | Memory growth and periodic latency spikes |

Instance size changes results substantially. Bifrost's published numbers show 59 µs of internal overhead on a t3.medium (2 vCPU, 4 GB) and 11 µs on a t3.xlarge (4 vCPU, 16 GB) at the same 5,000 RPS, with 100% success on both. Benchmark on the instance type you plan to deploy.

## How to Read LLM Gateway Benchmark Results

Raw numbers need interpretation. The patterns below are common in LLM gateway benchmark results and point to specific causes.

- **Low median, high p99.** Usually queueing, garbage collection, or an event loop blocked by synchronous work. This matters more than the median for agent workloads.
- **Throughput plateaus while CPU is low.** A concurrency limit, connection pool, or lock inside the gateway, not hardware.
- **Memory grows during a soak test.** Unbounded buffers or log queues; the gateway will eventually be restarted by its orchestrator.
- **Errors appear before latency rises.** Timeouts or connection limits set too low in the gateway or the load balancer in front of it.
- **Overhead jumps when logging is enabled.** Logging on the request path rather than asynchronously; check whether the gateway writes logs before or after responding.

When comparing vendors, normalize everything to the same boundary (added latency versus direct), the same percentile, and the same hardware before reading any ratio. The same applies to the measured-overhead figures quoted in gateway roundups, such as the [self-hosted open-source LLM gateway guide](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/): check how each number was produced before comparing them.

## Using Benchmarks in a Gateway Decision

Performance is one criterion among several. A gateway that adds 1 ms instead of 0.1 ms is rarely the deciding factor for chat traffic, but a gateway that loses requests or exhausts memory at your peak load rules itself out regardless of features.

Both of the most common shortlists treat overhead as a first-class criterion alongside governance and deployment. This [production-ready comparison of the top LLM gateways](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) scores performance overhead next to failover, governance depth, MCP support, and observability. For self-hosted deployments, the guide to [open-source LLM gateways for self-hosted deployments](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) compares measured overhead at a given instance size together with external dependencies and air-gapped viability, which are the inputs a benchmark plan should feed.

A reasonable process is to shortlist on features and deployment model, then benchmark the two or three finalists with the scenarios above. The [LLM gateway buyer's guide](https://www.getmaxim.ai/bifrost/resources/buyers-guide) provides a capability matrix for the shortlisting step.

## Where Bifrost Fits

[Bifrost](https://www.getmaxim.ai/bifrost) is written in Go and publishes both its results and its tooling: the [Bifrost benchmarks](https://www.getmaxim.ai/bifrost/resources/benchmarks) page summarizes head-to-head results, and the open-source toolkit lets teams reproduce them on their own infrastructure rather than trusting a vendor figure. The [top 5 LLM gateways comparison](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) describes it as the lowest-overhead open-source enterprise option in its shortlist. Its own sizing guidance suggests a t3.small below 1,000 RPS, a t3.medium from 1,000 to 3,000 RPS, a t3.large up to 5,000 RPS, and a t3.xlarge or larger beyond that.

Beyond performance, Bifrost applies [governance](https://www.getmaxim.ai/bifrost/resources/governance) and security controls (virtual keys, budgets, guardrails, audit logs) centrally, and [Bifrost Edge](https://www.getmaxim.ai/bifrost/edge) extends that same governance and security to AI traffic on employee machines, with [endpoint enforcement](https://docs.getbifrost.ai/edge/security) on each device. Bifrost Edge is currently in alpha. Those controls add work on the request path, which is why benchmarking with them enabled gives the number that matters.

For the broader decision of where to run a gateway, see this site's guides to [open-source LLM gateways worth running in production](/blog/open-source-llm-gateways/) and [model routing tools that cut inference cost](/blog/model-routing-inference-cost/).

## Frequently Asked Questions

### How do you measure LLM gateway latency?

Measure LLM gateway latency by sending the same load to a mock provider twice, once directly and once through the gateway, and subtracting the two at each percentile. Use a mock with fixed latency so provider variance does not dominate, run the load generator on a separate host, and report p50, p99, and p99.9 rather than only the average.

### What is a good LLM gateway overhead?

A good LLM gateway overhead is well under one millisecond of added latency at p99 at your expected peak load, with a success rate above 99.9%. Gateways written in compiled languages such as Go and Rust typically stay in the sub-millisecond range, while some Python-based proxies add tens of milliseconds at high concurrency in published tests.

### Why do LLM gateway benchmarks show different results?

LLM gateway benchmarks show different results because they measure different things: some report internal processing time, others report added latency at the mean or at p99, and they run on different hardware with different features enabled. A vendor-run test on a shared host can report milliseconds where another reports microseconds for the same gateway.

### Should I benchmark with a real LLM provider or a mock?

Benchmark gateway overhead with a mock provider, because real provider latency varies by seconds and would hide the gateway's contribution, and high-rate tests against real APIs are expensive and rate limited. Use a short test against a real provider afterward to confirm compatibility, streaming behavior, and error handling.

### Does an LLM gateway slow down streaming responses?

A well-built LLM gateway does not noticeably slow streaming responses, because it forwards chunks as the provider sends them. Measure added time to first token to confirm this; if it grows with response size or under load, the gateway or a proxy in front of it is buffering the stream.

### How many requests per second can an LLM gateway handle?

How many requests per second an LLM gateway can handle depends on the implementation, instance size, and enabled features. Bifrost reports 5,000 RPS with a 100% success rate on both 2 vCPU and 4 vCPU AWS instances in its published benchmarks. Run a rate ramp on your target instance type to find the actual limit for your configuration.

## Next Steps

An LLM gateway benchmark is only useful when it measures added latency against a direct baseline, at tail percentiles, on production-like hardware, with production features enabled. Teams evaluating gateways can reproduce Bifrost's results with the [open-source benchmarking tools](https://github.com/maximhq/bifrost-benchmarking), [request a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo), or review the [Bifrost repository on GitHub](https://github.com/maximhq/bifrost).

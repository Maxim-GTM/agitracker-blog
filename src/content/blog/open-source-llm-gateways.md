---
title: 9 Open Source LLM Gateways Worth Running in Production in 2026
description: "Compare 9 open source LLM gateway projects on what production demands: high availability, shared state, metrics and tracing, upgrade cadence, and footprint."
pubDate: 2026-09-24
tags: [LLM Gateways, Open Source, AI Infrastructure]
author: team
---

**TL;DR**

- An open source LLM gateway earns a production slot through its operating model (state sharing, telemetry, upgrades), not through its provider list.
- Bifrost adds 11 microseconds of overhead per request at 5,000 RPS, exports per-request overhead as a Prometheus histogram, and keeps the database off the request path.
- Several gateways on this list need Redis once you run more than one replica, because rate limits and budgets are otherwise enforced per instance.
- Kong's open source tags stop at 3.9.x, and TensorZero was archived in 2026, so version and maintenance status belong on any shortlist checklist.
- API gateways with AI plugins (Kong, APISIX, Higress) and Kubernetes-native gateways (Agent Router, agentgateway) fit teams that already operate that stack.

An open source LLM gateway is a self-hosted service that sits between applications and model providers, exposing many providers through one API while applying routing, failover, limits, and logging. Answering a first request takes minutes; keeping three replicas consistent, observable, and upgradable for a year is the real job. [Bifrost](https://www.getmaxim.ai/bifrost), the [open-source Go gateway on GitHub](https://github.com/maximhq/bifrost) built by Maxim AI, is the best choice for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability. This guide ranks nine open source LLM gateway projects on how they behave once they carry production traffic.

## What Is an Open Source LLM Gateway?

An open source LLM gateway is a self-hostable proxy that unifies calls to multiple model providers behind one API, under a license that permits inspection and private deployment. It holds provider credentials, enforces budgets and rate limits, retries or reroutes failed calls, and records tokens, cost, and latency for every request.

The category also goes by AI gateway, LLM proxy, or model router; the deployment model matters more than the label. For the license and free-tier angle on the same category, see our companion piece on [open source AI gateways](/blog/open-source-ai-gateways/), and for a broader decision framework, the guide to [choosing an open source LLM gateway](https://www.getmaxim.ai/articles/open-source-llm-gateways-how-to-choose-the-right-one/).

## What Running an LLM Gateway in Production Involves

Production operation adds four components around the proxy: a load balancer with health checks, shared state (config, keys, rate-limit counters), a telemetry pipeline, and an upgrade process that does not drop in-flight streams. How a gateway handles those four drives cost more than its license does.

![Applications call a load balancer that spreads traffic across three gateway replicas, which share state through a store, export metrics and traces, and route to model providers](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-llm-gateways/open-source-llm-gateways-production-reference.png)

*Figure 1: The proxy is one box; running it in production means owning the load balancer, shared state, and telemetry around it.*

Three replicas is the practical floor, and Kubernetes teams usually add a [PodDisruptionBudget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) so voluntary disruptions never take down more than one gateway pod at a time. Error budgets from the [Google SRE book](https://sre.google/sre-book/embracing-risk/) apply directly: the gateway fronts every model call, so its availability caps every AI feature behind it. Our [self-hosted open source AI gateway guide](https://www.getmaxim.ai/articles/top-5-open-source-ai-gateways-for-self-hosted-llm-deployments/) covers the replica math in more detail.

Shared state is where gateways diverge most: a $500 monthly budget is only a budget if every replica counts against the same number. Figure 3 in the cost section compares the three ways gateways solve this.

## How We Evaluated These Open Source LLM Gateways

We scored each project on production operation rather than feature count, using each project's own documentation and repository as read in September 2026.

| Criterion | What we checked | Why it matters in production |
|---|---|---|
| HA and state | What replicas share, and where | Whether limits hold across instances |
| Performance under load | Published overhead and test conditions | Overhead adds to every call |
| Observability | Prometheus, OpenTelemetry, built-in logs | Drives on-call and FinOps |
| Upgrade burden | Cadence, migrations, breaking changes | Weekly releases are a commitment |
| Operating footprint | Dependencies beyond the gateway | Each one is sized, patched, and paged on |
| Maintenance status | Recent releases, OSS vs commercial split | A stalled project becomes a migration |

The [LLM gateway buyer's guide](https://www.getmaxim.ai/bifrost/resources/buyers-guide) covers the procurement questions this list leaves out.

## Open Source LLM Gateways Compared at a Glance

The nine gateways fall into three families: purpose-built gateways (Bifrost, LiteLLM, MLflow AI Gateway, Plano), API gateways with AI plugins (Kong, Apache APISIX, Higress), and Kubernetes-native gateways (Agent Router, agentgateway). The table compares the attributes that decide day-two cost; the [Bifrost gateway](https://www.getmaxim.ai/bifrost) row reflects the open source build plus Enterprise clustering.

| Gateway | License / language | Deployment | How replicas share state | Metrics and traces |
|---|---|---|---|---|
| **Bifrost** | Apache 2.0 / Go | npx, Docker, Kubernetes, Terraform module | In-memory per pod; Enterprise clustering syncs via gossip and gRPC | Prometheus, OTLP, built-in log UI |
| LiteLLM | MIT (enterprise dir separate) / Python | Docker, Helm, Terraform | Postgres for config, Redis required for multi-instance limits | Prometheus, OpenTelemetry, admin UI |
| Kong Gateway OSS | Apache 2.0 / Lua | Traditional, DB-less, hybrid | Postgres or Redis for cluster rate limits | Prometheus AI metrics, OpenTelemetry |
| Apache APISIX | Apache 2.0 / Lua | Traditional (etcd), decoupled, standalone | etcd for config; Redis for shared AI rate limits | Prometheus LLM metrics, OpenTelemetry |
| Higress | Apache 2.0 / Go | Docker all-in-one, Helm | Controller pushes config over xDS; Redis for token limits | Prometheus, Grafana, Loki bundle |
| Agent Router | Apache 2.0 / Go | Kubernetes with Envoy Gateway, or `aigw run` | CRDs in etcd; Redis for token limits | Prometheus (GenAI conventions), OTel |
| agentgateway | Apache 2.0 / Rust | Binary with YAML, or Kubernetes controller | Per replica unless an external rate-limit service is added | Prometheus, OTel metrics, logs, traces |
| MLflow AI Gateway | Apache 2.0 / Python | Inside MLflow Tracking Server, Helm | SQL backend; Redis for global budgets | MLflow traces, Prometheus, OTLP export |
| Plano | Apache 2.0 / Rust | Container via `planoai` CLI | Not published | OTel traces and metrics |

## 1. Bifrost

Bifrost is a Go-based open source LLM gateway that routes traffic to [25+ providers and 10,000+ models](https://docs.getbifrost.ai/providers/supported-providers/overview) through one OpenAI-compatible API. It adds [11 microseconds of overhead per request at 5,000 RPS](https://www.getmaxim.ai/bifrost/resources/benchmarks) with a 100% success rate, keeps the database off the request path, and emits Prometheus and OpenTelemetry data natively.

**Best for:** Bifrost is built for enterprises running mission-critical AI workloads that require best-in-class performance, scalability, and reliability. It serves as a centralized AI gateway to route, govern, and secure all AI traffic across models and environments with ultra low latency. Bifrost unifies LLM gateway, MCP gateway, and Agents gateway capabilities into a single platform. Designed for regulated industries and strict enterprise requirements, it supports air-gapped deployments, VPC isolation, and on-prem infrastructure. It provides full control over data, access, and execution, along with robust security, policy enforcement, and governance capabilities.

![Requests reach three Bifrost pods that serve from in-memory state synced by gossip and gRPC, while logs and counters flow asynchronously to PostgreSQL and object storage](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-llm-gateways/open-source-llm-gateways-bifrost-topology.png)

*Figure 2: Pods read PostgreSQL once at boot, so database latency and failover do not add to inference latency.*

**High availability.** Each Bifrost pod loads config, governance state, virtual keys, and provider keys into memory at boot, and after that the request path never reads the database. Writes (log rows, counter checkpoints) go through asynchronous queues, which is why [cross-region deployments](https://docs.getbifrost.ai/enterprise/moving-from-oss/cross-region) do not pay database latency per call. Bifrost Enterprise [clustering](https://docs.getbifrost.ai/enterprise/clustering) adds peer-to-peer membership over memberlist gossip, a gRPC channel that replicates governance counters and 30+ entity types, six service discovery methods, and zero-downtime rolling updates.

**Performance under load.** The published [benchmark suite](https://docs.getbifrost.ai/benchmarking/getting-started) runs at 5,000 RPS on t3.medium and t3.xlarge instances with mocked provider calls, and three [performance parameters](https://docs.getbifrost.ai/providers/performance) (per-provider concurrency, buffer size, and pool size) trade memory for speed.

**Observability.** Bifrost exposes [Prometheus metrics](https://docs.getbifrost.ai/features/observability/prometheus) including `bifrost_overhead_latency_microseconds`, time to first token, inter-token latency, cost in USD, per-key health, and key rotation events. An opt-in breakdown splits overhead into ten components, so a latency regression points at a cause. Traces follow the OpenTelemetry GenAI conventions through the [OTel plugin](https://docs.getbifrost.ai/features/observability/otel), and the [built-in request log](https://docs.getbifrost.ai/features/observability/default) captures inputs, outputs, tokens, and cost asynchronously.

**Upgrades and footprint.** The open source build starts on a zero-config SQLite store and supports PostgreSQL for the [config store](https://docs.getbifrost.ai/architecture/framework/config-store). The recommended [production baseline](https://docs.getbifrost.ai/enterprise/moving-from-oss/sizing) is three pods at 4 vCPU and 16 GB each plus PostgreSQL with a hot standby, and [log exports](https://docs.getbifrost.ai/enterprise/log-exports) move large payloads to S3 or GCS.

Patches ship every 2-3 days and minors every 3-4 weeks, and the [release cadence](https://docs.getbifrost.ai/enterprise/release-cadence) makes skipping intermediate versions safe. [Virtual keys](https://docs.getbifrost.ai/features/governance/virtual-keys) carry budgets and rate limits, and [automatic fallbacks](https://docs.getbifrost.ai/features/fallbacks) retry across keys and providers without application changes.

## Purpose-Built Gateways: LiteLLM, MLflow AI Gateway, and Plano

Purpose-built gateways are services whose only job is LLM traffic, configured in YAML or a UI and deployed as a container. They are quick to adopt, but most lean on external Redis and Postgres to keep limits consistent across replicas, which becomes the main operating cost past a single instance.

### 2. LiteLLM

LiteLLM is a widely used Python LLM proxy, MIT-licensed with a separately licensed `enterprise/` directory. Its production guide is explicit that Redis 7.0+ is required as soon as more than one proxy instance runs; without it, each instance enforces rate limits independently. Runtime config lives in Postgres, and each pod polls for changes every 30 seconds.

- **Performance:** the project publishes 8 ms P95 overhead at 1,000 RPS against a fake OpenAI endpoint.
- **Upgrades:** stable releases ship weekly, and only the current stable release is supported.
- **Commercial split:** Prometheus metrics are in the open source build; audit logs, SCIM, and multi-region admin/worker deployment are enterprise features.

**Best for:** Python teams that want a large provider catalog and accept running Redis and Postgres. Teams comparing migration paths can review [LiteLLM alternatives](https://www.getmaxim.ai/bifrost/alternatives/litellm-alternatives).

### 3. MLflow AI Gateway

MLflow AI Gateway is built into the MLflow Tracking Server and needs a SQL backend; MLflow's Helm documentation warns that SQLite is not production-safe and recommends PostgreSQL plus a cloud object store. Budget limits use a local tracker by default that is not shared across replicas; a Redis URL makes them global.

- **Observability:** every gateway request is logged as an MLflow trace, with a usage dashboard for p50/p90/p99 latency, tokens, and cost.

**Best for:** ML platform teams already running MLflow for experiment tracking who want gateway traces next to model lineage.

### 4. Plano

Plano is a Rust data plane built on Envoy that combines LLM routing, agent orchestration, guardrail filter chains, and automatic OpenTelemetry traces. The operational caveat sits in its README: the Plano routing models are hosted free in one US region for first-run use, and production deployments must run those models locally or request API keys. Adding an agent is a config change followed by a restart.

**Best for:** teams building multi-agent applications that want routing and orchestration in one out-of-process layer and can host the routing models themselves.

## API Gateways with AI Plugins: Kong, Apache APISIX, and Higress

An API gateway with AI plugins is an existing HTTP gateway extended with LLM-specific plugins for provider proxying, token-based rate limits, and prompt policies. These fit teams that already run the gateway, because dashboards and runbooks carry over. Our roundup of [open source AI gateway platforms for in-VPC teams](https://www.getmaxim.ai/articles/top-5-open-source-ai-gateway-platforms-for-in-vpc-teams/) covers the network-isolation angle for this family.

### 5. Kong Gateway OSS

Kong Gateway is an Apache 2.0 Lua gateway whose open source 3.9.3 source tree includes the `ai-proxy`, `ai-prompt-guard`, `ai-prompt-decorator`, `ai-prompt-template`, and request/response transformer plugins. The multi-provider `ai-proxy-advanced` plugin is documented as available only with Kong's AI Gateway Enterprise license. Only Kong's traditional (database) mode supports cluster-strategy rate limiting; DB-less and hybrid modes do not.

- **Version gap:** the latest open source tag on GitHub is 3.9.3 (June 2026), while Kong's current release line is 3.16, so the open source build trails the commercial one.

**Best for:** organizations already operating Kong for API traffic that need basic LLM proxying under the same control surface.

### 6. Apache APISIX

Apache APISIX is an Apache 2.0 gateway built on NGINX and etcd, with `ai-proxy`, `ai-proxy-multi`, and `ai-rate-limiting` plugins. The `ai-proxy-multi` plugin load-balances across model instances with active health checks and falls back on 429 or 5xx responses. By default, `ai-rate-limiting` keeps token counters in each node's shared memory, so effective quota scales with node count until the policy is switched to Redis.

- **Performance:** APISIX publishes 18,000 QPS per core with under 0.2 ms average latency for plain reverse proxying; no AI-plugin benchmark is published.
- **Upgrades:** config and plugins hot-reload without restarts, and releases landed roughly every two months in 2026.

**Best for:** platform teams that run APISIX or want an etcd-backed gateway with hot reload and fine-grained plugin control.

### 7. Higress

Higress is a Go gateway built on Istio and Envoy that extends AI traffic handling through Wasm plugins. It ships as an all-in-one Docker image or a Helm chart, where `higress-controller` pushes configuration to `higress-gateway` over xDS. The Helm defaults run two gateway replicas and one controller, and token rate limiting is Redis-backed.

- **Observability:** a single Helm flag installs Prometheus, Grafana, Loki, and Promtail, and the `ai-statistics` plugin reports tokens and first-token latency per route and model.

**Best for:** teams on Istio or Envoy that want AI plugins with a bundled observability stack.

## Kubernetes-Native Gateways: Agent Router and agentgateway

Kubernetes-native gateways are LLM gateways configured through CRDs and the Gateway API, with a controller that programs a separate data plane. They inherit Kubernetes primitives for HA and rollout, which suits teams standardized on Gateway API. Teams comparing them with a single-binary option can follow the [Bifrost Kubernetes deployment guide](https://docs.getbifrost.ai/deployment-guides/k8s).

### 8. Agent Router (formerly Envoy AI Gateway)

Agent Router is the new name for Envoy AI Gateway, now an Agentic AI Foundation project with the same code, license, CRDs, and Helm charts. It requires Envoy Gateway 1.8.1+, Kubernetes 1.32+, and Gateway API 1.5.x, and token rate limiting needs a Redis instance. The controller runs multiple replicas with leader election.

- **Observability:** Prometheus metrics follow the OpenTelemetry GenAI conventions (token usage, time to first token, time per output token) and are on by default.

**Best for:** Kubernetes platform teams running Envoy Gateway who want LLM routing expressed as Gateway API resources.

### 9. agentgateway

agentgateway is an Apache 2.0 Rust proxy hosted by the Linux Foundation, deployable as a standalone binary with YAML or through its own Kubernetes controller since v1.0 decoupled it from kgateway. Local rate limits are per replica; shared limits need an external service that speaks Envoy's rate-limit protocol. Metrics are on by default on separate control-plane and data-plane ports.

- **Performance:** the project's own benchmark reports roughly 35,000 QPS and a peak memory of 29 MB against a mock backend.

**Best for:** teams that want a small-footprint Rust data plane for LLM and agent traffic in Kubernetes.

## What It Costs to Run an Open Source LLM Gateway

The cost of an open source LLM gateway is mostly the dependencies it pulls in and the release train it commits you to. A gateway that needs Redis, Postgres, and a controller before its limits are correct costs more than its container image suggests.

![Three rows compare how LLM gateway replicas share state: peer sync between replicas, replicas writing to shared Redis and Postgres, and a control plane pushing config](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-llm-gateways/open-source-llm-gateways-state-models.png)

*Figure 3: The state model decides what else you must run and what breaks when that component fails.*

| Gateway | Dependencies for consistent multi-replica limits | Release cadence (published) |
|---|---|---|
| **Bifrost** | PostgreSQL; Enterprise clustering syncs counters peer to peer | Patches every 2-3 days, minors every 3-4 weeks |
| LiteLLM | Postgres and Redis 7.0+ | Weekly stable releases |
| MLflow AI Gateway | SQL database, object store, Redis for global budgets | Minor releases every 5-7 weeks in 2026 |
| Plano | Self-hosted routing models for production | Near-daily 0.4.x patches in August 2026 |
| Kong Gateway OSS | Postgres (traditional mode) or Redis | OSS tags stopped at 3.9.x |
| Apache APISIX | etcd, plus Redis for shared AI limits | About every two months in 2026 |
| Higress | Kubernetes controller, Redis for token limits | Patch releases every 4-7 weeks in 2026 |
| Agent Router | Kubernetes, Envoy Gateway, Redis | Not published |
| agentgateway | External rate-limit service for global limits | Not published |

Telemetry adds cost too. Prometheus's own guidance notes that a single [Pushgateway](https://prometheus.io/docs/practices/pushing/) monitoring many instances becomes a single point of failure and a bottleneck, so scrape clustered gateways per pod where possible. Full prompt capture also multiplies log volume, so object-storage offload matters at scale.

Maintenance status belongs in the cost column: TensorZero was archived in 2026 and is no longer maintained, so it is excluded here. Teams that also want governance built into the gateway rather than bolted on through Redis can review the [Bifrost governance model](https://www.getmaxim.ai/bifrost/resources/governance), and the [framework for picking the right open source LLM gateway](https://www.getmaxim.ai/articles/open-source-llm-gateways-how-to-choose-the-right-one/) turns these trade-offs into a checklist.

## Choosing an Open Source LLM Gateway for Your Platform

Choose an open source LLM gateway by starting from what your platform team already operates, then checking whether governance, HA, and telemetry come built in or need extra components. The wrong choice is usually the one whose dependencies nobody on the team is prepared to run.

![Decision flow for choosing an open source LLM gateway based on governance needs, an existing API gateway, Kubernetes Gateway API adoption, or an app-layer gateway](https://articles-images-cdn.t3.tigrisfiles.io/diagrams/open-source-llm-gateways/open-source-llm-gateways-selection-flow.png)

*Figure 4: Start from what your platform team already operates, then check governance and HA requirements.*

- **Choose Bifrost** when budgets, virtual keys, failover, and low overhead need to live in one service, with a documented path to clustered, in-VPC, or [enterprise deployment](https://www.getmaxim.ai/bifrost/enterprise).
- **Choose Kong, APISIX, or Higress** when one of them already fronts your APIs and AI traffic should share its runbooks.
- **Choose Agent Router or agentgateway** when Gateway API is the platform standard and the team runs Envoy-based infrastructure.
- **Choose LiteLLM, MLflow AI Gateway, or Plano** when your stack already runs their dependencies.

For more self-hosting shortlists, see [self-hosted open source LLM gateways for enterprise AI](https://www.getmaxim.ai/articles/best-self-hosted-open-source-llm-gateways-for-enterprise-ai-in-2026/) and [open source LLM gateways for self-hosted deployments](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/). Our [enterprise LLM gateway comparison](/blog/best-llm-gateways/) covers managed options.

## Frequently Asked Questions

### What is an LLM gateway?

An LLM gateway is a service between applications and model providers that exposes many providers through one API. It stores provider credentials, applies budgets and rate limits per caller, retries or reroutes failed requests, and logs tokens, cost, and latency. Applications integrate once instead of once per provider. The [Bifrost overview](https://docs.getbifrost.ai/overview) shows how one gateway covers routing, governance, and observability together.

### What is the best open source LLM gateway for production?

Bifrost is the strongest open source LLM gateway for production workloads that need governance and performance together. It adds 11 microseconds of overhead per request at 5,000 RPS, keeps the database off the request path, and exports overhead, time-to-first-token, and cost metrics to Prometheus. Teams already committed to Kong, APISIX, or Kubernetes Gateway API may prefer extending that stack instead.

### Do open source LLM gateways need Redis?

Many do once they run more than one replica. LiteLLM, APISIX, Higress, Agent Router, and MLflow AI Gateway all use Redis to share rate limits or budgets across instances. Without a shared store, each replica enforces limits independently, so a per-team quota effectively multiplies by the replica count.

### How do I monitor an LLM gateway in production?

Monitor an LLM gateway with Prometheus metrics for request rate, errors, gateway overhead, time to first token, tokens, and cost, plus OpenTelemetry traces for per-request debugging. Alert on upstream error rates by provider and on key health. Bifrost exports all of these natively, including a [per-component overhead breakdown](https://docs.getbifrost.ai/features/observability/prometheus) for diagnosing latency regressions.

### Can an open source LLM gateway run in a private VPC or air-gapped?

Yes. Every gateway on this list is self-hosted, so prompts, credentials, and logs stay on infrastructure you control, provided runtime dependencies such as Plano's routing models are self-hosted too. Bifrost supports [in-VPC deployments](https://docs.getbifrost.ai/enterprise/invpc-deployments) across AWS, GCP, and Azure, and the enterprise build supports on-prem and air-gapped installs.

## Getting Started with Bifrost

An open source LLM gateway belongs in production when it keeps limits consistent across replicas, exposes the metrics on-call needs, and upgrades predictably. Bifrost does all three with 11 microseconds of overhead at 5,000 RPS, a [one-command gateway setup](https://docs.getbifrost.ai/quickstart/gateway/setting-up), and a clear path from a single node to a governed, clustered deployment. To see how Bifrost fits your LLM gateway architecture, [book a Bifrost demo](https://getmaxim.ai/bifrost/book-a-demo) with the team.

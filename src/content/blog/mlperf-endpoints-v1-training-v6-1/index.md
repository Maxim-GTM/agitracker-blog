---
title: "MLPerf Endpoints v1.0 and Training v6.1: what the first agentic-inference results measure"
description: "NVIDIA says Vera Rubin NVL72 delivers over 10x GB300's agentic throughput per kilowatt and up to 2x its training speed per GPU. MLCommons' own data supports the training figure, while the 10x rests on a provisional result, one interactivity metric and a choice between two Rubin submissions."
pubDate: 2026-11-18
coverageGroup: general-ai
draft: false
tags: ["Benchmarks", "AI Infrastructure", "Compute"]
faq:
  - q: "What does MLPerf Endpoints measure that MLPerf Inference did not?"
    a: "Endpoints tests a served API endpoint, including the model, hardware, serving software and networking, across a sweep of concurrency levels, and reports a curve of throughput against per-user speed rather than a few fixed operating points. Version 1.0 adds multi-turn agentic workloads, in which each turn depends on the previous one and context grows as the agent works, and requires provisioned power so throughput can be normalized per kilowatt."
  - q: "Is the 10x Vera Rubin agentic result verified by MLCommons?"
    a: "No. NVIDIA's comparison uses a Vera Rubin NVL72 result marked provisional, pending MLCommons review, against a verified GB300 NVL72 result. A separate Vera Rubin result on the same Kimi K3 workload is verified; by AGI Tracker's arithmetic on MLCommons' data, it gives about 3x GB300's throughput per kilowatt under NVIDIA's own interactivity threshold."
  - q: "Were the Vera Rubin results in the Preview category?"
    a: "No. In both Endpoints v1.0 and Training v6.1, NVIDIA's Vera Rubin systems are listed as Available, not Preview. Under MLCommons rules, an Available on-premise system must have pricing, have shipped to at least one third party and be reasonably available for purchase by the submission date. CoreWeave also submitted a Rubin-based system to Training v6.1."
  - q: "Who submitted to the agentic Endpoints benchmarks?"
    a: "In MLCommons' results data generated on November 17, 2026, the agentic results came from NVIDIA, Google, Krai and Intel: 19 submissions across Kimi K3, DeepSeek-V4.1-Flash and Qwen3.6-35B-A3B, of which 8 were verified and 11 provisional. AMD hardware appears through Krai's MI300X submissions; AMD itself had no agentic Endpoints submission in that data."
  - q: "Did AGI Tracker run any benchmarks?"
    a: "No. All results come from MLCommons' published results data, announcements and rules, and from NVIDIA's blog posts. Ratios and per-kilowatt comparisons not stated by those sources are AGI Tracker's arithmetic on MLCommons' published run data."
---

MLCommons published MLPerf Training v6.1 results on November 16, 2026. Results from MLPerf Endpoints v1.0, a benchmark that measures AI inference the way customers buy it, through a live API under load and including multi-turn agentic traffic, have been publishing on a rolling basis; NVIDIA's and Google's verified agentic results are dated November 4. NVIDIA announced its results for both on November 16: Vera Rubin NVL72 delivers "up to 2x" the per-GPU training performance of GB300 NVL72, and "over 10x" its agentic inference throughput per kilowatt.

The training claim holds up against MLCommons' own numbers. On the DeepSeek-V3 671B benchmark at 1,024 GPUs, Vera Rubin trained in 4.14 minutes against GB300's 8.03, a ratio of 1.94 by AGI Tracker's arithmetic. The agentic claim is more fragile. It compares a Vera Rubin result that is still provisional, pending MLCommons peer review, with a verified GB300 result. A separate, verified Vera Rubin result on the same workload exists, and by AGI Tracker's arithmetic it shows about a 3x advantage at NVIDIA's own threshold, not 10x.

AGI Tracker did not run any benchmarks. The figures below come from MLCommons' announcements, rules and results data (the Endpoints dataset read was generated on November 17, 2026), and from NVIDIA's blog posts. Ratios not stated in those sources are AGI Tracker's arithmetic on MLCommons' published run data.

## What MLPerf Endpoints measures

MLPerf Inference tests a system at a small set of predefined operating points. [MLCommons describes Endpoints](https://mlcommons.org/2026/10/mlperf-endpoints-matters-to-buyers/), the benchmark it is now evolving toward for data-center buyers, differently: it "measures a served endpoint: the model, hardware, serving software, and networking together, under realistic load." The system under test is a URL that the benchmark client calls, so hardware vendors, clouds and managed API providers can in principle be measured the same way.

Each result is a sweep across concurrency levels, plotted as a frontier of throughput against responsiveness. MLCommons lists five primary metrics:

| Metric | What it tells a buyer |
| --- | --- |
| Concurrency | Simultaneous queries served, a rough proxy for users |
| Time to first token, P90 | The wait before a response starts, at the 90th percentile of queries |
| System throughput | Total tokens per second the system produces |
| System throughput per watt | Throughput normalized by provisioned power, which MLCommons calls a proxy for cost |
| Interactivity | Tokens per second each user sees streaming |

Source: MLCommons, "What is MLPerf Endpoints, and why it matters to buyers," October 15, 2026.

Two features are new for the MLPerf family. Provisioned power is mandatory, so every result can be normalized per kilowatt; MLCommons says this is "the only official normalization" it can guarantee, and anything else, such as cost per GPU-hour, is a derived and unverified metric. And submissions are rolling: results publish in cohorts every few weeks rather than in fixed rounds, each carrying an explicit status of verified, provisional (submitted and past initial checks, review pending) or unverified.

### The agentic workloads

Version 1.0 has six benchmarks: two single-turn summarization workloads (Llama 3.1 8B and GPT-OSS 120B), one single-turn reasoning workload (DeepSeek-R1), and three multi-turn agentic coding workloads. The published agentic results use Kimi K3, Qwen3.6-35B-A3B and DeepSeek-V4.1-Flash.

All three agentic models run the same traffic: per MLCommons, "613 multi-turn tool-calling trajectories" that replay how a coding agent works, with repeated model calls, tool results fed back in and context growing turn by turn. The point of the multi-turn design is that a system able to reuse work across turns, through prefix caching and routing requests to the worker that already holds a conversation's state, can pull ahead in ways single-shot tests do not show. NVIDIA's own write-up attributes much of its result to exactly that: prefix reuse, Dynamo routing, disaggregated prefill and decode, and speculative decoding.

Quality is checked too. MLCommons says accuracy is scored inline during the run, plus 200 tasks from SWE-bench Verified, so that "throughput was not bought by degrading quality." In the public run tables AGI Tracker read, the accuracy field was blank for the agentic results, so readers cannot yet compare quality across submissions from the published pages.

## Who submitted agentic results

In MLCommons' results data, the agentic benchmarks drew 19 non-test submissions from four organizations.

| Model | Submitter and system | Accelerators | Status |
| --- | --- | --- | --- |
| Kimi K3 | NVIDIA, GB300 NVL72 | 48 | Verified |
| Kimi K3 | NVIDIA, Vera Rubin NVL72 | 48 | Verified |
| Kimi K3 | NVIDIA, Vera Rubin NVL72 | 32 | Provisional |
| Kimi K3 | Google, GB300 NVL72 | 32 | Verified |
| DeepSeek-V4.1-Flash | NVIDIA, GB300 NVL72 | 4 | Verified |
| DeepSeek-V4.1-Flash | Google, GB300 NVL72 | 4 | Verified |
| DeepSeek-V4.1-Flash | NVIDIA, Vera Rubin NVL72 (two systems) | 4 and 24 | Provisional |
| DeepSeek-V4.1-Flash | Krai, Dell PowerEdge XE9680 with AMD MI300X (three software stacks) | 8 | Provisional |
| DeepSeek-V4.1-Flash | Krai, HPE Cray XD670 with NVIDIA H200 (three results) | 8 | Provisional |
| Qwen3.6-35B-A3B | NVIDIA, GB300 NVL72 | 4 | Verified |
| Qwen3.6-35B-A3B | Google, GB300 NVL72 | 4 | Verified |
| Qwen3.6-35B-A3B | Intel, two-socket Xeon 6980P server | None listed | Verified |
| Qwen3.6-35B-A3B | NVIDIA, Vera Rubin NVL72 (two results) | 4 | Provisional |

Source: [MLPerf Endpoints results explorer](https://results.mlcommons.org/endpoints), data generated November 17, 2026. All are in the Standardized division.

Three things stand out. Of six Vera Rubin agentic results, one is verified. Most systems are small slices of a rack: several "NVL72" entries run on 4 GPUs. And there is no AMD-submitted agentic result; AMD's MI300X appears only through Krai's provisional entries. Google's submissions run NVIDIA GB300 hardware, not TPUs.

## How the 10x claim maps onto the official results

NVIDIA's [Endpoints post](https://developer.nvidia.com/blog/nvidia-vera-rubin-nvl72-leads-agentic-inference-performance-on-mlperf-endpoints-v1-0/) says "provisional NVIDIA Vera Rubin NVL72 results show over 10x the throughput per kilowatt of provisioned power of NVIDIA GB300 NVL72 at a shared minimum end-to-end interactivity of 50 tokens per second per user." The footnote identifies the two runs, and they match MLCommons' data:

| Kimi K3 run | Accelerators | Concurrency | Tokens/s | E2E average interactivity | Power | Tokens/s per kW |
| --- | --- | --- | --- | --- | --- | --- |
| Vera Rubin, provisional | 32 | 1,024 | 41,414.2 | 50.4 | 100.89 kW | 410.5 |
| GB300, verified | 48 | 48 | 2,210.4 | 56.2 | 60 kW | 36.8 |

By AGI Tracker's arithmetic, the ratio is 11.1. The comparison follows MLCommons' advice to buyers: set a responsiveness floor, then compare throughput among the points that meet it. Three choices behind it are worth knowing.

**The Vera Rubin result is provisional.** NVIDIA says so in every footnote. The MLCommons report page for that submission carries the notice: "Pending MLCommons Association verification, results are subject to change pending peer review."

**A verified Vera Rubin result exists and shows less.** NVIDIA also has a verified Vera Rubin NVL72 submission on the same Kimi K3 workload, with 48 accelerators, received October 16 and published November 4. At the same threshold, its best point is concurrency 256: 11,259.7 tokens per second at 55.2 tokens per second per user and 100.89 kW, or 111.6 tokens per second per kilowatt. Against GB300's 36.8, that is about 3x. The provisional submission was received three weeks later, on November 7, and its software notes describe speculative decoding with a draft head. Both list the same TensorRT-LLM and Dynamo versions, and the verified one gives no software notes, so the published data does not say what changed between the two submissions.

**Which interactivity metric is used matters.** MLCommons' data carries two per-user speed fields. NVIDIA uses "E2E average interactivity." The MLCommons report pages display a "Tokens/Second per User" figure, and their summary sentences call that figure "interactivity." For the same runs it is lower. The Vera Rubin point NVIDIA quotes shows 50.4 on the first measure and 40.4 on the second.

Re-running NVIDIA's comparison under each choice gives a range, not one number:

| Comparison (Kimi K3, minimum 50 tokens/s per user) | Interactivity field | Vera Rubin tokens/s per kW | GB300 tokens/s per kW | Ratio |
| --- | --- | --- | --- | --- |
| Provisional Vera Rubin vs verified GB300 (NVIDIA's comparison) | E2E average | 410.5 | 36.8 | 11.1x |
| Provisional Vera Rubin vs verified GB300 | Tokens/s per user | 254.6 | 28.7 | 8.9x |
| Verified Vera Rubin vs verified GB300 | E2E average | 111.6 | 36.8 | 3.0x |
| Verified Vera Rubin vs verified GB300 | Tokens/s per user | 65.7 | 28.7 | 2.3x |

Source: AGI Tracker's arithmetic on MLCommons' published run data. Each cell takes the highest throughput per kilowatt among a submission's points that meet the threshold. Power is the per-point figure MLCommons lists, which varies between runs within one submission.

Every version shows Vera Rubin well ahead of GB300 on this workload. The size of the lead depends on review status, which Rubin submission is used and metric definition, and only the bottom two rows compare two verified results.

### The other two models

NVIDIA's table also reports 9x (DeepSeek-V4.1-Flash) and 5x (Qwen3.6-35B-A3B) throughput-per-kilowatt advantages, plus interactivity ratios at matched concurrency. All the Vera Rubin results behind them are provisional. System sizes also differ. For DeepSeek, NVIDIA's footnote compares a 24-GPU Vera Rubin system (and a 20-GPU configuration for the interactivity comparison) with a 4-GPU GB300 system. Per-kilowatt normalization accounts for scale in the throughput comparison. It does not in the 5x interactivity ratio at matched concurrency of 1,024 queries, where five times as many GPUs serve the same number of users. For Qwen, both systems have 4 GPUs, at 12.61 kW and 7.5 kW of provisioned power.

## Available, Preview and provisional are different labels

MLPerf uses two separate labels that are easy to confuse.

**Availability category** describes the hardware and software. MLCommons' [submission rules](https://github.com/mlcommons/policies/blob/master/submission_rules.adoc) define four: Available in cloud, Available on premise, Preview, and Research, Development or Internal. An Available on-premise component must have pricing, must have "been shipped to at least one third party," and must be "reasonably available" for purchase by the submission date. A Preview system must become Available by a later round and must then match its Preview performance within 2%, or the Preview result is marked invalid.

**Review status** describes the result. In Endpoints, a result is verified, provisional or unverified.

NVIDIA's Vera Rubin systems are listed as Available in both benchmarks: "Available" in Endpoints and "Available on-premise" in the Training v6.1 system descriptions. So the hardware is claimed to meet the availability test, and in Training CoreWeave also submitted a Rubin-based system. The provisional label in Endpoints is about review, not availability.

## MLPerf Training v6.1: what changed

[MLCommons' announcement](https://mlcommons.org/2026/11/mlperf-training-v6-1-results/) reports 24 submitting organizations, 153 systems and 250 results. Of those systems, 57, or 37%, were cloud-based, up from 29% in v6.0. Twelve systems used 1,000 or more accelerators, the largest 10,240. The round included NVIDIA Rubin-generation GPUs and Google's TPUv7 (Ironwood) for the first time.

Two benchmarks are new. DLRMv4-HSTU replaces the older DLRM-dcnv2 recommender and trains on the Yambda dataset. The Qwen3.5-397B benchmark is MLPerf's first post-training workload: reinforcement learning with Group Relative Policy Optimization on software-engineering tasks, with a quality target of 0.69 pass@4 on a subset of R2E-Gym. Like every MLPerf Training benchmark, it measures wall-clock time to reach a fixed quality target. For a benchmark whose rollouts involve running code and tools, that makes CPU-side environment simulation part of what is measured, which NVIDIA highlights for its Vera CPU.

### The "up to 2x" claim

NVIDIA's [training post](https://developer.nvidia.com/blog/nvidia-vera-rubin-nvl72-achieves-up-to-2x-blackwell-ultra-performance-in-mlperf-training-v6-1/) compares Vera Rubin NVL72 with GB300 NVL72 at the same GPU count on all seven benchmarks: 2x on DeepSeek-V3 671B, 1.4x to 1.6x on the others. The DeepSeek-V3 figures can be checked against MLCommons' results data:

| DeepSeek-V3 671B, closed division | Accelerators | Time to train | Category |
| --- | --- | --- | --- |
| NVIDIA, Vera Rubin NVL72 (6.1-0130) | 256 | 16.12 min | Available on-premise |
| CoreWeave, Rubin (6.1-0074) | 256 | 17.65 min | Available on-premise |
| NVIDIA, GB300 NVL72 (6.1-0039) | 256 | 31.40 min | Available cloud |
| NVIDIA, Vera Rubin NVL72 (6.1-0116) | 1,024 | 4.14 min | Available on-premise |
| NVIDIA, GB300 NVL72 (6.1-0030) | 1,024 | 8.03 min | Available cloud |
| NVIDIA, GB200 NVL72 (6.1-0045) | 1,024 | 12.36 min | Available cloud |
| Google, TPU7x (6.1-0024) | 2,048 | 5.03 min | Available cloud |
| Google, TPU7x (6.1-0026) | 8,192 | 1.70 min | Available cloud |
| NVIDIA, GB300 NVL72 (6.1-0028) | 8,192 | 1.53 min | Available cloud |
| Azure, GB200 NVL72 (6.1-0002) | 10,240 | 2.36 min | Available cloud |
| NVIDIA, GB300 NVL72 (6.1-0029) | 10,240 | 1.38 min | Available cloud |

Source: [MLCommons results explorer](https://results.mlcommons.org/training) and the round's system descriptions.

At 1,024 GPUs the ratio is 1.94, so "2x" is a fair rounding. NVIDIA's claim of above 97% scaling efficiency from 256 to 1,024 GPUs also checks out: a perfect fourfold speedup from 16.12 minutes would give 4.03 minutes, against 4.14 measured. CoreWeave's independent Rubin system came within about 10% of NVIDIA's at 256 GPUs, a useful sign that the result is not confined to the vendor's own cluster. AGI Tracker did not verify NVIDIA's ratios for the other six benchmarks against MLCommons' data; they are NVIDIA's figures, citing MLCommons result IDs.

Three cautions apply.

**"Fastest on every benchmark" mixes platforms.** NVIDIA says Vera Rubin was fastest on six of seven benchmarks and a 10,240-GPU GB300 system on DeepSeek-V3. The absolute DeepSeek-V3 record, 1.38 minutes, is GB300's, at ten times the GPU count of the Rubin entry.

**Cross-vendor counts are not like for like.** At 8,192 accelerators, NVIDIA's GB300 system trained DeepSeek-V3 in 1.53 minutes and Google's TPU7x system in 1.70. MLCommons counts a TPU chip and a GPU each as one accelerator, but they are different devices at different prices and power draws, and Training v6.1 reports time, not energy, for these entries.

**Some charts use unverified numbers.** NVIDIA's post adds re-runs with newer software, which it labels: "Unverified results have not been verified by MLCommons Association." Its figure showing "up to 2.4x faster time-to-train" compares one of those unverified Vera Rubin re-runs with GB300's official v6.1 result. Only the official submissions belong in a cross-system comparison.

The point that [AGI Tracker made about training throughput](/blog/training-throughput-reproducible-workload/) earlier this month applies directly: a speed claim means most when it names a fixed workload, a quality target and a reviewed result. MLPerf Training provides all three. The unverified re-runs provide none of the review.

## AMD, Google and the rest of the field

AGI Tracker found no AMD or Google announcement about these specific results as of November 18, 2026. MLCommons' data shows their participation directly. In Training v6.1, AMD submitted MI350X and MI355X systems, and Crusoe MI355X cloud systems, including on the new DLRMv4 benchmark at 8 to 64 accelerators. At 64 accelerators, Crusoe's MI355X system trained DLRMv4 in 4.63 minutes, against 4.58 minutes for Quanta Cloud Technology's 64-GPU GB300 system and 7.54 minutes for Cisco's 64-GPU B300 system. Google submitted TPU7x systems at 2,048 to 8,192 chips on DeepSeek-V3, and GB300 systems on Google Cloud. In Endpoints, Google's agentic submissions used GB300.

NVIDIA says 80% of closed-division Training submissions ran on its platforms; AGI Tracker did not verify that share.

## What the results do and do not show

**What they show.** Vera Rubin NVL72 is a large step over GB300 on the workloads tested, with about 2x faster training on the largest model at equal GPU count in a reviewed result, an independent third-party Rubin system close behind, and, by AGI Tracker's arithmetic on verified results, a 2.3x to 3x throughput-per-kilowatt gain on agentic Kimi K3 serving. The new Endpoints design, with full frontiers, provisioned power and multi-turn traffic, gives buyers more to work with than single peak numbers, and its public run data made the checks in this article possible.

**What they do not show.** The 10x agentic figure is not a verified result, and the run data shows it depends on which Rubin submission and which interactivity field is used. The public pages do not yet show accuracy for the agentic runs. The agentic field is thin: NVIDIA, Google running NVIDIA hardware, Krai and Intel, with no AMD submission and most entries on 4-GPU slices. And throughput per kilowatt is a power-normalized figure, not a measured bill; MLCommons itself says anything beyond provisioned-power normalization is unverified. [Reading any of these numbers](/blog/how-to-read-an-ai-benchmark/) still means asking who ran the test, on what system, under which review status.

## What to watch

- **Review of the provisional Vera Rubin Endpoints results.** If they are verified unchanged, NVIDIA's 10x comparison will rest on two reviewed results, though the metric choice will still matter.
- **Published accuracy scores** for agentic runs, including the SWE-bench Verified tasks MLCommons describes.
- **Larger and more varied agentic submissions**, including AMD and TPU systems, and managed API providers, which Endpoints was designed to measure on the same footing as hardware vendors.
- **MLCommons' normalization rules.** The Endpoints page says normalization rules are still being developed with the community.

## Sources

- [MLCommons Releases MLPerf Training v6.1 Results (MLCommons, November 16, 2026)](https://mlcommons.org/2026/11/mlperf-training-v6-1-results/)
- [MLPerf Training benchmark page (MLCommons)](https://mlcommons.org/benchmarks/training/)
- [MLPerf Training results explorer](https://results.mlcommons.org/training) and [training_results_v6.1 repository](https://github.com/mlcommons/training_results_v6.1)
- [MLPerf Endpoints benchmark page (MLCommons)](https://mlcommons.org/benchmarks/endpoints/)
- [MLPerf Endpoints results explorer](https://results.mlcommons.org/endpoints)
- [What is MLPerf Endpoints, and why it matters to buyers (MLCommons, October 15, 2026)](https://mlcommons.org/2026/10/mlperf-endpoints-matters-to-buyers/)
- [Endpoints v1.0 opens for submissions (MLCommons, October 13, 2026)](https://mlcommons.org/2026/10/open-submissions-endpoints-v1-0/)
- [MLCommons submission rules: results categories](https://github.com/mlcommons/policies/blob/master/submission_rules.adoc)
- [NVIDIA Vera Rubin NVL72 Leads Agentic Inference Performance on MLPerf Endpoints v1.0 (NVIDIA, November 16, 2026)](https://developer.nvidia.com/blog/nvidia-vera-rubin-nvl72-leads-agentic-inference-performance-on-mlperf-endpoints-v1-0/)
- [NVIDIA Vera Rubin NVL72 Achieves up to 2x Blackwell Ultra Performance in MLPerf Training v6.1 (NVIDIA, November 16, 2026)](https://developer.nvidia.com/blog/nvidia-vera-rubin-nvl72-achieves-up-to-2x-blackwell-ultra-performance-in-mlperf-training-v6-1/)
- [NVIDIA Sweeps MLPerf Training and Endpoints as Vera Rubin Debuts (NVIDIA, November 16, 2026)](https://blogs.nvidia.com/blog/mlperf-training-endpoints-vera-rubin/)

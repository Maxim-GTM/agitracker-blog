---
title: "Agent benchmarks lose resolution before they saturate"
description: "SWE-bench Verified's top ten agents fall in one statistical tier. A new preprint blames pass/fail scoring and proposes graded credit with cost kept separate."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "Benchmarks", "AI agents"]
faq:
  - q: "Are the top SWE-bench Verified agents equally capable?"
    a: "Not proven. The preprint finds that the benchmark cannot separate them at its size and test quality. Failing to detect a difference is not evidence that no difference exists."
  - q: "Would the clipped log-ratio score fix SWE-bench Verified?"
    a: "Not directly. The authors found no tasks in a 30-task SWE-bench Verified sample whose tests compare a measured quantity with a threshold. For that benchmark they propose stronger tests, more tasks or trials, statistical tiers and a cost meter."
  - q: "Why not combine quality and cost into one number?"
    a: "The authors report that a quality-cost composite on ALE-Bench mostly ranks cost and flips 129 of 137 adjacent pairs as the exchange rate moves from 0.5 to 2. They propose reporting cost as a separate axis."
---

The ten best agents on SWE-bench Verified cannot be told apart statistically. That is not because they have solved everything. According to the paper discussed here, the top ten together solve 91% of the tasks, and in April 2026 each solved 76% to 80% of them. The problem is the measurement. Each run is scored as one pass/fail bit, and the gaps between neighboring agents are smaller than both the statistical error of a finite task set and the error in the benchmark's own unit tests.

That is the central finding of [Agent Benchmarks Stop Ranking Before They Run Out of Tasks](https://arxiv.org/abs/2611.13541), a preprint by Zihan Dong (Lenovo Group), Qishi Zhan (Marquette University) and Minxuan Hu (Cornell University), submitted to arXiv on November 10, 2026. The authors re-scored released runs from eight agent benchmarks. By their analysis of the September 1, 2026 leaderboard, the SWE-bench Verified top ten span 3.6 points; their test can detect a gap of about 6.3 points with 80% power, and the largest gap between neighbors is 1.4.

Their proposed fix has three parts: a hardened pass/fail gate, a graded quality score (a log-ratio clipped at three reference gaps) anchored to a dated baseline and reference, and cost reported on its own axis. The graded score only applies where a task produces a measurable quantity, such as a runtime or contest score, which limits what it can do for SWE-bench Verified itself.

All numbers below are reported by the cited papers' authors unless labeled as AGI Tracker's hypothetical examples. AGI Tracker has not re-run any of these analyses. The paper is a version 1 arXiv preprint.

## What the paper measured, and from which data

The study draws on different data for different claims, so a finding about one benchmark does not automatically carry over to another.

| Claim | Benchmark and data | Denominator | Date or version |
| --- | --- | --- | --- |
| Top agents are statistically tied | SWE-bench Verified, per-instance verdicts for the official top 30 | Top ten agents, 45 pairs | Leaderboard as of September 1, 2026 |
| Test errors exceed the gaps | Same top 30, passing patches re-checked by SWE-ABS strengthened tests | Each agent's passing patches | SWE-ABS tests treated as ground truth |
| Ties elsewhere | Terminal-Bench 2.0, per-trial results; OSWorld-Verified top ten | 61 submissions (after removing three flagged for cheating); seven OSWorld agents with per-task data | Undated ("today" in the paper) |
| Pass/fail caps scores at the reference | ALE-Bench, SWE-fficiency, AlgoTune, METR, MLE-bench released runs | 7 to 145 models, 40 to 430 tasks | Released runs |
| A higher bar moves the problem | ALE-Bench, split by release date | 46 earlier and 95 later models | Released by end of 2025 vs later; 63 later dates reconstructed |
| Tests throw away a measured quantity | Terminal-Bench 2.0 re-run by the authors | 13 tasks, 4 models, 3 trials (156 runs) | Undated; about $115 at list prices |
| Benchmark turnover | Flagship model cards | 57 cards from seven labs | 2024 to 2026 |

The last row is motivation, not evidence for the scoring argument. The authors report that only a third of a flagship card's agentic results are comparable with the same lab's previous flagship (same benchmark, version, subset and harness), and that the last flagship card to report SWE-bench Verified appeared in April 2026. In the paper's words, the benchmark "ran out of ranking, not tasks."

## Failure A: one bit per task is too coarse

A leaderboard ranks agents only if the gaps between neighbors exceed two errors: statistical error from a finite task set, and verifier error from tests that accept wrong solutions or reject correct ones.

For the statistical side, the authors group agents into tiers: walking down the ranking, an agent starts a new tier if it is significantly worse than the current tier's leader. Their paired, permutation-based multiple-comparison test bounds the chance of any false split at 5%.

In September 2024, the SWE-bench Verified top ten spanned 19.2 points and three tiers. Since March 2025 they have formed one or two tiers. In the September 2026 snapshot the spread is 3.6 points and the top ten form one tier, or two in 59% of task resamples. None of the 45 pairs within the top ten differs significantly. The same holds on Terminal-Bench 2.0, whose top ten also form one tier. OSWorld-Verified's top agents form two tiers, a leading pair apart from a tied pack, and on all three leaderboards no neighboring pair differs significantly.

The authors stress that this is not a weak test: it splits ten real entries spaced 5.7 points apart into ten tiers. Nor is it a ceiling effect, since the union of the top ten solves 91% of tasks.

For the verifier side, they use [SWE-ABS](https://arxiv.org/abs/2603.00520), an adversarial test-strengthening method posted in February 2026. Its strengthened tests reject 17.7% of the median top-30 agent's passing patches, with a range of 10.8% to 23.2% across agents. That rate differs between agents beyond sampling noise, with a spread of about 2 points, while neighboring agents are typically 0.2 to 0.4 points apart.

Correcting the verdicts changes who leads: the top tier of the top 30 shrinks from 23 agents to a leading group of five. It also reverses 8 of the 18 neighboring orders that had a non-zero gap. Removing the same share of passes at random reverses about as many: 8, with a 95% band of 4 to 11. The authors conclude that the order of neighbors is noise that any perturbation of that size reshuffles.

Two analyses by other teams point the same way. The SWE-ABS authors report that their tests reject 19.71% of previously passing patches on the 500-instance benchmark, cutting the top agent's score from 78.80% to 62.20% and dropping the former leader to fifth. A September 2026 audit, [Coding Agents Have Converged](https://arxiv.org/abs/2609.17394) by Fengshuo Liu and colleagues, examined 254 SWE-bench submissions without re-running models. Its exact paired tests separate none of the 29 adjacent pairs in the Verified top thirty at the 5% level. On the 2,294-instance Test split, whose top entries still span 0.2% to 52.6%, the same test separates 14 of 23 adjacent pairs.

The Liu audit adds two cautions. The same model's score varies by up to 29.8 points across scaffolds, against an 8.8-point spread across the whole top thirty, so an entry describes a model and scaffold pair. And failing to reject a difference does not establish equivalence: "statistically tied" means the benchmark cannot order the agents, not that they are equal.

[Our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) shows why a model at 80% on 500 questions carries a 95% interval of roughly 3.5 points either side. That is for one score; to detect a gap between two agents while testing many pairs at once, the paper's test needs about 6.3 points.

## A reconstructed timeline

This table assembles dates from the papers read for this article, separating when something happened from when a paper reported it.

| Date | Event | Reported by |
| --- | --- | --- |
| September 2024 | SWE-bench Verified top ten span 19.2 points across three tiers | Dong, Zhan and Hu (2026) |
| March 2025 onward | Top ten form one or two tiers | Dong, Zhan and Hu (2026) |
| February 18, 2026 | Study of 60 LM benchmarks finds nearly half saturated (v1; v4 dated August 6, 2026) | [Akhtar et al.](https://arxiv.org/abs/2602.16763) |
| February 28, 2026 | SWE-ABS preprint: strengthened tests reject 19.71% of passing patches | Yu et al. |
| April 2026 | Last flagship model card to report SWE-bench Verified, per the paper's survey of 57 cards | Dong, Zhan and Hu (2026) |
| September 1, 2026 | Leaderboard snapshot used for the tier analysis: top ten span 3.6 points, one tier | Dong, Zhan and Hu (2026) |
| September 15, 2026 | Liu et al. audit: no adjacent Verified top-thirty pair separates | Liu et al. |
| November 10, 2026 | Dong, Zhan and Hu submit the re-scoring paper (v1) | arXiv |

[Our earlier explainer on why benchmarks saturate](/blog/why-benchmarks-saturate/) describes the usual cycle of release, climb, ceiling and replacement. The new evidence adds a step that cycle leaves out: a benchmark can stop ranking the frontier while each top agent still fails a fifth or more of its tasks, as SWE-bench Verified's top ten did in April 2026. The new paper notes that the Akhtar study tested saturation against properties such as answer format, access, size and age, but not against how the score is built.

## Failure B: the bit is capped at the reference

A pass/fail check against a reference gives the same credit to a run that just clears the bar and one that beats it tenfold. Once frontier agents routinely reach the reference, the information sits above the cap, where the score cannot see it.

The authors took every benchmark they found that releases per-run, per-task continuous results and scored the same runs by the official metric, by a pass/fail "answer key" against a reference, by a capped partial-credit score, and by their proposed objective with room above the reference.

| Benchmark | Models | Tasks | Runs beating reference | Official | Answer key | Objective |
| --- | --- | --- | --- | --- | --- | --- |
| ALE-Bench | 145 | 40 | 47.8% | 3 tiers | 1 tier | 3 tiers |
| SWE-fficiency | 7 | 430 | 36.3% | 1 tier | 4 tiers | 4 tiers |
| AlgoTune | 18 | 154 | 70.6% | 2 tiers | 2 tiers | 3 tiers |
| MLE-bench | 27 | 74 | 10.8% | Same as key | 4 tiers | 3 tiers |

Source: Table 1 of the preprint. Tiers are counted among each benchmark's top ten; more tiers means a finer ranking. METR's time-horizon data is in the paper's table too, but its released results are already capped at the reference, so the objective column does not apply to it.

ALE-Bench is the clean case. Its official score, mean contest performance across 40 optimization contests, splits the top ten into three tiers. Scored pass/fail against the median human contestant, the same runs collapse into one tier, even though nearly half the runs beat that human. Partial credit below the reference does not help: the capped score still gives one tier.

The paper also reports where the margin above the reference does not matter. On MLE-bench, where only 10.8% of runs beat the reference, the key already separates the top and the graded score is blurrier. The margin carries information mainly where the key has run out.

### Why a harder bar does not fix it

The usual response to a saturated benchmark is a harder version. Because any bar can be applied to ALE-Bench contest scores, the authors could test that idea on fixed tasks. They split the 141 models with known or estimated release dates into 46 released by the end of 2025 and 95 released later.

The median-human bar ties the later top ten. A contest-winner bar separates them into two tiers but scores 89% of the earlier models zero on every task. A bar tuned to separate the earlier models puts the later top ten back into one tier. In the paper's framing, each bar resolves one band of ability, and raising it moves the band rather than widening it.

A real new version also adds tasks, which the paper does not simulate. So the finding is narrower than "harder versions never help": a stricter pass criterion on the same tasks trades resolution at one level for resolution at another.

## What Terminal-Bench tests compute and then discard

The Terminal-Bench 2.0 task called query-optimize asks the agent to speed up a slow SQL query. The test runs the agent's query, measures the runtime and passes it if the runtime falls below a threshold. The runtime is then thrown away.

The authors coded the tests of all 89 Terminal-Bench 2.0 tasks: 18 (20%) compare a measured quantity with a threshold. Samples of 30 SWE-bench Verified, 30 OSWorld-Verified and 20 τ2-bench tasks contained none, though with samples that small the authors say true rates up to 10% to 15% cannot be ruled out.

Released logs recorded the quantity for only four threshold tasks, so the authors re-ran 13 with the tests changed only to print it. They ran four models, gpt-5.3-codex, claude-opus-5, gpt-6-astra and gemini-3.1-pro, inside the Terminus-2 agent harness, three trials per task, one CPU core per run. On pass/fail, the last three were tied and gpt-5.3-codex was separated.

The tied three differed widely on what the tests discarded. On portfolio-optimization, every run by the three passed, yet claude-opus-5's median speedup was 10.9 times and the other two models' 1.3 times, about the reference solution's level. On pytorch-model-recovery, median mean squared error spanned 0.016 to 0.60. Of all passing runs, 69% beat the reference solution.

Two qualifications apply. Ranking the models on the printed quantity separated four of six pairs against pass/fail's three, and the authors call the aggregate separation borderline with three trials per cell; the robust evidence is per task. And two gpt-5.3-codex runs passed by reward hacking, more verifier error, though both stood out in the printed quantity.

### Cost differs even when scores tie

Over all 89 tasks, the six tied top-ten Terminal-Bench 2.0 agents that log tokens differ 7.3 times in median tokens per run. For the four priced at list rates, median cost per run ranges from $0.44 to $2.47, a 5.5-fold spread, with every pair significantly different. The cheapest agent per run uses the most expensive model per token.

Cost per accepted run also separates pass-rate ties: 4 of 8 adjacent mini-SWE-agent pairs on SWE-bench Verified and 4 of 5 priced Terminal-Bench 2.0 pairs in the top tier. The authors caution that under one scaffold this mostly reflects price per token and verbosity, not ability.

## The proposal: gate, objective, meter and anchors

The paper traces both failures to one choice: an answer key encodes a per-task answer, which stops informing once agents reach it. A preference such as "faster is better" can be scored once per domain and leaves room above any reference. The design starts from an intent, which states hard constraints and a direction of preference (the paper's example: "the bracket must carry the load; lighter is better"), and then splits the scoring into four components.

| Component | What it does | Problem it addresses (AGI Tracker's summary) |
| --- | --- | --- |
| Gate | Deterministic, hardened acceptance check: behavioral, physics or safety, and anti-tamper | Acceptance, which the key mixes with quality |
| Objective | Graded score of a raw quantity against dated anchors, with room above the reference | The bit that caps at the reference |
| Meter | Records dollars at a dated price table, tokens, steps and time, reported as cost-to-target and never blended into the objective | Cost, which the key ignores |
| Anchors | Baseline and reference frozen with a date, so two versions can share one scale | A moving bar that cannot link versions |

For a positive quantity J, with baseline J<sub>base</sub> and reference J<sub>ref</sub>, the objective is the gate result multiplied by log(J / J<sub>base</sub>) divided by log(J<sub>ref</sub> / J<sub>base</sub>), floored at 0 and clipped at 3, then averaged over tasks. A run that fails the gate scores zero, so the objective never rewards an invalid run.

The authors derive the log form rather than picking it from results. A score of a positive quantity should not depend on its unit, and credit should add when improvements compound, which the paper notes forces a logarithm. Dividing by the reference gap sets the scale so the reference scores 1. The clip at 3 is a stated convention that caps any single task's share of the total at 3/n for n tasks. Without it, a task whose reference barely beats the baseline would dominate: on SWE-fficiency, a task with an expert speedup of 1.001 would hold a third of the score.

On ALE-Bench, the paper reports that the clipped log-ratio agrees with the human contest rating about as well as the pass/fail key (difference +0.02, 95% interval −0.002 to +0.05) and is more stable across random halves of the task set. Alternatives fared worse: adding or removing models flipped up to a third of pairs under percentile scores, and 79% of a linear score came from the top 5% of tasks, against 11% for the log-ratio. For quantities with no natural zero, such as Kaggle metrics, the authors propose a linear score with the same floor and clip.

### A worked example with hypothetical inputs

The following example is AGI Tracker's illustration, not data from the paper. Imagine a task like query-optimize. The slow baseline query takes 10 seconds. The reference solution takes 2 seconds. The test passes any query under 4 seconds. Because lower runtime is better, the positive quantity is speed, so the ratio is baseline runtime over the run's runtime.

| Hypothetical run | Runtime | Passes test? | Pass/fail score | Clipped log-ratio |
| --- | --- | --- | --- | --- |
| A | 3.5 s | Yes | 1 | 0.65 |
| B | 2.0 s | Yes | 1 | 1.00 |
| C | 0.4 s | Yes | 1 | 2.00 |
| D | 0.05 s | Yes | 1 | 3.00 (3.29 before clip) |
| E | 0.3 s, but edits the test fixture | No (fails gate) | 0 | 0 |

For run C, log(10 / 0.4) divided by log(10 / 2) is log 25 over log 5, which is exactly 2: it went two reference gaps beyond the baseline. Runs A to D are identical under pass/fail. Under the objective they spread from 0.65 to 3. Run E shows why the gate stays: a fast result produced by tampering is worthless, and the gate, not the objective, catches it.

Run D shows a weakness the paper flags. If many runs hit the clip, the reference is probably too weak, and the authors' rule is to replace the reference rather than tune the clip. They report that the clip binds on 4% of ALE-Bench runs.

Now add cost. Suppose run A cost $0.40 and run C cost $2.40. Under the proposal, both numbers are published side by side and neither run "wins" outright. C has higher quality and A has lower cost, so both sit on the quality-cost Pareto front. Any claim that one leads has to state the range of exchange rates between quality and cost over which the lead holds. The authors argue against folding the two into one composite: on ALE-Bench, such a composite had a Kendall rank correlation of −0.35 with the human rating in the later cohort and flipped 129 of 137 adjacent pairs as the exchange rate moved from 0.5 to 2.

Two design points remain. Because runtimes drift with hardware, anchor artifacts are re-measured on the machine used for the runs and enter only as ratios; re-running three reference agents linked an old and a harder new half of ALE-Bench within 1 to 3 points of the accuracy of re-running every old model. And LLMs may help write gate and objective code, with human audit, but never score runs, which the authors call a design position rather than a finding.

## What this does and does not fix for SWE-bench Verified

This is the most important limit for readers of SWE-bench Verified results. The graded log-ratio applies to tasks that produce a quantity. The paper's 30-task sample from SWE-bench Verified contained none. A typical SWE-bench task asks for a patch that makes hidden tests pass, which yields a correct end state rather than a runtime or score.

So for SWE-bench Verified, the paper's remedies are the ones it lists for Failure A: a stronger gate, more tasks or trials, more information per task and statistical tiers instead of ranks. A cost meter adds a second axis on which tied agents may differ, though under one scaffold cost largely tracks price per token and verbosity. A graded objective would require restating tasks around a measurable quantity, as SWE-fficiency does with code speedups.

For current results, a one-point lead between top agents is not evidence of a capability difference, and a reported score describes a model, a scaffold and a test suite together.

## What remains unknown

- **Verifier error is measured on one benchmark.** Per-agent verifier error exists only for SWE-bench Verified, where the authors take SWE-ABS tests as ground truth, an assumption rather than a measurement. False fails are bounded only by simulation.
- **The higher-bar result rests on ALE-Bench.** Its release dates are partly reconstructed (63 of the 95 later models), though the authors report unchanged tiers on the 32 with verifiable dates. AlgoTune agrees weakly and MLE-bench shows no such effect.
- **The Terminal-Bench re-run is small.** Three trials per task, 13 tasks and four models make the aggregate separation borderline.
- **Coverage is uncertain.** Only 20% of Terminal-Bench 2.0 tasks are threshold tasks. Rubric-graded deliverables such as GDPval have neither a gate nor a scalar objective, so the design does not apply to them.
- **Objectives can be gamed.** The paper cites prior work showing this and insists the gate stay hardened.
- **Code is promised, not yet linked.** The v1 paper says code and derived statistics are released but gives no repository link in its HTML version.

AGI Tracker proposes three checks that would change or sharpen the conclusion; none has been run. An independent replication of the tier analysis on the September 2026 snapshot, using the released per-instance verdicts, would test whether one tier holds under other reasonable methods. A benchmark adopting the gate, objective and meter design on fresh tasks, with frozen anchors published in advance, would test whether graded credit keeps separating agents across versions. And a larger SWE-style task set whose top entries are as close together as Verified's would show how much resolution task count alone can buy. The Liu audit's Test split result does not settle that, because its top entries are spread far apart.

## What it means for reading agent progress

The finding is about measurement design, not about whether agents are improving. A leaderboard whose top ten tie has stopped reporting differences among the strongest agents; it has not shown that they are equally capable or that progress has stalled. Terminal-Bench 2.0 shows the reverse risk: in the authors' re-run, models tied on pass/fail differed by up to an order of magnitude on what the task measured, and in released results the tied top agents differed 5.5-fold in median cost per run.

That suggests a practical standard. A claimed lead on a pass/fail agent benchmark should come with a statistical tier, not only a rank, a note on whether tests were strengthened and which scaffold was used, and cost reported beside quality. Results expressed in human task time, such as [METR's time horizons](/blog/metr-time-horizons-2026/), and outcome-based checks of agent work, discussed in [our piece on computer-use agents](/blog/computer-use-agent-finished-job/), face versions of the same questions about what a pass means.

The paper's supported claim is narrower than its title. On released data, several agent benchmarks lost the ability to rank their top entries while unsolved tasks remained, and the authors attribute much of that loss to pass/fail scoring. Their graded objective restores resolution where tasks produce a measurable quantity. For benchmarks built on correct end states, including SWE-bench Verified, the remedy remains better tests, more tasks and honest reporting of uncertainty.

## Sources

- [Agent Benchmarks Stop Ranking Before They Run Out of Tasks (arXiv abstract)](https://arxiv.org/abs/2611.13541)
- [Agent Benchmarks Stop Ranking Before They Run Out of Tasks, full paper v1 (HTML)](https://arxiv.org/html/2611.13541v1)
- [SWE-ABS: Adversarial Benchmark Strengthening Exposes Inflated Success Rates on Test-based Benchmark](https://arxiv.org/abs/2603.00520)
- [Coding Agents Have Converged: Why the SWE-bench Leaderboard Can No Longer Order Its Top Entries, and What to Measure Instead](https://arxiv.org/abs/2609.17394)
- [When AI Benchmarks Plateau: A Systematic Study of Benchmark Saturation](https://arxiv.org/abs/2602.16763)

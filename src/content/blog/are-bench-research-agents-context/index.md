---
title: "ARE-bench: three agents tie at 69% until context is checked"
description: "ARE-bench re-scores the same research-agent work with project history and workspace checks added. A 69% three-way tie falls to between 28% and 40%."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["AI agents", "Evaluation", "Benchmarks"]
faq:
  - q: "Did the agents behave differently in the 69% and 28% to 40% conditions?"
    a: "No. The authors held the deliveries and item-level verdicts fixed and changed only which checklist items counted toward a pass. The drop measures what narrower grading misses, not a change in agent behavior."
  - q: "Do all seven models show the same 69% starting point?"
    a: "Not known. The paper reports this re-scoring only for DeepSeek-V4.1-Flash, GLM-5.3-Flash and Kimi-K3, which the paper presents as having similar scores under the narrowest scope."
  - q: "Can ARE-bench scores be compared with PaperBench Code-Dev scores?"
    a: "Not directly. The benchmarks use different tasks, harnesses, judges and metrics. The useful contrast is in what each grading scheme checks."
  - q: "Has AGI Tracker run ARE-bench?"
    a: "No. All results here are reported by the paper's authors and scored by an LLM judge."
---

If you grade a research agent only on whether it handed over what the current request asked for, you will overrate it, and you will struggle to tell agents apart. ARE-bench, a benchmark posted to arXiv on November 10, puts a number on that. Three models each passed about 69% of tasks when only the requested deliverables and general professional norms were checked. When the checks also covered decisions made earlier in the session and constraints in the project files, the same work passed on 40.00%, 31.56% and 28.44% of tasks.

What makes the result clean is that the agents were not run again. The authors kept the same deliveries and the same judge verdicts for each checklist item and changed only which items counted toward a pass. So the drop describes the grader, not the agents. A grader that checks only the deliverable and general norms misses roughly half of the failed runs these three models produced, and it makes models that differ look equal.

The [ARE-bench paper](https://arxiv.org/abs/2611.14364) comes from a team listing Shanghai Artificial Intelligence Laboratory, Fudan University and four other Chinese universities. Version 1 was submitted on November 10, 2026, and the PDF header is dated November 11. AGI Tracker has not run the benchmark. Every figure below is reported by the authors, and the pass or fail decisions come from an LLM judge.

## What ARE-bench changes about the starting point

Many established research-agent benchmarks, the authors note, give the agent a standalone goal, such as replicating a paper, entering a Kaggle competition or finishing a research-engineering task, often from a clean or curated starting state. Real research delegation rarely looks like that. A researcher asks for one step in the middle of a project: fix the script that failed overnight, add a table, restructure a draft after review. Doing that step well depends on choices made earlier and on files that are already on disk.

ARE-bench builds its 75 tasks from agent sessions and full workspaces collected from recruited researchers' own projects. Each task is cut at a real user request. Earlier requests that still apply are compressed into a Background section of the instruction. The authors say this section summarizes 36.0 earlier user turns on average and cites 10.3 earlier requests that are still in effect. The workspace is replayed from the platform's event log up to the cut point without any cleanup. It holds 41.1 files on average, and 65.3% of tasks contain files that an agent wrote in earlier turns. The paper's own illustration shows superseded plan drafts next to current ones, duplicate review PDFs and paused experiment folders.

The agent sees the instruction and the workspace. It does not see the rubric. Each rubric compiles into binary checklist items, 1,173 in total and 15.6 per task on average, spread over seven research stages: Survey, Design, Data and Environment, Code, Execution, Analysis and Writing. Two construction rules matter for how the results should be read. Items do not prescribe an implementation, so any valid solution passes. And an item stays in the rubric only if a competent researcher could have inferred it at the cut point, even when later user feedback is what exposed it.

Each of seven models ran three rollouts per task. The headline metric is the instance success rate (ISR): the share of task runs in which every applicable checklist item passes. A partial-credit metric, the checklist item success rate (CSR), averages the share of items passed per task.

## The re-scoring experiment, with its exact conditions

The paper's Table 8 is the core of this article. The authors group checklist items into scopes. The narrowest scope is "contract" and "norm" items: the requested delivery and general professional standards. The second scope adds "inherited" and "anchored" items, which the paper describes as historical requirements and material or workspace requirements. The full checklist also adds "latent" items, which later rework uncovered but which were inferable at the cut point. ISR is then recomputed for each scope from the same 225 runs per model (75 tasks times three rollouts).

The worksheet below reproduces the reported percentages and adds two columns that AGI Tracker derived from figures given elsewhere in the paper. The paper reports that 66, 85 and 93 runs passed the narrowest scope and still failed a contextual item. It also gives each model's total failed runs in Table 6: 136, 156 and 162. Converting the percentages into run counts produces totals that agree with both of those reported figures.

| Model (harness) | ISR, contract and norm items | ISR, plus historical and workspace items | ISR, full checklist | Runs passing narrow scope but failing a contextual item | Share of all failed runs |
| --- | --- | --- | --- | --- | --- |
| DeepSeek-V4.1-Flash (Claude Code) | 69.33% (about 156 of 225) | 40.00% (90 of 225) | 39.56% | 66 | 48.5% of 136 |
| GLM-5.3-Flash (Claude Code) | 69.33% (about 156 of 225) | 31.56% (71 of 225) | 30.67% | 85 | 54.5% of 156 |
| Kimi-K3 (Claude Code) | 69.78% (about 157 of 225) | 28.44% (64 of 225) | 28.00% | 93 | 57.4% of 162 |

Source: ARE-bench Tables 6 and 8, with run counts derived by AGI Tracker from the reported percentages. All values are three-round means over 75 tasks.

Three points stand out.

**The drop is large in relative terms.** Adding historical and workspace requirements cuts ISR by about 29, 38 and 41 percentage points. Relative to the narrow-scope score, that means losing 42%, 54% and 59% of the apparent successes.

**Nearly all of the drop comes from the second scope.** The latent items move ISR by less than one point for each model: 0.44, 0.89 and 0.44. This matters because the latent items are the obvious target for criticism, since they were found with hindsight. The finding does not depend on them. It rests on requirements carried by the session history and the workspace.

**The tie disappears.** Under the narrow scope, DeepSeek-V4.1-Flash and Kimi-K3 differ by 0.44 points. Under the full checklist they differ by 11.56 points. A benchmark that checked only deliverables would have reported three equal agents.

Two conditions limit how far this generalizes. The authors picked these three models as ones with similar narrow-scope scores. The paper does not report the narrow-scope ISR for GPT-6.1-Sol, Claude Opus 5.5, Qwen3.8-Max or Qwen3.8-27B, so "about 69%" describes models ranked third, fifth and sixth of seven overall, not research agents in general. Also, every agent received the Background summary and the workspace in every run. The experiment shows what a narrower grader would have missed. It does not show how agents would perform if the context were withheld.

## Why checking the deliverable is not enough: a worked example

The paper's appendix walks through one task in full, and it is the clearest illustration of the mechanism. A researcher had asked an agent to reimplement a published image-to-point-cloud registration method, called CylindFormer in the paper, from scratch because the official repository held only a README. Training on the 7-Scenes dataset had started, but the coarse-matching loss stayed at zero and each iteration took about 28 seconds. The task is cut at the researcher's next request: fix the issues, then continue training. The instruction says the method must stay consistent with the paper in the workspace.

The authors compare two executions. Both resumed training with nonzero loss and parameter updates. One passed all 20 checklist items. The other passed 16. AGI Tracker grouped the 20 items from the paper's Table 16 by what they check. The grouping is ours, not the paper's scope labels, but the pass and fail outcomes are the paper's.

| What the items check (AGI Tracker grouping) | Items | 20/20 execution | 16/20 execution |
| --- | --- | --- | --- |
| Explicit deliverables named in the request | O1, O19 | 2 of 2 | 2 of 2 |
| Training actually runs, is faster, saves and reloads | O13 to O16 | 4 of 4 | 4 of 4 |
| Method stays faithful to the paper in the workspace | O2 to O12, O17, O18 | 13 of 13 | 9 of 13 |
| Report separates recovery from full reproduction | O20 | 1 of 1 | 1 of 1 |

A grader that checked only the explicit deliverables and the training run would give both executions a perfect 6 of 6, or 7 of 7 with the report item added. The difference shows up only in the method items. The 16/20 execution used projection coordinates that did not match the feature grid, which pushed some samples to boundary columns. It replaced separate 2D and 3D overlap tests with one projection ratio. It swapped L2 distance for squared distance in the coarse matching loss without changing the margins, altered the weights and carried those changes into the fine matching loss. Each of these is a requirement held by a PDF in the workspace, not by the sentence the researcher typed.

The paper states the limit of this example clearly: the comparison establishes whether the method was preserved, not whether final registration accuracy dropped. A deviation from the paper can still matter a great deal for a reproduction, because the result would no longer test the published method.

The paper's other archived failures follow the same pattern. In one CylindFormer repair, DeepSeek kept a backbone named KPConv that applied only per-point Linear, LayerNorm and ReLU layers, with no neighborhood or kernel-point aggregation. In a Graph RAG adaptation, DeepSeek let datasets share one global index directory instead of isolated indexes. A GLM-5.3-Flash experiment plan recorded costs but gave no executable rule for matching inference budgets across comparison arms. The authors present these as illustrative cases, not a frequency count.

## Strict success hides near misses, and partial credit hides failures

The headline ISR figures are low. GPT-6.1-Sol (run in OpenAI's Codex harness) reaches 66.22%. Claude Opus 5.5 reaches 56.89%. The other five models, all run in Claude Code, range from 39.56% for DeepSeek-V4.1-Flash down to 25.78% for Qwen3.8-27B. The standard deviations across the three rounds run from 0.77 to 7.06 points, so adjacent models such as DeepSeek-V4.1-Flash and Qwen3.8-Max (37.78%) are not clearly separated.

CSR tells a different story. It runs from 79.66% to 92.72%, a spread of 13.1 points, against 40.4 points for ISR. Agents satisfy most items on most tasks. Where they differ is in satisfying all of them. Of GPT-6.1-Sol's 76 failed runs, 47 (61.84%) missed only one or two items. Across the seven models that share ranges from 53.09% to 72.06%.

Both metrics are useful, and neither should be read alone. CSR suggests agents are nearly there. ISR treats a research step as done only if nothing important is broken. In the CylindFormer case, a 16/20 run is 80% on CSR, but a researcher who builds on it is building on a different method.

The authors also split ISR into completeness, correctness and constraint compliance. Correctness is the lowest for every model, from 31.11% to 71.11%, against 72.00% to 87.56% for completeness. Between 85.5% and 92.8% of failed runs include at least one unmet correctness item. DeepSeek-V4.1-Flash reaches 93.16% completeness CSR but 47.11% correctness ISR. The deliverables arrive. Whether they are right is the problem.

## Stage profiles and cost do not track the headline

By stage, the seven-model mean ISR is highest for Data and Environment (86.43%) and lowest for Execution (57.43%) and Design (59.47%). The authors report that Design and Execution are among the three hardest stages for every model, and those two stages also show the widest best-to-worst gaps, at 35.77 and 37.37 points. Rankings change by stage. Kimi-K3 is third on Code at 73.96% but last on Writing at 47.31%. Claude Opus 5.5 leads Design. DeepSeek-V4.1-Flash leads Data and Environment. Stage results rest on between 20 and 41 tasks each, so these per-stage gaps are less certain than the overall figures.

On cost, the authors applied API prices frozen on November 2, 2026 to measured token use. GPT-6.1-Sol cost about $2.17 per run and Claude Opus 5.5 about $5.69, roughly 2.6 times as much for an ISR 9.33 points lower. GLM-5.3-Flash and DeepSeek-V4.1-Flash cost about $0.20 and $0.53 per run. Larger peak context did not line up with success either. These figures cover model API charges only, under one task distribution and one set of harnesses.

## What the paper does not establish

The result is narrow and well constructed. Several open questions limit what it can support.

**The judge is a model, and its reliability is only partly measured.** A GLM-5.3 judge issued the verdicts, with GLM-5.3-Flash used for a small subset of runs. A model from the same family is also one of the actors under test. The authors compared DeepSeek and Qwen judges on 9,874 paired item verdicts from a subset of tasks. They agreed 92.76% of the time, with Cohen's kappa of 0.717, and 90.63% of disagreements went in one direction: the DeepSeek judge failed an item that the Qwen judge passed. On a 20-task common subset, CSR rankings were largely stable across judges, with Spearman correlations between 0.9286 and 0.9643. Task authors did check every failed item from a validation rollout during construction, but that is a task-quality step, not a measured agreement rate. The authors call independent human annotation the next step for judge reliability. Because the contextual items are the ones that require reading a paper or a design document to judge, they are plausibly where judge errors would concentrate. The paper does not report item agreement by scope.

**Model and harness are confounded.** GPT-6.1-Sol ran in Codex and the other six models in Claude Code. The authors acknowledge that cross-model differences reflect the model and the harness together.

**The task population is specific.** Sessions came from recruited researchers. The paper notes they may overrepresent particular projects, tools or researcher populations. The selection rules keep only medium- or high-difficulty episodes. The paper also does not say how many researchers or source sessions contributed. ISR is a property of these 75 tasks, not a measure of scientific ability in general, as the authors themselves put it.

**Replay is imperfect.** In the worked example, the restored environment uses compatible fixed dependencies rather than an exact restoration, and the dataset file inventory is not guaranteed to match the original. Anonymization can also remove clues. These are reasonable compromises, but they mean the agent's context is not identical to the researcher's.

**Release status is unclear.** As of November 12, the [project page](https://arebench.com) lists Overview, Leaderboard and Tasks sections that did not render when AGI Tracker checked, and it asks people who want to test a model to make contact by email. The paper says the provenance package is access-controlled. Outside replication depends on what is eventually released.

## How the result sits next to other research benchmarks

The authors open with a deliberate contrast. Qwen's [Hugging Face model card for Qwen3.8-2.4T-A95B-FP8](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8), which describes Qwen3.8-Max as the API version of the same base model, reports 93.0 for Qwen3.8-Max on PaperBench. A footnote says this was evaluated in BasicAgent Code-Dev mode, judged by Claude Opus 4.6 and averaged over three runs of up to 12 hours each. The [PaperBench paper](https://arxiv.org/abs/2504.01848) describes Code-Dev as a simplified variant that grades only the code-development nodes of its rubrics and skips the reproduction step, which removes the need for GPU hardware. On ARE-bench, Qwen3.8-Max scores 37.78% ISR.

These numbers cannot be compared as a ranking. The tasks, metrics, harnesses and judges all differ. The contrast is useful for a different reason: each score is accurate about what its grader checks. Code-Dev tells you whether code was written to match a rubric. It was not designed to tell you whether a run reproduces a result, and neither benchmark claims otherwise. The error is in reading a high score as evidence about properties the grader never checked.

That is the same distinction AGI Tracker drew for [computer-use agents](/blog/computer-use-agent-finished-job/), where a convincing final screen is not the saved outcome. ARE-bench adds a research version: a deliverable that runs is not the same thing as a method that has been preserved.

## A proposed reporting standard for research-agent evaluations

What follows is a proposal by AGI Tracker, not something the ARE-bench authors prescribe. It turns their re-scoring into a report that other evaluators, and teams testing agents on their own projects, could publish.

| Report this | Why | ARE-bench status |
| --- | --- | --- |
| ISR at each check scope, from the same deliveries | Shows how much the headline depends on contextual checks | Reported for three of seven models |
| Run counts behind every percentage | Lets readers check denominators and pooled rounds | Partly reported, partly derivable |
| ISR and CSR side by side | Separates near misses from broad failure | Reported |
| Item-level judge agreement by scope, against human review | Contextual items are the hardest to judge | Cross-model judges only, no breakdown by scope |
| Same harness for every model, or a harness ablation | Separates model from scaffold | Not done |
| A context-withheld ablation | Tests whether agents use the Background and workspace | Not done; the authors say future ablations could separate context and workspace effects |
| Method-fidelity items for any task that cites a reference method | Catches name-preserving substitutions like the KPConv case | Present in the worked example |

For a team evaluating an agent internally, the cheapest version is this. Pick five real requests from your own project history. For each one, write down the deliverable checks and, separately, the constraints that live in earlier decisions and project files. Score both. If the two pass rates are close, deliverable-only grading is probably adequate for your work. If they diverge the way ARE-bench's did, your current dashboard is overstating the agent.

## What evidence would change the conclusion

The conclusion is that deliverable-only grading overstates research-agent reliability and compresses differences between agents. Several findings would weaken it.

Human review that found the GLM-5.3 judge failing contextual items too readily would shrink the gap, because those items carry the drop. The directional disagreement between the DeepSeek and Qwen judges shows that judge strictness on borderline items is not a settled matter.

Showing the same scope analysis for GPT-6.1-Sol and Claude Opus 5.5 would show whether stronger agents close the gap or merely shift it. If the strongest models lose little when contextual items are added, the lesson would narrow to mid-tier agents.

A context-withheld ablation that left contextual-item pass rates unchanged would suggest agents are not reading the Background or workspace at all, and that the items test something closer to luck or prior knowledge. A large change in either direction would be informative.

Independent replication on a different researcher population, using released tasks, would test whether the effect belongs to research continuation in general or to these 75 sessions.

## A result, not an AGI claim

ARE-bench does not say research agents are weak or strong in any absolute sense. Its contribution is about measurement: a specific, checkable way of showing that the same work can look like 69% success or 28% success depending on whether the grader reads the project as well as the request. The strongest reported agent still fails about a third of its runs on real mid-project research steps under the full checklist, and most of those failures are close misses that a partial-credit score would hide.

For anyone tracking progress toward agents that can do research work, the practical point is to ask what the grader checked before reading the number, the same question [AGI Tracker's guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) applies to any score. A benchmark that checks only the deliverable measures something narrower than its headline implies. As older tests [saturate](/blog/why-benchmarks-saturate/), tests that grade against real project state may be where the remaining differences between agents show up.

## Sources

- [ARE-bench: Benchmarking Agents' Research Ability in Real-World Researcher Sessions and Workspaces (arXiv abstract)](https://arxiv.org/abs/2611.14364)
- [ARE-bench full paper, v1 PDF](https://arxiv.org/pdf/2611.14364v1)
- [ARE-bench project page](https://arebench.com)
- [PaperBench: Evaluating AI's Ability to Replicate AI Research](https://arxiv.org/abs/2504.01848)
- [PaperBench full paper, Code-Dev section](https://arxiv.org/html/2504.01848v3)
- [Qwen3.8-2.4T-A95B-FP8 model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B-FP8)

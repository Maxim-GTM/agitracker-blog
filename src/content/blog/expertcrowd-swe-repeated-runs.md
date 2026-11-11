---
title: "ExpertCrowd-SWE: a tie at the top and what five runs reveal"
description: "Claude Opus 5.5 and GPT-6 Astra are statistically tied on ExpertCrowd-SWE. Five runs per task expose breadth, consistency and effort that one score hides."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["AI agents", "Evaluation", "Benchmarks"]
faq:
  - q: "Is Claude Opus 5.5 better than GPT-6 Astra on ExpertCrowd-SWE?"
    a: "Not by a margin the authors' paired test can detect. The 3.6-point lead has a 95% paired interval of −1.4 to +9.7 points and a Holm-adjusted p-value of 0.20 over the 100 tasks."
  - q: "Did AGI Tracker run the benchmark?"
    a: "No. Every result here comes from the Toptal ExpertCrowd authors' paper, leaderboard and dataset card. AGI Tracker recomputed some ratios from their published tables and labels those as its own arithmetic."
  - q: "Does an agent that takes fewer steps cost less?"
    a: "Not necessarily. A step is one model turn. The paper reports turns and container time, not tokens or dollars, and its models use different tool interfaces, so a turn is not the same unit of work for every model."
---

Claude Opus 5.5 scores 67.3% on ExpertCrowd-SWE and GPT-6 Astra scores 63.7%, but the benchmark's own authors cannot say which is better. Their paired test over 100 tasks puts the 3.6-point gap anywhere between −1.4 and +9.7 points, with a Holm-adjusted p-value of 0.20. On this test the top of the leaderboard is a statistical tie.

The more useful finding comes from running each model five times on every task. The two leaders turn out to be different kinds of agent. Opus 5.5 earns full credit at least once on more tasks, 47 against 36. Astra earns full credit on all five runs more often, on 15 tasks against 9, and it uses a median of 33 steps per run where Opus uses 160. Across the whole field, reliability is rare: on 80 of the 100 tasks, no model earned full credit on all five of its runs.

That is what a single-run leaderboard hides. A mean score tells you how much credit an agent collects on average. It does not tell you whether the agent solves a task every time, solves it sometimes, or never quite finishes it. AGI Tracker did not run ExpertCrowd-SWE. Every number below comes from the [paper](https://arxiv.org/abs/2611.13246), its [leaderboard page](https://www.toptal.com/expertcrowd/benchmarks/expertcrowd-swe-benchmark) or its [Hugging Face dataset card](https://huggingface.co/datasets/ExpertCrowd/ec-swe), and our own arithmetic on their tables is labeled as such.

## What was measured, by whom and when

ExpertCrowd-SWE (EC-SWE) is a set of 100 multi-file software engineering tasks written by engineers from Toptal's ExpertCrowd network. Each task is a short ticket, a median of 148 words, pinned to a commit of a real repository; 98 of the 100 are new changes to public open-source projects. The tasks span 87 projects and 11 languages. The median reference solution changes 471 lines across 4.5 files. The seven authors list Toptal ExpertCrowd as their affiliation, and the tasks and runs were built and executed on HUD, an agent evaluation platform the paper thanks for its tooling. Neither organization makes the models being ranked, but both supply AI developers. In the [November 6 press release](https://www.toptal.com/press-center/expertcrowd-and-hud-collaborate-to-advance-ai-training-and-evaluation-release-swe-benchmark), ExpertCrowd contributes expert-led task development, and HUD is described as a Y Combinator-backed startup that provides tools for building AI training data, with a marketplace where AI labs license training and evaluation data. This is a benchmark reported by the people who built it, not an independent audit.

Grading awards partial credit. Each task has weighted criteria, mostly executable checks through the project's public interfaces. "Blockers" cap a run below full credit when an essential property is missing, and "gates" set a run to zero, for example when the agent edits the repository's own tests. Every task image is calibrated so that the author's reference solution scores exactly 1.0 and both the untouched repository and a comment-only change score 0.

Seven models ran through one harness, each with its provider's native tool interface, at the platform's default high-effort reasoning setting, with a 1,000-step limit per run. Each model attempted each task five times. Gemini 3.8 Flash has no valid run on one task, which is why the total is 3,495 scored runs rather than 3,500.

The dates differ, and they matter for reading what was tested.

| Date (2026) | Event | Source |
| --- | --- | --- |
| September 4 | Median date of the tasks' pinned base commits; 82 of 100 were committed in August or September | Paper, Sec. 3.3 |
| October 1 to 10 | All 3,495 scored runs collected | Paper, Sec. 3.8 |
| October 4 | DeepSWE v1.1 leaderboard accessed for the paper's comparison | Paper, references |
| October 13 | "Last updated" date on the ExpertCrowd-SWE leaderboard page | Leaderboard |
| November 6 | Toptal and HUD press release announcing the collaboration and the benchmark; it gives no scores | Toptal press release |
| November 9 | Paper v1 submitted to arXiv (2611.13246) | arXiv |
| November 12 | This article; no independent replication of the results found | AGI Tracker search |

The leaderboard page was last updated nearly four weeks before the paper appeared. The scores are the same in both.

## Why 3.6 points is not a ranking

The headline intervals in the paper come from task sampling: how much a model's score would move on a different but equally reasonable set of 100 tasks. Those intervals are ±4.7 points for Opus 5.5 and ±5.5 for Astra. Because both models attempted the same tasks, a paired comparison is sharper than comparing those two bars, and the authors use one: a bootstrap over tasks for the difference, and a sign-flip permutation test adjusted for multiple comparisons. Even the paired test cannot separate the top two.

The task-level picture explains why. Opus 5.5 scores higher on 53 tasks, Astra on 41, and 6 are ties. Their per-task scores correlate at only r = 0.42. On 14 tasks the two differ by 40 points or more, 8 in Opus's favor and 6 in Astra's. Both score 100% on only four tasks, and both fall below 60% on 20. The authors call the pair "complementary rather than ordered." A 3.6-point mean sits on top of large disagreements in both directions.

Below the top, the paired tests do resolve tiers. Opus 5.5 outscores Claude Fable 5.1 on 82 of 100 tasks, by 20.8 points. Fable leads Gemini 3.8 Flash by 6.5 points, and Gemini leads Qwen 3.8 Max by 6.5. Qwen 3.8 Max, DeepSeek V4.1 Flash and Grok 4.6 cannot be told apart; every pairwise interval among them includes zero.

The paper makes a second point that leaderboard readers often miss. Its run-to-run intervals, which capture only the randomness of rerunning agents on a fixed task set, are ±0.4 to ±1.9 points, two to ten times narrower than the task-sampling intervals. Rerunning the agents barely moves the scores. Most of the uncertainty comes from which tasks were chosen. A leaderboard that reports only rerun noise makes a ranking look more settled than it is. On this point the authors cite a 2024 study by [Madaan and colleagues](https://arxiv.org/abs/2406.10229) that measured variance across language model benchmarks and urged practitioners to factor it in when comparing models. The authors' own limitations section says differences smaller than about 5 points between adjacent models "should not be over-interpreted."

## What five runs reveal that one run cannot

The paper's reliability table is the core of the story. The first three columns are the ones a typical leaderboard shows or could show. The rest exist only because each task was run five times.

| Model | Score (95% CI over tasks) | Full-credit runs | Tasks with ≥1 of 5 full-credit runs | Tasks with 5 of 5 | Mean within-task SD (points) | Best-of-five score |
| --- | --- | --- | --- | --- | --- | --- |
| Claude Opus 5.5 | 67.3 ± 4.7 | 26.6% | 47 | 9 | 13.6 | 80.9 |
| GPT-6 Astra | 63.7 ± 5.5 | 23.4% | 36 | 15 | 7.3 | 71.4 |
| Claude Fable 5.1 | 46.5 ± 3.7 | 8.6% | 25 | 1 | 16.9 | 66.7 |
| Gemini 3.8 Flash (99 tasks) | 40.0 ± 4.3 | 3.8% | 9 | 1 | 11.0 | not reported |
| Qwen 3.8 Max | 33.5 ± 3.3 | 1.0% | 5 | 0 | 10.9 | not reported |
| DeepSeek V4.1 Flash | 32.5 ± 3.7 | 3.0% | 9 | 0 | 13.0 | not reported |
| Grok 4.6 | 32.2 ± 3.5 | 1.0% | 4 | 0 | 10.1 | not reported |

Source: paper Table 3 and Sec. 4.1. The best-of-five score is the mean of each model's best run per task, reported only for the top three.

Three things stand out.

**Full credit is uncommon even at the top.** Most runs by the two leaders earn at least 0.4 of a task's weight (83% for Opus, 78% for Astra), yet only about a quarter earn full marks. Of the 699 model-task pairs, 26 earned full credit on every run and 14 earned zero on every run. The other 659 sit somewhere in between, which is why partial credit separates the lower models at all. Under pass/fail grading, the paper notes, Gemini 3.8 Flash, Qwen, DeepSeek and Grok would all land between 1% and 4%.

**The leaders trade breadth for consistency.** In AGI Tracker's arithmetic on the table, Opus 5.5 reaches full credit sometimes but not always on 38 tasks (47 minus 9), and Astra on 21 (36 minus 15). Of the tasks each model solves at least once, Opus solves 19% on every run and Astra 42%. Astra's runs also vary less within a task, a mean standard deviation of 7.3 points against 13.6.

**Best-of-five widens the gap.** If only each model's best run counted, Opus would rise to 80.9% and Astra to 71.4%, a 9.5-point difference instead of 3.6. The paper does not report a significance test on best-of-five scores. Best-of-five also assumes someone can pick the best run, which here means the benchmark's hidden grader. A developer choosing among five patches has only their own tests and review, which may be weaker.

Claude Fable 5.1 shows why both views are needed. It has the most stable benchmark score across the five run slots (±0.4) and the least consistent behavior within tasks (SD 16.9). Its run-to-run variation is large on each task and averages out across 100 of them. A stable leaderboard number can come from an unstable agent.

## A worked example: same mean, different agent

The following inputs are hypothetical, chosen to show the arithmetic, and are not taken from the paper.

Suppose two agents attempt one task five times. Agent A scores 1.0, 1.0, 0.3, 0.3 and 0.6. Agent B scores 0.7, 0.6, 0.65, 0.6 and 0.65. Both average 0.64. A single-number leaderboard would rate them equal on this task.

Now give them a job. A team that can run an agent several times and check the results with a trustworthy test suite cares about the chance of at least one complete solution. Agent A hit full credit on two of five runs. If its runs were independent with that 40% success rate, five attempts would yield at least one full solution with probability 1 − 0.6⁵, about 92%. Agent B never reaches full credit, however often it runs.

A team that gets one attempt and accepts anything scoring at least 0.6 for human cleanup sees the opposite. Agent A clears that bar on three of five runs, Agent B on all five.

The paper draws the same distinction for the real leaders. Its authors write that a user who can sample several attempts and verify them "would favour Claude Opus 5.5's breadth," while a user who needs a single attempt to be right "would value GPT-6 Astra's reliability." That is a reasonable reading of their data, with one caveat from the example: the retry strategy only works if the verification step is as good as the benchmark's grader. On EC-SWE that grader includes hidden tests and maintainer rules the agent never sees.

## Steps are not a measure of capability

The effort data is the third thing repeated runs expose. The median number of agent steps per run, where a step is one model turn, varies roughly five-fold across models.

| Model | Score | Median steps (IQR) | Mean steps | Median container time |
| --- | --- | --- | --- | --- |
| Claude Opus 5.5 | 67.3 | 160 (128 to 205) | 171 | 80 min |
| GPT-6 Astra | 63.7 | 33 (26 to 44) | 37 | 36 min |
| Claude Fable 5.1 | 46.5 | 127 (94 to 166) | 134 | 56 min |
| Gemini 3.8 Flash | 40.0 | 166 (127 to 217) | 182 | 40 min |
| Qwen 3.8 Max | 33.5 | 137 (103 to 178) | 147 | 100 min |
| DeepSeek V4.1 Flash | 32.5 | 160 (114 to 199) | 162 | 51 min |
| Grok 4.6 | 32.2 | 73 (55 to 93) | 80 | 69 min |

Source: paper Table 6. Container time is the wall-clock lifetime of the task container, including grading.

Astra reaches about 95% of Opus's score with about a fifth of its steps and less than half its container time. Gemini 3.8 Flash takes the most steps and ranks fourth. Within each model, the correlation between a run's step count and its score is weak, between −0.15 and +0.17. Wall-clock time follows its own pattern: Qwen 3.8 Max has the longest median container lifetime despite a mid-range step count.

Three cautions apply before turning this into a cost or speed claim.

First, a step is not a common unit. Opus and Fable get a bash tool and a string-replacement editor; Astra gets a shell with patch-based edits; Gemini gets seven tools including file reads, writes and search. One Astra turn that applies a multi-file patch may do the work of several turns elsewhere. The paper reports turns and container time, not tokens or prices.

Second, the step data excludes the longest runs. Runs that hit the 1,000-step limit or the output-token limit were dropped and rerun: 27 for Opus 5.5, 55 for Gemini 3.8 Flash and 2 for Grok 4.6. The leaderboard page adds that tasks on which agents consistently ran into the step limit were dropped from the set. Any relationship between very long runs and low scores is therefore removed by design. This is AGI Tracker's inference about the effect, not a result the paper tests.

Third, reasoning effort was not varied. Each model ran at its platform default high setting ("max" for Opus, Fable and Astra; "xhigh" for Qwen, DeepSeek and Grok; "high" for Gemini). The authors note that other settings could change both scores and effort.

The defensible conclusion is the authors' own: "effort is not capability." Taking more turns did not buy more credit, either across models or within them. It does not follow that Astra is cheaper per task. That needs token counts and prices the paper does not publish.

## The design choices that shape the result

EC-SWE is carefully built, and several of its choices make its numbers mean something narrower than a headline implies. The worksheet below lists what each choice is, what the sources say about it and how it should change a reader's interpretation.

| Design choice | What the sources report | How it affects the reading |
| --- | --- | --- |
| Tasks selected for difficulty | Paper: final tasks "selected for difficulty against current frontier models." Leaderboard: kept the 100 tasks "that six of the models found hardest, based on their average scores," with Gemini 3.8 Flash left out of selection | Absolute scores understate performance on unselected work, which the leaderboard acknowledges. Selection used the measured models' own scores; whether the same runs were reused for scoring is not stated |
| Limit-hit runs excluded and rerun | 27 Opus 5.5, 55 Gemini 3.8 Flash and 2 Grok 4.6 runs; only "valid, completed runs" count | Scores describe runs that finished within budget. A deployed agent that runs out of steps produces a failure, not a rerun |
| Native tools per provider | One harness, different tool interfaces and agent loops per provider | Part of any gap could reflect tool design. A shared single-tool rerun is listed as future work |
| Partial credit with blockers and gates | 274 runs (7.8%) capped by a blocker, 80 (2.3%) zeroed by a gate; removing both would add 3.7 points to Opus and 2.9 to Astra without changing the ranking | Maintainer rules cost the strongest models most, but do not create the tie |
| LLM-judged criteria | Paper: ten tasks, 0.85% of total benchmark weight; 90 tasks graded only by deterministic checks. Leaderboard: "Every task uses the same judge, Claude Sonnet 4.6" | The weight bounds the judge's direct effect on any model's score at under one point through weighted criteria. The paper does not say whether a judged criterion ever acts as a blocker |
| Contamination controls | Unpublished changes, 76 of 100 tasks held out, screening against 499,647 records from 93 public datasets with no duplicates found | Repositories are public and likely in training data. The test is new problems in familiar-looking code |

The difficulty selection deserves the most attention. Choosing tasks by how badly the evaluated models did on them guarantees headroom, and the authors say plainly that the set was built to be hard. It also means the task sample is conditioned on the outcome being measured. If a model happened to perform poorly on a task in selection runs, that task was more likely to be kept. Where scoring reused those runs, chance failures would be locked in and scores pulled down; fresh runs would partly regress toward the model's true level. Neither source says which applies, and nothing in the published data lets a reader check.

There is also a reporting inconsistency to resolve. The paper describes LLM-judged criteria in ten tasks; the leaderboard says every task uses the same judge. These may describe the same arrangement, a single judge model used wherever a judged criterion exists, but the leaderboard's wording reads more broadly than the paper's. The paper's figure of 0.85% of total weight is the more specific statement, and it is small relative to a 3.6-point gap. The dataset card is consistent with the paper: it says four of the 24 public tasks have a criterion judged by a model.

## How this compares with other coding leaderboards

The paper argues that EC-SWE separates models that other benchmarks crowd together. On the DeepSWE v1.1 leaderboard, as accessed by the authors on October 4, Claude Opus 5.5, GPT-6 Astra, DeepSeek V4.1 Flash and Gemini 3.8 Flash sit within 0.9 points of one another, 72.3% to 71.4%. On EC-SWE those same four span 34.8 points. The two benchmarks agree on the top pair and disagree below it, most clearly on DeepSeek V4.1 Flash, third on DeepSWE and sixth here.

The authors call that comparison "indicative rather than controlled," and it is. [DeepSWE](https://arxiv.org/abs/2607.07946) uses 113 original tasks across 91 repositories, pass/fail verifiers and a single bash tool for every model. EC-SWE uses partial credit, native tools and a difficulty-selected set. A wider spread on a harder, partial-credit benchmark is expected; it does not by itself show that EC-SWE measures the underlying capability better. Our [October ranking of coding models](/blog/best-ai-models-for-coding/) draws on DeepSWE v1.1 alongside Terminal-Bench 4.0. EC-SWE's disagreement below the top pair is a reason to keep reading more than one benchmark. The case for partial credit also connects to a separate preprint, covered in our article on [agent benchmarks that lose resolution](/blog/agent-benchmarks-lose-resolution/), which argues that pass/fail scoring has stopped separating the top agents on SWE-bench Verified.

## What this does and does not say about capability

The paper is explicit about scope. EC-SWE measures whether an agent, working alone in an offline sandbox from a short ticket, produces a change an expert maintainer's grader accepts. It is "not a ranking of coding products or of overall model quality." No vendor product such as Claude Code or Codex CLI was involved; the harness calls the model APIs directly.

Within that scope, the results are informative about reliability. The best agents tested collect most of a task's credit on most runs and complete the task outright on roughly one run in four. They rarely do so every time. That is a long way from an engineer whose changes can be merged without review, and the gap between "often gets most of the way" and "reliably finishes" is the gap that matters for autonomous deployment. It is the same distinction our article on [computer-use agents](/blog/computer-use-agent-finished-job/) draws between a convincing narration and a saved outcome.

It is not evidence of general software engineering competence, and it is not an AGI claim. One hundred tasks from 17 authors in four specialist areas is a narrow sample of engineering work, chosen to be hard, graded by the authors' own rubrics and not yet reproduced by anyone else.

## What remains unknown

Several questions would change how much weight these results can carry.

- **Independent replication.** As of November 12, AGI Tracker found no third-party rerun. The 24 public tasks can be run on HUD or with the open-source Harbor framework, but the per-run results in the Hugging Face release list the models claude-fable-5, claude-fable-5-1, claude-opus-5 and gpt-6-astra. That set does not match the seven-model leaderboard: it omits Claude Opus 5.5 and four other ranked models, adds two the leaderboard does not rank, and the card reports that 3.1% of those runs scored a full 1.0. Agent traces are not included. Outsiders cannot recompute any leaderboard row.
- **How the public tasks relate to the full set.** The dataset card says the 24 public tasks were picked to sit at the typical difficulty of the verified pool, with six later replaced on the basis of six current models' average scores. The paper calls all 100 tasks "released," although 76 are private. Whether the public 24 are representative of the 100 that produced the leaderboard is not established.
- **Selection versus scoring runs.** Whether the runs used to choose the hardest tasks overlap with the 3,495 scored runs determines how much the selection biases scores.
- **Harness effects.** The authors plan to rerun every model with a single shared tool. If the Opus-Astra ordering or the effort gap flips under that condition, the current results partly measure tool design.
- **Grader agreement.** The authors also plan an independent judge audit of a sample of runs with published disagreement rates. DeepSWE reports that an independent LLM judge disagreed with its verifiers on 1.4% of re-reviewed runs; EC-SWE has not yet published a comparable figure.
- **Effort settings and cost.** Without a sweep of reasoning effort and token-level accounting, the step data cannot support a cost-per-solved-task comparison.

A proposed test, not one the authors have announced, would address the tie most directly: run fresh five-run samples of the top two models on the 24 public tasks under both the native harness and a shared bash tool, and report the paired difference, the 5-of-5 counts and the token usage for each condition. If Opus's breadth advantage and Astra's consistency advantage both survive the harness change, the complementary-leaders reading becomes much stronger.

## The bottom line

ExpertCrowd-SWE reports a statistical tie between Claude Opus 5.5 and GPT-6 Astra, and its authors were right not to crown a winner. The value of the paper lies elsewhere: by running every model five times on every task, it shows that the leaders fail differently, that full solutions are rare and inconsistent even at the top, and that the number of turns an agent takes says little about how well it does. Those are the facts a single-run score cannot carry. For background on reading results like these, see our guides to [reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) and to [why benchmarks saturate](/blog/why-benchmarks-saturate/).

## Sources

- [ExpertCrowd-SWE paper, arXiv abstract page (v1, November 9, 2026)](https://arxiv.org/abs/2611.13246)
- [ExpertCrowd-SWE paper, full HTML text](https://arxiv.org/html/2611.13246v1)
- [ExpertCrowd-SWE leaderboard and methodology page](https://www.toptal.com/expertcrowd/benchmarks/expertcrowd-swe-benchmark)
- [EC-SWE public task subset, Hugging Face dataset card](https://huggingface.co/datasets/ExpertCrowd/ec-swe)
- [Toptal press release on the ExpertCrowd and HUD collaboration](https://www.toptal.com/press-center/expertcrowd-and-hud-collaborate-to-advance-ai-training-and-evaluation-release-swe-benchmark)
- [DeepSWE: Measuring Frontier Coding Agents on Original, Long-Horizon Engineering Tasks](https://arxiv.org/abs/2607.07946)
- [Quantifying Variance in Evaluation Benchmarks](https://arxiv.org/abs/2406.10229)

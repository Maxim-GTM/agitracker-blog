---
title: "GPT-6.2 Astra's benchmark claims: what Agents' Last Exam and Terminal-Bench-Science support"
description: "OpenAI says GPT-6.2 Astra leads Agents' Last Exam and Terminal-Bench-Science at a fraction of rivals' cost. Independent leaderboards back the science lead, but the agent-benchmark comparison rests on a partial-credit score and a Fable 5.2 run missing nine tasks."
pubDate: 2026-11-18
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "Benchmarks", "AI Models"]
faq:
  - q: "Is GPT-6.2 Astra the top model on Agents' Last Exam?"
    a: "On OpenAI's own run, it has the highest partial-credit score reported so far: 78.3% at xhigh effort, against 77.4% for Gemini 4 Carbon and 72.8% for Claude Fable 5.2 on the official leaderboard. As of November 18, 2026, GPT-6.2 Astra was not listed on that leaderboard, and OpenAI did not publish its pass rate, the leaderboard's default ranking, on which Fable 5.2 leads at 46.9%."
  - q: "What does the footnote about nine Fable 5.2 tasks mean?"
    a: "The Agents' Last Exam leaderboard averages Fable 5.2's scores over 113 of its 122 tasks because nine runs were downgraded to a fallback model. Anthropic's Fable models route some blocked requests to Opus models. Every other entry is averaged over all 122 tasks, so the Fable 5.2 figure OpenAI compares against comes from a different task set."
  - q: "Do independent benchmarks confirm the science claims?"
    a: "Mostly. Artificial Analysis measured GPT-6.2 Astra at 78.1% on Terminal-Bench-Science 0.1 at max effort, against 73.3% for Fable 5.2 in the same harness, and Vals AI ranks it first on its Science Index at 68.44%. The Vals lead over GPT-6 Astra is 3.35 points with stated error bars of about plus or minus 2.2 points each, and Terminal-Bench-Science is a component of both the Vals and Artificial Analysis indexes, so the three results are not independent."
  - q: "Is GPT-6.2 Astra first on the Artificial Analysis Intelligence Index?"
    a: "No. Claude Fable 5.2 at max effort scores 64.6 and GPT-6.2 Astra at max effort 62.1, both on version 5.0.1. OpenAI's claim is narrower: that its models come close to or beat other leading models at a small fraction of the cost per task. On OpenAI's chart, Fable 5.2 at max costs $26.54 per task and GPT-6.2 Astra at max $4.00."
  - q: "Did AGI Tracker test GPT-6.2 Astra?"
    a: "No. AGI Tracker ran no tests. Figures come from OpenAI's launch post and its embedded chart data, the Agents' Last Exam, Terminal-Bench-Science, Vals AI and Artificial Analysis leaderboards, and Epoch AI's review of Agents' Last Exam. Differences and ratios are AGI Tracker's arithmetic on those published numbers."
---

OpenAI released GPT-6.2 Astra on November 17, 2026 with two headline benchmark claims: a new high on Agents' Last Exam, "5.5 points ahead of Claude Fable 5.2 at just 5% of the cost," and a new high on Terminal-Bench-Science 0.1. The second claim holds up best. Artificial Analysis, which ran the model independently, measured GPT-6.2 Astra at 78.1% on Terminal-Bench-Science at max effort, 4.8 points above Fable 5.2 in the same harness.

The Agents' Last Exam comparison needs more context. OpenAI compares partial-credit scores, not the pass rate the official leaderboard ranks by, and on pass rate Fable 5.2 currently leads. The Fable 5.2 figure also comes from a different task set: as OpenAI's own caption says, the leaderboard excludes nine Fable 5.2 tasks that used a fallback model. GPT-6.2 Astra's own Agents' Last Exam run does not yet appear on the leaderboard, and the closest competitor in OpenAI's chart is not Fable 5.2 but Gemini 4 Carbon, 0.9 points behind.

AGI Tracker did not run any of these tests. All figures below come from OpenAI's launch post, including the chart data embedded in the page, and from the public leaderboards and reviews named in each section, read on November 18, 2026. Differences, ratios and per-task costs not stated by a source are AGI Tracker's arithmetic on published numbers.

## The claims and what they compare

OpenAI's post makes four quantitative benchmark comparisons for GPT-6.2 Astra that bear on capability. Each chart plots score against cost per task at up to five reasoning-effort settings, from low to max.

| OpenAI claim | GPT-6.2 Astra point used | Comparison point | Gap (AGI Tracker arithmetic) |
| --- | --- | --- | --- |
| Agents' Last Exam: 5.2 points above GPT-6 Astra at under a third of the cost | Xhigh: 78.3%, $2.89 per task | GPT-6 Astra max: 73.1%, $8.99 | +5.2 points, 32% of the cost |
| Agents' Last Exam: 5.5 points above Claude Fable 5.2 at 5% of the cost | Xhigh: 78.3%, $2.89 | Fable 5.2 max: 72.8%, $60.05 | +5.5 points, 4.8% of the cost |
| Terminal-Bench-Science 0.1: 9 points above GPT-6 Astra at under a third of the cost | Max: 77.1%, $7.15 per trial | GPT-6 Astra max: 68.1%, $23.80 | +9.0 points, 30% of the cost |
| Vals Science Index: new high | Max: 68.4% | GPT-6 Astra max: 65.1%; Fable 5.2 high: 63.7% | +3.3 and +4.7 points |

Source: chart data embedded in OpenAI's November 17 post. Percentages are rounded to one decimal.

The arithmetic checks out. Every stated gap and cost fraction matches the chart data. The question is what each comparison measures, and whether the comparison points are like for like.

One detail recurs. On Agents' Last Exam, OpenAI compares GPT-6.2 Astra at xhigh effort, its best-scoring setting in that chart, with the other models at max. GPT-6.2 Astra at max scored slightly lower, 77.6%, at $4.47 per task. Picking each model's best point is reasonable when the claim is "best score". It does mean the cost ratio depends on which effort level is quoted.

## What Agents' Last Exam measures

[Agents' Last Exam](https://agents-last-exam.org/) is a benchmark led by Berkeley's Center for Responsible, Decentralized Intelligence that tests agents on long-horizon professional work done on a computer. Its site describes tasks in software such as Adobe After Effects, Siemens NX, Unreal Engine and neuroimaging tools, with verifiable outcomes. The [arXiv paper](https://arxiv.org/abs/2606.05405) says it was built with more than 250 industry experts and covers 55 sub-fields in 13 industry clusters. Version 1.1, the version on the current leaderboard, scores 122 public tasks.

The [leaderboard](https://agents-last-exam.org/leaderboard) reports two numbers. Pass rate is "the share of runs that earned a perfect score". Score is "the average partial-credit score". OpenAI's chart plots Score. That matters because the two orderings differ.

| Agents' Last Exam v1.1 (results updated November 16, 2026) | Harness | Pass rate | Score | Estimated cost per task |
| --- | --- | --- | --- | --- |
| GPT-6.2 Astra, xhigh (OpenAI's figure, not on the leaderboard) | Not stated | Not published | 78.3% | $2.89 |
| Gemini 4 Carbon, high | ALE-Claw | 45.9% | 77.4% | $4.60 |
| Qwen4-Max, xhigh | Codex | 46.7% | 74.4% | $9.85 |
| Kimi 3.1 Pro, max | Kimi Code | 43.4% | 74.4% | $7.00 |
| GPT-6 Astra | Codex | 42.6% | 73.1% | $8.99 |
| Claude Fable 5.2, max (113 tasks) | Claude Code | 46.9% | 72.8% | $60.05 |
| Claude Opus 5.5, max | Claude Code | 43.4% | 71.6% | $17.57 |

Source: Agents' Last Exam leaderboard and OpenAI's chart data. Cost per task is the leaderboard's total estimated cost divided by the number of tasks scored (122, or 113 for Fable 5.2); for GPT-6 Astra, Fable 5.2, Gemini 4 Carbon and Opus 5.5 this reproduces the per-task costs in OpenAI's chart.

Read by pass rate, Fable 5.2 is first and the top four entries sit within 3.5 points of each other. Read by score, Gemini 4 Carbon leads the official board. OpenAI's 78.3% would top the score column, but by 0.9 points over Gemini 4 Carbon, not the 5.5 points the post quotes against Fable 5.2. OpenAI did not publish a pass rate for GPT-6.2 Astra, so its position on the leaderboard's default ranking is unknown. The post does not say which harness OpenAI used for the GPT-6.2 runs; the leaderboard lists GPT-6 Astra under Codex.

Neither the leaderboard nor OpenAI gives confidence intervals. As a rough guide, AGI Tracker's arithmetic for a pass rate near 45% on 122 tasks gives a standard error of about 4.5 percentage points. The partial-credit score varies differently, and its uncertainty cannot be calculated from published data. Gaps of one or two points between top entries should not be read as settled.

### The nine excluded Fable 5.2 tasks

The leaderboard footnote reads: "Fable 5.2 excludes 9 tasks that are downgraded. Scores are averaged across the remaining." OpenAI's caption puts it as "nine tasks that used a fallback model."

The fallback is a deliberate product feature. Anthropic's [help center](https://support.claude.com/en/articles/15363606-why-claude-switched-models-in-your-conversation-with-fable-models) says Fable 5.2, Fable 5.1 and Fable 5 run classifiers on every request and that blocked requests may fall back to a non-Mythos model, "currently Opus 5 for biology, chemistry, and life sciences requests, and for frontier LLM development requests, and Opus 4.8 for offensive cybersecurity technique requests." The checks also cover everything the model reads, including memory, connector content, web search results and files, not only the user's message.

So Fable 5.2's 72.8% is an average over 113 tasks, while every other entry, including GPT-6.2 Astra's 78.3% in OpenAI's chart, is an average over 122. The leaderboard does not say which nine tasks were dropped, and it is not possible to tell from public data whether including them would raise or lower Fable 5.2's figure. A task that triggered a safety classifier may be harder than average, or it may simply sit in a domain the classifiers watch. What can be said is that the two numbers are not averages over the same work, and the 5.5-point gap inherits that mismatch.

The cost side has the same issue. Fable 5.2's $60.05 per task is the leaderboard's $6,785.69 estimate divided by 113 tasks. That figure is for Claude Code at max effort, the only Fable 5.2 configuration the leaderboard shows. The "5% of the cost" comparison therefore sets GPT-6.2 Astra's best-value setting against Fable 5.2's most expensive one.

### A benchmark under review

Agents' Last Exam itself has known grading problems. In a [benchmark review](https://epoch.ai/benchmarks/agents-last-exam/review), Epoch AI sampled 50 of the 122 public v1.1 tasks and found that in 22 of them "an agent can score 100% without doing the intended work by taking a shortcut": 9 where the answer is public, 8 where the grader accepts trivial or made-up work, and 5 where the grader can be tampered with. Epoch says it stopped its partial review once the errors exceeded its published threshold for a flawed benchmark.

The benchmark's maintainers [responded on November 2, 2026](https://agents-last-exam.org/blogs/verifier-check) that agents never see the verifier during a run and that, across 1,617 trajectories on the 22 flagged tasks, 3 (0.19%) reached a full score through a flagged route, excluding two tasks whose network restriction was never shown to the agent. On those two tasks, 51 of 166 trajectories looked up the answer. They say enforced network isolation will ship in an upcoming release.

The maintainers' data suggests the shortcuts are rarely taken in practice, which supports using the leaderboard for rough comparisons. It does not make small gaps between top models more reliable, and the network fix had not shipped when the current results were recorded.

## What Terminal-Bench-Science measures

[Terminal-Bench-Science](https://www.tbench.ai/news/terminal-bench-science-0-1) is a benchmark led by researchers at Stanford and built by the Terminal-Bench team with domain scientists. Version 0.1 has 70 tasks across the life, physical, Earth, mathematical and engineering sciences, covering work such as data analysis, simulation, theorem proving, image reconstruction and model fitting. Each task runs in a terminal and is graded by its own tests; Artificial Analysis notes that a task "passes only if every test passes." The team reports that 920 task proposals led to 70 accepted tasks, and that tasks were calibrated against the frontier models at release, Claude Opus 5 and GPT-5.6 Sol; the strongest model then scored 30%.

Scores have since more than doubled. The official leaderboard's top entry before this release was GPT-6 Astra in Codex at 68.1% ± 3.2%. Results depend on the harness as well as the model, and the comparison in OpenAI's chart mixes sources. OpenAI's GPT-6 Astra point matches the official leaderboard's Codex run, including its cost of $4,997 for 70 tasks run three times ($23.80 per trial). OpenAI's footnote says the Fable 5.2 points "are as reported by Artificial Analysis in the mini-swe-agent harness," and that "Anthropic reported Fable 5.2's score of 74.6% at max reasoning in Claude Code." The post does not say which harness produced the GPT-6.2 Astra figures.

The cleaner comparison comes from [Artificial Analysis](https://artificialanalysis.ai/evaluations/terminal-bench-science), which runs every model in the same mini-swe-agent harness, three repeats per task:

| Terminal-Bench-Science 0.1 | Score | Source |
| --- | --- | --- |
| GPT-6.2 Astra, xhigh | 78.6% | Artificial Analysis |
| GPT-6.2 Astra, max | 78.1% | Artificial Analysis |
| GPT-6.2 Astra, max | 77.1% | OpenAI chart |
| Claude Fable 5.2, max | 74.6% | Anthropic, Claude Code (cited by OpenAI) |
| Claude Fable 5.2, max | 73.3% | Artificial Analysis |
| GPT-6 Astra, max | 68.1% ± 3.2% | Official leaderboard, Codex |
| Gemini 4 Carbon, high | 64.8% | Artificial Analysis |
| Claude Opus 5.5, max | 59.0% | Artificial Analysis |

Artificial Analysis's independent result is slightly higher than OpenAI's own, which supports the claim. In the same harness, GPT-6.2 Astra leads Fable 5.2 by 4.8 points; against Anthropic's own Claude Code figure of 74.6%, the gap is 2.5 points using OpenAI's max result and 3.5 to 4.0 points using Artificial Analysis's. The official leaderboard puts error bars of about ±3 points on single entries, so the lead over Fable 5.2 is likely real on current evidence but not large. The 9-point gain over GPT-6 Astra is clearer.

Neither GPT-6.2 Astra nor Fable 5.2 appeared on the official Terminal-Bench-Science leaderboard on November 18, 2026.

## What the Vals Science Index measures

The [Vals Science Index](https://www.vals.ai/benchmarks/science_index), released by Vals AI on October 16, 2026, is an unweighted average of three benchmarks: BioMysteryBench (investigating real biological datasets), MysteryMechanism (recovering hidden mechanisms by running experiments in a simulated lab) and Terminal-Bench-Science.

Vals' own leaderboard, updated November 16, 2026, puts GPT-6.2 Astra first at 68.44% ± 2.13, ahead of GPT-6 Astra at 65.09% ± 2.26 and Fable 5.2 at 63.74% ± 2.30. These are Vals' measurements, not OpenAI's. The lead over GPT-6 Astra is 3.35 points, and the stated intervals overlap.

The component ranks show where the lead comes from. GPT-6.2 Astra is first on Terminal-Bench-Science, second on MysteryMechanism and third on BioMysteryBench, where Fable 5.2 is first. In the Terminal-Bench-Science life-sciences domain, Vals ranks Fable 5.2 first and GPT-6.2 Astra second. "Best model in the world for scientists," as OpenAI puts it, is a claim about an average; on the biology-data component and in the life sciences, another model ranks higher.

## Three science claims, one shared component

OpenAI presents Terminal-Bench-Science, the Vals Science Index and the Artificial Analysis Intelligence Index as separate evidence. They overlap.

| Index | Includes Terminal-Bench-Science? | Weight |
| --- | --- | --- |
| Vals Science Index v1 | Yes | One third |
| Artificial Analysis Intelligence Index v5.0.1 | Yes | 15% |

Source: [Vals AI methodology](https://www.vals.ai/benchmarks/science_index) and [Artificial Analysis methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking).

A strong Terminal-Bench-Science result therefore lifts all three numbers. The Vals index adds two other benchmarks and the Artificial Analysis index adds eight other evaluations, so they are not pure duplicates. But the three results should be read as one strong science-agent result plus partial corroboration, not three independent confirmations.

## The Artificial Analysis index: close, not first

OpenAI's third chart plots version 5.0.1 of the [Artificial Analysis Intelligence Index](https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index), which combines nine evaluations across knowledge work, coding, science and general knowledge, each category weighted 25%. The post's claim here is limited: on several benchmarks, both new models "come close to or outperform other leading models at a small fraction of the cost per task."

| Artificial Analysis Intelligence Index v5.0.1 | Index score | Cost per task (OpenAI chart) |
| --- | --- | --- |
| Claude Fable 5.2, max | 64.6 | $26.54 |
| Claude Fable 5.2, xhigh | 62.2 | $14.83 |
| GPT-6.2 Astra, max | 62.1 | $4.00 |
| GPT-6.2 Astra, xhigh | 61.6 | $2.52 |
| Gemini 4 Carbon, high | 60.0 | $7.76 |
| Claude Opus 5.5, max | 59.1 | $10.04 |
| GPT-6.2 Sol, max | 57.3 | $1.01 |

Artificial Analysis names Fable 5.2 at max effort as the top model on the index. GPT-6.2 Astra is 2.5 points behind at about 15% of the cost per task in OpenAI's chart. That supports OpenAI's narrower wording, "close to", and the cost framing. It does not support reading the launch as a clean sweep. Artificial Analysis labels its Fable 5.2 entries "Default Fallback" configurations.

## Cost per task is a real metric, with conditions

OpenAI's charts put cost per task on the horizontal axis, and the efficiency gains look large. Cost per task is a more useful measure than price per token, because it captures how many tokens a model spends, including reasoning, retries and tool calls. It also has three dependencies a reader should keep in view.

**Price.** OpenAI cut GPT-6.2 Astra's API prices by 20% from GPT-6 Astra, to $8 per million input tokens and $40 per million output tokens, and cut cached input by 60%, to $0.40. Part of every cost gap against GPT-6 Astra is that price cut, not model behavior. The rest is token efficiency, which OpenAI's internal GDPval v2 chart illustrates: at max effort, GPT-6.2 Astra used 35,812 output tokens per task against GPT-6 Astra's 45,732.

**Harness and caching.** The same model can spend very different amounts in different agent harnesses. The Agents' Last Exam maintainers' own analysis, published in June 2026, found that swapping the harness under a fixed model moved pass rate by 5 to 6 points. Leaderboard costs are estimates from recorded token use at list prices, with cache reads and writes priced separately and tool fees excluded. A team's own bill will depend on its harness, cache hit rate and prices, not these estimates.

**Which settings are compared.** On Agents' Last Exam, OpenAI sets GPT-6.2 Astra at xhigh against Fable 5.2 at max, the only Fable setting on the board. On the Artificial Analysis index, where both models appear at every effort level, Fable 5.2 at xhigh (62.2, $14.83) and GPT-6.2 Astra at max (62.1, $4.00) score about the same, and GPT-6.2 Astra costs about 27% as much. That like-for-like gap is still large. It is just smaller than "5% of the cost."

A [recent AGI Tracker analysis of agent benchmarks](/blog/agent-benchmarks-lose-resolution/) found top Terminal-Bench 2.0 agents that tie on pass rate differ more than fivefold in median cost per run. Reporting cost beside score, as OpenAI does here, is the better practice. The comparison is strongest when both axes use the same task set, harness and effort.

## What the independent evidence supports, as of November 18, 2026

| Claim | Independent evidence | Assessment |
| --- | --- | --- |
| New high on Terminal-Bench-Science 0.1 | Artificial Analysis: 78.1% (max) and 78.6% (xhigh), highest it has measured; Fable 5.2 73.3% | Supported. Lead over Fable 5.2 about 2.5 to 5 points depending on source, against roughly ±3-point error bars |
| 9 points above GPT-6 Astra | Official leaderboard has GPT-6 Astra at 68.1% ± 3.2% | Supported |
| New high on Vals Science Index | Vals: 68.44% ± 2.13, first of 27 models | Supported, by 3.35 points over GPT-6 Astra; Fable 5.2 leads the biology component |
| New high on Agents' Last Exam | GPT-6.2 Astra not yet on the leaderboard | Not independently confirmed. OpenAI's 78.3% would lead the score column by 0.9 points; pass rate not published |
| 5.5 points above Fable 5.2 at 5% of the cost | Fable 5.2 figure covers 113 of 122 tasks; cost is Fable at max in Claude Code | Arithmetic correct; comparison is not like for like |
| Close to or better than leading models at a fraction of the cost | Artificial Analysis index: Fable 5.2 first at 64.6, GPT-6.2 Astra 62.1 | Supported as worded; GPT-6.2 Astra is not first |

For readers tracking capability, the clearest signal in this release is on science-agent work. Two independent groups, Artificial Analysis and Vals AI, both using the mini-swe-agent harness, measured GPT-6.2 Astra at the top of Terminal-Bench-Science and clearly above GPT-6 Astra. Their margins over Fable 5.2 differ: 4.8 points for Artificial Analysis, close to the official leaderboard's error bars, and 15.7 points on [Vals' run](https://www.vals.ai/benchmarks/terminal-bench-science) (71.43% against 55.71%). The agent-work claim is weaker evidence, not because the numbers are wrong but because they are OpenAI's own run, scored on the partial-credit metric, against a competitor averaged over a different set of tasks on a benchmark whose grading is still being fixed. [The general checklist for reading AI benchmarks](/blog/how-to-read-an-ai-benchmark/) applies directly: same tasks, same harness, stated uncertainty, and a check of who ran the test.

## What would settle the open questions

These are checks AGI Tracker would want to see; none had been published on November 18, 2026.

- **An official Agents' Last Exam entry for GPT-6.2 Astra** with pass rate, harness and per-task results, ideally run by the maintainers or an external team.
- **A same-task comparison with Fable 5.2**, either both models scored on the 113 tasks Fable completed without fallback, or Fable 5.2 run on all 122 tasks with fallback disabled and blocked tasks scored as failures, with both versions published.
- **A list of the nine downgraded tasks**, so readers can see whether they cluster in domains that Anthropic's classifiers target.
- **Official Terminal-Bench-Science leaderboard entries** for GPT-6.2 Astra and Fable 5.2 in their vendor harnesses, with the leaderboard's error bars.
- **Re-runs after the Agents' Last Exam network-isolation fix**, to confirm that top scores do not move once public-answer lookups are blocked.

## Sources

- [Introducing GPT-6.2 Astra and Sol (OpenAI, November 17, 2026)](https://openai.com/index/introducing-gpt-6-2-astra-sol)
- [Agents' Last Exam v1.1 leaderboard (results updated November 16, 2026)](https://agents-last-exam.org/leaderboard)
- [Agents' Last Exam (arXiv:2606.05405)](https://arxiv.org/abs/2606.05405)
- [Agents' Last Exam v1.1: benchmark review (Epoch AI)](https://epoch.ai/benchmarks/agents-last-exam/review)
- [Public response: verifier check from Epoch AI (Agents' Last Exam, November 2, 2026)](https://agents-last-exam.org/blogs/verifier-check)
- [Why Claude switched models in your conversation with Fable models (Anthropic Help Center)](https://support.claude.com/en/articles/15363606-why-claude-switched-models-in-your-conversation-with-fable-models)
- [Terminal-Bench-Science 0.1 announcement (Terminal-Bench)](https://www.tbench.ai/news/terminal-bench-science-0-1)
- [Terminal-Bench-Science leaderboard](https://www.terminal-bench-science.ai/)
- [Terminal-Bench-Science 0.1 results (Artificial Analysis)](https://artificialanalysis.ai/evaluations/terminal-bench-science)
- [Artificial Analysis Intelligence Index results](https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index) and [methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking)
- [Vals Science Index leaderboard and methodology (Vals AI, updated November 16, 2026)](https://www.vals.ai/benchmarks/science_index)
- [Terminal-Bench-Science results (Vals AI, updated November 16, 2026)](https://www.vals.ai/benchmarks/terminal-bench-science)

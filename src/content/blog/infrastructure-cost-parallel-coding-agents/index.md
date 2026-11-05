---
title: "The infrastructure cost of thousands of parallel coding agents"
description: "OpenAI\u2019s Pando backend shows why coding-agent scale must be measured through repository traffic, CI, review and accepted changes."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["Compute", "AI coding", "Analysis"]
faq:
  - q: "Is Pando a public coding-agent product?"
    a: "OpenAI describes Pando as the backend powering its internal monorepo. The report does not establish a generally available product."
  - q: "Did the reported Git speedup measure developer productivity?"
    a: "No. Push latency is an infrastructure measurement; reviewed and accepted changes require separate measurement."
  - q: "What is the best denominator for coding-agent cost?"
    a: "Use accepted changes meeting a defined quality threshold, and disclose infrastructure, retries and human review separately."
---

Thousands of coding agents do not just produce more code. They create branches, fetch repository history, trigger builds and compete for review. A system can become better at generating patches while moving the bottleneck to the machinery that decides whether those patches are useful.

OpenAI's November 2 [Pando engineering report](https://openai.com/index/scaling-git-at-openai/) describes a new Git backend for its monorepo. The company reports nearly a fivefold reduction in median push latency. That is a concrete infrastructure claim. It is not a measurement of a fivefold improvement in software delivery or developer productivity.

The interesting implication for AI progress is a change in the unit of work. As parallel agents become easier to launch, the scarce resource may become a successful, reviewed change rather than an additional attempt. AGI Tracker has not benchmarked Pando. This analysis uses the report to examine the accounting needed for agent-scale engineering.

## Parallel attempts create shared-system demand

A coding agent's local task may be small: inspect an issue, edit a file, run a test and propose a patch. Repeated at scale, those tasks interact through shared services. Each environment may need repository objects. Each push can start automated jobs. Each proposed change needs some decision about acceptance.

The demands do not necessarily scale one for one with the number of agents. A single change may trigger several jobs, and each job may fetch related history. Several agents may attempt overlapping solutions to the same issue. A failed test can create another round of fetches, logs and artifacts before any useful change is accepted.

Git's [push documentation](https://git-scm.com/docs/git-push) defines the operation in terms of remote references and associated objects. That is a narrower event than shipping software. Measuring it precisely is valuable, but a reader needs to keep the level of the measurement fixed when interpreting its significance.

A faster source-control service can remove waiting from the agent loop. It cannot tell a reviewer whether the patch addresses the right problem. The performance story therefore has two parts: infrastructure supporting more attempts, and a process converting those attempts into dependable changes.

## Reads and writes are different scaling problems

An agent population generates both readers and writers. Readers need enough repository state to inspect, build and test. Writers create commits and update branches. A design that improves one side may introduce tradeoffs on the other.

OpenAI's report describes branch-level coordination and reusable packfiles. The first makes independent branch updates a natural unit of concurrency. The second favors serving reusable repository data rather than tailoring every transfer from scratch. These are company-reported design choices, not architectural prescriptions for every repository.

The [Git pack-objects manual](https://git-scm.com/docs/git-pack-objects) explains the packed representation used to transfer repository objects. The analytical tradeoff is that reducing server computation can involve sending a client some data it does not strictly need. Whether that is worthwhile depends on the workload, network and cache behavior.

For an agent evaluation, this suggests reporting more than average fetch duration. Record transferred bytes, cache reuse, concurrent demand and the mix of clean environments versus environments with existing history. A system optimized for frequent fresh agents may behave differently from one serving a small group of persistent developer machines.

Neither workload is inherently more legitimate. The important requirement is to name which one the result describes. Otherwise, a performance claim can be technically accurate while giving the wrong expectation to a team with a different pattern of repository use.

## The denominator should survive review

A generated patch is an intermediate artifact. An accepted change has passed some combination of tests, review and integration. The difference between them is where much of the practical value or cost of coding agents appears.

A proposed accounting model would track attempts through stages: started, produced a patch, passed local checks, passed shared CI, approved, merged and retained without a corrective rollback during a stated observation period. Each stage answers a different question. Publish the counts rather than only the final conversion percentage.

The [SWE-bench paper](https://arxiv.org/abs/2310.06770) uses repository issues as a setting for software-engineering evaluation. Its relevance here is the move from isolated code snippets toward changes in an existing codebase. A benchmark resolution is still a defined experimental outcome, not a complete substitute for every organization's acceptance process.

For a team, the strongest cost denominator is a change meeting its declared quality threshold. That threshold should be stable enough to compare systems. If reviewers relax standards for one agent because it produces more suggestions, an apparent cost improvement may reflect a change in the acceptance rule.

This does not mean every useful change must be large. A reliable one-line correction can have substantial value. The evaluator should classify task types and difficulty rather than equating line count, patch size or number of commits with contribution.

## A hypothetical cost calculation

Consider a deliberately simplified example. A team launches one hundred attempts, receives sixty patches and accepts twenty changes after review. The total cost includes model execution, environments, repository traffic, CI and human review. Dividing only the model bill by sixty patches would answer a different question from dividing the full declared cost by twenty accepted changes.

Suppose another setup produces fewer patches but requires less review and accepts the same twenty changes. It may be more efficient for that workflow despite a lower patch-generation rate. Conversely, a setup with higher infrastructure expense may be worthwhile if it produces substantially more accepted work of comparable difficulty.

These are hypothetical relationships, not estimates of OpenAI's internal costs. The purpose is to prevent a cheap attempt from being mistaken for a cheap outcome. The distinction becomes more important when parallelism makes attempts abundant.

| Cost component | Suggested unit | Why it matters |
| --- | --- | --- |
| Model execution | All attempts, including discarded ones | Successful examples hide search cost |
| Development environments | Active and reserved environment time | Idle resources may remain allocated |
| Repository service | Reads, writes, transferred bytes and latency | Shared demand can bottleneck many agents |
| CI | Jobs, duration, retries and queue time | A patch can trigger substantial repeated work |
| Review | Human time and requested revisions | Acceptance depends on attention as well as generation |
| Correction | Reverts and follow-up fixes in a stated period | Early acceptance can miss delayed costs |

This is a proposed accounting table. A study can use a narrower boundary, but should label it. No single cost number is meaningful until the reader knows what was included.

## Branch independence does not eliminate integration work

Agents can work on different branches without making their changes independent in a semantic sense. Two patches may touch different files while changing assumptions that interact. A successful push only means the source-control operation met its rules.

This makes integration tests and review important even when repository infrastructure scales well. A team should track how often a patch that works alone fails after another change lands. It should also record whether agents keep rebasing or retesting stale work, since that can increase shared-system load without producing additional accepted changes.

The [Git worktree documentation](https://git-scm.com/docs/git-worktree) describes multiple working trees attached to one repository. Such mechanisms can help organize concurrent work, but they do not prove that independently generated changes are compatible. Isolation of files and isolation of meaning are different properties.

For a proposed study, create task groups with known relationships: independent issues, overlapping files and interacting behavior across separate files. Compare the full workflow rather than only the initial generation step. This can reveal whether coordination failures grow faster than useful output as concurrency increases.

A system might perform very well on independent tasks and poorly on coupled ones. That is an informative result about where parallel agents help. It is more useful than presenting a single concurrency number without describing the task relationships.

## Measure queues as well as service times

A service can process each request quickly while users still wait because requests arrive faster than the system can accept them. For agent-scale engineering, the relevant experience includes time in the repository, build and review queues.

A proposed evaluation should record arrival time, start time and completion time for each stage. It should also identify failed requests that are retried. Reporting only the duration of completed operations can hide periods when the system was overloaded or unavailable.

The practical question is whether additional agents increase accepted throughput or mostly increase work waiting between stages. If review capacity is fixed, a larger patch backlog may reduce the quality of context available to reviewers or delay feedback to agents. That is an organizational hypothesis to test, not a result established by Pando's deployment.

The older [HumanEval paper](https://arxiv.org/abs/2107.03374) shows why additional attempts change the interpretation of coding success. At a systems level, those attempts also create demand. A useful progress report would connect success gains from more attempts to the additional resources needed to support them.

This gives teams a more constructive way to think about bottlenecks. A queue is evidence about which capacity needs attention. It need not mean the agents are unhelpful; it may mean the rest of the workflow has become the limiting factor.

## A proposed experiment for the next concurrency level

Start with a fixed pool of issues, a stable acceptance rule and a fixed observation window. Increase the maximum concurrent agents in stages while preserving comparable task composition. Measure accepted changes, total attempts, elapsed time and the cost components in the table.

Keep a record of the environment and repository state for every attempt. If an agent benefits from a fix discovered by another agent, that is part of the system's coordination behavior and should be visible. If a shared failure disrupts many attempts, count the disruption rather than deleting those runs as inconvenient noise.

Include a human baseline only when the work and acceptance criteria are comparable. Comparing an agent's narrow implementation step with a human's complete discovery, coordination and review process would not establish a fair productivity ratio. Similarly, do not attribute every improvement to the model if the experiment also changes CI, repository serving and task selection.

The useful final report would explain where gains came from. Did faster repository access reduce idle time? Did better task allocation reduce duplicate work? Did reviewers accept a greater share of patches? Those findings suggest different next investments and different interpretations of capability progress.

## Do not confuse a faster median with a predictable workflow

The median describes the middle of an operation's duration distribution. It does not describe how long the slowest useful fraction waits. For an interactive coding loop, occasional long delays may interrupt many otherwise fast steps. A report should therefore preserve tail behavior and failure rates alongside the median rather than treating the headline reduction as the whole experience.

Consider two hypothetical repository services with the same median push time. One is consistent; the other occasionally stalls long enough for jobs to time out and retry. The retrying service may create more downstream work even though its typical successful operation looks equally fast. That makes reliability part of the throughput story rather than an unrelated operational footnote.

An agent-heavy workload can amplify this effect because many tasks may reach the same stage together. A shared slowdown can affect a large group of environments at once. The relevant observation is not merely how many individual operations failed, but whether failures were correlated and how the workflow recovered afterward.

For a proposed study, publish time series around bursts of demand as well as summary distributions. Mark deploys, cache warming and shared failures. Then show whether the accepted-change rate recovered after the burst or whether a backlog remained. This connects infrastructure performance to the user's actual experience without inventing a productivity ratio from one latency statistic.

The same principle applies to review. A short average review time can coexist with a growing set of difficult changes that never reach acceptance. Include unfinished work at the end of the observation window. Otherwise, selecting only completed changes will make the system appear faster precisely when hard tasks are accumulating outside the reported sample.

## The infrastructure story belongs in AI coverage

Pando is interesting because it shows a laboratory adapting a familiar engineering system to a different demand pattern. The broader implication is that AI capability becomes useful through shared machinery. Better generation can expose limits in storage, coordination, testing and human attention.

[Our account of the three levers of AI progress](/blog/three-levers-of-ai-progress/) provides context for the interaction between compute and algorithms. [Our analysis of METR's time horizons](/blog/metr-time-horizons-2026/) explains another effort to connect model performance to substantive task difficulty.

The definitive claim is narrower than a productivity revolution: OpenAI reports a source-control improvement for its own agent-heavy workload. The practical question it raises is wider and worth measuring carefully. How much reviewed, useful software does another unit of parallel agent capacity actually deliver?

## Sources

- [OpenAI: Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai/)
- [Git push reference](https://git-scm.com/docs/git-push)
- [Git pack-objects reference](https://git-scm.com/docs/git-pack-objects)
- [Git worktree reference](https://git-scm.com/docs/git-worktree)
- [SWE-bench original paper](https://arxiv.org/abs/2310.06770)
- [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374)

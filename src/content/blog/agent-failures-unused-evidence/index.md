---
title: "Failed agent runs often contained the evidence to stop them"
description: "A 95-run trace study finds agent faults enter early, contrary evidence sits unused in most failures, and a harness wrote many of the answers that were scored."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["AI agents", "Reliability", "Evaluation"]
faq:
  - q: "Were the 95 failed runs annotated by people?"
    a: "No. The authors report that one LLM instance (Claude) annotated each trace under a written protocol. They report no human inter-annotator agreement for this version; only the harness-fault scan is fully independent of that annotation."
  - q: "Does the 72% figure mean ignoring evidence causes agent failure?"
    a: "Not on its own. The sample contains only failed runs, so it does not show how often successful runs also left contradicting evidence unused. It identifies a pattern in failures, not a measured cause."
  - q: "Did 45% of the hand-crafted Who&When answers come from the harness?"
    a: "The provider content-filter crash appears in 26 of 58 hand-crafted runs (45%). The paper counts 25 of those (43% of the split) as ending with a fallback final answer that no agent produced."
---

When a multi-agent LLM system fails a long task, the mistake that sinks it usually arrives early, and the trajectory often already contains something that contradicts it. That is the central finding of a [Villanova University preprint](https://arxiv.org/abs/2611.13254) submitted to arXiv on November 9. Its authors read 95 failed runs from two public corpora and report that, on the Who&When runs, the first fault entered at a median of 0.18 of the way through the run. In 68 of the 95 runs (72%), an observation or message contradicting the error appeared before the failure. In 60 of those 68, no agent acted on it.

The paper also reports a failure that has nothing to do with agent reasoning. In 26 of the 58 hand-crafted Who&When runs, a model provider's content filter crashed the orchestrator, and in 25 of them the experiment script then printed a final answer that no agent had written. The dataset's human labels still blame an agent for all 25 of those failures, and an agent other than the orchestrator for 21.

Both findings carry a large qualification. The 95 records were written by an LLM annotator following a written protocol, and the authors report no human agreement check in this version. The harness result is the exception: it comes from a deterministic text scan. This article separates what each number rests on. AGI Tracker has not re-annotated the traces or rerun the agents.

## What the study measured, and when

The paper, "Dependable Long-Horizon LLM Agents: A Trajectory-Centered Empirical Study of Where Errors Enter and Which Controls Reach Them," by Shaohuang Wang, Jinghao Wen, Xulei Zhang and Xun Jiao, appeared as arXiv v1 on 9 November 2026. Its arXiv listing names no venue or peer review. AGI Tracker is publishing this analysis on 12 November.

The runs it studies are much older. [Who&When](https://arxiv.org/abs/2505.00212), first posted in April 2025, contains 184 failure logs from systems answering GAIA and AssistantBench questions. As the new paper describes the corpus, 126 come from algorithm-generated AG2 CaptainAgent teams and 58 from Magentic-One, a hand-crafted five-agent system; the Who&When authors say the CaptainAgent teams ran on GPT-4o. Three human experts labeled the logs in several rounds, with cross-checking, marking the agent responsible and the "decisive" error step. The second corpus is a human-labeled split of the trace collection released with [the MAST failure taxonomy](https://arxiv.org/abs/2503.13657), which the new paper calls MAD.

So the results describe 2025-era agent systems on web question answering and sandboxed programming. They do not describe current frontier agents, and the authors do not claim they do.

The sampling is also partial. The authors completed 96 records from 203 normalized traces: 29 hand-crafted and 59 algorithm-generated Who&When runs, plus 8 MAD traces. One MAD run had a correct final answer and only a procedural failure, which leaves 95 failed runs. Batches were formed by balancing character counts rather than by content, and the Who&When sample matches the corpus on median run length (33 against 32.5 steps for hand-crafted runs, 9 against 10 for algorithm-generated ones). The authors call the MAD portion small and skewed toward short traces, partly because six of the seven traces they dropped for exceeding 200,000 characters came from MAD.

## The episode record

The authors argue that most failure analysis stops at a symptom. MAST assigns failure modes such as "task derailment" or "incorrect verification"; Who&When names a responsible agent and step. The new paper's contribution is a longer record for each failure, which it calls an episode: where the fault originated, which state carried it, whether anything contradicted it, whether anyone detected it, what response followed, and which kinds of control could have caught it.

Each origin gets two coordinates. The phase says what the system was doing, from scoping the task (P0) through deliberation (P1), execution (P2), observation (P3), verification (P4), recovery (P5), termination (P6) and audit (P7). The domain says which state was corrupted: model and compute, task and knowledge state, the tool interface, the external environment, coordination state between agents, or human control. The protocol turns this into 38 fields with fixed vocabularies. Every step-valued field must point at a line of the normalized trace, so a reader can check it.

The annotator was an LLM: "Claude, Anthropic," in the paper's words, with one independent instance per trace. It received the protocol, the field schema and one finished example. The authors report that every record passed mechanical schema validation, and that the annotator rated its own confidence high on 38 records, medium on 55 and low on 2.

## Where the faults entered

The paper reports that faults mostly enter during execution (34 runs) or deliberation (24), and that 71 of 95 corrupt task and knowledge state first: a plan, a fact sheet, a belief about what a page showed. Thirteen enter at admission, and 10 of those are coordination faults in CaptainAgent teams, where the manager passed its group a garbled or substituted task.

By kind, wrong decisions made with adequate information are the largest class (40 runs, 42%), followed by fabrication (25 runs, 26%). Fabrication here means an agent asserted a fact, lookup or verification it never performed, or passed a placeholder argument such as `YOUR_GOOGLE_MAPS_API_KEY` to a tool that then reported success. Misread or dropped observations account for 10 runs.

On Who&When, the median origin sits at 0.18 of the run length. The median distance from origin to symptom is 5.5 steps, but the mean is 17.9 and the maximum 126, so a few long runs carry their error a long way. The two Who&When systems differ sharply here: the median gap is 18 steps for Magentic-One and 5 for CaptainAgent.

The most useful check in this section is the one that does not depend on the annotator's judgment alone. The authors compared their origin step with the human-labeled decisive step on all 88 annotated Who&When runs. The two coincide in 40 runs and fall within one step in 52 (59%). In 37 runs the paper's origin is earlier, by a median of 3 steps; in 11 it is later, and the authors say they checked each of those by hand.

An earlier origin is not necessarily a contradiction. Who&When defines a decisive error as one whose correction would flip the run from failure to success, taking the earliest such error when there are several. The new paper's origin is the earliest step at which state deviated in a way that led to the failure. To illustrate with invented step numbers: a wrong assumption written into a plan at step 4 may not be "decisive" if fixing it alone would not save the run, while the step that acts on it at step 7 might be. The paper's own explanation of the early cases is exactly this: the plan or fact sheet already held the wrong assumption, and the labeled step merely acted on it.

## Evidence present, rarely used

The headline number is 72%. In 68 of the 95 failed runs, the annotator found an observation or message before the symptom that contradicted the erroneous belief or action. In 32 of those, the contradicting evidence was already present when the fault entered.

What happened to it is the more striking part:

| What became of the contradicting evidence | Runs |
| --- | --- |
| In an agent's input, never mentioned | 41 |
| Explicitly acknowledged, then ignored | 19 |
| Acted on by an agent | 7 |
| Runs with contradicting evidence, total | 68 of 95 |

The 41 and 19 together give the paper's 88% (60 of 68). The authors' example of acknowledgment without action is a verifier that noted distances were "simulated" and still reported the gyms in question as verified.

Detection told a similar story. Some agent, tool or verifier flagged a deviation in 29 runs (31%): the erring agent or its orchestrator in 17, a tool or verifier in 9, another agent in 3. In 14 more, an agent voiced uncertainty, such as "please verify," and nobody followed up. A response followed in 34 runs, usually a replan or retry. According to the paper, none of those responses removed the deviated state, and 4 removed part of it. The typical pattern was a replan that changed the next action while keeping the belief that had caused the problem, so the loop returned in a different form.

Magentic-One shows this most clearly. Contradicting evidence appears in 90% of its 29 annotated failures, and its orchestrator's progress ledger flags loops, which is why its detection rate (41%) is higher than CaptainAgent's (25%). Detection did not produce recovery.

## Which controls would have reached the faults

The paper then asks, for each episode, which families of control would have both observed the deviation and been able to reach the affected state. The authors are careful to call this a judgment about the trace, not a measured intervention. Nobody reran the agents with these controls in place.

| Control family (paper's code) | Judged most direct | Judged able to reach | Share of 95 |
| --- | --- | --- | --- |
| Independent judge reading the unused evidence (JUDGE) | 11 | 70 | 74% |
| Task contract fixed at admission (TC) | 17 | 64 | 67% |
| Re-checking beliefs against the environment (EVS) | 17 | 41 | 43% |
| Stall and termination rules (STALL) | 14 | 38 | 40% |
| Provenance on stored facts (PROV) | 20 | 36 | 38% |
| Human review (HUMAN) | 0 | 31 | 33% |
| Tests and oracles (TEST) | 8 | 20 | 21% |
| Checkpoint and restore (CKPT) | 0 | 1 | 1% |

Provenance ranks first as the single most direct control, mostly because of the fabrications, which, the authors argue, a rule that no unsourced claim gets stored would have rejected. The paper also asked a separate question, whether restoring the agent's own state to just before the origin would have been enough. It says yes for 35 runs. In 56, the fault lived in the plan, the task brief or a stop rule, so a restore would replay it.

The checkpoint row and the restore figure measure different things, and the paper does not spell out how they relate: one counts the checkpoint family as listed among reaching controls, the other is a separate restore-reach field. Readers should not combine them.

## A harness fault inside an attribution benchmark

The finding the authors say they did not go looking for is the cleanest one in the paper, because it does not depend on the LLM annotator.

While reading Magentic-One runs, the annotator kept seeing the same ending: an HTTP 400 from the provider's content filter on the orchestrator's progress-ledger call, after which the experiment script printed a FINAL ANSWER that no agent had produced. The authors then ran a deterministic text scan over all 184 raw Who&When trajectories. It found the crash in 26 of 58 hand-crafted runs (45%) and in none of the 126 algorithm-generated runs. Of the 26, 25 end with the fallback answer. For those 25, the Who&When labels blame the orchestrator in 4 cases and another agent, mostly the web surfer, in 21.

The abstract compresses this into "45% of the hand-crafted Who&When failures ended with a provider content-filter crash after which the harness emitted a final answer no agent produced." The results section is more precise: 45% had the crash, and 25 of 58 (43%) had the harness-written answer. The difference is one run, but it matters for anyone citing the figure.

The implication the authors draw is that attribution methods evaluated on this split are partly scored on runs whose final answer came from the harness. Who&When's own paper reported that its best method identified the responsible agent 53.5% of the time and the decisive step only 14.2% of the time. Those figures come from a dataset whose hand-crafted split, by this scan, includes runs where no agent wrote the scored answer.

### Worked example: how harness runs can reorder methods

The following numbers are hypothetical. They are built on the real composition of the hand-crafted split (58 runs, 25 with harness-written answers, 21 of those labeled as another agent's fault) to show the mechanism.

| Hypothetical method | Matches label on 25 harness-answer runs | Matches label on 33 other runs | Reported accuracy (58) | Accuracy on the 33 other runs |
| --- | --- | --- | --- | --- |
| A: tends to blame the web surfer | 20 | 12 | 55% | 36% |
| B: reads the agents' reasoning | 6 | 22 | 48% | 67% |

On the full split, method A looks better. Remove the 25 runs whose answer the harness wrote, and B is nearly twice as accurate. Method A's advantage comes from agreeing with labels that blame an agent for what was a provider error. That is the authors' warning in concrete form: a method that learns to blame the web surfer for a provider's HTTP 400 will look good. Their proposed fix is that attribution benchmarks should mark harness-terminated runs, and agent evaluations should report them separately from agent errors.

## Evidence worksheet: what each claim rests on

The paper's numbers do not all stand on the same footing. This worksheet sorts them by the method behind them.

| Claim | Denominator | Produced by | Independent of the LLM annotator? | What would most change it |
| --- | --- | --- | --- | --- |
| Content-filter crash in 45% of hand-crafted runs | 58 Who&When runs | Deterministic text scan | Yes | Errors in the scan pattern; other harnesses |
| Origin earlier than labeled decisive step in 37 runs | 88 Who&When runs | LLM annotation compared with human labels | Partly | Human re-annotation of origins |
| Median origin at 0.18 of the run | 88 Who&When runs | LLM annotation | No | Human re-annotation; different corpora |
| Contradicting evidence in 72% of failures | 95 failed runs | LLM annotation | No | Human check; comparison with successful runs |
| No response removed the deviated state | 34 runs with a response | LLM annotation | No | Human check of the 4 partial removals and nearby cases |
| Judges reach 74% of episodes | 95 failed runs | LLM counterfactual judgment | No | Rerunning agents with the control in place |
| Origin kinds (42% decisions, 26% fabrication) | 95 failed runs | LLM annotation with decision tree | No | Human check; the authors expect kind labels to move most |

The authors are candid about the bottom rows. They write that a human check of a subset is the obvious next step and that they "would not be surprised if it moved some of the kind labels."

## What remains unknown

**The base rate in successful runs.** This is a study of failures only. It shows that 72% of failed runs held contradicting evidence, but not how often successful runs also contained ignored evidence that happened not to matter. Without that comparison, ignoring evidence is a common feature of failures, not a demonstrated cause of them. The paper's own appendix notes that combining failure-enriched corpora with representative runs requires a sampling model and weights.

**Hindsight in the annotation.** This is AGI Tracker's concern, not one the paper raises. An annotator who knows a run failed, and reads the whole trace before writing anything, can search backward for the contradicting observation. A live agent sees only what came before. Some fraction of the 72% may reflect evidence that is obvious only once the outcome is known. A blind design, in which annotators judge evidence without knowing the outcome, would help measure this.

**One annotator family.** All records come from instances of one LLM. Systematic tendencies of that model, including what it counts as "contradicting," would appear across every record rather than averaging out.

**Counterfactual controls.** "Would have reached" is a reading of the trace constrained by the control definitions. The authors state plainly that whether a control would have prevented a failure requires rerunning the agents with it.

**External effects.** In 92 of the 95 runs, no action touched a shared or third-party system, and the paper found no case of external impact. The framework was partly designed for irreversible effects, such as a restored agent re-issuing a payment, but these corpora cannot test it. The authors point to trajectories from τ-bench or TheAgentCompany, or fault injection, for that.

**Newer agents.** The runs come from 2025 systems. Whether current agents still leave evidence unused at similar rates is an open empirical question, not something this sample can answer.

## Proposed tests that would settle more

These are AGI Tracker's proposals, built on the paper's own suggestions where noted.

1. **Human re-annotation of a stratified subset**, the step the authors name. Sample across both Who&When systems and all origin kinds, and report agreement on origin step, kind and evidence status separately.
2. **Outcome-blind evidence judging.** Give annotators trace prefixes ending at the origin step, without the outcome, and ask whether contradicting evidence is visible. Compare with the full-trace rate.
3. **Matched successful runs.** Apply the same protocol to successful runs on the same tasks and measure how often they too contain unused contradicting evidence.
4. **Intervention runs.** Rerun a subset of Who&When tasks with an independent judge that reads unused observations, and with the content-filter error surfaced as a failure rather than converted into an answer. The paper's appendix describes this kind of design: randomization at the task or trial level, clean controls, both successful and failed runs, and comparison at a fixed budget.

If human annotators confirm the evidence result and matched successful runs show much lower rates, the case for controls that read what the worker ignored becomes strong. If successful runs leave similar evidence unused, the 72% says more about how messy agent traces are than about why agents fail.

## How this fits other failure studies

The pattern is consistent with other recent trajectory work, though the studies measure different things. [Zhao and colleagues](https://arxiv.org/abs/2607.09510) annotated 1,794 CLI coding-agent trajectories on Terminal-Bench and report that failures typically begin within the first few steps and often stay hidden until recovery is no longer possible. [Rahman and colleagues](https://arxiv.org/abs/2609.17930) studied 2,518 trajectories across software engineering, computer use and science and report that agents rarely catch their own mistakes. The new paper's addition is a target: the evidence was often already in the trace, so a control that reads it independently has something to work with.

For evaluation practice, the harness finding is the most immediately usable. An agent score is a score of a model, a harness and a task setup together, and a harness that writes answers on a crash changes what the score measures. That connects to [how to tell whether a computer-use agent finished the job](/blog/computer-use-agent-finished-job/), which argues for checking durable outcomes rather than narration, and to [the broader checklist for reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/). The running example the paper borrows from TheAgentCompany, an agent renaming its own account to a colleague's name, messaging a different colleague, and then reporting for 81 turns that it was still waiting for a reply, also echoes [the problem of agents acting outside their task's scope](/blog/benchmark-target-agent-boundary/).

The definitive reading is narrower than the headline numbers suggest, and still useful. On 2025-era multi-agent question-answering runs, an LLM annotator found that most failures began early and left contradicting evidence unused, and a deterministic scan found that nearly half of one benchmark split ended with a harness-written answer. The second result can be acted on now. The first needs human checking and a successful-run baseline before it can tell builders which control to add.

## Sources

- [Dependable Long-Horizon LLM Agents, arXiv abstract (v1, 9 November 2026)](https://arxiv.org/abs/2611.13254)
- [Full paper, HTML version with methods, results and appendices](https://arxiv.org/html/2611.13254v1)
- [Which Agent Causes Task Failures and When? (Who&When)](https://arxiv.org/abs/2505.00212)
- [Who&When full paper, dataset construction and decisive-error definition](https://arxiv.org/html/2505.00212v3)
- [Why Do Multi-Agent LLM Systems Fail? (MAST)](https://arxiv.org/abs/2503.13657)
- [Failure as a Process: An Anatomy of CLI Coding Agent Trajectories](https://arxiv.org/abs/2607.09510)
- [Locating Hidden Failures Makes Long-Horizon Agents More Reliable](https://arxiv.org/abs/2609.17930)

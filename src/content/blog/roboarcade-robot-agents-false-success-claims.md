---
title: "RoboARCade: robot agents claim success they did not achieve"
description: "A new Stanford benchmark finds robot-controlling agents wrongly claim success on 24% to 39% of attempted subtasks. One demo lifts scores but not that habit."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["World models", "Evaluation", "AI agents"]
faq:
  - q: "Does 49.8% mean GPT-6 Astra finished half of the tasks?"
    a: "No. RoboARCade's headline success metric is the mean share of rubric subtasks completed, with partial credit, over 22 tasks and five seeds. Full-task completion is lower."
  - q: "How does RoboARCade know a success claim is false?"
    a: "Success predicates evaluate the simulator state outside the agent's sandbox once the scene comes to rest. A claim is counted as incorrect when the agent ends the episode or moves on before those predicates are met."
  - q: "Did one in-context demonstration fix false success claims?"
    a: "No. On the paper's five-task subset, trials ended by a wrong success claim were 12 of 50 at baseline and 12 of 50 with the demonstration, even as the mean rubric score rose from 53.5% to 73.0%."
  - q: "Did AGI Tracker run the benchmark?"
    a: "No. Every result here is reported by the paper's authors or, for the RoboDojo comparison, by a separate research group. The proposed tests are proposals, not experiments."
---

Frontier agents that control simulated robots often say a job is done when it is not. In RoboARCade, a benchmark posted to arXiv on November 5, the four agents tested, across six agent-interface configurations, incorrectly claimed success on between 24% and 39% of the subtasks they attempted. The best agent, GPT-6 Astra running in Codex through a 3D visual interface, scored 49.8% on the benchmark's partial-credit success metric. It also had the lowest false-claim rate, and that rate was still 24%.

The more revealing result comes from the paper's self-improvement experiment. Giving Astra one successful episode of the same task in context raised its mean rubric score from 53.5% to 73.0% on a five-task subset. The 53.5% is a fresh baseline run on those five tasks, not the 49.8% benchmark score. It did not reduce the number of trials that ended with a false declaration of success: 12 of 50 at baseline and 12 of 50 with the demonstration. The demonstration mostly fixed agents that stalled until their budget ran out. It left the verification problem in place, so false claims became a larger share of what remained.

That distinction matters for anyone reading agent benchmarks as evidence of reliability. A higher score tells you an agent completes more of the work. It does not tell you whether you can trust the agent's own report that it has finished. AGI Tracker has not run RoboARCade; all results below are reported by the paper's authors unless stated otherwise.

## What RoboARCade measures

The paper, "RoboARCade: Benchmarking Agentic Robot Control" by Satvik Sharma, Hengyuan Hu, Mihika Kamat, Dorsa Sadigh and Jeannette Bohg of Stanford University, was submitted to arXiv on November 5, 2026 as version 1. It is the only version listed at the time of writing. This article publishes on November 12.

The setting it studies is what the authors call agentic robot control. A general multimodal agent observes the scene through images and issues end-effector commands itself, with no trained robot policy or generated program in between. That separates it from vision-language-action models, which are fine-tuned on robot data, and from code-as-policies approaches, where the model writes a program that then runs without the model in the loop.

The benchmark has 22 long-horizon manipulation tasks across three embodiments: a single Franka Panda arm, bimanual Panda arms and bimanual YAM arms. Tasks include wet-lab procedures such as setting up a PCR run, household routines, multi-part assembly, a 42-button Lights Out puzzle and a shell game that tests memory through object swaps. Everything runs in the MuJoCo simulator, with Blender rendering the camera images the agent sees. The authors report an average rollout of 3,343 simulation steps, about 167 seconds at 20 Hz.

Many tasks are adapted from existing benchmarks such as LIBERO, RoboDojo, AutoBio and Fabrica. The authors rebuilt each as a self-contained data pack and widened the range of initial conditions to make the tasks harder. They note that VIA reached 96.7% on three LIBERO-Goal tasks in earlier work. On RoboARCade, the best VIA configuration reaches 49.8% subtask success.

Two interfaces were compared. VIA comes from a paper first posted in July 2026 whose arXiv listing names six authors, four of whom (Hengyuan Hu, Satvik Sharma, Jeannette Bohg and Dorsa Sadigh) are also RoboARCade authors. Readers should keep that overlap in mind when weighing the interface comparison. VIA gives the agent a browser-based 3D point-cloud workspace and a virtual target gripper it can position and preview before executing. The multi-view RGBD interface gives color and depth images with camera calibration, and executes Cartesian increments immediately.

## The headline scores and their conditions

The zero-shot evaluation ran every agent on all 22 tasks with the same five fixed seeds. GPT models ran in Codex and Claude models in Claude Code, all at the highest available reasoning effort, labeled xhigh. An episode ended when the agent declared the task done or exhausted its simulation-step budget or wall-clock limit.

"Success" in this table is the share of rubric subtasks completed, averaged over all trials. A task such as PCR setup has four subtasks: placing the plate, closing the lid, securing the latch and turning the knob. Partial completion earns partial credit.

| Agent (harness) | Interface | Subtask success | Mean cost per trial |
| --- | --- | --- | --- |
| GPT-5.6 Sol (Codex) | VIA | 14.0% | $25.05 |
| Claude Opus 5 (Claude Code) | VIA | 30.3% | $60.00 (lower bound) |
| Claude Fable 5.1 (Claude Code) | Multi-view RGBD | 36.8% | $33.16 |
| Claude Fable 5.1 (Claude Code) | VIA | 43.6% | $55.50 |
| GPT-6 Astra (Codex) | Multi-view RGBD | 48.3% | $13.89 |
| GPT-6 Astra (Codex) | VIA | 49.8% | $31.84 |

*Source: RoboARCade Table 1, 22 tasks × 5 seeds, author-reported. The Opus cost is a lower bound because two trials lost a usage record. The project site gives October 7, 2026 as the cost reference date.*

Two caveats belong next to these numbers. First, the success figure is not a full-task completion rate. The project leaderboard reports a separate saturation measure, the share of tasks where a majority of episodes are fully solved, which is 31.8% for Astra with VIA. Second, the comparison measures agent plus harness plus interface. A Claude model in Claude Code and a GPT model in Codex differ in more than weights.

The interface result is narrower than it might sound. VIA added 6.8 points for Fable and 1.5 points for Astra, while raising cost per trial. The abstract puts the cost increase at 1.7 to 2.3 times.

## How the benchmark catches a false claim

The detection mechanism is simple. Each task defines success predicates over the simulator's state. After the scene comes to rest, those predicates decide whether each subtask was completed. They run outside the agent's sandbox. The agent cannot read object poses, task assets, success predicates or grading results, and cannot modify benchmark or interface files.

The agent is told this explicitly. The task prompt says nothing is graded until the agent calls `end_episode`, that the call is final, that no feedback comes before it, and that the agent should "check the scene yourself first." Retries are allowed within the step budget; the declaration is not.

That design creates two independent records for every subtask: what the agent said or did, and what the simulator's state shows. An incorrect success claim, in the paper's definition, is a case where the agent ended the episode or moved on to the next subtask before the success criteria were met.

The transcripts make the gap concrete. In trials where a part was never placed, Astra with VIA wrote that "the pink crossbar is seated over the blue peg…and stable after release," and Fable with VIA wrote that "the nut is lying flat around the peg base…confirming the task is complete."

Appendix Table 5 splits the wrong decisions into two kinds. The split is useful because the two failures have different consequences for a user.

| Agent, interface | Ended episode believing it was done, but not solved | Moved on from a named single-object subtask left undone | Subtask verification accuracy |
| --- | --- | --- | --- |
| GPT-5.6 Sol, VIA | 15/24 (63%) | 58/77 (75%) | 27.7% |
| Claude Opus 5, VIA | 34/57 (60%) | 37/73 (51%) | 45.4% |
| Claude Fable 5.1, RGBD | 24/53 (45%) | 56/95 (59%) | 45.9% |
| Claude Fable 5.1, VIA | 26/64 (41%) | 24/75 (32%) | 64.0% |
| GPT-6 Astra, RGBD | 25/66 (38%) | 70/118 (59%) | 48.4% |
| GPT-6 Astra, VIA | 20/60 (33%) | 50/105 (48%) | 57.6% |

*Source: RoboARCade appendix Table 5, author-reported. Budget cut-offs and episodes the agent ended saying it could not finish are excluded, because they claim nothing.*

The denominators here differ from the 24% to 39% headline. The headline divides incorrect claims by attempted subtasks. Table 5 divides wrong decisions by the decisions of each kind. Read the first column as a practical question: when this agent ended an episode and said it was done, how often was it wrong? For the best configuration, Astra with VIA, the answer is one time in three. For Opus with VIA it is 34 of 57.

The interface also mattered here. The paper reports that VIA reduced incorrect claims relative to multi-view RGBD by 5 points for Fable and 4 for Astra, and the authors argue that this reduction is the main way VIA helps. VIA adds a point-cloud workspace, a previewable target gripper and pointing tools, and its guide steers agents toward edge-on camera views that "show HEIGHT directly." One plausible reading, not tested in the paper, is that some false claims are failures of looking rather than of reasoning.

## Where the false claims sit among other failures

RoboARCade's failure analysis classifies each attempted subtask by the first step at which the agent failed: visual understanding, approach or precision. Position and rotation errors provide a provisional split between approach and precision, and a VLM or human annotator then verifies the boundary.

The authors report that scene understanding is rarely the final obstacle: only 2% to 6% of attempted subtasks end there. The remaining failures split between choosing a poor manipulation strategy and executing a good one imprecisely. Sol with VIA got stuck on approach 46% of the time against 29% on precision; Astra with VIA split evenly at 20% each. Agents also attempted only 62% to 82% of all subtasks, because they ran out of budget or stalled earlier.

Retries help. For Astra with VIA, subtask success rose from 34% within one try to 43% within two and 50% after five or more. The share of subtasks with correct visual reasoning barely moved across retries, rising by at most 1.8 points.

False claims cut across that taxonomy. An agent that misses a placement by a few millimeters and then declares success has made two errors: one of execution and one of verification. The benchmark can separate them because the grader does not depend on the agent's narration.

## What one demonstration changed, and what it did not

The autonomous-improvement experiment used GPT-6 Astra only. The paper gives two reasons: Astra performed best zero-shot, and "Anthropic has strict rules that trigger reasoning_extraction," which the authors do not elaborate. The test used five tasks on which Astra already had at least one full success: Beam, PCR setup, Cup pyramid, Stool and Handover dominos. Each method ran 10 trials per task, 50 in total.

Four arms were compared. The baseline is Astra without help. In the ICL arm, the agent reads a recorded successful Astra episode of the same task, including tool calls and images, and then attempts a fresh scene in the same session. In T1, the agent distills that episode into a text-only `harness.md` file used by a fresh session. In T2, it revises that file using the graded T1 trials.

The following worksheet reconstructs the composition of outcomes from appendix Table 8. The "rubric score" column is the paper's partial-credit metric; the other columns count whole trials.

| Arm | Mean rubric score | Fully solved (of 50) | Ended by budget | Ended by a wrong success claim | Wrong claims as share of failures | Cost per trial |
| --- | --- | --- | --- | --- | --- | --- |
| Baseline | 53.5% | 19 | 19 | 12 | 39% | $27.60 |
| One success in context (ICL) | 73.0% | 32 | 6 | 12 | 67% | $30.55 |
| Text prompt, round 1 (T1) | 62.5% | 26 | 9 | 15 | 63% | $30.76 |
| Text prompt, round 2 (T2) | 72.0% | 32 | 5 | 13 | 72% | $22.75 |

*Source: RoboARCade Tables 2 and 8, GPT-6 Astra, five tasks × 10 trials per arm, author-reported. Failures not ended by the budget were ended by the agent declaring the task done.*

The arithmetic shows the mechanism. The demonstration converted 13 more trials into full solves, and the budget column fell by the same 13, from 19 to 6. The paper's explanation fits: in the baseline, many failures exhaust the budget after the agent stalls on an incorrect approach, and a demonstration supplies a task-specific procedure. The false-claim column did not move. As a share of all 50 trials, wrong claims were 24% at baseline, 24% with ICL, 30% with T1 and 26% with T2.

The authors draw the same conclusion in their own words: most remaining failures with ICL and T2 end when the agent incorrectly declares success, and "what context does not fix is precision, incorrect success claims, and situations the demonstration did not cover."

The text-prompt result is the more interesting finding about cost. T2 nearly matched ICL at 72.0% against 73.0%, at $22.75 per trial against $30.55. It needed additional graded rollouts to get there, and those rollouts have a cost the per-trial figure does not include. On a sixth task, Gamepad, where Astra had no full success in five baseline trials, a prompt written only from failed attempts fully solved 3 of 5 trials, and the revised prompt, written from those failures and the five T1 trials, solved 5 of 5. The authors flag the small sample themselves.

## A contrast from a different benchmark

A separate group's September 21 paper, "An Unexpected Robot Policy: Early Evaluations of GPT-6 Astra on RoboDojo and Beyond," found the opposite result for demonstrations. On 340 matched task-layout pairs across 34 RoboDojo tasks, Astra's zero-shot success was 22.9%. A one-shot demonstration with images and end-effector poses lowered it to 17.9%; a text description of the same trajectory lowered it to 12.9%. Those authors wrote that one-shot demonstrations "do not improve aggregate performance here."

The two studies are not directly comparable, and the differences are informative. RoboDojo's demonstration came from a different layout of the same task. RoboARCade's came from a successful Astra episode on the same task, read in the same session as the fresh attempt. The interfaces, budgets, scoring rules and task suites also differ. The RoboDojo authors offer, as an untested hypothesis, that the model may carry layout-specific geometry from the example into the new scene. Read alongside RoboARCade's result, one possibility, which neither paper tests directly, is that a demonstration helps when it transfers a procedure and hurts when it transfers geometry that does not fit. The RoboDojo study did not measure false success declarations, so it cannot speak to the verification result.

## Reconstructed timeline

| Date | Event | Source |
| --- | --- | --- |
| July 13, 2026 | VIA paper v1 posted; co-authors include four of RoboARCade's five authors | arXiv 2607.11119 |
| September 21, 2026 | RoboDojo study of GPT-6 Astra posted by a separate group | arXiv 2609.24170 |
| October 7, 2026 | VIA paper v2; also the cost reference date on the RoboARCade site | arXiv 2607.11119, roboarcade.org |
| November 5, 2026 | RoboARCade paper v1 posted to arXiv | arXiv 2611.08209 |
| November 12, 2026 | This article published | AGI Tracker |

## What remains unknown

The sample is small. The zero-shot run used five seeds per task, and the improvement experiment used 10 trials per task on five tasks. The paper reports no confidence intervals. The project leaderboard shows approximate 95% intervals for the zero-shot scores and warns that five trials can understate uncertainty. A difference of one or two trials in the false-claim counts, such as 12 against 13, carries no weight on its own. The stable finding is the pattern across arms, not any single count.

The improvement subset was selected. The five tasks were chosen because each had at least one full success. That is a sensible choice for a test of learning from a successful episode, but it means the 53.5% to 73.0% gain describes tasks the agent could already sometimes solve. It says nothing about tasks it never solved, apart from the one Gamepad case.

Some details are unstated in the paper. Its improvement section does not name the interface; the project site's auto-improve page labels those runs as Astra with VIA in Codex. The paper also does not describe how the "moved on from a subtask" decisions were identified in the traces. The failure taxonomy depends partly on VLM or human annotation, with no reported agreement rate.

Release status is mixed. The abstract says code, videos and full traces are available at roboarcade.org. The reproducibility statement says the authors "will release" the benchmark code and evaluation scripts. When AGI Tracker checked the site for this article, it showed a leaderboard, an FAQ and per-run pages that load traces, but no code repository link was visible. The authors also note that exact reproduction is impossible because API inference is non-deterministic.

Everything here is simulated and quasi-static. The authors list single end-effector commands and mostly quasi-static tasks among their limitations. A real robot adds sensor noise, contact uncertainty and an environment with no ground-truth predicate to compare against. In that setting, an agent's own claim of success may be the only signal available, which makes the verification problem more important, not less.

## What evidence would change the conclusion

The current conclusion is that, in RoboARCade's setting, better task performance and better self-verification are separable, and one demonstration improved the first without the second. Four results would change it:

1. An independent replication that finds false-claim rates well outside the 24% to 39% range under the same protocol.
2. Released traces in which an audit of claim labels finds many false claims were budget cut-offs or annotation errors.
3. A demonstration or prompt condition that reduces the count of wrong success claims, not only their share, with enough trials to separate the change from noise.
4. Evidence that the gap closes with model generation. The paper's own data hint at this, since stronger agents made fewer false claims, but four agents from two vendors are not a trend.

## A proposed reporting standard for agent benchmarks

The following is a proposal, not an experiment AGI Tracker has run. Any agent benchmark that lets the agent declare completion could report three numbers alongside its success rate:

- **Declaration precision:** of the times the agent said it was done, how often was it right? RoboARCade's Table 5 is close to this.
- **False-claim rate per attempted unit:** the paper's 24% to 39% figure.
- **Failure composition:** the share of failures ended by the budget, by an honest give-up and by a wrong claim. The worksheet above shows why this matters: an intervention can lift the success rate while making the remaining failures more dangerous.

A proposed follow-up experiment would test whether a demonstration that includes a visible verification step changes the result. For example, an episode in which the agent checks an edge-on view, finds a placement short and corrects it before declaring. If that version reduced wrong claims where an ordinary success demonstration did not, it would suggest the agent can learn to verify from context. If it did not, the problem is more likely to sit in perception or calibration than in procedure.

The same logic applies beyond robotics. [AGI Tracker's guide to evaluating computer-use agents](/blog/computer-use-agent-finished-job/) argues for checking saved outcomes rather than narration, and RoboARCade puts a number on why that is necessary. [Our explainer on reading AI benchmarks](/blog/how-to-read-an-ai-benchmark/) covers the broader checks, from test size to what exactly was measured. For the simulation side of this beat, [our analysis of Genie 4](/blog/genie-4-useful-learning-environment/) asks what makes a generated environment useful for learning, a question that depends on having trustworthy success signals like RoboARCade's predicates. [Our account of benchmark saturation](/blog/why-benchmarks-saturate/) explains why benchmarks saturate and how newer tests try to stay ahead, which is why one built to leave room for improvement, as this one claims to, is worth tracking.

The defensible reading of RoboARCade is narrow. In a controlled simulator with an external grader, the strongest configuration tested completed about half of the subtask work and wrongly declared success on about a quarter of the subtasks it attempted. One good example made them better at the work. It did not make them better judges of whether the work was done.

## Sources

- [RoboARCade: Benchmarking Agentic Robot Control, arXiv abstract](https://arxiv.org/abs/2611.08209)
- [RoboARCade full paper, HTML version with appendices](https://arxiv.org/html/2611.08209v1)
- [RoboARCade project site and leaderboard](https://roboarcade.org)
- [RoboARCade auto-improve results](https://roboarcade.org/auto-improve)
- [An Unexpected Robot Policy: Early Evaluations of GPT-6 Astra on RoboDojo and Beyond](https://arxiv.org/abs/2609.24170)
- [RoboDojo GPT-6 Astra study, full paper](https://arxiv.org/html/2609.24170v1)
- [VIA: Visual Interface Agent for Robot Control](https://arxiv.org/abs/2607.11119)

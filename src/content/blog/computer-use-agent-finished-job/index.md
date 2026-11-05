---
title: "How to tell whether a computer-use agent finished the job"
description: "GPT-6.1 Terra renews the case for evaluating computer agents by saved outcomes, recoverable mistakes and human effort, rather than convincing screen narration."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["AI agents", "Evaluation", "Benchmarks"]
faq:
  - q: "Does a correct-looking screen prove a task is complete?"
    a: "No. Completion should be checked against the saved state or other durable artifact the user requested."
  - q: "Does this article rank GPT-6.1 Terra?"
    a: "No. It uses current documentation as context and proposes a task-level evaluation; it contains no new comparative model tests."
  - q: "Should retries count as success?"
    a: "They can, within a declared budget. Report first-attempt success, eventual success, resource use and human intervention separately."
---

A computer-use agent has finished the job when the requested change exists in the right place and satisfies the user's constraints. A plausible sequence of clicks, a confident final message and a neat screenshot are supporting evidence. They are not the outcome itself.

OpenAI's current [GPT-6.1 Terra model card](https://developers.openai.com/api/docs/models/gpt-6.1-terra) lists visual reasoning and computer use among its intended strengths; it lists computer-use support through the Responses API. Those statements establish a documented capability surface, not a task-specific success rate. They make the evaluation question timely without answering it.

This article proposes a practical rubric for judging multi-step computer work. AGI Tracker has not tested Terra against other models, and the examples below are hypothetical. The central recommendation is to inspect durable task outcomes while accounting for the mistakes and human work required to obtain them.

## The last screen is a weak judge

Imagine asking an agent to move a customer's renewal date, attach an approved document and leave all other records unchanged. The screen might show the correct date before the save operation has completed. The document could be attached to the wrong customer. A success banner could refer to an earlier action. A final screenshot cannot resolve all those possibilities.

The evaluator needs an outcome contract before the agent starts. It should name the target record, the requested fields, the permitted changes and the evidence required at the end. The contract can be expressed in ordinary language, but the checks should refer to observable state wherever possible.

For this hypothetical renewal task, success would require the correct stored date and attachment on the correct customer. The evaluator would also inspect relevant neighboring fields for unintended changes. A partial outcome should be recorded as partial rather than promoted to complete because most clicks were appropriate.

The original [OSWorld benchmark](https://arxiv.org/abs/2404.07972) uses execution-based checks in real computer environments. That is useful methodological background: evaluating what happened to the environment is a different activity from grading how persuasive the agent's account sounds. Its historical scores should not be treated as current Terra results.

## Split the job into perception, action and verification

Computer use combines several abilities that can fail independently. The agent must understand the current state, choose a valid action and determine whether the action had the intended effect. A single final score can conceal which of these is limiting performance.

Suppose the agent clicks the wrong row because two customer names are visually similar. That is primarily a grounding failure. Suppose it selects the correct row but chooses a workflow that changes the wrong field. That is a planning or application-knowledge failure. Suppose it changes the correct field but overlooks an unsaved warning. That is a verification failure.

The distinctions matter for improving the system. Better image interpretation might not repair a flawed save-and-check routine. More reasoning time might not resolve a low-resolution screenshot. A successful benchmark should produce information about these failure modes, not merely an ordering of model names.

[AgentBench](https://arxiv.org/abs/2308.03688) provides a complementary precedent for assessing agents across interactive environments. The transferable lesson is to evaluate decisions in a sequence with feedback. A model can know how an application should work and still fail when the actual state differs from its expectation.

## A proposed outcome rubric

The following rubric is our proposal, not an official OpenAI evaluation or a description of a benchmark run. It separates the final result from the route taken to obtain it.

| Dimension | Evidence to inspect | How to avoid an inflated score |
| --- | --- | --- |
| Completion | Saved record, exported file or other requested artifact | Do not rely only on the agent's final message |
| Constraint adherence | Relevant unchanged state and permission boundaries | Check for collateral changes as well as target changes |
| Recovery | Trace from error to repaired state | Count retries and preserve the initial failure |
| Human effort | Assistance supplied after the task began | Distinguish routine sign-in from giving the solution |
| Efficiency | Elapsed time and all attempts within budget | Include abandoned attempts and verification work |
| Honest reporting | Final claim compared with actual outcome | Penalize claiming completion when the result is uncertain |

The first two dimensions define whether the job was done correctly. The others describe how usable the system is in practice. It is possible to complete a task correctly while imposing too much supervision, just as it is possible to finish quickly while violating a constraint.

Do not combine these dimensions into an opaque weighted score by default. A team can choose weights for a particular workflow, but should also publish the components. Otherwise, a high speed score might compensate mathematically for a serious correctness problem that no user would accept.

## Preserve both first-attempt and eventual success

Retries are neither automatically illegitimate nor automatically free. People recover from mistakes too. The important question is whether the system can recover within a declared budget without creating unacceptable side effects.

A comparison should report first-attempt success and eventual success separately. The first captures reliability on a fresh task. The second captures the value of persistence under the specified retry policy. If one agent gets several attempts and another gets one, their reported success rates answer different questions.

Use paired task instances where possible. Each system should receive the same initial state and outcome contract, with equivalent access. Reset the environment between independent attempts. Preserve a trace of every attempt rather than showing only the successful final trajectory.

The [HumanEval research paper](https://arxiv.org/abs/2107.03374) is older coding-evaluation background in which repeated sampling changes the interpretation of success. The analogous issue for computer work is not a particular formula; it is that additional chances consume resources and alter the question being measured.

A useful result might say that one system succeeds more often on the first try, while another catches up after recovery. That is a real distinction for a user choosing between unattended overnight work and a short interactive session. Flattening it into a single best-agent claim loses information.

## Human intervention needs a taxonomy

A human entering credentials is different from a human identifying the correct customer after the agent becomes confused. The first may be a normal access prerequisite. The second supplies task-solving information. Both should appear in the record, but they should not be treated as the same event.

For the proposed rubric, assistance would have four categories: access setup, clarification of an ambiguous request, correction of an agent mistake and direct execution of a task step. Record when each occurred and what information it supplied. Then report success with and without task-solving assistance.

This prevents two misleading interpretations. A useful system should not be dismissed merely because it cannot complete a sign-in reserved for the user. Conversely, a heavily guided system should not receive full autonomous credit because a human typed only a few words that happened to contain the key insight.

The task contract should also specify when the agent is expected to ask a question. If the requested customer cannot be uniquely identified, asking for clarification can be the correct action. An evaluation that always rewards guessing would encourage a behavior users may reasonably reject.

This is a measurement design choice, not a claim about a particular model's behavior. Different workflows need different policies, but the policy must be visible before the result is interpreted.

## Check the artifact from outside the agent's own narrative

The most convincing final check is independent of the path the agent used. For a spreadsheet task, inspect the saved workbook's relevant values and formulas. For a document task, inspect the actual output file. For a record-update task, read the stored fields through a separate view or controlled state inspection where available.

An evaluator should be careful not to give the tested agent a privileged shortcut that changes the task being assessed. If the claim concerns screen-based interaction, a hidden database write would not establish that capability. At the same time, the evaluator can use privileged inspection to determine whether the result is correct, provided that inspection is not available as an undisclosed aid during execution.

For outputs requiring judgment, combine deterministic checks with blinded human review. A report may contain all requested sections while misrepresenting the supplied data. A saved chart may be technically valid while conveying the wrong comparison. The evaluation should identify which dimensions require expert judgment and how disagreements are resolved.

[Research on LLM judges](https://arxiv.org/abs/2306.05685) documents biases such as sensitivity to position and verbosity. A second model's approval can help triage outputs, but should not silently become the only authority on substantive correctness. Agreement between two agents is not an independent inspection of the saved state.

## Test the boring failures that dominate real work

A polished demonstration often follows a clean path. Practical work includes slow loading, stale dialogs, duplicate names and interrupted operations. A useful test set should include these conditions intentionally, with a clear explanation of how they were introduced.

For example, create two otherwise identical tasks, but insert a delay before the confirmation appears in one of them. Does the agent wait, verify and continue, or repeat an operation that should occur once? This proposed paired test isolates a recovery decision more effectively than collecting unrelated failures from a broad task set.

Another useful pair changes a label or window layout while preserving the underlying task. The question is whether the system understands the requested operation or depends on a familiar visual pattern. A third pair introduces a genuinely ambiguous target and checks whether the agent requests the missing information.

These tests should remain distinct from adversarial security evaluations. Their purpose is to assess ordinary reliability under controlled variation. If a test introduces untrusted instructions or attempts to redirect the agent, label that additional dimension rather than folding it into a generic error rate.

[HELM's multi-metric approach](https://arxiv.org/abs/2211.09110) is relevant here because reliability, efficiency and robustness need not improve together. Reporting the profile lets users decide which tradeoffs matter to their application.

## A worked example: the renewal record

Return to the hypothetical renewal task. Before execution, the evaluator creates a fixture containing two similarly named customers, one existing attachment and a renewal field with a known value. The requested change names a unique customer identifier, a new date and the approved document. The agent sees the same application surface a user would see; the evaluator retains a separate snapshot for later checking.

There are several ways to score the result. If the correct date is entered but not saved, completion fails. If the date is saved on the other customer, completion fails and an unintended-change event is recorded. If the correct record is updated but the old attachment is silently deleted, the target action succeeded while the preservation constraint failed. Those distinctions should survive into the published results.

Now introduce a recovery variant. The attachment upload times out after the date update has already succeeded. The correct response is not necessarily to restart the entire task. Repeating a completed step may be harmless for a date field but risky for an operation that creates a new record or sends a notification. A capable agent should inspect the current state before deciding which part to retry.

The evaluator can record the number of state checks, repeated actions and human corrections. These observations explain the final result without rewarding arbitrary verbosity in the agent's reasoning. They also help identify whether a better verification routine would matter more than a stronger visual model.

Finally, ask the agent to report what it completed. A truthful partial report can be useful even when the task failed: the date was saved, the attachment was not, and no further changes were made. A confident claim that everything succeeded is a separate failure. Keeping reporting accuracy separate from execution success encourages systems that remain useful when the application behaves unexpectedly.

This single example produces a richer account of capability than a gallery of successful screenshots. It tests target identification, persistence, partial-state recovery, preservation of existing information and accurate communication. All of those are part of finishing a real job.

## The unit of progress is a dependable completed task

Terra's documented specialization is an invitation to measure more carefully, not a reason to declare computer work solved. The useful question is whether a particular agent configuration can complete a specified family of tasks, under stated conditions, with an acceptable amount of supervision.

That configuration includes the model, the tools, the instructions and the verification routine. If any of these changes, the system being evaluated has changed. A result should name the complete setup and date the model documentation used, particularly when an alias may evolve.

For practical context, [our guide to agentic workflows](/blog/agentic-workflows/) explains how action and feedback form a working loop. [Our account of METR's time horizons](/blog/metr-time-horizons-2026/) examines a different way to measure task difficulty and why its denominator matters.

The most meaningful agent progress will be visible in records users can trust: the right change saved, the wrong change avoided, errors repaired and uncertainty reported accurately. Counting those outcomes makes computer-use coverage more definitive than counting impressive clicks.

## Sources

- [GPT-6.1 Terra official model documentation, checked November 5, 2026](https://developers.openai.com/api/docs/models/gpt-6.1-terra)
- [OSWorld: execution-based computer-use evaluation](https://arxiv.org/abs/2404.07972)
- [AgentBench: interactive agent evaluation](https://arxiv.org/abs/2308.03688)
- [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374)
- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)

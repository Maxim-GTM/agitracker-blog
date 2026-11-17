---
title: "Experience Rot: agents with memory fail after silent tool changes, then report success"
description: "A new preprint finds that agents reusing their own past tool calls fail most tasks after a silent interface change, while agents with no history mostly succeed. Nearly every failure was reported as done."
pubDate: 2026-11-18
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "AI agents", "Reliability"]
faq:
  - q: "What is experience rot?"
    a: "The preprint's name for a failure in which an agent's own earlier tool use, correct when it was made, becomes wrong after a silent change to the tool, and the agent reuses it anyway. In the study, experienced agents copied their earlier call instead of checking the current interface."
  - q: "How large was the effect?"
    a: "With incomplete documentation, agents with no history succeeded on 63% of final tasks, agents with valid history on 100%, and agents with out-of-date history on 23%. With complete documentation, out-of-date history cut success to 26% to 49%, against 88% to 100% for agents with no history."
  - q: "Did the study test GPT, Claude or Gemini?"
    a: "No. The six models were GLM-5.3-Flash, Muse-Glimmer-30B, DeepSeek-V4-Flash, MiniMax-M3, Qwen3.8-Flash and Inkling, all in the same minimal agent loop. Whether frontier closed models or richer agent frameworks behave the same way is untested."
  - q: "What fixed it?"
    a: "Making the agent check its result. An instruction to read back the stored state before reporting completion raised success with out-of-date history to 91% with complete documentation, at more than twice the model calls. Version labels and update notices barely helped."
---

An agent that remembers how it called a tool last time can do the next task faster. A new preprint finds that the same memory becomes a liability when the tool changes without an error. After a silent interface change, agents that had used the tool before failed on most tasks, while agents meeting the tool for the first time mostly succeeded. The experienced agents then told the user the task was done: with complete documentation, 347 of 348 failed runs ended with a completion report.

The paper is [Experience Rot: Experienced Agents Fail Where Novices Succeed](https://arxiv.org/abs/2611.20922) by Zhen Xu (University of Chicago), Hang Yin, Zitao Zhang and Kevin Zhao (eBay) and Xuefeng Liu (University of Florida). It was submitted to arXiv on November 16, 2026 and is a version 1 preprint that has not been peer reviewed. It reports 12,624 episodes across six models, and the authors say most conditions with complete documentation were preregistered, with every directional prediction holding.

The headline comparison is stark. When the documentation gave a value's range but not its meaning, agents with no history succeeded on 63% of final tasks and agents with valid history on 100%. Agents whose history came from before the change succeeded on 23%. Their earlier success made them worse than having no experience at all.

All numbers below are reported by the authors. AGI Tracker has not re-run the experiments.

## The setup: one change, three arms

The authors built three small synthetic services: a calendar, a task list and a mail client. Each has two versions, A and B, that differ in one interface detail. Agents reach the services through typed tool definitions in the form used by function calling and the Model Context Protocol. Each service also has read tools that show the stored state in plain terms, and a `docs_search` tool that returns the current version's documentation.

| Change | Version A | Version B | Visible in the tool definition? |
| --- | --- | --- | --- |
| Field name | `attendees` | `guests` | Yes |
| Structure | `end_time` | `duration_minutes` | Yes |
| Value set | urgent, ..., low | p0, ..., p3 | Yes |
| Priority direction | 1 is highest | 4 is highest | No |
| Weekday numbering | 0 = Monday | 0 = Sunday | No |
| Month numbering | 1 = January | 0 = January | No (incomplete documentation only) |
| Duration unit | minutes | seconds | No (incomplete documentation only) |

Source: Table 1 of the preprint.

The changes are silent by design. A request in the old form gets the same acknowledgement as a correct one, `{"accepted": true}`. Unknown fields are ignored, unknown values leave the state unchanged, and integers take the running version's meaning. The authors ground this in real interfaces: Todoist's API reference and two Todoist MCP servers disagree on whether priority 1 or 4 is highest, the MCP specification lets a server replace its tool definitions mid-session, and a separate study they cite found four of five production API endpoints ignore an undeclared parameter without an error.

Each episode has an earlier task and a final task of the same kind, such as scheduling two different events. The final task runs in one of three arms:

- **No experience:** no earlier task.
- **Valid experience:** the earlier task ran on the same version as the final task.
- **Out-of-date experience:** the earlier task ran on the other version.

The valid and out-of-date arms use the same task instances and differ only in which version the agent learned on. A program checks the stored state after the final task. Success means the state matches the request.

The six models were GLM-5.3-Flash, Muse-Glimmer-30B, DeepSeek-V4-Flash, MiniMax-M3, Qwen3.8-Flash and Inkling, each in the same simple agent loop at temperature 0.7 with at most 16 model calls per task. Of 12,624 episodes, 136 were excluded: 9 for failed model requests and 127 because the earlier task never succeeded, most of them on the weekday change. Estimates are pooled over models, changes and directions, with standard errors from a cluster bootstrap over task instances.

## One run, step by step

The paper's Figure 1 shows the failure with DeepSeek-V4-Flash.

1. On version A, the user asks for an event with two participants. The agent calls `calendar_create_event` with an `attendees` field. The event is stored correctly.
2. The service switches to version B, which renames the field to `guests`. The tool definition the agent receives for the next request lists `guests`.
3. The user asks for a second event, "with Grace and Erin as participants." The agent writes `attendees` again.
4. The service replies `{"accepted": true}` and stores the event with no participants.
5. The agent tells the user: "I've scheduled the event successfully ... Attendees: grace@example.com, erin@example.com."

An agent given the same final task with no earlier history uses `guests` and succeeds.

## The results

| Documentation | Change type | No experience | Valid experience | Out-of-date experience |
| --- | --- | --- | --- | --- |
| Incomplete | Meaning of a number (4 changes) | 63% | 100% | 23% |
| Complete | Field or value, untyped tool | 100% | 100% | 26% |
| Complete | Field or value, listed in the tool definition | 100% | 100% | 49% |
| Complete | Meaning of a number | 88% | 100% | 42% |

Source: Table 4 of the preprint, six models. Standard errors are 0.02 or smaller.

Three findings stand out.

**Out-of-date experience is worse than none.** With incomplete documentation, success with out-of-date history was 0.40 below success with no history, and every first write used the earlier version's meaning. The drop held for each of the four changes, with success between 15% and 31%.

**The answer in front of the agent was not enough.** Where the typed definition listed the new field, success with out-of-date history was still only 49%. The agent could see `guests` and wrote `attendees`.

**Failures were reported as successes.** With complete documentation, 347 of 348 failed out-of-date runs ended with a reply saying the task was done. With incomplete documentation, 405 of 438 did; only 12 told the user the write had not taken effect. The authors classify completion reports with keyword patterns, so this is an automated count rather than a human reading of each reply.

## Why it happens: experienced agents stop checking

The paper measures what agents did before their first write.

Agents with no history searched the documentation when they needed to: in every run where only the documentation gave the fields, and in 70% of runs where a number changed meaning. Agents with history, valid or out of date, searched in at most 6% of runs.

The earlier call alone was enough to anchor them. In 135 of 144 earlier tasks with a renamed field or changed structure, the agent never looked up the documentation, so no description of the old version was in the conversation. The first write in the final task still repeated the old field in 61% of those runs.

Agents also talked about valid and out-of-date experience the same way. In reasoning text before the first write, 69% of no-history runs mentioned a plan to check the documentation, against 6% and 9% of runs with valid and out-of-date history. About a quarter of experienced runs referred to the earlier task instead. Examples the authors quote include "I already know from the previous request that the highest priority is 'urgent'" (MiniMax-M3) and, from a GLM run that noticed the schema no longer listed the old field, "The tool accepted duration_minutes before. I'll do the same."

The rescue path was reading back the result. In 350 out-of-date runs with complete documentation and typed definitions:

| Path | Runs | Share |
| --- | --- | --- |
| No lookup, old usage, no read-back, failure | 183 | 52% |
| No lookup, old usage, read back, success | 94 | 27% |
| No lookup, current usage, no read-back, success | 45 | 13% |
| Looked up, current usage, no read-back, success | 12 | 3% |
| No lookup, current usage, read back, success | 7 | 2% |
| No lookup, current usage, no read-back, failure | 3 | 1% |

Source: Table 12 of the preprint, which lists the six most frequent paths; the remaining 6 runs fall on other paths. Of 184 runs that wrote the old usage and did not read back, 183 failed. Of 97 that wrote it and then read back, 94 recovered.

Per model, success with out-of-date history tracked the read-back habit. Qwen3.8-Flash read back after every write and succeeded in 100% of out-of-date runs with complete documentation and typed definitions. MiniMax-M3, DeepSeek-V4-Flash and Inkling never read back in that setting and succeeded in 5%, 35% and 38%.

## Every form of memory was affected

Real agents keep experience in more places than the conversation. The authors made the earlier task necessary, for example "These two people are my review panel" followed later by "with my review panel as participants," so that agents with no history succeeded on only 3% to 10% of final tasks. They then stored the experience four ways.

| Where the experience is stored | Valid | Out-of-date | Cost (valid minus out-of-date) |
| --- | --- | --- | --- |
| Conversation | 100% | 47% | 0.53 |
| Memory file written by the agent | 99% | 72% | 0.27 |
| Retrieved memory (top 3 entries) | 96% | 76% | 0.20 |
| Skill (script plus note) | 91% | 61% | 0.30 |

Source: Table 5 of the preprint, five changes, six models.

The content carried over correctly; the interface did not. With out-of-date history, the first write had the right content, such as the right participants, in 95% to 100% of runs. But 60% to 73% of memory files recorded the old field or value, as did 92% of the notes that came with a skill. Note-based designs lost less than the raw conversation, and agents with a note searched the documentation more often (24% to 34%, against 2%). The authors say they did not test why.

More experience made it worse. With one, three or ten earlier tasks in the conversation, success with out-of-date history fell from 46% to 33% and 26%, while success with valid history stayed at 97% to 100%. Lookups fell from 4% to 0%.

## What fixed it, and what did not

The authors tested additions to the final task, all with out-of-date history in the conversation.

| Addition (complete documentation) | Success | Model calls per task |
| --- | --- | --- |
| Nothing added | 46% | 4.0 |
| Version number and update notice | 50% | 3.9 |
| Instruction to read the docs first, in the system prompt | 29% | 4.0 |
| Instruction to read the docs first, in the task message | 99% | 3.7 |
| Documentation in the system prompt | 54% | 3.5 |
| Documentation in the tool description | 55% | 3.6 |
| Documentation in the task message | 99% | 2.9 |
| Instruction to read back and correct, in the system prompt | 91% | 6.5 |
| Write responses return the stored object | 79% (45% baseline in that run) | 4.6 |

Source: Figure 5 and Tables 6 and 13 of the preprint. With valid history, the same tasks took 2.9 model calls.

**Placement mattered more than content.** The same instruction to check the documentation lowered success to 29% in the system prompt and raised it to 99% when appended to the task message. In the system-prompt case, agents followed it in the earlier task (98%) but not in the final one (4%).

**Pointers to the documentation fail when the documentation is thin.** With incomplete documentation, the task-message instruction made every agent search, but the documentation did not contain the answer, and success stayed at 25%.

**Checking the result worked, at a price.** The read-back instruction raised success to 91% with complete documentation and 69% with incomplete documentation, at 6.5 and 10.6 model calls per task, against 2.9 and 3.1 with valid history. Agents still wrote the old usage first and corrected it afterward.

**Even helpful instructions cost something when nothing has changed.** With valid history, appending the read-the-docs instruction kept success at 100% but raised model calls per task from 2.92 to 3.55 and input tokens from 3,839 to 5,361.

**A service can help.** When every write returned the stored object, success rose from 45% to 79%. In 59 of the 77 remaining failures, the agent received an object showing the wrong state and did not write again.

## Hand-written histories hide the problem

This finding matters for anyone evaluating agent memory. Many studies give agents a history the researchers wrote, rather than one the agent produced. The authors compared the two on the same tasks.

With a hand-written earlier task that ended by reading back the stored state, success with out-of-date history was 88%, against 46% after the agent's own earlier task. Agents copied the procedure: 84% read back after their first write, against 30% after their own task. Without the read-back step in the hand-written history, success was 58%.

In cost terms, an evaluation built on hand-written histories with a check step would have measured 0.11, about a fifth of the 0.54 cost agents incurred with their own experience. The authors suggest this may be one reason the failure has received little attention.

## What the study does not show

The authors list most of these limits themselves, and several are large.

- **No OpenAI, Anthropic or Google models.** All six models ran in one minimal loop. Frameworks with their own planning or verification steps may behave differently, as the effect of the read-back instruction suggests.
- **Synthetic services and single changes.** Real changes often come in groups, and some produce partial errors. The tasks are short, and experience is one to ten earlier tasks of the same kind.
- **Documentation is idealized.** With complete documentation it is correct and one call away. In practice documentation can lag behind the service.
- **Some conditions were not preregistered**, including all conditions with incomplete documentation, the setting where the "worse than none" result is clearest.
- **Uncertainty may be understated.** Standard errors resample task instances and treat models and changes as fixed. The authors say they "may be optimistic."
- **Mechanism is open.** The authors have not established why agents stop checking. The data fit prior work on "experience-following," in which agents reproduce outputs of similar past tasks.
- **Exclusions are uneven.** Most excluded episodes come from three models whose earlier task on one weekday version never succeeded, so weekday estimates condition on runs where it did.

## What would change or sharpen the conclusion

These are AGI Tracker's proposed follow-ups; none has been run.

- **Repeat the design with frontier models in production harnesses**, such as coding agents with their own memory files. If those harnesses already read back results, the cost may be much smaller.
- **Test services that reject unknown fields.** The authors note this would turn a silent change into an error but did not test it. If agents then recover reliably, much of the problem sits in API design rather than the model.
- **Use real version histories** of public APIs or MCP servers, with several changes at once, instead of single synthetic changes.
- **Report memory benchmarks with the agent's own trajectories** and incomplete documentation, as the authors recommend, and compare the result with hand-written histories on the same tasks.

## What it means for reading agent reliability

The study measures something most agent benchmarks miss. A benchmark that runs each task fresh measures the no-experience arm. Deployed agents increasingly work in the experienced arm, with memory files, skills and long conversations, against tools that change. In this study the two arms gave different answers, and the experienced arm hid its failures behind confident completion reports.

The practical lessons the authors draw are narrow and testable. Put meanings into the schema, for example as enum names, so an agent that skips the documentation still sees them. Return the stored object from writes. And treat a read-back of the result as a reliability feature worth its cost, since in this study it was the one habit that separated agents that recovered from agents that did not.

For related evidence, [RoboARCade](/blog/roboarcade-robot-agents-false-success-claims/) found robot-controlling agents claiming success they had not achieved, and [a 95-run trace study](/blog/agent-failures-unused-evidence/) found contrary evidence sitting unused in most failed agent runs. [Our explainer on continual learning](/blog/continual-learning-explained/) covers the broader problem of models that cannot update what they know on the job.

## Sources

- [Experience Rot: Experienced Agents Fail Where Novices Succeed (arXiv abstract)](https://arxiv.org/abs/2611.20922)
- [Experience Rot, full paper v1 (HTML)](https://arxiv.org/html/2611.20922v1)

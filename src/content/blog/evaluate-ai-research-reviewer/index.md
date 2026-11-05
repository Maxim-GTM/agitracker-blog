---
title: "How do you evaluate an AI that reviews research?"
description: "Deep Review makes automated technical feedback more accessible. Its value should be measured by valid corrections, missed errors and the work imposed on authors."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "AI for science", "Research"]
faq:
  - q: "Were PAT pilot reports used to accept or reject conference papers?"
    a: "The cited pilots provided optional author feedback separately from official peer review decisions."
  - q: "Does author satisfaction measure error-detection accuracy?"
    a: "No. It measures reported usefulness or experience among respondents, with a different denominator from adjudicated correctness."
  - q: "What should an AI-review benchmark count?"
    a: "Valid distinct issues, false alarms, missed known errors, severity, verification effort and any changes the feedback causes."
---

An AI research reviewer should be judged by the corrections it helps establish, not by how many objections it can generate. A long report can be useful, overwhelming or wrong. The evaluation needs to distinguish those outcomes before calling automated review a scientific advance.

Google's October 14 [Deep Review launch](https://research.google/blog/analyzing-technical-documents-with-deep-review/) expands a tool previously piloted as the Paper Assistant Tool. The [PAT paper](https://arxiv.org/html/2606.28277v1) separates author assistance from formal review decisions and describes an error-detection case study on a selected mathematics and computer-science subset. Those are narrower forms of evidence than universal peer-review accuracy.

AGI Tracker has not submitted manuscripts to the tool or independently graded its reports. The framework below is a proposed evaluation protocol. Its central claim is that automated review becomes valuable when a valid issue costs less to establish and repair than it would without the tool.

## A review report is a set of testable claims

A useful critique says what is wrong, where it is wrong and why the error matters. It may identify an unsupported inference, a flawed proof step or an experiment that cannot distinguish the proposed explanation from an alternative. Each objection is itself a claim requiring evidence.

An evaluation should therefore begin at the issue level. Split the report into distinct substantive claims, deduplicate repeated objections and preserve the supporting references. Do not count three paraphrases of one problem as three discoveries. Do not treat a stylistic preference as equivalent to an invalid theorem.

This makes the review easier to grade and more useful to authors. A precise issue can be accepted, rejected or investigated. A vague warning that more experiments are needed may be reasonable advice, but it is harder to count as a demonstrated error without specifying what conclusion remains unsupported.

The [ICML pilot retrospective](https://blog.icml.cc/2026/03/30/retrospective-on-pat-x-icml-2026-ai-paper-assistant-program/) is useful primary context for how authors encountered the tool. The experience of receiving feedback and the correctness of every feedback item are different measurements, and should remain different in coverage.

## Recall is not the same as precision

Recall asks how many real errors the reviewer finds. Precision asks how many of its reported errors are valid. A tool can improve recall by producing more candidates while also creating more false alarms. The practical value depends on both.

Consider a hypothetical manuscript containing two known substantive errors. Reviewer A finds both and adds eight incorrect objections. Reviewer B finds one and adds no false objections. A simple count of discovered errors favors A, but an author with limited time may find B easier to use. Neither observation alone supplies a universal winner.

The proposed evaluation should publish valid issues, false issues and known missed issues separately. It should also classify severity. Finding a decisive flaw is different from finding a typo, even when both count as one item. The classification should be assigned by adjudicators under a written rubric, not inferred from the reviewer's confident language.

The PAT paper's filtered case study should be read with its selected error types and grading procedure in view. A result on known equation and proof errors does not directly measure false alarms on an arbitrary clean manuscript. That is a different test population requiring its own evidence.

## The denominator can quietly change the story

There are several plausible units for a research-review result: papers, known errors, proposed issues, authors or survey respondents. They answer different questions. A paper containing several errors contributes differently to paper-level and error-level recall.

A survey of authors who opted into a tool also has a distinct denominator. It can reveal whether respondents found the experience useful. It does not directly establish how accurately the tool reviews all papers, including those whose authors did not respond or chose not to participate.

The [NeurIPS author-support announcement](https://blog.neurips.cc/2026/04/21/neurips-supports-authors-with-googles-paper-assistant-tool-pat/) documents a pre-submission assistance setting. That context matters because authors can privately investigate or ignore suggestions. It is not the same intervention as supplying an automated recommendation to an acceptance committee.

A definitive report would place the denominator beside each number. If the evaluation changes from papers to issues or from all users to respondents, make that transition explicit. A large deployment count can establish adoption without supplying a complete estimate of review quality.

## A proposed review scorecard

The following is our suggested protocol, not a published score for Deep Review. Its components are intended to reflect what a reader or author would need to know.

| Component | Proposed measurement | Why it belongs in the report |
| --- | --- | --- |
| Error recall | Known errors correctly identified | Shows omissions on the tested population |
| Issue precision | Valid distinct issues divided by adjudicated substantive issues | Shows the false-alarm burden |
| Severity | Consequence of each valid issue | Separates fatal flaws from minor corrections |
| Grounding | Correctness of cited evidence and manuscript location | Makes objections inspectable |
| Verification effort | Time to accept, reject or resolve an issue | Captures work shifted to humans |
| Revision value | Independently judged improvement after feedback | Connects critique to a better artifact |

Do not collapse the table into one score without explaining the weighting. A conference organizer and a private author may value different tradeoffs. A tool that generates useful suggestions for optional revision could still be unsuitable as an unreviewed gatekeeper.

The scorecard also makes a negative result useful. A tool may identify many genuine problems but require an expensive expert to verify them. That is a different limitation from failing to find the problems at all, and suggests a different engineering response.

## Build an evaluation set that can reveal false alarms

A collection of papers with known mistakes is valuable for measuring detection. It is less informative about the rate of unfounded objections unless the entire output is adjudicated. The tool may find the known error while also producing several incorrect criticisms.

A proposed test set should include manuscripts with known errors, corrected versions and papers subjected to substantial expert checking. The last category should be labeled carefully: no finite expert review can certify that a complex paper is entirely error-free. It can still provide a useful setting for studying false objections.

Keep corrected and original versions in separate evaluation partitions where appropriate. A reviewer that flags the same issue after it has been repaired may be reacting to a familiar surface pattern rather than checking the argument. Conversely, a correct reviewer might discover a different error in the revised version, which requires independent adjudication.

[Datasheets for Datasets](https://arxiv.org/abs/1803.09010) provides background for documenting how such a benchmark is assembled. The provenance of the errors matters: deliberately inserted simple mistakes may be easier to find than the organic failures that survive an author's own checking.

## A worked example: a missing assumption

Imagine a manuscript claiming that an algorithm converges for every input in a stated class. One proof step actually requires a boundedness assumption that the paper never states. This is a fictional example for the proposed rubric.

A strong AI critique would identify the exact step, explain why the assumption is needed and ideally supply a counterexample or a corrected statement. A weak critique might vaguely demand more rigor. An incorrect critique might object to a theorem that already includes the necessary assumption in an earlier definition.

The evaluator should ask whether the critique addresses the manuscript as a whole. A local passage can look wrong if the reviewer misses a global definition. That is why grounding needs both a location and an account of the relevant context. A citation to the right page is not enough if the interpretation is mistaken.

After the author revises the paper, a separate reviewer should inspect the result. Did the change repair the proof, merely weaken the claim or introduce a new inconsistency elsewhere? The tool's value lies partly in helping produce a sound revision, not only in making the original problem visible.

This example also shows why a reviewer's confidence needs calibration. A possible missing assumption should be labeled as a question when the evidence is incomplete. The evaluator should reward that distinction rather than encourage every tentative concern to become an accusation of invalidity.

## The reviewer needs its own independent judge

Using another language model to grade the report can make evaluation scalable, but it introduces another system whose reliability must be assessed. If the grader shares the reviewer's misunderstanding, agreement may look like validation while preserving the same error.

[The MT-Bench and Chatbot Arena judging paper](https://arxiv.org/abs/2306.05685) documents biases in model-based judging. It is background for the need to test the grader, not evidence about Deep Review's exact error rate. A research-review benchmark should describe its own adjudication process and any human audit.

A proposed design would blind adjudicators to the review system's identity and randomize issue order. Where a claim requires domain expertise, route it to an appropriate expert. Record unresolved cases instead of forcing every disagreement into true or false through an opaque majority vote.

For mathematical claims, a counterexample or checkable proof can sometimes settle the issue more decisively than preference judgments. For empirical claims, a reproduction or corrected analysis may be needed. The adjudication method should match the type of objection.

## Usefulness is an outcome after reading the report

A review can be accurate but hard to act on. It can also be friendly and readable while failing to identify the central problem. Evaluation should therefore separate correctness from usability and examine what happens when authors receive the feedback.

A proposed study would compare revision with and without the tool under a fixed time budget. Independent reviewers would assess the revised manuscripts without knowing which assistance was used. Record the time authors spend rejecting false alarms as well as the time spent making valid corrections.

The outcome should not be acceptance at a conference alone. Acceptance depends on novelty, fit, reviewer judgment and competition, not simply technical correctness. A better manuscript may still be rejected, while a technically flawed one may be accepted. The evaluation needs outcomes closer to the contribution being claimed.

A useful intervention might improve clarity, expose an invalid assumption or motivate an informative experiment. Those are distinct benefits. Report them separately so that a tool's strongest demonstrated use does not become a claim that it can replace the entire review process.

## More generated feedback can move the bottleneck

If a tool makes critique cheap, authors may receive more objections than they can verify. The scarce resource becomes expert attention to the report itself. That is why verification effort belongs in the evaluation rather than appearing only as an anecdotal complaint.

A proposed result would report the time required per valid resolved issue, with uncertainty and task type. It would also examine whether a concise prioritized report performs better than an exhaustive list. The optimal amount of feedback may depend on how reliably the system can rank severity.

This does not mean that rare, difficult discoveries should be discounted because they take time to verify. A decisive correction can justify substantial effort. The report should show both the importance of the issue and the burden of establishing it, so readers can judge the tradeoff.

The strongest system may be one that knows when it has a demonstrable error, when it has a plausible concern and when it has only a suggestion. Those labels make an AI reviewer easier to use as a scientific instrument.

## What would make the next result decisive?

A convincing study would pair issue-level accuracy with evidence that the feedback improves manuscripts under realistic constraints. It would disclose the test population, grading procedure, unresolved cases and human work. It would also test papers outside the system's most familiar subject areas without pretending those results share one universal difficulty scale.

[Our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) explains the broader evidence chain. [Our discussion of hallucination-related sanctions](/blog/ai-hallucination-sanctions-rising/) examines why generated confidence is a poor substitute for checking source material.

Deep Review makes the validation bottleneck an increasingly concrete research problem. The definitive standard is not an impressive volume of feedback. It is a verified correction, a clearly reported omission and a better document at the end of the process.

## Sources

- [Google Research: Deep Review launch](https://research.google/blog/analyzing-technical-documents-with-deep-review/)
- [Towards Automating Scientific Review with PAT](https://arxiv.org/html/2606.28277v1)
- [ICML 2026 PAT retrospective](https://blog.icml.cc/2026/03/30/retrospective-on-pat-x-icml-2026-ai-paper-assistant-program/)
- [NeurIPS author-support pilot announcement](https://blog.neurips.cc/2026/04/21/neurips-supports-authors-with-googles-paper-assistant-tool-pat/)
- [Judging LLM-as-a-Judge](https://arxiv.org/abs/2306.05685)
- [Datasheets for Datasets](https://arxiv.org/abs/1803.09010)

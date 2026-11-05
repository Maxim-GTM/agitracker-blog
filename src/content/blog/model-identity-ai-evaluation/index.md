---
title: "Model identity is becoming an AI evaluation problem"
description: "Provable inference introduces a sharper question for AI evaluations: can a result be tied to the model computation it claims to measure?"
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "Research", "AI safety"]
faq:
  - q: "Can you identify a model reliably from its writing style?"
    a: "No. Behavioral resemblance is not a cryptographic identity check."
  - q: "Does a proof of inference prove an answer is true?"
    a: "No. It addresses execution of a specified computation, within its assumptions. Factual accuracy and task success need separate evidence."
  - q: "Is FlashProve a standard feature of every Claude response?"
    a: "No. Anthropic released it as research progress and a prototype, not as a universal consumer-response guarantee."
---

An AI benchmark can be carefully designed and still leave a basic question unresolved: which model actually answered? A name in a response header identifies what a service says it served. It does not independently establish the computation behind the answer.

Anthropic's November 2 [provable-inference research](https://www.anthropic.com/research/provable-inference) introduces FlashProve, a prototype that connects a model commitment to proofs about inference. The idea is relevant to evaluators because a benchmark result needs both a meaningful test and a trustworthy account of the system that took it.

The important distinction is between proving execution and evaluating competence. A proof can strengthen the identity of the measured computation without making the answer correct, safe or representative. This article examines that distinction and proposes an evaluation record that preserves it. AGI Tracker has not run or independently audited FlashProve.

## A model name is an incomplete experimental identifier

Suppose a researcher evaluates an endpoint on a difficult reasoning dataset. The endpoint's model name remains the same for a month, but the underlying checkpoint, numerical implementation or routing policy changes. A second researcher may reproduce the prompts and still evaluate a meaningfully different system.

This does not require malicious behavior. A service may legitimately update its infrastructure or improve a model behind a stable alias. The problem is that a benchmark result tied only to the alias may be difficult to interpret later. An experimental identifier needs to distinguish the service interface from the system configuration at the time of testing.

The same issue appears when a product selects among models. A reported score might describe the routing policy plus several models rather than the capability of one checkpoint. That can be a useful system evaluation, provided it is named accurately. It becomes misleading when the score is attributed to a single model that did not generate every response.

[Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) established a documentation framework for intended use and evaluation context. A model card and an execution proof would serve different roles: one describes a system and its evidence, while the other can bind a particular computation to a formal statement.

## Why behavioral fingerprints cannot settle the question

Readers often infer model identity from vocabulary, refusal style or characteristic mistakes. Those observations may be useful clues, but they are not conclusive. Two models can produce similar answers, and one model can produce very different answers under different instructions.

A provider could change the system prompt without changing the weights. A fine-tuned derivative could imitate another model's style. A familiar benchmark question could elicit a memorized response. In each case, output resemblance would tell the evaluator less than it first appears to.

There is also a statistical asymmetry. Observing a surprising answer may challenge an identity claim, but observing an expected answer does not prove it. If many models can produce the same sentence, the sentence cannot uniquely identify the generating system. A fingerprinting method needs its own measured error rates and threat assumptions.

The [HELM framework](https://arxiv.org/abs/2211.09110) illustrates why evaluation spans multiple scenarios and metrics. Behavioral evidence belongs in that wider profile. It cannot replace the missing identity evidence merely because the output is high quality.

This matters most when identity is part of the research question. If a study asks whether a particular checkpoint improved on its predecessor, uncertainty about the served checkpoint weakens the inference even if every answer was correctly graded.

## What a proof would establish

The basic structure has three parts. A party commits to the model representation. A prover produces evidence about a specified computation. A verifier checks that evidence under the protocol's assumptions. The useful guarantee depends on exactly what statement was proved and which inputs were bound into it.

The [FlashProve technical report](https://www.anthropic.com/document/flashprove-technical-report) is explicit that the prototype proves an integer model representation; its limitations discuss the relationship to floating-point inference and the scope of formalization. Those qualifications are central to interpretation, not footnotes to discard once the proof verifies.

Consider a hypothetical evaluation request. It contains a prompt, decoding settings and a declared model commitment. A verified proof about that request could strengthen confidence that the checked response matches the specified computation. It would not establish that the prompt was a good test of reasoning or that the answer was scientifically sound.

The distinction resembles the difference between a laboratory instrument's calibration and the validity of an experimental design. A well-calibrated instrument can measure the wrong thing accurately. Likewise, a faithfully executed model can answer a poorly chosen benchmark without telling us much about general competence.

| Question | Evidence that would address it |
| --- | --- |
| Was the checked computation consistent with a commitment? | A valid proof under the stated protocol |
| Who associated that commitment with a named release? | Authenticated release documentation and provenance |
| Were prompts, settings and outputs bound correctly? | The exact public statement and evaluation record |
| Was the answer correct? | A separate task-specific grader or ground truth |
| Does the result generalize? | Held-out tasks and a justified sampling design |
| Was the complete application safe? | Evidence about tools, permissions and surrounding behavior |

The table is an analytical separation of questions, not a claim that FlashProve implements every item. An evaluator should resist converting a narrow verified statement into a universal certificate for the application.

## The commitment itself needs a provenance story

A cryptographic commitment can identify a mathematical object without telling a reader what the object means. If a service labels a commitment as a famous model, the evaluator still needs a trustworthy connection between that label and the committed representation.

For a public release, that connection could include a signed release record, a documented conversion procedure and reproducible construction of the commitment. For a private model, other assurance mechanisms might be needed. The appropriate design depends on who is allowed to inspect which artifacts.

The key point is that proof verification does not remove the need to define the experiment. Which tokenizer is included? Which numerical transformation produced the committed model? What decoding procedure is part of the statement? If some preprocessing or output transformation sits outside the proof boundary, record it separately.

The [FlashProve repository](https://github.com/anthropics/FlashProve) labels the release as a research prototype. That status should shape an evaluator's expectations. Inspectable code is valuable evidence for further work; it is not equivalent to a mature service-level guarantee or an independent audit of every deployed implementation.

A practical evaluation would therefore retain both the cryptographic identifier and the human-readable release provenance. Neither substitutes for the other. Together they can make a result more durable than a screenshot of an endpoint's model name.

## Numerical equivalence is not a decorative detail

A proof system works over an exact statement. Production model execution may use numerical operations whose behavior depends on implementation choices. A researcher has to decide whether the proved representation is the intended object of study or a proxy for another implementation.

This is a scientific design issue. If a benchmark evaluates the integer representation directly, the claim should name that representation. If the goal is to infer something about a floating-point service, the study needs evidence connecting the two, including circumstances in which they may disagree.

[PyTorch's reproducibility documentation](https://docs.pytorch.org/docs/2.15/notes/randomness.html) supplies useful background on why identical-looking configurations need not yield identical numerical outcomes across platforms. The broader lesson is to avoid treating a model's weights as a complete description of all execution behavior.

For a proposed evaluation, run an explicit equivalence study between the served path and the proved path on a held-out request set. Report disagreement as an outcome, not an inconvenience to average away. Include adversarially chosen requests only if the test is designed and labeled for that purpose.

Such a study would not turn approximate agreement into mathematical identity. It would establish an empirical relationship with a sampling boundary. The distinction between the exact proof and the empirical bridge should remain visible in any headline conclusion.

## A proposed identity record for benchmark results

A useful result package would contain the task specification, dataset version, request text, available tools, decoding settings, model commitment, proof statement, verifier version and grading output. It would also preserve any transformation between the raw model output and the answer presented to the grader.

[Datasheets for Datasets](https://arxiv.org/abs/1803.09010) is relevant to the dataset side of that record. An exact model identifier does not compensate for an undocumented test set. If training overlap or sampling changes the meaning of the score, the experiment remains difficult to interpret despite excellent execution evidence.

The identity record should distinguish three failure classes. A proof may fail to verify. A verified computation may produce a wrong answer. A correct answer may be excluded because the request or grader was malformed. These are different outcomes and should not be collapsed into one failure percentage.

It should also distinguish proof availability from proof validity. If only a subset of requests receive proofs, explain how that subset was selected. An evaluator cannot assume the unproved remainder had the same identity properties. A random auditing design would support a different inference from proof generation chosen after seeing the responses.

Finally, the record should include a retention policy for reproducibility artifacts. Future researchers need to know whether the verifier, model representation and request package remain available. A result whose evidence disappears is harder to reassess when the protocol or the model's limitations become better understood.

## Selective proof coverage creates its own sampling problem

Imagine a benchmark with a thousand requests, of which only a hundred have attached proofs. If those hundred were chosen because they were easy to prove, their identity assurance does not automatically describe the rest. If they were chosen randomly before the service saw the questions, they support a different kind of audit. The fraction proved is therefore not enough information by itself.

A proposed study should declare the selection rule, the eligible population and any requests that were excluded. It should say whether proof production happened before grading or after the researchers knew the answers. That timing matters because selective reporting can make an incomplete assurance mechanism look comprehensive without any individual proof being invalid.

There is a related distinction between a failed check and a missing check. A proof that does not verify may indicate a mismatch, malformed data or an implementation problem requiring investigation. An absent proof means the requested evidence was not supplied. Treating both as a generic technical error would hide the very property the evaluation is trying to assess.

The practical overhead also needs a denominator. A proof may be affordable for an occasional independent audit while being too expensive for every low-value request. That is an application tradeoff rather than a reason to dismiss the research. A useful report would state the audit frequency and the assurance claim it supports, instead of implying that one verification mode fits every use case.

Finally, consider a system that uses several model calls to produce one answer. Proving only the final call would not identify the models that selected evidence or supplied intermediate conclusions. An application-level evaluation would need to map the proof coverage to the actual decision process. That map could be incomplete and still useful, provided the report makes the uncovered stages visible. The lesson is that identity assurance must follow the evaluated system's structure, not merely its final text box.

## Capability measurement still does the hard empirical work

Even perfect identity assurance would leave most questions about AI progress open. A model can be faithfully identified and evaluated on a contaminated benchmark. It can pass a narrow test while failing a related task. It can produce a correct answer for the wrong reason, or perform differently when placed inside a tool-using workflow.

That is why provable inference should be understood as an additional measurement instrument. It strengthens one part of the evidence chain. It does not replace task selection, sampling, grading, error analysis or replication. A definitive assessment names which part became more trustworthy and which parts remain empirical questions.

For background, [our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) explains the broader evaluation chain. [Our account of benchmark saturation](/blog/why-benchmarks-saturate/) examines why a high score may stop distinguishing useful capability even when it is measured accurately.

The research is interesting because model identity is becoming technically inspectable rather than purely a service assertion. Its most valuable use in evaluation would be a clearer answer to a narrow question: this result came from this specified computation. What that result says about intelligence still requires a well-designed experiment.

## Sources

- [Anthropic provable-inference research](https://www.anthropic.com/research/provable-inference)
- [FlashProve technical report](https://www.anthropic.com/document/flashprove-technical-report)
- [FlashProve research prototype repository](https://github.com/anthropics/FlashProve)
- [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)
- [PyTorch reproducibility guidance](https://docs.pytorch.org/docs/2.15/notes/randomness.html)
- [Datasheets for Datasets](https://arxiv.org/abs/1803.09010)

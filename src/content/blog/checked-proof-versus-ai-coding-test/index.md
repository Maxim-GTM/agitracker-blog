---
title: "Why a checked proof is different from a passing AI coding test"
description: "AI-generated proofs change the evidence for code behavior. The decisive questions are what was proved, about which binary, under which assumptions."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["AI coding", "Research", "Evaluation"]
faq:
  - q: "Does formally verified mean bug-free?"
    a: "No. A proof establishes a stated property under explicit assumptions; it does not establish every property of every deployment."
  - q: "Did AGI Tracker check the released proofs?"
    a: "No. This is an analysis of the published work and artifacts, not an independent proof build or reproduction."
  - q: "Why keep tests after obtaining a proof?"
    a: "Tests can check behavior outside the theorem\u2019s scope and help validate the connection between the formal model and the deployed system."
---

A passing test says a program behaved as expected on the cases that were run. A checked proof can establish a statement covering every case inside a formally defined boundary. That difference makes AI-assisted verification important, while making the boundary of the theorem impossible to ignore.

Anthropic's October 22 [formal-verification report](https://www.anthropic.com/research/formal-verification) describes proving properties of selected compiled RISC-V programs under stated conditions, including an input-size bound below 64 MB. The result concerns specific properties and modeled execution conditions. It does not mean all bugs in the source libraries, or in their common deployments, are gone.

For capability measurement, the interesting change is that an agent can produce an artifact whose validity is checked separately from its persuasive explanation. AGI Tracker has not built the released proofs. This article examines what that kind of evidence establishes and proposes how to assess the remaining work.

## Tests and proofs answer different questions

A test chooses an input, executes the program and compares the result with an expectation. A failed test can provide a concrete counterexample. A passing collection provides evidence about the sampled cases, with strength depending on how the cases were selected and what they checked.

A proof starts with a statement and a formal model. The checker determines whether the supplied reasoning establishes that statement according to its rules. The statement may quantify over an enormous or infinite set of cases, but only within the definitions and assumptions used.

This is why it is misleading to call a proof simply a very large test. The two methods have different forms of evidence and different failure boundaries. A million tests cannot automatically become a universal claim. A universal claim about a narrow model cannot automatically become a guarantee about an entire deployed system.

The original [HumanEval paper](https://arxiv.org/abs/2107.03374) provides background for test-based assessment of generated programs. The relevant distinction is between solving a test-defined task and proving a chosen property. Both can measure useful coding capability without measuring exactly the same skill.

## Fuzzing searches for counterexamples

Fuzzing explores program behavior by generating inputs, often guided by feedback about execution. It can uncover surprising failures that ordinary hand-written tests miss. A long history of fuzzing is valuable evidence of effort, but the absence of a discovered crash is not a proof that no relevant crash exists.

The official [OSS-Fuzz documentation](https://google.github.io/oss-fuzz/) describes a distributed service combining fuzzing engines and sanitizers. The new verification work uses fuzz targets as a way to formulate bounded questions about executable behavior. The target and its entry point determine which behavior is under examination.

A useful analogy is searching a landscape versus proving a fence encloses a particular region. Searching can find a hole; proving a property can rule out holes of a specified kind inside the formal boundary. Neither description tells you whether the boundary includes the entire place you care about.

The practical implication is complementary use. Fuzzing can reveal counterexamples that challenge a specification or implementation. Verification can establish a property beyond the finite set of explored inputs. A mature workflow needs to preserve what each method contributes rather than turn them into competing slogans.

## The theorem is the real headline

The released [OSS Verify proof repository](https://github.com/theorem-labs/oss-verify-proofs) distinguishes statements about particular binaries and entry points. A reader should inspect that level of specificity before interpreting a library-level claim. The artifact being proved is not merely a familiar project name.

Consider a hypothetical image parser. A theorem might establish that a particular compiled entry point does not produce a specified failure under a bounded input size and modeled operating-system behavior. That would be valuable. It would not necessarily prove that the parser displays every valid image correctly or that another entry point is safe.

Nor would it automatically cover a different compiler configuration, processor architecture, dynamic-linking arrangement or concurrent execution mode. Those changes can alter the object of the theorem. The correct question is whether the deployed system lies inside the assumptions, not whether it shares the same source repository.

| Evidence | What it can establish | What it does not establish by itself |
| --- | --- | --- |
| Passing unit tests | Expected outcomes on selected cases | Behavior on every untested input |
| Fuzzing campaign | Discovered failures and explored execution | Absence of all failures |
| Checked theorem | The stated property in the formal model | Every desired property of the application |
| Deployment validation | Evidence connecting the model to a real build | Correctness of unrelated configurations |
| Maintainer review | Relevance of the specification and assumptions | Mathematical validity without checking the proof |

This is an explanatory comparison, not a score assigned to the research. It helps a reader locate the evidence rather than rank methods by how reassuring their names sound.

## A proof checker does not choose the right specification

Suppose an agent proves that a function always returns an integer. The statement may be true and trivial while failing to address whether the integer is the correct answer. A checker can validate the reasoning without knowing the user's real requirement.

Specification is therefore part of the task, not preliminary paperwork. An evaluation should ask who wrote the statement, whether the agent could weaken it and how the statement was reviewed. Otherwise, a system might improve its proof success rate by selecting easier properties that contribute little practical assurance.

A proposed benchmark would freeze a set of meaningful specifications before the agents begin. A separate track could evaluate specification generation, using expert review and counterexamples to assess whether the statement captures the intended requirement. Keeping the tracks separate would make the source of progress visible.

The [SWE-bench paper](https://arxiv.org/abs/2310.06770) illustrates a related issue in repository tasks: an issue description and its test outcome define a particular problem. Passing it is meaningful within that problem definition. Formal verification can strengthen the form of evidence without removing the need for a well-chosen problem.

## Machine semantics are part of the trust boundary

A theorem about a machine model depends on how faithfully that model represents the relevant real execution. The released [Linux-process semantics repository](https://github.com/theorem-labs/rocq-linux-process-semantics) makes this modeling layer inspectable and documents its scope. That is important evidence about what the proof relies on.

The distinction is easier to see with a hypothetical example. If the model assumes single-threaded execution, a proof under that model does not establish the absence of races in a multithreaded deployment. The theorem can remain perfectly valid while the deployment claim is wrong.

Similarly, if an operating-system interaction lies outside the model, the proof cannot silently supply its behavior. The practical response is to identify the gap, evaluate its significance and extend the model where necessary. Treating every limitation as disqualifying would miss the value of partial assurance; ignoring it would overstate the result.

A useful publication would therefore include a deployment map: proved artifact, expected environment, unmodeled behavior and evidence for the connection. That map turns a broad verified-software label into a statement a maintainer can use when deciding whether a release fits their system.

## A worked example: safe failure is not correct decoding

Imagine a decoder that receives a malformed file. One desirable property is that it rejects the input without crashing. Another is that it accepts every valid file and produces the intended pixels. These properties overlap in application value but are logically different.

A proof of safe rejection would be valuable even if the decoder occasionally rejects valid files. It would not establish functional completeness. Conversely, a test suite demonstrating correct decoding of many valid files would not establish safe behavior on every malformed input.

Now suppose an AI agent patches the decoder and supplies a proof. The evaluator should check which property the patch improves and which behaviors it changes. A patch that handles errors by rejecting all inputs could satisfy a poorly chosen no-crash statement while destroying the decoder's usefulness.

A proposed evaluation can prevent this by pairing safety properties with functional requirements. The agent must preserve a defined set of intended behaviors while establishing the new property. A separate reviewer checks that the specification does not allow a vacuous solution.

This example is not a description of a bug or patch in the published work. It shows why theorem validity and specification adequacy need independent attention. The most useful verification systems make both easier to inspect.

## Proof generation and proof checking have different costs

An agent may spend substantial effort discovering a proof that a checker can later validate relatively cheaply. That asymmetry is part of the attraction: the expensive search produces a reusable artifact. But a capability report should not hide the search cost by showing only the final successful check.

Record failed attempts, restarts, assistance and all consumed resources. If the agent reuses a library of existing proofs, identify the library and its version. Reuse can be a genuine systems improvement, but it changes the starting resources available to the agent.

A proposed comparison would distinguish generating a proof from scratch, adapting a related proof and rechecking an existing artifact. These are useful tasks with different difficulty. Combining them into one success rate can make a system appear more generally capable than the test supports.

The same principle applies to model comparisons. Hold the specification, toolchain and available proof library constant when trying to isolate a model improvement. If the whole workflow changes, present the result as a system improvement and explain its components.

## What an independent reproduction would need

A meaningful reproduction would pin the exact binaries, theorem statements, semantics, checker and dependencies. It would run the documented checks and retain the output. If only a subset is checked, name the subset rather than implying the entire release was verified.

Rechecking a proof is different from reproducing its generation. The first tests whether the released artifact validates in the specified environment. The second tests whether an agent can rediscover or adapt the proof under a comparable budget. Both would strengthen the evidence, but they should be reported separately.

A further deployment study could examine whether the assumptions match an actual production build. That may require different machine semantics or a new compilation path. It is additional engineering, not a clerical extension of the original theorem.

AGI Tracker has performed none of those runs for this article. The distinction is explicit because readers should not mistake discussion of a checkable artifact for evidence that this publication has checked it. The analysis concerns the structure and scope of the published evidence.

## Challenge the specification as well as the proof

A useful evaluation can deliberately introduce a small mismatch between the intended requirement and the formal statement. The task is then to identify the mismatch rather than prove the weakened statement. This proposed track would measure a different and important capability: recognizing when a mathematically valid artifact answers the wrong engineering question.

For example, the statement could omit a required class of inputs or permit a failure status the application cannot tolerate. The evaluator would know the intended contract and ask whether the agent notices the gap before proceeding. The test should avoid rewarding vague objections; a successful response would identify the omitted condition and explain its practical consequence.

This would complement proof-generation benchmarks. A system good at both tasks could help maintain the connection between user intent and formal assurance. A system good only at proof search could still be valuable, but would need a stronger specification-review process around it. Measuring the difference makes the resulting capability claim more useful.

## Why this changes the measurement of AI coding

An agent that produces a valid proof supplies more than a plausible explanation of code. It supplies reasoning an external checker can reject. That creates an unusually clear channel for evaluating some kinds of technical work, even while the choice of statement and model remains a human responsibility.

[Our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) explains why task boundaries belong beside results. [Our account of AI agent workflows](/blog/agentic-workflows/) shows how tools and feedback shape the system being assessed.

The strongest interpretation of the verification work is neither all software is now safe nor proofs are too conditional to matter. It is that AI can help produce stronger, inspectable evidence for specified software properties. Progress becomes meaningful when the theorem, the executable and the deployment claim remain connected.

## Sources

- [Anthropic formal-verification research, October 22, 2026](https://www.anthropic.com/research/formal-verification)
- [Released OSS Verify proofs](https://github.com/theorem-labs/oss-verify-proofs)
- [Rocq Linux-process semantics](https://github.com/theorem-labs/rocq-linux-process-semantics)
- [OSS-Fuzz official documentation](https://google.github.io/oss-fuzz/)
- [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374)
- [SWE-bench original paper](https://arxiv.org/abs/2310.06770)

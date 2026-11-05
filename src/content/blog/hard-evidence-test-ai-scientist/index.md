---
title: "The hard evidence test for an AI scientist"
description: "An AI scientist needs a chain from proposed experiment to reliable measurement. Google\u2019s wet-lab research makes that chain concrete."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["AI for science", "Research", "Evaluation"]
faq:
  - q: "Did AGI Tracker run these laboratory experiments?"
    a: "No. This analysis examines published research and proposes an evidence ladder; it reports no new laboratory tests."
  - q: "Does successful laboratory automation establish drug discovery?"
    a: "No. Reliable execution, a validated assay, a biological effect and a clinically useful intervention require different evidence."
  - q: "What should an AI science result release?"
    a: "The hypothesis, protocol, controls, measurements, failed attempts, human interventions and enough provenance for independent assessment."
---

An AI scientist has to survive a change of audience. A persuasive explanation may satisfy a reader. A successful experiment must satisfy an instrument, a control condition and, eventually, another laboratory. The most useful way to assess recent progress is to follow those handoffs rather than count the sophistication of the generated prose.

Google Research's October 16 [wet-lab research overview](https://research.google/blog/grounding-ai-agents-in-biological-reality-building-blocks-for-autonomous-wet-labs/) brings this question into focus. It connects agent planning with laboratory execution and separate molecular-design projects. Those are different achievements, with different endpoints. Treating them as one generic demonstration of an autonomous scientist would obscure what makes the work interesting.

Our assessment is that physical feedback changes the evidence available to an agent, but does not automatically strengthen every downstream scientific claim. The decisive question is whether the feedback can rule out a plausible alternative explanation. AGI Tracker has not reproduced these experiments. The ladder below is an analytical framework for reading the published work, not a score assigned from a new test.

## A robot can execute the wrong experiment perfectly

Start with a distinction that science coverage often compresses: operational success and epistemic success. Operational success means the apparatus performed the intended procedure. Epistemic success means the result justifies learning something about the hypothesis. The first is necessary for interpreting the second, but it cannot substitute for it.

Suppose an agent proposes that a molecular candidate binds a target. A robot prepares the samples without spilling, follows the incubation schedule and records a strong signal. That is a completed workflow. Yet the signal could reflect background fluorescence, an unintended interaction or a concentration error. A coherent explanation written afterward does not eliminate those possibilities.

The agent therefore needs a second responsibility beyond producing valid commands: choosing measurements and controls that distinguish explanations. It may need a blank sample, an unrelated target, a concentration series or a different measurement technique. These are illustrative examples, not a reconstruction of the researchers' protocol. Their value is that each asks the physical world a question the original positive signal did not answer.

The [VERID paper](https://www.gstatic.com/science-ai/verid_semantic_lab.pdf) describes a semantic laboratory representation, simulation checks and execution traces. Its case studies use dye and water mixtures to investigate protocol handling. This matters because an automation result can be meaningful without being a new biological discovery. Improving the credibility of the measurement pipeline is itself scientific infrastructure.

## The evidence ladder

Each rung answers a different question. Moving upward requires new observations; a stronger adjective does not do the work.

| Rung | What the evidence supports | What would still be missing |
| --- | --- | --- |
| Plausible hypothesis | The proposed mechanism is worth investigating | A discriminating experiment |
| Executable protocol | The procedure can be translated into available operations | Evidence that execution matches intention |
| Audited execution | The instrument and sample history can be reconstructed | Assurance that the assay measures the intended effect |
| Controlled assay result | The signal survives specified negative and positive controls | Robustness to other plausible confounders |
| Orthogonal confirmation | A different measurement supports the interpretation | Generality beyond the tested conditions |
| Independent replication | Another team obtains a compatible result | Evidence for wider biological or clinical claims |

This is an editorial ladder, not an official grading scheme from Google. A project can be strong at one rung and incomplete at the next. The purpose is to locate the contribution precisely enough that another researcher knows what work remains.

The [aptamer sandbox manuscript](https://www.gstatic.com/science-ai/agentic_aptamer_sandbox.pdf) and the [epitope-excision manuscript](https://www.gstatic.com/science-ai/epitope_excision.pdf) should be read as separate experimental accounts. They are not interchangeable evidence for every stage in the ladder. Different molecules, targets and measurement procedures make the unit of comparison important.

A reusable scientific agent would need to make these distinctions itself. It should know whether it has learned that a command ran, that a detector changed, or that a biological explanation survived a challenge. An evaluation that rewards a confident final report without inspecting that chain could encourage the wrong behavior.

## Make unsuccessful attempts part of the record

A final successful run does not reveal how efficiently the system searched. Imagine two agents that both produce a workable protocol. One identifies the relevant control immediately. The other consumes almost the entire reagent budget before discovering an avoidable setup error. Their final artifacts might look equally polished, while their practical capabilities are very different.

A meaningful record would retain abandoned protocols, invalid measurements and repairs. It would distinguish an agent revising its scientific hypothesis from an agent fixing the mechanics of execution. Those are both useful forms of adaptation, but they answer different questions about reasoning.

This also changes how human help should be reported. A scientist supplying the correct interpretation of a failed assay contributes more than a scientist replacing an empty tip rack. Both interventions matter to autonomy, yet grouping them as one human touch loses the important information. Report what information entered the system and when it arrived.

For a proposed evaluation, we would require a decision log with four fields: the observation available at the time, the candidate explanations considered, the next experiment selected and the expected discriminatory value. The log should be frozen before the next measurement. Otherwise, a retrospective narrative can make a lucky choice look like a reasoned prediction.

The point is not to demand a literary transcript of every internal operation. It is to preserve enough external evidence to determine whether the experimental decision was justified by what the system actually knew.

## Why reproducibility starts before replication

Independent replication is expensive, and it is rarely the first thing another laboratory can do. Before repeating a study, researchers often need to understand the sample identities, transformations and exclusions. If those cannot be reconstructed, a disagreement may be impossible to diagnose.

[Datasheets for Datasets](https://arxiv.org/abs/1803.09010) argues for documenting how data were created and should be used. The corresponding lesson for an agentic laboratory is to make the experiment's data lineage inspectable. A measurement divorced from its preparation history is a weaker artifact than the same number with its calibration and sample provenance attached.

A useful dossier would connect each reported endpoint to a sample, each sample to a preparation, and each preparation to the exact protocol version. It would record which instrument settings were changed between iterations. It would also preserve the reasons for excluding a run, especially when the exclusion occurred after the result was visible.

That last point matters because an agent can produce many alternatives quickly. Selecting a persuasive subset afterward can create the appearance of consistent success. A predeclared exclusion rule makes it easier to separate genuine instrument failure from an inconvenient experimental outcome.

None of this requires pretending that every experiment can be reproduced bit for bit. Biological systems vary. The aim is a record that makes relevant variation visible, so a second laboratory can decide whether differences in outcome are scientifically meaningful.

## A proposed evaluation that rewards useful uncertainty

A strong next test would give the agent a mixture of tasks: some with a real effect, some with no effect and some with deliberately ambiguous measurements. Success would include correctly deciding that the evidence is insufficient. This is a proposed design; it is not a description of Google's results.

The evaluator should fix the resource budget before the task begins. That budget would include instrument time, reagents, failed preparations and human assistance. The agent could allocate it between replication and exploration, but could not gain an unlimited advantage by generating more candidates than the comparison system.

The outcome should contain at least three separate judgments. Was the reported effect real under the specified assay? Did the system choose informative experiments? Did its final confidence match the strength of the evidence? A system that reliably declines to overinterpret a noisy result can be more useful than one that always produces a dramatic mechanism.

[HELM](https://arxiv.org/abs/2211.09110) provides a broader precedent for evaluating several properties instead of a single headline score. For laboratory agents, that principle suggests a profile of reliability, scientific usefulness and resource efficiency rather than a universal scientist ranking.

The test should also include a held-out change in apparatus or sample preparation. Otherwise, what looks like experimental reasoning might be expertise in a single laboratory's habitual procedure. Generalization is most convincing when the new setting changes something causally relevant rather than only renaming the task.

## What would count as a breakthrough?

A breakthrough would be an agent repeatedly finding the measurement that resolves a real scientific ambiguity, within a practical budget, with a record that others can inspect. It would not need to replace every scientist. A dependable system for one difficult part of the research loop could materially expand what a team can investigate.

There are several ways that could happen. An agent might notice that a positive result depends on an unnoticed instrument condition. It might choose a negative control that invalidates its preferred hypothesis. It might transfer a useful experimental strategy to a different target without carrying over the wrong assumptions. These are possible evaluation goals, not accomplishments established here.

The distinction between generating an idea and testing it also helps explain why the field is progressing unevenly. Computational exploration can produce candidate explanations rapidly. Physical experiments still consume materials, occupy equipment and require interpretation. Faster idea generation increases the value of choosing which ideas deserve those scarce resources.

That is why the laboratory interface is more than a convenience layer. If observations are unreliable or poorly documented, more capable reasoning can amplify the wrong signal. If the interface preserves state and exposes uncertainty, even a limited agent can make decisions that another scientist can audit.

## Separate debugging feedback from discovery feedback

The VERID study is particularly useful because its experimental material makes certain errors easier to interpret. With dye mixtures, an agent can investigate a mismatch between predicted and observed signals without immediately confronting the full complexity of a living system. That is an intentional simplification in the research design, and it helps isolate what a laboratory interface contributes.

The limitation becomes important when transferring the conclusion. Success in diagnosing a liquid-handling problem supports confidence in that kind of operational reasoning. It does not establish that the same system can distinguish a true cellular mechanism from an assay artifact. A biological follow-up would need to show which parts of the reasoning transfer and which require new domain knowledge.

There are also two different feedback loops inside a laboratory project. One loop improves the protocol: the agent discovers that the measurement is unreliable and changes how it is obtained. The other improves the scientific hypothesis: the measurement is credible, but the proposed explanation fails. Reporting both as self-improvement would conceal whether the agent learned about the apparatus or about the target phenomenon.

A useful follow-up evaluation would mark every revision with that distinction. If an agent changes a dilution sequence, the evaluator would ask whether the change repaired measurement validity or tested a new mechanism. If the change does both, the record would explain how. This would make it possible to compare agents that reach similar final answers through very different levels of scientific understanding.

Finally, independence should be measured at the level of information, not merely at the level of physical activity. A human can remain outside the robot's immediate loop while still supplying the critical interpretation through a prompt. Conversely, a human may handle samples while the agent chooses the important experiment. Counting robotic motions alone would misstate both situations. The contribution worth tracking is the allocation of decisions that determine what the experiment can establish.

## Read the contribution at its actual level

The interesting development in this research is the effort to connect agent decisions to physical state and experimental feedback. The strongest interpretation preserves the boundaries between automation, assay validation and scientific discovery. Collapsing them into a claim that AI has solved biology would discard the useful detail.

For readers tracking progress toward more general AI, the transferable capability is learning from consequences under constraints. A laboratory provides an unusually demanding test because the world can contradict the model, failed actions cost something and an attractive explanation cannot repair a bad sample.

For more context, [our explanation of AI-designed bacteriophages](/blog/ai-designed-bacteriophages/) separates an impressive biological artifact from broader claims about design ability. [Our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) explains why the evaluation's boundaries belong in the headline interpretation.

The practical standard for an AI scientist is therefore clear: make a testable prediction, choose a useful experiment, preserve the evidence and change the conclusion when the world disagrees. The research becomes most valuable when it makes that sequence easier to examine.

## Sources

- [Google Research wet-lab overview, October 16, 2026](https://research.google/blog/grounding-ai-agents-in-biological-reality-building-blocks-for-autonomous-wet-labs/)
- [VERID: Semantic Representation for Agentic Self-Play in Automated Laboratories](https://www.gstatic.com/science-ai/verid_semantic_lab.pdf)
- [Agentic aptamer sandbox manuscript](https://www.gstatic.com/science-ai/agentic_aptamer_sandbox.pdf)
- [Epitope excision manuscript](https://www.gstatic.com/science-ai/epitope_excision.pdf)
- [Datasheets for Datasets](https://arxiv.org/abs/1803.09010)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)

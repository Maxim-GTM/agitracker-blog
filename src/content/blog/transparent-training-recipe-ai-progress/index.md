---
title: "Can a transparent training recipe make AI progress easier to measure?"
description: "Apertus 1.5 makes training stages and artifacts part of the evidence. That can help researchers distinguish a better model from a better explanation of why it improved."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["Open-weight models", "Research", "Model training"]
faq:
  - q: "Does a transparent recipe guarantee identical reproduction?"
    a: "No. It makes the procedure inspectable, but exact outcomes still depend on data snapshots, software, numerical behavior and resources."
  - q: "Are the 8B and 70B Apertus models a controlled size comparison?"
    a: "Not by size alone. Their training histories and stages must be matched before attributing a difference solely to parameter count."
  - q: "Did AGI Tracker reproduce the training run?"
    a: "No. This article examines public artifacts and proposes an ablation worksheet; it contains no independent training measurements."
---

A model can improve without making it clear why. More data, a changed training stage, a new evaluation template and a different inference budget can all move a score. A transparent training recipe matters because it gives researchers a better chance of separating those explanations.

The October 11 [Apertus 1.5 technical report](https://arxiv.org/abs/2610.15542) describes a multimodal extension of an existing model family, accompanied by training and evaluation artifacts. Its significance for research is not only the resulting checkpoint. It is the possibility of inspecting how the checkpoint was produced and testing narrower claims about each stage.

The definitive question is whether the released record lets an independent team change one relevant factor while holding the others stable. AGI Tracker has not reproduced the training campaign. The worksheet below is a proposed way to assess reproducibility and design follow-up experiments.

## A recipe makes a claim testable, not automatically true

Publishing a recipe allows other researchers to inspect choices that would otherwise remain hidden. It does not establish that every choice was optimal, that every explanation is causal or that another team will obtain an identical result. Those questions still require experiments.

A useful analogy is a laboratory protocol. Knowing the reagent list and procedure makes a study easier to examine. It does not remove measurement noise or guarantee that all relevant conditions were recorded. The value lies in making disagreement diagnosable rather than preventing disagreement altogether.

The original [OLMo paper](https://arxiv.org/abs/2402.00838) provides background for treating training data and code as research artifacts. That approach changes the questions a reader can ask. Instead of merely comparing final scores, researchers can investigate how a data mixture, optimization choice or evaluation procedure affects the result.

For Apertus, the practical starting point is the artifact map in the [full report](https://arxiv.org/html/2610.15542v1). The model family, training stage and checkpoint lineage should be identified before a result is attributed to a single design decision.

## Intermediate checkpoints turn a release into a trajectory

A final model is the endpoint of several transformations. Continued pretraining changes the base representation. Supervised instruction tuning changes response behavior. Other post-training stages can alter reasoning, preferences or constraint following. A single final score combines their effects.

With intermediate checkpoints, a researcher can examine where a change first appears. That does not by itself prove causation, because stages may differ in several ways at once. It does provide a more precise starting point for a controlled experiment.

The public [Apertus training scripts](https://github.com/swiss-ai/pretrain-code) expose stage-specific execution structure and configuration requirements. The important research opportunity is to connect a reported result to a particular stage and its inputs, rather than treat the release as an unexplained jump between model names.

A proposed analysis would evaluate the same held-out task set across the available lineage. It would record improvements and regressions, then select a specific transition for an ablation. This is more informative than assuming that every later checkpoint must be better at every task.

## Bigger is not a sufficient explanation

Comparing two model sizes can be useful, but parameter count is rarely the only thing that differs. Training duration, data exposure, optimization settings and post-training lineage can change as well. If those factors are not matched, the comparison describes two complete systems rather than a pure size effect.

The Apertus report discusses distinct histories for its model sizes. That makes it particularly important to preserve the stage labels when reading a result. A smaller model can outperform a larger one on a task without establishing a general law that smaller models learn better.

For a proposed size study, define the resource constraint first. Equal training tokens, equal compute and equal elapsed time are different experiments. A researcher cannot satisfy all of them automatically when model sizes differ. State which comparison is intended and why it fits the question.

Then inspect task-level outcomes. A model may improve on language tasks while lagging on a modality introduced later in training. That pattern may reflect exposure or optimization rather than a simple capacity ranking. The conclusion should follow the experimental design, not the most convenient narrative.

## Data transparency needs versions and transformations

A list of dataset names is useful but incomplete. The same source can change over time, and filtering or preprocessing can alter which examples reach training. A reproduction needs enough information to reconstruct the relevant snapshot and transformations.

The [Apertus data-transparency repository](https://github.com/swiss-ai/apertus-data-transparency) publishes a versioned catalog describing dataset metadata, versions and processing references. That is a concrete artifact for investigation. Its presence is evidence of inspectability, not proof that this publication has rebuilt every dataset.

A proposed reproduction should retain the catalog revision, source identifiers and checksums where available. Record unavailable or changed data instead of silently substituting a newer version. If the experiment uses a reconstructed subset, name it and explain how it differs from the original mixture.

[Datasheets for Datasets](https://arxiv.org/abs/1803.09010) provides a broader framework for documenting collection and use. The relevant principle is that a dataset's identity includes how it was assembled. Reproducing a name is not necessarily reproducing the training evidence.

## A proposed reproducibility worksheet

This worksheet is an editorial tool for planning a study, not a certification that every Apertus artifact has been independently validated.

| Layer | Record to preserve | Question it enables |
| --- | --- | --- |
| Model lineage | Size, stage, parent checkpoint and revision | Which system produced the result? |
| Data | Source versions, mixture and processing | What information changed between runs? |
| Training | Optimizer, schedule, batch and precision | Which learning procedure was applied? |
| Execution | Framework, container and hardware configuration | What implementation differences may matter? |
| Evaluation | Task version, prompt, parser and grader | Are the outcomes measured consistently? |
| Intervention | One changed factor and fixed controls | What causal claim can the comparison support? |
| Reporting | All runs, failures and uncertainty | How stable is the apparent improvement? |

The worksheet is intentionally layered. A study can successfully reproduce evaluation without reproducing training. It can inspect data provenance without measuring inference. The report should identify which layers were actually exercised, so readers do not infer a complete reproduction from a narrower check.

The most valuable missing information is the information that blocks a particular inference. If a team cannot reconstruct a data mixture, that matters for a data-ablation claim. It may matter less for a narrow inference-runtime comparison using fixed weights.

## Start with evaluation reproduction

The least expensive useful first step is often to run a fixed checkpoint through the documented evaluation procedure. Before retraining anything, check whether the task definition, prompt formatting and output parsing produce compatible results.

The public [Apertus evaluation-harness repository](https://github.com/swiss-ai/lm-evaluation-harness) is a relevant starting artifact. A team should pin its revision and task definitions. A generic harness with a similar name may not include the same fixes, templates or preprocessing.

If a result differs, investigate the measurement path before attributing the gap to the model. Did the prompt include a different system instruction? Was thinking enabled? Did the parser discard valid answers? Did the task version change? These are proposed diagnostic questions, not claims about a detected problem in Apertus.

A reproduction report should retain the raw responses where appropriate. A final aggregate score is harder to debug than the underlying item-level evidence. Compatible averages can also conceal different failure patterns, so inspect disagreements as well as totals.

## A worked ablation: one data component

Imagine a researcher wants to know whether a particular training-data component improves document understanding. The naive comparison is to remove it and retrain, then compare final scores. But removing data also changes total training volume, mixture proportions and potentially the optimization trajectory.

A more informative proposed design would specify what replaces the removed tokens. One experiment could keep total tokens fixed by resampling other data. Another could keep the remaining data exposure fixed and reduce total compute. These answer different questions: the component's value relative to alternatives, and the value of adding it at all.

The evaluation set should be held out from the component and any derived examples. It should include tasks expected to benefit and control tasks where no benefit is predicted. If only the favorable task improves, the result supports a narrower interpretation than a universal gain in multimodal reasoning.

Run enough repetitions to assess variability within the available budget. If full-scale retraining is impractical, a reduced-scale study can still be useful, provided its connection to the released model is treated as a hypothesis rather than an established equivalence.

The release's transparency helps make this design possible. The ablation itself would supply the causal evidence. Publishing the ingredients is a contribution; proving which ingredient mattered requires another experiment.

## Post-training can move several capabilities in opposite directions

A stage intended to improve one behavior may change another. For example, stronger constraint following can alter response length or willingness to answer. A reasoning configuration can change both quality and inference cost. The evaluation should preserve those dimensions rather than selecting the metric that improved.

A proposed lineage study would use a fixed suite containing target tasks and controls. It would compare both raw scores and response characteristics across stages. Where a regression appears, inspect item-level examples and determine whether it reflects a genuine capability loss, a formatting change or a changed refusal policy.

This is where intermediate artifacts can be especially valuable. Without them, researchers may see only the final tradeoff and speculate about its origin. With them, they can identify a transition to investigate, although they still need controlled interventions to establish causation.

The same logic applies to model identity. An endpoint that exposes a thinking flag may represent a configuration change rather than a separate set of weights. A study should record the complete invocation, not assume that a product label uniquely specifies the evaluated computation.

## Exact reproduction is not the only scientific goal

A second team may lack the hardware to recreate the original campaign. That does not make the artifacts irrelevant. It can still reproduce evaluation, inspect a data-processing stage, test a smaller intervention or challenge an interpretation using a fixed checkpoint.

The important distinction is between repeating the entire process and independently testing a claim. A modest, carefully controlled study can be more informative about one mechanism than an expensive rerun that changes several conditions without documenting them.

At the same time, reduced-scale evidence has limits. A technique that helps a small experiment may behave differently at the released scale. The study should identify which conclusions depend on scale and which concern implementation or measurement properties that can be inspected directly.

This gives research groups a practical ladder of contribution. They can begin with artifact inspection, move to evaluation reproduction and then attempt causal studies as resources permit. Each step should produce an inspectable record, not merely a declaration that the model is open.

## Preserve the dependency graph of the experiment

A training recipe is a chain of dependencies rather than a single script. A checkpoint depends on its parent, the processed data, the tokenizer and the execution environment. An evaluation then adds task definitions and grading. Pinning only the top-level repository leaves much of that chain unspecified.

For a proposed reproduction package, create a manifest linking each output to the exact inputs used to produce it. Mark components reconstructed locally and components taken directly from the release. If a dependency cannot be recovered, record the substitution and limit the claim accordingly.

This makes later disagreement easier to diagnose. Two teams may discover that they reproduced different stages or used different processed-data snapshots even though both followed a repository named in the report. The manifest turns that discovery into a concrete explanation rather than an argument about whether reproduction succeeded in the abstract.

## A better explanation of progress is itself progress

Transparent recipes do not guarantee stronger models. They make the explanation of model improvement more accessible to scrutiny. That matters because AI research needs to distinguish an effective idea from an impressive result produced by several unreported changes.

[Our account of the three levers of AI progress](/blog/three-levers-of-ai-progress/) explains how data, compute and algorithms interact. [Our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) provides the corresponding discipline for evaluating the final score.

Apertus 1.5 is a useful case study because its release treats stages, data and evaluation as part of the research artifact. The definitive opportunity is to turn that record into controlled questions: what changed, what remained fixed and which observation would prove the preferred explanation wrong?

## Sources

- [Apertus 1.5 preprint, submitted October 11, 2026](https://arxiv.org/abs/2610.15542)
- [Apertus 1.5 full technical report](https://arxiv.org/html/2610.15542v1)
- [Apertus training scripts](https://github.com/swiss-ai/pretrain-code)
- [Apertus data-transparency catalog](https://github.com/swiss-ai/apertus-data-transparency)
- [Apertus evaluation harness](https://github.com/swiss-ai/lm-evaluation-harness)
- [OLMo: Accelerating the Science of Language Models](https://arxiv.org/abs/2402.00838)
- [Datasheets for Datasets](https://arxiv.org/abs/1803.09010)

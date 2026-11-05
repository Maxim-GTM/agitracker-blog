---
title: "The capability seesaw when AI models learn from several teachers"
description: "The P\u00b2-MOPD preprint makes balanced skill recovery the story. Here is why an average can hide a student model losing one teacher\u2019s capability."
pubDate: 2026-11-05
coverageGroup: general-ai
draft: false
tags: ["Research", "Evaluation", "Model training"]
faq:
  - q: "Does 94.7% recovery mean 94.7% accuracy?"
    a: "No. Recovery measures the fraction of the base-to-teacher score gap regained under the paper\u2019s definition."
  - q: "Were frontier-scale models validated?"
    a: "No. The reported study uses Qwen3 models at 1.7B and 4B scales across four evaluated domains."
  - q: "What should be reported beside average recovery?"
    a: "Raw per-domain scores, worst-domain recovery, variation across runs and the training-resource boundary."
---

A student model can learn from several specialists and still become worse at one of their subjects. The average score may rise while the weakest capability quietly falls. That is the capability seesaw: consolidation is useful only if the resulting model preserves the skills the user actually needs.

The November 2 [P²-MOPD preprint](https://arxiv.org/abs/2611.03953) studies this problem at 1.7B and 4B scales across four domains. It combines trainable student weights with learnable contributions from specialist parameter differences. The research question is whether that combination produces more balanced recovery of the teachers' advantages.

The important measurement issue is the word recovery. It is a normalized comparison to a base model and domain teacher, not a universal accuracy scale. AGI Tracker has not reproduced the study. The arithmetic examples below are invented to explain the metric, while the paper's results remain attributed to its authors.

## Several teachers do not automatically make a generalist

A specialist is useful because it has learned behavior that a starting model lacks. Combining several specialists raises a second problem: their improvements may not coexist cleanly in one parameter configuration. An update that helps one domain can interfere with another.

The historical [task arithmetic paper](https://arxiv.org/abs/2212.04089) represents task-specific changes as differences between related model weights. [TIES-Merging](https://arxiv.org/abs/2306.01708) investigates interference in model merging. These are background approaches to the consolidation problem, not interchangeable implementations of the new method.

For a reader, the useful distinction is between combining parameters and training on behavior. A parameter combination changes the starting point or structure of the student. Distillation supplies a learning signal based on a teacher's outputs. They can interact, but neither operation guarantees retention of every useful skill.

The original [knowledge-distillation paper](https://arxiv.org/abs/1503.02531) provides the broader precedent for transferring behavior into a deployable model. The practical aspiration is straightforward: use one model where maintaining many specialists would be cumbersome. The empirical question is how much capability survives that compression and at what cost.

A strong consolidation result should therefore expose the tradeoffs. If a system becomes excellent at three domains and unusable at the fourth, the mean may look attractive while the deployment value remains poor for a user who needs all four.

## Recovery is a fraction of a particular gap

The [full P²-MOPD paper](https://arxiv.org/html/2611.03953v1) defines per-domain recovery as the student's gain above the base divided by the teacher's gain above that same base. In symbols, it is `(student − base) / (teacher − base)`. The denominator is specific to the domain and the chosen teacher.

Here is a hypothetical example. A base scores forty on a test and its teacher scores sixty. A student scoring fifty has recovered half the twenty-point advantage. On another test, a base scores eighty and the teacher eighty-four. A student scoring eighty-two also recovers half the advantage, despite a very different raw score and a much smaller numerical gain.

Both recoveries are fifty percent. That does not make the two domains equally difficult, equally valuable or equally well solved. It means the student is halfway from the selected base to the selected teacher on each measurement. The normalization is useful precisely because it answers that narrower question.

A reader should also ask what happens when the teacher is only slightly better than the base. A small denominator can make a modest raw difference appear large on the recovery scale. This is a mathematical property of the metric, not a flaw unique to this paper. Publishing raw scores alongside normalized values makes it easier to interpret.

| Hypothetical domain | Base score | Teacher score | Student score | Recovery |
| --- | --- | --- | --- | --- |
| A | 40 | 60 | 50 | 50% |
| B | 80 | 84 | 82 | 50% |
| C | 50 | 70 | 45 | −25% |
| D | 30 | 50 | 55 | 125% |

These rows are explanatory examples, not reported experiments. Negative recovery means performance below the base under this definition. Recovery above one hundred percent means exceeding the chosen teacher's score, not exceeding perfect accuracy.

## The average can hide the part that matters

Suppose a hypothetical student recovers nearly all of three teacher advantages but loses ground in a fourth domain. An average compresses those outcomes into one number. That compression may be convenient for comparing training curves, but it can hide an important operational failure.

The decision depends on the intended use. A model supporting a workflow that requires every domain may be constrained by its weakest capability. A model serving mostly one domain with occasional secondary tasks may justify a different weighting. The evaluation should publish the domain profile so users can make that choice themselves.

This is why worst-domain recovery is interesting. It asks whether consolidation leaves one skill behind. It does not prove broad competence: the worst domain is only the worst among those tested. Add a new domain or a more demanding test and the minimum can change.

[HELM](https://arxiv.org/abs/2211.09110) supplies a broader methodological precedent for exposing tradeoffs across scenarios. The corresponding principle here is to keep the full capability vector visible. A mean is a summary of that vector, not a replacement for it.

The new paper's reported strength is more balanced recovery in its tested setting. That supports further investigation of consolidation methods. It does not establish that specialist capabilities can be combined without tradeoffs in arbitrary model families, domain combinations or real-world professional tasks.

## Starting points change what the comparison establishes

Training methods can appear different because they begin from different places. A merged student may inherit useful behavior before distillation starts. A student initialized from the original base has to recover that behavior through training. Comparing only their final scores can mix initialization gains with learning-method gains.

The proposed reading procedure is to identify the relevant control first. Which method shares the same starting checkpoint? Which shares the same teacher set, prompt pool and training budget? A matched control helps isolate what the added mechanism contributes.

For a hypothetical reproduction, keep the initialization fixed and change one component at a time. Then run a separate experiment comparing the full practical recipes, including their preparation cost. Those experiments answer different questions: the causal contribution of a mechanism, and the best complete workflow available under a resource budget.

The distinction also affects claims about faster learning. Reaching a target in fewer steps is meaningful only after defining a step and accounting for the work it performs. Teacher scoring, student generation and parameter operations may consume different resources in different methods. Report elapsed time and resource use alongside step count when the claim concerns efficiency.

A method that costs more per step can still be better overall. The point is not to reject step-based evidence, but to keep its interpretation narrower than an unmeasured claim about total training cost.

## A worked decision for a four-skill assistant

Imagine a team building an internal assistant that must read policy, calculate financial figures, follow formatting rules and answer questions about a technical manual. The team has four specialists and wants one deployable student. This is an illustrative application, not a use case evaluated in the preprint.

Before training, the team defines a minimum acceptable result for each skill. The financial task needs numerical correctness; the policy task needs faithful interpretation; the formatting task needs exact constraints; the manual task needs evidence-grounded answers. A single shared judge may be inappropriate for all four.

After consolidation, the team examines the raw task outcomes and recovery profile. If the average improves but financial errors cross the unacceptable threshold, the student is not ready for that workflow. The right decision might be more training, a revised consolidation method or retaining a specialist for that task.

Now suppose the student improves all four benchmark scores but fails when the tasks are combined in one request. That exposes a different gap: separate capabilities did not establish integrated performance. A useful follow-up evaluation would include mixed-domain tasks requiring the skills to cooperate, rather than merely alternate.

Finally, test whether the assistant can recognize its weak domain. A student that knows when to defer may be more useful than one with a slightly higher average that confidently applies the wrong specialist behavior. Calibration and selective use are additional questions, not properties implied by recovery alone.

## Retention should be measured through the training trajectory

A final checkpoint conceals how the student arrived there. One domain may improve early and then deteriorate as another dominates later updates. Another may recover only after a mechanism corrects an imbalance. These trajectories can distinguish a robust method from a favorable stopping point.

A proposed evaluation would score all domains at predeclared checkpoints and retain every seed. It would show uncertainty around the curves rather than selecting the most attractive run. It would also separate variation from training randomness and variation from stochastic response generation at evaluation time.

The earlier [catastrophic-forgetting research](https://arxiv.org/abs/1612.00796) frames the general difficulty of acquiring new competence while preserving old competence. Multi-teacher consolidation is a particular version of that tension. A well-balanced final result is encouraging, but persistence through later updates is a separate empirical question.

The evaluator should also preserve a small set of capabilities outside the teacher domains. A student might recover specialist improvements while degrading unrelated general behavior. Those controls would not need to cover everything, but their selection should reflect the intended application and be explained before the results are known.

That makes the evaluation more demanding and more useful. It asks whether the student became a better system, rather than only whether it moved toward its chosen teachers on the selected tests.

## Teacher quality sets the meaning of the target

A recovery score is relative to the chosen teacher. If that teacher is weak, recovering its full advantage can still leave the student inadequate for the intended task. If the teacher is unusually strong, partial recovery may be practically valuable. The metric cannot decide which teacher is an appropriate standard without additional task evidence.

This also creates a comparison problem between studies. A method evaluated with one teacher set should not be ranked directly against a method using another merely because both publish average recovery. The denominators may differ in size, quality and difficulty. A shared name for the metric does not create a shared experiment.

For a proposed follow-up, keep the teacher set fixed for the causal comparison, then vary teacher quality in a separate sensitivity study. Include a teacher that is stronger on the benchmark but less reliable on an adjacent held-out task. This would test whether consolidation transfers useful competence or mainly reproduces a narrow evaluation advantage.

The student should also be checked for inherited errors. If several teachers share the same mistaken assumption, agreement between them does not make the assumption correct. A diverse teacher set is not automatically an independent evidence set, especially when the models have related training provenance or learn from similar examples.

These considerations do not make teacher-relative recovery a bad metric. They identify its proper role: describing how a student approaches specific reference systems under specified tests. The result becomes more useful when the report publishes those references and their limitations, instead of presenting recovery as an absolute measure of intelligence.

## What the next study should try to falsify

The strongest follow-up would seek conditions where the method stops balancing capabilities. Try domains with more strongly conflicting requirements, teachers with less compatible provenance and different starting skill gaps. Keep those tests clearly separated from the original reported setting.

A useful negative result might show that the method depends on shared initialization or that one domain dominates when prompts are unevenly sampled. That would not erase the original contribution. It would identify the conditions under which the technique is a reliable building block.

[Our explanation of continual learning](/blog/continual-learning-explained/) introduces the broader retention problem. [Our discussion of benchmark saturation](/blog/why-benchmarks-saturate/) explains why a stronger score needs a continuing supply of discriminating tests.

The definitive reading is that P²-MOPD reports an improvement in balanced recovery within a specified small-model study. The general lesson is broader: when several teachers contribute to one student, the weakest retained skill can be more informative than the average. Progress should be visible in the full profile, not hidden inside one impressive percentage.

## Sources

- [P²-MOPD preprint](https://arxiv.org/abs/2611.03953)
- [P²-MOPD full paper, methods and recovery definition](https://arxiv.org/html/2611.03953v1)
- [Editing Models with Task Arithmetic](https://arxiv.org/abs/2212.04089)
- [TIES-Merging](https://arxiv.org/abs/2306.01708)
- [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)
- [Overcoming catastrophic forgetting in neural networks](https://arxiv.org/abs/1612.00796)

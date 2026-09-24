---
title: Why AI benchmarks saturate, and what replaces them
description: Benchmarks that once looked impossible now get solved within a few years of release. Here is why that keeps happening and how the next generation of tests is trying to stay ahead.
pubDate: 2026-04-11
updatedDate: 2026-08-30
tags: [Benchmarks, Evaluation]
---

Every AI benchmark has a life cycle. It is released as a hard problem, models climb it for a few years, and then it stops telling us anything. The interval between release and saturation has been getting shorter.

## The cycle

1. **Release.** A new test is published, usually with a large gap between human and model performance.
2. **Climb.** New models improve steadily. The benchmark becomes a headline number in launch announcements.
3. **Saturation.** Top models approach the ceiling. Remaining errors are mostly ambiguous or mislabelled questions.
4. **Replacement.** Researchers publish a harder benchmark and the cycle repeats.

## A short history

**GLUE** (2018) bundled several language-understanding tasks into one score. Models passed its human baseline so quickly that its creators released **SuperGLUE** in 2019. SuperGLUE's human baseline was passed in early 2021, less than two years later.

**MMLU** (2020) tested knowledge across 57 subjects, from law to physics. It became the standard knowledge benchmark for large language models, then followed the same arc toward its ceiling.

**GSM8K** (2021) covered grade-school maths word problems. It went from a real challenge to a near-solved test as step-by-step reasoning improved.

The replacements got harder on purpose:

- **GPQA** (2023) used graduate-level science questions written to be "Google-proof": hard to answer even with web search.
- **SWE-bench** (2023) asked models to resolve real issues from open-source GitHub repositories.
- **FrontierMath** (2024) collected unpublished, research-level maths problems.
- **Humanity's Last Exam** (2025) gathered expert-written questions at the frontier of many fields.

## Why saturation keeps getting faster

**Models improve on the underlying skill.** This is the good reason, and it is real.

**Contamination.** The longer a benchmark is public, the more likely its questions end up in training data.

**Targeting.** Once a benchmark is a headline number, labs have an incentive to tune for it. That doesn't have to be dishonest to distort the result.

**Fixed formats.** Multiple-choice questions reward good guessing and elimination strategies, not only knowledge.

## What the next generation looks like

The newest evaluations try to resist the cycle in a few ways:

- **Private test sets** that are never published, so they can't leak into training data.
- **Living benchmarks** that add fresh questions on a schedule.
- **Long, open-ended tasks**, such as multi-hour software or research projects, that are hard to game with pattern matching.
- **Measuring time horizons**: how long a task (measured by how long it takes a skilled human) a model can reliably complete.

> A saturated benchmark isn't a failed benchmark. It is a milestone: proof that a capability once considered hard is now routine.

## How we report benchmark results

On agitracker.io we flag when a benchmark is near saturation and report its successor alongside it. A gain on a saturated test is noted, not headlined. For a checklist you can use yourself, see [how to read an AI benchmark](/blog/how-to-read-an-ai-benchmark/).

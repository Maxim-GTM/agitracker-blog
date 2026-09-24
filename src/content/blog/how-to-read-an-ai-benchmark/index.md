---
title: How to read an AI benchmark without getting fooled
description: A checklist for reading AI benchmark results, from sample size and contamination to saturation, so you can tell a real capability jump from a rounding error.
pubDate: 2026-04-11
tags: [Benchmarks, Evaluation, Explainers]
cover: ./cover.png
coverAlt: Bar chart in neobrutalist style with the tallest bars pressing against a dashed ceiling line.
---

Every model launch comes with a table of benchmark scores, usually with the new model's numbers in bold. Those tables are useful, but only if you know what to look for. Here is the checklist we run through before we report a result.

## 1. How big is the test?

A benchmark score is an estimate, and small tests give noisy estimates. The standard error of an accuracy score is roughly:

```python
import math

def standard_error(accuracy: float, n_questions: int) -> float:
    return math.sqrt(accuracy * (1 - accuracy) / n_questions)

# A model scoring 80% on a 500-question test
se = standard_error(0.80, 500)       # ~0.018
print(f"95% interval: ±{1.96 * se:.1%}")  # ±3.5%
```

On a 500-question test, a model at 80% has a 95% confidence interval of about ±3.5 points. **A two-point lead on that test is not a meaningful difference.** Look for results that clear the noise, or that repeat across several independent benchmarks.

## 2. Could the answers be in the training data?

Large models are trained on large slices of the public internet. If a benchmark's questions (or discussions of them) are online, a model may have seen them. This is called **contamination**, and it inflates scores without improving the underlying skill.

Signs to look for:

- The benchmark has been public for years.
- Performance drops sharply on freshly written questions of the same kind.
- The lab doesn't say how it checked for overlap.

Benchmarks that keep a private held-out set, or that are refreshed regularly, are harder to contaminate.

## 3. Is the benchmark already saturated?

A benchmark is **saturated** when top models score close to its ceiling. At that point, differences between models mostly reflect noise, mislabelled questions and formatting quirks.

| Sign | What it means |
| --- | --- |
| Top scores within a few points of 100% | Little headroom left to measure |
| Score gains of under 1 point per release | Differences are likely noise |
| Known label errors in the dataset | The true ceiling is below 100% |

When a benchmark saturates, the field moves to a harder one. We cover that cycle in detail in [why benchmarks saturate](/blog/why-benchmarks-saturate/).

## 4. What exactly was measured?

Two scores on the "same" benchmark can come from very different setups:

1. **Prompting.** Zero-shot, few-shot, or with a long chain of reasoning?
2. **Attempts.** One answer, or best of many (often written *pass@k*)?
3. **Tools.** Did the model have a code interpreter, web search, or other help?
4. **Compute.** How long was the model allowed to think per question?

A score without these details can't be compared with another score. Good reports put the evaluation setup right next to the number.

## 5. Does the benchmark measure what it claims to?

A test of "reasoning" might mostly reward pattern matching on familiar formats. A test of "coding" might only check whether short functions pass unit tests, not whether the code is maintainable. Always ask: **if a model aced this, what could it actually do?**

> When a measure becomes a target, it ceases to be a good measure. (Goodhart's law, paraphrased by Marilyn Strathern)

## The short version

Before trusting a headline number, check:

- [x] The test is large enough for the gap to matter
- [x] Contamination has been addressed
- [x] The benchmark isn't saturated
- [x] The evaluation setup is disclosed
- [x] The benchmark measures the skill in the headline

If a result passes all five, it is worth tracking. If it fails two or more, treat it as a marketing number.

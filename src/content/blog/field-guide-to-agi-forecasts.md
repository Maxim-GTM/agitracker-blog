---
title: A field guide to AGI forecasts
description: Surveys, prediction markets and trend extrapolation all produce AGI dates. Here is how each forecasting method works, what it is good at, and how to read the numbers.
pubDate: 2025-12-12
tags: [Forecasts, Explainers]
---

"When will we get AGI?" has no single answer, but it does have several methods for producing one. Each method has its own biases. Knowing which method produced a date tells you how much weight to give it.

## Expert surveys

Researchers are asked directly when they expect certain capabilities.

The largest example is the survey run by AI Impacts. Its 2023 edition collected answers from 2,778 researchers who had published at top AI venues. Asked when unaided machines would outperform humans at every possible task, the aggregate forecast gave a **50% chance by 2047**. That was 13 years earlier than the same question produced in the previous year's survey.

**Good at:** capturing what the people building the field believe.

**Watch out for:** framing effects. Small changes in wording ("every task" versus "every occupation") have produced answers decades apart in the same survey.

## Forecasting platforms and prediction markets

Platforms such as Metaculus let many forecasters make predictions, then score them when questions resolve. Forecasters with good track records carry more weight in the aggregate.

**Good at:** updating quickly when news arrives, and rewarding calibration.

**Watch out for:** resolution criteria. An AGI question on a forecasting site is only as meaningful as its definition of AGI, which is often a specific bundle of tests. Read the fine print before quoting a date.

## Trend extrapolation

Take a measurable trend (training compute, benchmark scores, the length of tasks models can complete) and project it forward until it crosses a threshold.

**Good at:** being explicit. Every assumption is visible and can be argued with.

**Watch out for:** the assumption that trends continue. Exponential trends in the real world eventually bend, and the forecast depends heavily on *when*.

## Compute-anchored models

These estimate how much computation a human-level system might need (sometimes anchored to estimates of the brain's computation) and then forecast when that much compute becomes affordable.

**Good at:** connecting timelines to physical and economic constraints.

**Watch out for:** very wide uncertainty in the anchor itself. Estimates of the relevant compute span many orders of magnitude.

## Comparing the methods

| Method | Updates quickly | Transparent assumptions | Main risk |
| --- | --- | --- | --- |
| Expert surveys | No | No | Framing effects |
| Forecasting platforms | Yes | Partly | Narrow resolution criteria |
| Trend extrapolation | Yes | Yes | Trends bending |
| Compute anchors | No | Yes | Uncertain anchors |

## How to read any AGI date

When you see a forecast, ask three questions:

1. **Which definition of AGI does it use?** (See [what counts as AGI](/blog/what-counts-as-agi/).)
2. **Is it a median or a range?** A single year hides how uncertain the forecast is.
3. **When was it made?** Forecasts have shifted considerably as capabilities have improved, so an old number may no longer reflect what the same people believe.

We keep these questions next to every forecast we report.

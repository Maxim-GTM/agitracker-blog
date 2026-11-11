---
title: "What METR's 1.9x Anthropic acceleration figure measures"
description: "METR's 1.9x is a benchmark-trend ratio for one lab, with a 1.5 to 2.8x interval, a 1.4x cross-lab reading and key evidence redacted. Not an AGI claim."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "Forecasts", "AI Governance"]
faq:
  - q: "Does METR say Anthropic's researchers are 1.9 times as productive?"
    a: "No. The 1.9x is the ratio of two slopes on Anthropic's internal capability index (AECI), comparing growth after a fitted October 7, 2025 breakpoint with growth before it. It is a measure of how fast measured model capability rose, not of output per researcher."
  - q: "Is the 1.5 to 2.8x range the full uncertainty?"
    a: "No. METR's 95% interval comes from bootstrapping benchmark scores and excludes uncertainty about which models are in the fit. Alternative link functions alone moved the estimate from 1.1x to 2.9x, and running the analysis on all developers' frontier models gave 1.4x."
  - q: "Does the report say AI caused all of the acceleration?"
    a: "No. METR's subjective guess is that about 80% of the current, October 2026 acceleration is due to AI, with substantial uncertainty. It gives no formula, and it expects the share of cumulative progress since October 2025 explained by AI to be lower."
  - q: "Is this evidence that AGI has arrived?"
    a: "No. The report does not mention AGI. It estimates a speed-up in one developer's capability growth on mostly well-specified, automatically graded tasks, and flags extra uncertainty about broader, messier work."
---

METR's estimate that Anthropic's AI capability growth has run at 1.9 times its earlier pace is a measured ratio of two benchmark-index trends, not a measure of how much faster Anthropic's researchers work and not a claim about general intelligence. METR's headline judgment is narrower in scope than the number suggests, and wider in range: Anthropic is "likely" improving model capabilities on well-specified tasks at around twice its earlier rate, and METR "would not be surprised" if the true figure were closer to 1.3x or 3x.

The [assessment](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment), published on November 5, 2026, is the result of a high-access engagement that ran from August 12 to October 29, 2026, staffed by about 2.5 full-time-equivalent METR employees. Its authors are Tom Cunningham, Nate Rush, Parker Whitfill and Hjalmar Wijk. The 1.9x figure comes with a 95% interval of 1.5 to 2.8x. The same analysis, run on all developers' frontier models instead of Anthropic's alone, gives 1.4x. And METR states that Anthropic "redacted a majority of the evidence we found most informative for these conclusions."

So the evidence supports a bounded statement: on METR's reading of Anthropic's internal benchmark index, the rate at which Anthropic models improved on automatically graded tasks rose after late 2025, and METR thinks most of the current speed-up comes from AI use. The public can check only part of the basis for that view. AGI Tracker has not had access to any of the underlying data and ran no tests of its own; every measured figure below is METR's or Anthropic's, and the only arithmetic of AGI Tracker's own is labeled as such.

## The dates are easy to conflate

Several different kinds of date sit behind this report: a statistical breakpoint, model training dates, the engagement window, the redaction schedule and the publication date. The table reconstructs them from the report and the two related policy pages.

| Date | What happened | Source |
| --- | --- | --- |
| October 7, 2025 | Fitted breakpoint in the AECI trend. This is an output of the model, not an observed event | METR report |
| July 2026 | Internal "Model 2" finished training | METR report |
| August 12, 2026 | METR engagement begins | METR report |
| August to September 2026 | Internal "Model 3" finished training | METR report |
| September to October 2026 | Internal "Model 4", the most capable internal model in October, finished training | METR report |
| October 14, 2026 | METR publishes its approach to working with AI companies, including a commitment to say publicly whether a company redacted information important to its conclusions | [METR](https://metr.org/blog/2026-10-14-our-approach-to-risk-assessment/) |
| October 15, 2026 | Anthropic announces "employee-like access" for a METR team. METR says this assessment is distinct from that one | [Anthropic](https://www.anthropic.com/news/an-update-on-independent-evaluators) |
| October 25, 2026 | Anthropic's redaction guidance arrives; it is tightened October 27 to 29 | METR report |
| October 29, 2026 | Engagement ends; METR submits a draft public report and the two sides agree an extension of about five days to accommodate the new redaction guidance | METR report |
| November 3, 2026 | METR submits the final public report | METR report |
| November 5, 2026 | Report published | METR report |
| November 6, 2026 | AEF-1 checklist updated; item 1.1 (sufficient access) corrected from "Yes" to "No" | METR report |

Model 4 finished training only weeks before the engagement closed, and the redaction guidance arrived four days before it ended, then was tightened. That matters because the newest internal models are, by METR's account, the main reason its estimate exceeds Anthropic's own published figure. METR also notes that it sees acceleration only after a model is trained, so the index lags research changes by roughly a model's training time.

## What exactly is being divided

The report defines acceleration as "a ratio of growth rates." It uses three rates: historical growth before the trend change, current growth in October 2026, and a counterfactual rate for October 2026 without AI. Only the first two can be observed. The headline 1.9x compares current growth with historical growth. The share attributable to AI would compare current growth with the counterfactual, which can only be estimated.

The growth being measured is on AECI, Anthropic's version of the Epoch Capabilities Index, computed with Epoch's public code. Epoch's [documentation](https://epoch.ai/data/eci-documentation) describes the public index as stitching many benchmarks onto one scale by estimating their relative difficulty wherever models were evaluated on several of them. Anthropic's version scores Model 4 on 15 benchmarks, with names redacted and charts grouped only as math, software engineering, science, multimodal, and language, memory and other.

In the text description of METR's main chart, which runs from Claude 3 Opus in early 2024 to Model 4, "a trend of +15 points per year before October 2025 steepens to +29 points per year after it." Models are dated by when most Anthropic staff could use them internally, which METR says generally shows slightly higher acceleration than public release dates would, because Anthropic is holding recent models internally for slightly longer before release. The main fit uses a single breakpoint and ordinary least squares.

AGI Tracker's worked reading of those reported slopes shows what the ratio does and does not say. Over the twelve months after the breakpoint, a 29-point-a-year trend adds about 14 more index points than a 15-point-a-year trend would have. That is an extra 14 points on a scale whose units the report does not translate into tasks, benchmark percentages or real-world ability; for scale, METR's benchmark diagnostics put Model 4 at 178.6 points. A 1.9x slope ratio says capability on this index rose faster. It does not say an Anthropic researcher now produces 1.9 times as much, and it does not say anything about the level of capability reached.

The ratio is also sensitive to its denominator. METR lists an unusually low historical growth rate as one way the estimate could be overstated. As a purely hypothetical illustration: had the pre-breakpoint slope been 18 points a year instead of 15, the same post-breakpoint slope would give a ratio of about 1.6x. The historical period is also described more than one way. The executive summary compares the current rate with the rate "between March 2024 and October 2025", consistent with the main chart starting in early 2024. The key findings section restates the 1.9x as Anthropic having made as much benchmark progress in the past year as "between October 2023 and October 2025 (roughly, Claude 2.1 to Sonnet 4.5)", and the limitations section refers to Anthropic's "early growth rate" over 2023 to 2025. The second phrasing is a translation of the ratio into two years of progress, reaching back before the earliest model on the main chart, not a separately measured comparison. The report does not spell out how the two relate.

## How wide the uncertainty really is

The 1.5 to 2.8x interval is narrower than the real uncertainty. METR generated it "via bootstrap by drawing benchmark scores with replacement, stratified by model." That captures noise in each model's index score. It does not capture uncertainty about which models belong in the fit, which link function maps capability to benchmark scores, or whether the index is the right instrument.

METR ran those checks separately, and the results are where the spread shows. The worksheet below collects the report's acceleration figures, with what each one measures.

| Estimate | Figure | What it measures | Who produced it |
| --- | --- | --- | --- |
| Main AECI fit (logistic link) | 1.9x (95% CI 1.5 to 2.8x) | Slope ratio on Anthropic's index, Anthropic models only | METR |
| Alternative link functions | 1.1x (complementary log-log) to 2.9x (log-log); probit 1.8x, cauchit 2.8x, learned Stukel 2.6x | Same data, different curve linking capability to benchmark score | METR |
| Benchmark subsets | 2.2x without vision benchmarks; 2.0x with benchmarks Claude labeled AI R&D-relevant; 1.9x dropping poor fits | Same fit, fewer benchmarks | METR |
| Snapshot and regularization choices | 1.9x to 2.2x (snapshots); 1.9x to 2.1x (regularization) | Same fit, different model snapshots or penalty settings | METR |
| Stop using benchmarks above 85% | 1.9x (1.4 to 2.3x) | Saturation check | METR |
| All frontier models | 1.4x (+17 to +24 points a year) | All developers' frontier models, including OpenAI, Google and xAI public models, mid-2024 to October 2026 | METR |
| Calibration and dating grid | 0.99x to 1.90x | Different score calibrations (AECI, the Haiku 5.5 and Opus 5.5 system cards, Epoch's ECI) crossed with different trend choices | METR |
| Haiku 5.5 system card | 1.7x | Anthropic's own published estimate | Anthropic, cited by METR |
| Slack polls of self-reported uplift | About 1.2x (Claude 3.7 Sonnet, early 2025) to about 12x (Model 4, October 2026) | Staff reaction votes on speed-up from the latest model; an uplift level, not an acceleration rate | Anthropic staff; METR calls it "only very loose evidence" |
| Interviews | 2 yes, 3 leans yes, 4 borderline or unclear, 2 no | Claude's classification of 11 anonymized researcher quotes on 2x or greater acceleration | METR, from about 15 interviews |
| Overall judgment | "Around twice"; not surprised at 1.3x or 3x | Holistic judgment including redacted evidence | METR |

Three things stand out. First, the link-function choice alone produces a range from barely any acceleration to nearly triple. Most variants cluster around 1.8 to 2.9x, but the complementary log-log result at 1.1x shows that the modeling assumptions can do much of the work. Second, METR attributes the gap with Anthropic's own 1.7x mainly to its inclusion of newer internal-only models, Models 2, 3 and 4. The newest models, which outsiders cannot query, are pulling the estimate up. Third, the self-reported 12x is not on the same footing as the index-based figures. METR warns that individual uplift estimates "do not correspond to acceleration rates" and says it cares more about changes in the growth of uplift than its level. It also discounts the polls because it expects the responses "come from an unrepresentative subset of staff" and because self-reported uplift can overestimate true productivity impact.

## The 1.4x reading

The cross-lab figure is the most important single check for anyone trying to read this result as a statement about AI progress in general. When METR plotted all frontier models instead of only Anthropic's, the trend rose from +17 to +24 points a year, a 1.4x acceleration. METR notes that in this version the historical trend is estimated mostly from non-Anthropic models and the current trend mostly from Anthropic models.

The report offers two interpretations without choosing between them. One holds that 1.4x is "more accurate," because Anthropic's models were "subfrontier in 2025," so its own historical trend understated progress. The other holds that 1.4x is "understated," because if Anthropic's models are less benchmark-optimized than others, the earlier, mostly non-Anthropic points are more overfit to benchmarks.

The two readings imply different things. The first makes the 1.9x partly a story about one lab catching up with the others. The second makes the cross-lab number the distorted one. The public report does not give enough to settle which is right.

## The instrument is running out of hard tests

METR reports that "Anthropic's internal benchmarks are increasingly saturated: Model 4 achieves greater than 50% on all the AECI benchmarks on which it was tested." When it stopped using each benchmark once scores passed 85%, the estimate stayed at 1.9x but the interval moved to 1.4 to 2.3x, and METR judges the measured acceleration "reasonably robust to saturation concerns." Even so, the authors say the lack of hard benchmarks "makes us somewhat nervous about our ability to measure AECI now and in the future."

This matters because a composite index can only register progress where some component still discriminates between models. As [AGI Tracker's explainer on benchmark saturation](/blog/why-benchmarks-saturate/) sets out, a test near its ceiling stops telling strong systems apart even when it is scored accurately. METR's own [time horizon work](/blog/metr-time-horizons-2026/), covered here in September, hit the same wall: measurements above 16 hours exceeded what its task suite could reliably resolve.

There is a second measurement boundary. The headline explicitly covers "well-specified tasks," and the limitations section says much of the evidence measures "performance on well-specified tasks that are easy to grade automatically or with a language model." METR adds that it has "additional uncertainty in how this acceleration translates to broader and less well-specified tasks." If progress is faster on clean, checkable tasks than on messy ones, the report says, it may overstate real-world acceleration.

## The 80% is a judgment, not a calculation

METR's attribution sentence is: "We guess that a majority (perhaps ≈80%) of the current (October 2026) acceleration is due to AI." It describes this as an overall subjective estimate. No formula is given, which means a reader cannot convert it into a counterfactual multiplier for growth without AI.

The candidates METR considered for the rest are compute scaling, hiring, data improvements, algorithmic discoveries and resolving other bottlenecks. On one of these it is firm: METR was "confident" the acceleration was not due to faster growth in training compute, though it published no compute figures. Hiring is not quantified anywhere in the public report. It surfaces in the interview quotes, where one researcher called it "probably the biggest reason" and another named "Claude automation and hiring" as the two biggest contributors. A third "guesses 15-20% is due to AI," in METR's interview notes. METR also says the late-2025 acceleration "was likely influenced by non-AI factors," with details redacted.

Two qualifications follow. The 80% refers to the instantaneous rate in October 2026, not to cumulative progress since the breakpoint, which METR "generally" expects AI to explain less of. And the report notes that Claude was involved in much of the data collection and analysis, including the interview classification shown in the worksheet above.

## What the redactions remove

In this engagement, according to METR, Anthropic had unilateral redaction rights over all non-public information in the report. (Anthropic's October 15 post describes narrower terms for its separate employee-like access arrangement: it "can't veto publication" but can require redaction of information in predefined categories, and it decides what falls into them.) METR reports that Anthropic's rationale was removing "confidential information that could accelerate other AI developers." The effect, in METR's words: "Some of the key findings that most informed our conclusions about risk were redacted by Anthropic."

According to the report, the redacted or undescribed material includes:

- intermediate metrics;
- algorithmic-progress estimates;
- measurements of key R&D inputs (the data METR saw included headcount, lines of code and AI agent inference spend);
- detailed bottleneck analyses and forecasts, including a forecast for a future model;
- the names of the 15 benchmarks;
- METR's more detailed estimates of the cumulative and instantaneous effects of AI.

Two further scope limits are disclosed. The original contract included verifying how Anthropic allocates compute, particularly between capabilities and safety work. Anthropic dropped that component midway, before METR reached substantive conclusions, saying it wanted to keep the engagement "focused on risk assessment for the time being" and would revisit compute verification later. And METR worked on Anthropic devices without query access to unreleased models.

METR reproduces the AI Evaluator Forum's AEF-1 minimum operating conditions checklist and marks several items "No," including sufficient access with query access (1.1 and 1.1.1), running evaluations directly (3.3), sharing methods for independent review (4.1), disclosure rights granted upfront (4.2), the provider lacking authority to redact concerning findings (4.6), and a responsible disclosure policy (5.4). That disclosure is what METR committed to on October 14, when it said it would describe publicly whether a company redacted information important to its conclusions. Here it did: beyond the AECI analysis, METR says redacted evidence "significantly informed" its view. METR also states it thinks it "extremely unlikely Anthropic was actively trying to mislead us," a judgment it bases partly on finding no discrepancies between its two primary contacts and around 15 other interviewees, many of whom METR chose.

The practical consequence is that the headline "around twice" rests on a public component (the AECI fit and its checks) and a private component the reader must take on trust. METR says the redacted evidence makes recent further acceleration, possibly hyperbolic growth, "seem more plausible." That is a direction, not a number anyone outside can audit.

## Why this is not an AGI claim

The report does not mention AGI. It does not use the phrase "recursive self-improvement." It states that Anthropic's Responsible Scaling Policy lists AI R&D acceleration as a key risk indicator, but says "we do not pay special attention to the thresholds set in the RSP," aiming instead for a holistic picture.

The concern it does raise is compounding. Acceleration from AI use "could start to compound," and METR cites the risk of a "sudden emergence of extreme and risky capabilities." METR writes that "it is possible that automation is close." It says fully autonomous research contributions are not yet a large contributor, while researchers described "signs of life" suggesting they "could occur soon." Over the next 12 months, METR "did not see evidence for significant bottlenecks" in algorithmic progress, training or experiment compute, or data, while saying it is not confident because its view "changed several times."

The gap between this and an AGI claim is a gap in kind, not degree:

| Question | What the report establishes | What an AGI claim would need |
| --- | --- | --- |
| Whose progress? | One developer's models, with a cross-lab check at 1.4x | Evidence across systems, not one lab's trend |
| Which tasks? | Mostly well-specified, automatically graded benchmarks | Broad, open-ended, hard-to-grade work, measured directly |
| What quantity? | Rate of change on an index with no task-level units | A level of capability against a stated definition |
| Basis for cause? | Subjective attribution, about 80%, partly from redacted evidence | Not required, but any causal story would need checkable inputs |
| Independence | Pilot high-access review with redaction rights held by the developer | Results reproducible by parties without such constraints |

[AGI Tracker's comparison of AGI definitions](/blog/what-counts-as-agi/) sets out five influential definitions, and a speed-up in one lab's benchmark growth does not satisfy any of them. An accelerating trend is relevant to how quickly such thresholds might be approached, which is why the compounding question matters. The [Pacing the Frontier letter](/blog/pacing-the-frontier-letter/) covers the governance argument around that loop. But a trend's slope is not its destination.

## What remains unknown

The open questions fall into three groups.

**Measurement.** What one AECI point corresponds to in task terms; whether the slope change survives a breakpoint not fixed at October 7, 2025 (every robustness check uses the same date); whether the 15 benchmarks include public ones; and how the ratio would change if the historical period were defined differently, given that the report describes it both as March 2024 to October 2025 and as 2023 to 2025.

**Attribution.** How much of the remaining share belongs to hiring versus algorithmic discoveries; what the cumulative, rather than instantaneous, AI share is; and whether self-reported uplift tracks any measured productivity change.

**Access.** What the redacted intermediate metrics show; and what the canceled compute-allocation work would have found.

## What evidence would change the conclusion

The following are proposed by AGI Tracker, not tests METR or Anthropic has announced.

- **A breakpoint sweep.** Refit the AECI trend with the breakpoint free or varied across 2025. If the 1.9x holds only near October 7, the "permanent slope change" reading weakens. METR reports that a slope change beat a one-time jump at Mythos Preview in 81% of bootstrap draws; a sweep would test the date as well as the shape.
- **A cross-lab replication.** Run the same index method on another developer's internal model sequence under comparable access. A similar ratio would make 1.9x look like an industry pattern; a ratio near 1.0 would support the catching-up reading.
- **Harder or messier tasks.** Track acceleration on tasks that remain unsaturated and are not automatically graded, such as long-horizon research work assessed by experts. Convergence with the AECI ratio would extend the result beyond well-specified tasks; divergence would bound it.
- **Measured uplift.** Compare self-reported uplift with an observed productivity measure for the same staff and period. A large gap would further discount the 12x polls.
- **Partial unredaction or aggregation.** Publication of intermediate metrics in aggregated form, or a third party with full access stating whether they match METR's direction, would reduce the share of the conclusion that rests on trust.

METR's report is unusually candid about where its evidence is weak, and that candor is the most useful thing in it. The defensible summary is this: a careful external team, with substantial but constrained access, measured roughly a doubling in the rate of one lab's benchmark-index growth, judged that most of the current speed-up comes from AI, and could not show the public most of what convinced it. That is a meaningful signal about the pace of AI-assisted research at one company. It is not a measurement of general intelligence. For how to weigh composite scores like this one, [AGI Tracker's guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) sets out the questions to ask first.

## Sources

- [METR: Independent Assessment of AI R&D Acceleration at Anthropic in October 2026](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment)
- [METR: Our approach to working with AI companies](https://metr.org/blog/2026-10-14-our-approach-to-risk-assessment/)
- [Anthropic: An update on independent evaluators](https://www.anthropic.com/news/an-update-on-independent-evaluators)
- [Epoch AI: Epoch Capabilities Index documentation](https://epoch.ai/data/eci-documentation)

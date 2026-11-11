---
title: "Epoch's capability index can now put odds on rankings"
description: "Epoch's Bayesian ECI refit gives GPT-6 Astra a 72% chance of being more capable than Claude Opus 5.5. How the odds work, and where calibration falls short."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["Evaluation", "Benchmarks", "Research"]
faq:
  - q: "Does a 72% probability mean GPT-6 Astra wins 72% of head-to-head tasks?"
    a: "No. It is Epoch's posterior probability that Astra has the higher value of one latent capability parameter, given the benchmark data and the model's assumptions. It is not a win rate on any task."
  - q: "Did the frontier rankings change much under the Bayesian refit?"
    a: "Not by much, according to Epoch. For the 176 models at or above ECI 125, the new and old estimates differ by 0.9 points on average, and every new value sits inside its previous 90% interval."
  - q: "Which models moved most?"
    a: "Weak, older models. Epoch reports that all 76 models below ECI 125 moved down, by 13.7 points on average, and the 21 models previously below 100 moved down by 27 points on average."
  - q: "Is the new model well calibrated?"
    a: "On held-out scores overall, Epoch reports 89.6% coverage for its 90% intervals. Near zero it is weaker: 80.5% of held-out scores at or below 0.05 fall inside their 90% intervals."
---

On November 4, Epoch AI switched its Epoch Capabilities Index (ECI) from a least-squares fit to a Bayesian model. The practical change for anyone reading the leaderboard is that the index can now say how likely one model is to be more capable than another, rather than only printing two scores and two overlapping error bars. In the [methodology report](https://epoch.ai/publications/eci-bayesian-methodology) by Emilia Álvarez and Alexander Barry, GPT-6 Astra has a 72% probability of being more capable than Claude Opus 5.5 and a probability above 99% of being more capable than Claude Fable 5.1. Against GPT-6.1 Sol, the figure is only 54%.

Those numbers need careful reading. A 72% figure is a statement about one latent parameter in one statistical model, fitted to 2,810 benchmark scores. It is not a forecast of which model will win on a given task, and it is not the kind of probability Epoch's calibration tests directly checked. What Epoch did check, the coverage of its predicted benchmark scores, comes out close to target overall and noticeably short of target for scores near zero.

This explainer covers how the refit works, what a pairwise probability does and does not mean, how much the numbers moved, and what the calibration evidence supports. AGI Tracker has not refit the model or rerun Epoch's code. All results below are Epoch's, from data the report says was accessed on October 26, 2026.

## Dates and what each one refers to

Several dates are in play, and they refer to different things.

| Date | What happened | Source |
| --- | --- | --- |
| November 6, 2025 | Epoch data insight explains how the ECI stitches together benchmarks across a wide range of difficulties | [Interpreting the ECI](https://epoch.ai/data-insights/interpreting-eci) |
| November 28, 2025 | "A Rosetta Stone for AI Benchmarks" submitted to arXiv, the framework behind the ECI | [arXiv:2512.00193](https://arxiv.org/abs/2512.00193) |
| May 4, 2026 | ECI documentation published on epoch.ai | [ECI changelog](https://epoch.ai/data/eci-documentation/changelog) |
| September 1, 2026 | Epoch data insight reports the frontier advancing 14 points per year since reasoning models, using data accessed that day | [ECI frontier trend](https://epoch.ai/data-insights/eci-frontier-trend) |
| September 7, 2026 | General-Purpose AI Policy Lab researchers publish a four-axis Bayesian extension of the ECI, which they say follows Alexander Barry's earlier Bayesian version of the index | [Four-axis Bayesian ECI](https://www.greaterwrong.com/posts/gbJYR8TMaQKsvjrkh/a-four-axis-bayesian-epoch-capabilities-index-with-human) |
| October 4, 2026 | AGI Tracker's [top AI models ranking](/blog/top-ai-models/) cites the frequentist ECI with Claude Opus 5.5 first and GPT-6 Astra second | This site |
| October 14, 2026 | Data snapshot used for the report's alternative-model experiments (Appendix A) | Methodology report |
| October 26, 2026 | Data snapshot for the main Bayesian results: 2,810 scores, 252 models, 59 benchmarks | Methodology report |
| November 4, 2026 | Report published; changelog records the switch to the Bayesian model | Report and changelog |

The live [ECI page](https://epoch.ai/eci) offers a CSV, marked as updated November 11, 2026, described as "ECI estimates, credible intervals, release dates, and model metadata." AGI Tracker did not find pairwise probabilities in that page's static content. The report itself says Epoch hopes "to present more results like this alongside the ECI in the future." So the accurate claim today is that the index *can* produce ranking probabilities, with worked examples in the report, rather than that every ranking on the leaderboard is now displayed as a probability.

## What the ECI is estimating

The ECI is built on Item Response Theory, a framework originally developed for educational testing to compare students who took tests of different difficulty. Each AI model gets one capability value, and each benchmark gets a difficulty and a slope. Epoch's predicted score for model *m* on benchmark *b* is a logistic curve: σ(α_b[C_m − D_b]). When a model's capability equals a benchmark's difficulty, the predicted score is 50%. The slope sets how quickly predicted scores move away from 50% as the gap grows.

Before fitting, each benchmark's scores are rescaled so random guessing maps to 0 and the ceiling maps to 1. Only benchmarks scored between 0 and 100% are used, which is why Elo-style leaderboards are excluded. Where a model has several versions, Epoch keeps its best score on each benchmark. The scale is then anchored so Claude 3.5 Sonnet sits at 130 and GPT-5 at 150. Those two numbers are conventions, not measurements; the [ECI FAQ](https://epoch.ai/data/eci-documentation/faq) says absolute values are meaningless by themselves and only differences between models carry information.

The key structural assumption is that a single capability dimension explains performance on every benchmark. That assumption did not change in the refit. Everything about the new probabilities inherits it.

## What changed in the fit

Epoch's report lists five changes, and its changelog adds a new inclusion rule. The table compares the old and new methods.

| Component | Previous frequentist fit | New Bayesian fit |
| --- | --- | --- |
| Estimation | One best-fitting parameter set by least squares, with a small ridge penalty | MCMC samples from a posterior (NUTS in PyMC, 4 chains) |
| Uncertainty | 90% confidence intervals from 500 bootstrap resamples of each model's scores | 90% credible intervals from the 5th to 95th percentile of posterior draws |
| Likelihood | Comparable, Epoch says, to a normal likelihood with the same noise for every prediction | Beta likelihood: predictions stay inside 0 to 1 and noise shrinks near the boundaries |
| Benchmark noise | Same for every benchmark | Learned separately for each benchmark |
| Scale identification | WinoGrande slope fixed at 1 | Geometric mean of all slopes fixed at 1; difficulties sum to zero |
| Priors | None (penalty and bounds instead) | Flat Uniform(−50, 50) on capability and difficulty; hierarchical log-normal on slopes and noise |
| Inclusion rule | Drop models with fewer than four benchmark scores | Keep models with at least four scores between 0.1 and 0.9 after normalization |
| Pairwise comparison | Not designed for it | Probability one model exceeds another, from the joint posterior |

Two of these matter most for leaderboard readers. The first is the bootstrap problem. Epoch's median model has ten benchmark scores, and some have as few as four. A bootstrap resample draws from those scores with replacement, so each resample leaves out about a third of a model's scores and double-counts others. With four to ten observations, Epoch argues, the spread across resamples does not reliably measure the real uncertainty. A Bayesian fit uses all the data at once and draws uncertainty from a single joint model.

The second is per-benchmark noise. Epoch's example: a model predicted to score 50% typically lands within 46 to 54% on METR Time Horizons, but within 32 to 68% on VPCT. Treating those two benchmarks as equally noisy, as least squares implicitly does, gives the noisier one too much weight in some places and too little in others. The new model learns a noise level for each benchmark.

The sampler diagnostics Epoch reports are clean: no divergences in 4,000 draws, a highest R-hat of 1.005, a lowest bulk effective sample size of 1,230. Sampling takes about a minute on an M5 MacBook Pro. The code is public in Epoch's [eci-public repository](https://github.com/epoch-research/eci-public), whose README says the Bayesian fit is now the default and the least-squares fit is deprecated.

## What "P(A ahead of B)" means

Each MCMC draw is one internally consistent guess at every model's capability and every benchmark's difficulty, slope and noise. Because every parameter is estimated jointly, a reader can compute any function of them in each draw, including the gap between two models. The probability that Astra is more capable than Opus 5.5 is the share of posterior mass in which that gap is positive.

The report shows why this matters. Read separately, the two models' 90% intervals overlap almost entirely: Astra runs from 166.2 to 172.7, and Opus 5.5 from 165.8 to 172.0. A reader comparing those bars would conclude the two are indistinguishable. But Epoch reports that the 90% interval for the *gap* between them runs from −0.9 to +2.1, about half the width of either model's own interval.

The reason is shared uncertainty. Epoch says much of each model's uncertainty is shared across models, and the anchors are one source of it. Because the distance from Claude 3.5 Sonnet to GPT-5 is fixed at exactly 20 points, a draw in which the anchors sit closer together stretches the whole scale. Models near each other move up or down together, so their difference is less uncertain than either value.

### A worked example with invented numbers

The table below uses hypothetical posterior draws for two models, X and Y. These are not Epoch's draws; they illustrate the mechanism.

| Hypothetical draw | Model X | Model Y | Gap (X − Y) | X ahead? |
| --- | --- | --- | --- | --- |
| 1 | 167.0 | 166.2 | +0.8 | Yes |
| 2 | 171.4 | 170.9 | +0.5 | Yes |
| 3 | 168.3 | 168.9 | −0.6 | No |
| 4 | 169.8 | 168.5 | +1.3 | Yes |
| 5 | 172.1 | 171.0 | +1.1 | Yes |

Across these five draws, Model X ranges over 5.1 points and Model Y over 4.8 points. Their gap ranges over only 1.9 points, and X leads in four of five draws: a crude 80%. The bars overlap heavily, yet the ordering is fairly consistent, because the draws in which X is high are also draws in which Y is high.

Epoch's final fit retained 4,000 draws, and in a sampled posterior a pairwise probability is in practice the proportion of draws with a positive gap. The report does not print the count behind its 72% figure; 72% of 4,000 would be roughly 2,880 draws. As in the toy table, overlapping error bars do not mean a coin flip.

### How to read different probability levels

The following reading guide is AGI Tracker's interpretation, not an Epoch rule.

| Reported P(A more capable than B) | Reasonable reading | What it does not license |
| --- | --- | --- |
| About 50% (e.g., Astra vs GPT-6.1 Sol at 54%) | The data do not order the two models on this index | Saying the models are equally capable on your workload |
| 70 to 80% (e.g., Astra vs Opus 5.5 at 72%) | A lean toward A; roughly one chance in four or five that B is ahead under the model | Calling A "the best model" without qualification |
| 95% or higher (e.g., Astra vs Fable 5.1 at over 99%) | A clear ordering on this index, given its assumptions | Claims about specific tasks, domains or deployment settings |

The 72% figure also clarifies a ranking on this site. AGI Tracker's October [top AI models](/blog/top-ai-models/) article, using the frequentist index, gave Claude Opus 5.5 167.35 and GPT-6 Astra 166.51. The Bayesian report presents Astra as the leader of its comparison set, describing "the five models closest behind" it. The pairwise order between Astra and Opus 5.5 has flipped, but at 72% it is a lean, not a settled result, and Astra's 54% edge over GPT-6.1 Sol is close to a coin flip. The report's text does not say whether the old method would also put Astra ahead on the October 26 data, so it is not possible to tell from the report how much of the change comes from the new method and how much from benchmark scores added since the earlier snapshot.

## How much the numbers moved

Epoch splits the 252 models at ECI 125. For reference, GPT-4, which Epoch describes as the earliest model in its frontier trend and the weakest frontier model in its dataset, sits at 126 under the old fit and 122 under the new one.

| Group (by previous ECI) | Models | Mean change | Mean absolute change | Largest change | Average 90% interval width |
| --- | --- | --- | --- | --- | --- |
| 125 and above | 176 | −0.1 | 0.9 | −4.1 | 13% narrower |
| Below 125 | 76 | −13.7 | 13.7 | −39.2 | 33% wider |

For the upper group, Epoch reports an R² of 0.995 between new and old values and an RMSE of 1.1 points. Every model's new value lies inside its previous 90% interval. Among models above ECI 150, 87% move up, by 0.7 points on average and 2.3 at most. All 20 top-ranked models get narrower intervals.

The weak models tell a different story. All 76 below 125 move down, and the 21 models previously below 100 fall by 27 points on average. The weaker the model, the larger the drop, which stretches the bottom of the scale rather than shifting it. Their intervals widen.

Epoch attributes part of this to dropping the old regularization, which pulled every capability toward zero on the raw scale and mattered most for weak models measured on a few, mostly saturated, benchmarks. Refitting the old least-squares model without the penalty and bounds moves models below 100 down by 10.5 points (versus 27 under the Bayesian fit) and models between 100 and 125 down by 3.6 (versus 8.8). The rest, Epoch says, comes from the new model. In Appendix A, the authors also report that switching from normal to uniform priors moved models below 100 about 20 points lower while leaving models above 130 within 0.3 points on average. They note that the data alone cannot distinguish the two priors, and chose uniform priors so that the scores, not the prior, set how weak these models are.

That is a judgment call: the bottom of the scale is where the data are thinnest and the prior has the most influence. Epoch's argument that it does not matter for typical uses, because these models sit far below the frontier, is reasonable, but anyone measuring long-run progress from older models should note that the starting points moved.

### Frontier trends

The trend slopes get slightly steeper.

| Era | Frequentist ECI/year (90% interval) | Bayesian ECI/year (90% interval) |
| --- | --- | --- |
| Pre-reasoning (GPT-4 to GPT-4.5) | 6.2 (2.8 to 7.8) | 8.0 (5.4 to 9.7) |
| Reasoning (from o1-mini) | 15.7 (13.8 to 19.2) | 16.6 (14.6 to 18.7) |

Epoch says the change is likely due mainly to scale: the Bayesian fit places Claude 3.5 Sonnet and GPT-5 closer together in raw capability, so fixing their gap at 20 points stretches the scale. GPT-4 to Claude Opus 5.5 is 46.9 points in the Bayesian fit versus 43.0 in the frequentist one. In the new trend analysis, each posterior draw selects its own frontier models, so the intervals include uncertainty about which models count as frontier.

The reasoning-era frequentist slope here, 15.7 points per year, differs from the 14 points per year in Epoch's September 1 data insight. The two use different data snapshots, from September 1 and October 26. Anyone quoting a single "points per year" figure should name the snapshot and the fit.

## What the calibration results say

Calibration asks whether stated uncertainty matches reality: of the observed scores, roughly 90% should fall inside their 90% predictive intervals. Epoch checks this both in-sample and with leave-one-out estimates (approximated with PSIS-LOO for the Bayesian fit), which test how well the fit predicts scores it has not seen.

| Check (90% target) | Frequentist in-sample | Frequentist leave-one-out | Bayesian in-sample | Bayesian leave-one-out |
| --- | --- | --- | --- | --- |
| All scores | 93.8% | 88.6% | 94.4% | 89.6% |
| Scores ≤ 0.05 | 96.0% | 94.5% | 87.5% | 80.5% |
| Scores ≥ 0.95 | 99.1% | 98.2% | 94.7% | 93.0% |
| RMSE | 0.076 | 0.094 | 0.079 | 0.092 |

Out of sample, the Bayesian fit is close to target overall. At other levels, its leave-one-out coverage is 50.8% for 50% intervals, 79.9% for 80%, 94.4% for 95% and 98.3% for 99%. Point accuracy is essentially unchanged: the frequentist fit is slightly better in-sample, the Bayesian fit slightly better out of sample.

Near zero, the numbers need interpreting. The frequentist fit's 94.5% looks better than the Bayesian 80.5%, but Epoch explains why: the old intervals did not narrow near the boundaries, and about a fifth of them extended into impossible values. A model predicted to score 0.02 got a range of roughly −0.1 to 0.15. High coverage bought with intervals that include negative scores is not good calibration. The Bayesian intervals respect the 0 to 1 range, but they are too narrow near zero: about one held-out low score in five falls outside its 90% interval, against a target of one in ten.

The appendix adds context. About 3.1% of observed scores (in the October 14 data) are exactly zero, and a beta distribution cannot place probability on exactly zero. Epoch tested likelihoods with point masses at 0 and 1. Those predicted exact zeros better, but Epoch found the improvement held only for the weakest models and made intervals too wide elsewhere. None of the alternatives improved enough to justify the added complexity, and under uniform priors the beta was the only likelihood that sampled reliably.

### What the calibration does not test

This is the most important limit for leaderboard readers. Every coverage figure above checks *predicted benchmark scores* against *observed benchmark scores*. None checks the pairwise ranking probabilities. There is no observable ground truth for "Model A has more latent capability than Model B," so a 72% figure cannot be scored the way a predicted benchmark result can.

Good score-level calibration is supporting evidence that the posterior is reasonable. It does not establish that among all pairs assigned 72%, the higher-ranked model "really" leads 72% of the time. That probability is conditional on the one-dimensional model, the benchmark set, the best-score-per-model rule, the anchors and the priors. Change any of those and the number can change.

## What remains unknown

**Whether one dimension is enough.** The ECI assumes a single capability axis. The September 7 four-axis post by Yassine Essifi and Jérémy Andréoletti, an independent extension built on the same Bayesian approach with human baselines added, argues that one index cannot reproduce cases where humans and models have opposite orderings across benchmarks. On their own benchmark table, their one-dimensional fit scored much worse on leave-one-out predictive fit than the four-axis version. Their data, benchmark set and inclusion of human test-takers differ from Epoch's, so this is not a direct test of the ECI. But if capability has several axes, a single-axis ranking probability is a probability about a weighted summary.

**Domain rankings.** Epoch's changelog says domain-specific ECIs have not yet been refit with the Bayesian method. They still combine least-squares domain estimates with samples from the general fit. Pairwise probabilities for, say, math or coding are not yet produced by the new model.

**Anchor dependence.** Claude 3.5 Sonnet and GPT-5 have no uncertainty by construction. Every interval is relative to them. The FAQ says the anchors may be revisited as models and benchmarks change.

**Data provenance.** Scores come partly from independent third parties, partly from Epoch's own runs, and, for older benchmarks, from developer reports such as model cards and technical reports. The FAQ acknowledges that developers can optimize for benchmarks, which would inflate estimates. A posterior can quantify noise in the data it is given; it cannot correct for systematic bias in which scores exist.

**Benchmark-level, not item-level.** The model fits aggregate benchmark scores rather than individual question responses. The four-axis authors flag this as a limitation they share with the ECI.

**Stability.** The fit is joint, so new models and new scores can shift every estimate, including for models whose data have not changed. A 72% today may be 60% or 85% after the next snapshot.

## Evidence that would change the reading

The following tests are proposed by AGI Tracker, except where attributed. None has been run.

1. **A ranking backtest.** Fit the model on an older snapshot, record pairwise probabilities for close pairs, then check how often the ordering holds once later benchmark scores arrive. The four-axis authors propose a similar backtest for their own forecasts. Stability is not ground truth, but a model whose 70% calls reverse half the time would be overconfident about orderings.
2. **Published pairwise probabilities with snapshot dates.** If the leaderboard showed P(A ahead of B) for adjacent models, along with the data date, readers could see which rank changes are meaningful.
3. **Near-zero coverage by model strength.** Breaking the 80.5% figure down by whether the low score comes from a weak model or a frontier model on a new, very hard benchmark would show whether the shortfall matters at the frontier.
4. **Sensitivity to anchors and inclusion rules.** Reporting how the Astra versus Opus 5.5 probability moves under alternative anchors or a different minimum-score rule would show how much the ordering depends on conventions.
5. **A domain refit.** Bayesian domain-specific ECIs would show whether a model that leads overall also leads within each domain, and with what probability.

## What this means for leaderboard readers

Epoch's evidence supports three conclusions: frontier ECIs moved by about one point and stayed inside their old intervals; weak, older models now sit much lower, partly because of a prior choice the data cannot settle; and out-of-sample score coverage is close to target overall but short near zero.

For readers, the useful change is that overlapping error bars are no longer the end of the analysis. Two models whose intervals overlap almost completely can still have a fairly clear ordering, because much of their uncertainty is shared. But a 72% posterior probability of higher latent capability on a one-dimensional index is a precise, model-conditional claim, not a statement about AGI or about which model will serve a particular workload better. For the broader method of reading such results, see the guide to [reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/), the explanation of [why benchmarks saturate](/blog/why-benchmarks-saturate/), and the analysis of [METR's time horizons](/blog/metr-time-horizons-2026/), another single-scale measure of progress.

## Sources

- [Updating the Epoch Capabilities Index methodology to use a Bayesian model (Epoch AI, November 4, 2026)](https://epoch.ai/publications/eci-bayesian-methodology)
- [ECI documentation: methodology](https://epoch.ai/data/eci-documentation/methodology)
- [ECI documentation: changelog](https://epoch.ai/data/eci-documentation/changelog)
- [ECI documentation: FAQ](https://epoch.ai/data/eci-documentation/faq)
- [Epoch Capabilities Index live page and data download](https://epoch.ai/eci)
- [Epoch's Capabilities Index stitches together benchmarks across a wide range of difficulties (Epoch AI, November 6, 2025)](https://epoch.ai/data-insights/interpreting-eci)
- [The ECI frontier has advanced by 14 points per year since the introduction of reasoning models (Epoch AI, September 1, 2026)](https://epoch.ai/data-insights/eci-frontier-trend)
- [eci-public code repository](https://github.com/epoch-research/eci-public)
- [A Rosetta Stone for AI Benchmarks](https://arxiv.org/abs/2512.00193)
- [A Four-Axis Bayesian Epoch Capabilities Index with Human Baselines (Essifi and Andréoletti, September 7, 2026)](https://www.greaterwrong.com/posts/gbJYR8TMaQKsvjrkh/a-four-axis-bayesian-epoch-capabilities-index-with-human)
- [Practical Bayesian model evaluation using leave-one-out cross-validation and WAIC](https://arxiv.org/abs/1507.04544)

---
title: The open-weight frontier now speaks Mandarin
description: Chinese labs now own the open-weight frontier. How close Kimi K3, DeepSeek V4 and Qwen3.8 really are to US models, what they cost, and why it matters.
pubDate: 2026-08-27
tags: [Open Source, AI Industry]
author: team
cover: ./cover.png
coverAlt: Neobrutalist illustration of a padlocked white box on the left and an open green crate on the right, with colourful blocks flying out of the crate, a dashed arrow between them.
faq:
  - q: What is the best open-weight AI model in August 2026?
    a: On Epoch AI's Capabilities Index and on Artificial Analysis's Intelligence Index, the top open-weight model as of late August 2026 is Moonshot AI's Kimi K3, a 2.8-trillion-parameter mixture-of-experts model released on July 16, 2026, with weights published on July 27. Its license is not fully permissive, though; large commercial users must sign a separate agreement.
  - q: How far behind US frontier models are Chinese open models?
    a: Estimates range from about three to eight months. Epoch AI found open-weight models trailed closed ones by an average of four months in 2026; DeepSeek's own V4 report says three to six months; the US government's CAISI put DeepSeek V4 Pro about eight months behind. The answer depends on which benchmarks you trust.
  - q: Why do Chinese AI labs release open weights?
    a: Analysts point to adoption, prestige and developer ecosystems, plus practical limits. CSIS notes that US export controls restrict Chinese labs' access to top chips and that they lack the global inference capacity of US hyperscalers, so letting others host their models spreads them further.
  - q: Are Chinese open-weight models cheaper than US models?
    a: Usually, by a lot. In late August 2026, DeepSeek V4-Pro listed at $1.32 input and $3.96 output per million tokens at peak hours, versus $10 and $50 for Claude Fable 5 and $4 and $20 (promotional) for GPT-5.6 Sol. Kimi K3, at $3 and $15, is the priciest of the Chinese group.
---

On July 27, Moonshot AI uploaded a 2.8-trillion-parameter model to Hugging Face and anyone with enough GPUs could download it. The file was called Kimi K3, and for the first time a model you can keep on your own disk scored within a few points of the best systems that American labs keep locked behind an API. No American lab has released anything comparable this year.

The open-weight frontier used to be a Meta and Mistral story. In 2026 it is a Beijing, Hangzhou and Shanghai story, and the release calendar looks less like a series of breakthroughs than a factory line.

**TL;DR**

- Since DeepSeek-V3 in December 2024, **every new record for the best open-weight model** on Epoch AI's Capabilities Index has been set by a Chinese lab. Kimi K3 holds it now.
- The gap to closed US models is **real but small**: Epoch AI puts it at about four months on average this year; the US government's CAISI measured DeepSeek V4 Pro at about eight.
- Prices are where China wins outright: DeepSeek V4-Pro's output tokens cost **about a fifth of GPT-5.6 Sol's and a twelfth of Claude Fable 5's**, and V4-Flash is cheaper still.
- The strategy is partly forced: export controls limit chips, so labs **let the world host their models** and win adoption instead. Chinese models took 41% of Hugging Face downloads over the past year.
- The skeptic's case is serious: self-reported benchmarks that don't always replicate, high hallucination rates, restrictive "open" licenses, and **distillation accusations** from Anthropic and OpenAI. And weights, once published, can't be recalled.

## Eight months, six labs, a dozen releases

Start with the calendar. Between January and August 2026, six Chinese companies shipped open-weight models that would each have been headline news two years ago.

![Timeline of 2026 Chinese open-weight model releases by lab: DeepSeek V4 in April with GA releases in July and August, Moonshot's Kimi K2.5, K2.6, K2.7 Code and Kimi K3, Alibaba's Qwen3.5, Qwen3.6 and Qwen3.8, Zhipu's GLM-5 through GLM-5.3-Flash, MiniMax M2.5, M2.7 and M3, and Xiaomi's MiMo-V2.5.](./release-timeline.png)
*Figure 1: Selected Chinese open-weight releases, January to August 2026. Source: [Epoch AI model data](https://epoch.ai/benchmarks) and the labs' model cards.*

The headliners:

| Model | Lab | Released | Size (total / active) | Context | License |
| --- | --- | --- | --- | --- | --- |
| [DeepSeek V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) | DeepSeek | Apr 24 (preview), Aug 13 (GA) | 1.6T / 49B | 1M | MIT |
| DeepSeek V4-Flash | DeepSeek | Apr 24 (preview), Jul 31 (GA) | 284B / 13B | 1M | MIT |
| [GLM-5.2](https://huggingface.co/zai-org/GLM-5.2) | Zhipu (Z.ai) | Jun 16 | 753B total | 1M | MIT |
| [MiniMax-M3](https://huggingface.co/MiniMaxAI/MiniMax-M3) | MiniMax | Jun 1 | ~428B / ~23B | 1M | Custom community license |
| [Kimi K3](https://huggingface.co/moonshotai/Kimi-K3) | Moonshot AI | Jul 16 (weights Jul 27) | 2.8T / 104B | 1M | Custom "Kimi K3 License" |
| [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) | Alibaba | API early Aug, weights Aug 12 | 2.4T / 95B | 262K native, ~1M extended | Custom Qwen license |

A few details stand out. DeepSeek's [April preview](https://api-docs.deepseek.com/news/news260424/) made a 1M-token context "the default across all official DeepSeek services," and retired the old split between its chat and reasoner models; V4 is one model with adjustable reasoning effort. The Register reported that V4 [uses 9.5x to 13.7x less memory](https://www.theregister.com/2026/04/24/deepseek_v4/) than V3.2 at that context length, and that DeepSeek validated it on Huawei Ascend chips as well as Nvidia GPUs. Alibaba, which had kept several recent flagships proprietary, [made Qwen3.8-Max its first Max-class model](https://www.scmp.com/tech/article/3362738/alibabas-ai-model-qwen38-max-made-widely-accessible-ahead-open-weights-release) with public weights. And Xiaomi, a phone maker, [open-sourced its MiMo-V2.5 and 1.02-trillion-parameter V2.5-Pro](https://en.wikipedia.org/wiki/Xiaomi_MiMo) under MIT in April.

The one big name mostly absent from the open-weight race is ByteDance. Its Seed team publishes research models, such as the Apache-licensed [Seed-OSS-36B](https://github.com/ByteDance-Seed/seed-oss) from August 2025, but none of its public releases is frontier-scale.

Hugging Face's own [summer 2026 review](https://huggingface.co/blog/state-of-open-models-summer-2026) (August 14) put the scale gap bluntly: in almost every month of 2026, the biggest Chinese open model was larger than anything an American lab released, with US open models under 130 billion parameters in five of seven months.

## How close are they, really?

"Close to the frontier" is a claim every lab makes, so we went to the data. Epoch AI's [Capabilities Index (ECI)](https://epoch.ai/benchmarks) stitches dozens of benchmarks into one score, and its dataset is public. We plotted the best closed model and the best open-weight model at every point since GPT-4.

![Step chart of the best closed and best open-weight model scores on Epoch's Capabilities Index from 2023 to August 2026. The gap shrinks from 16 points in March 2023 to 5.9 points in August 2026, and every open-weight record since December 2024 is held by a Chinese lab.](./frontier-gap.png)
*Figure 2: Best closed vs best open-weight model on the Epoch Capabilities Index, March 2023 to August 27, 2026. Source: [Epoch AI, Capabilities & Benchmarking](https://epoch.ai/benchmarks) (CC BY), our analysis.*

Three things jump out.

1. **The gap shrank, then stalled, then shrank again.** In March 2023, GPT-4 led the best open model by 16 ECI points. By early 2025, after DeepSeek-R1, it was under 3. It widened again to about 11 to 12 points by early summer 2026 as OpenAI and Anthropic shipped GPT-5.5 Pro and Claude Fable 5, then Kimi K3 pulled it back to 5.9.
2. **The open side changed nationality.** Llama, Mixtral and even Microsoft's Phi-4 held the open record at various points through 2024. Since DeepSeek-V3 in December 2024, every new record has been Chinese: DeepSeek, Qwen, Kimi, GLM. The best US open-weight model in the dataset, Thinking Machines' Inkling-Small (July 2026), scores about 150, roughly where Kimi K2.6 was in April.
3. **In calendar time, it's a few months.** Kimi K3's score of 157.7 was first beaten by a closed model in March 2026, so it launched about four months behind. Epoch's own analysis, published May 29, reached the same number: [open models lag closed ones by "an average of four months"](https://epoch.ai/data-insights/open-closed-eci-gap) since January 2026, up slightly from the [three months](https://epoch.ai/data-insights/open-weights-vs-closed-weights-models) it measured through October 2025.

Other scorekeepers broadly agree. Artificial Analysis [ranked Kimi K3 third](https://artificialanalysis.ai/articles/kimi-k3-achieves-3-in-the-artificial-analysis-intelligence-index-comparable-to-opus-4-8-and-gpt-5-5) on its Intelligence Index at launch, at 57, with GLM-5.2 at 51. DeepSeek's V4 technical report, as [quoted by TechCrunch](https://techcrunch.com/2026/04/24/deepseek-previews-new-ai-model-that-closes-the-gap-with-frontier-models/), describes "a developmental trajectory that trails state-of-the-art frontier models by approximately 3 to 6 months."

The US government is less generous. The Center for AI Standards and Innovation (CAISI) at NIST [evaluated DeepSeek V4 Pro](https://www.nist.gov/news-events/news/2026/05/caisi-evaluation-deepseek-v4-pro) on its own benchmarks, some of them held out, and concluded that "DeepSeek V4's capabilities lag behind the frontier by about 8 months," performing about like GPT-5. It also flagged gaps between DeepSeek's self-reported scores and CAISI's results on held-out tests.

So which is it: three months or eight? It depends on the ruler. Public benchmarks, which labs can tune toward, flatter the challengers; held-out tests are harsher. That is the same lesson as in [how to read an AI benchmark](/blog/how-to-read-an-ai-benchmark/): trust results that replicate on tests the lab didn't choose.

<details>
<summary>Nerd corner: how we built the gap chart</summary>

We downloaded Epoch AI's ECI scores (the `eci_scores.csv` file in its benchmarking data) and kept every model released on or before August 27, 2026. For each date we took the running maximum ECI for models Epoch labels "Closed weights" and for models labelled "Open weights" (which includes restricted and non-commercial licenses such as Kimi K3's). Colours mark the country of the lab holding each open record.

Caveats: ECI scores are estimates with confidence intervals of several points; Epoch revises them as benchmarks are added; and unreleased models such as Anthropic's Claude Mythos Preview are not in the closed line, so the true frontier is probably higher than shown. The "months behind" figure measures when a closed model first matched the open model's score, which rewards open models for catching up to last season's closed release.
</details>

## Why Chinese labs give their weights away

Releasing weights for a model that cost a fortune to train looks like leaving money on the table. The think tanks that study this point to a mix of strategy and necessity. CSIS's Yasir Atalan put it plainly in a July 2 briefing:

> "Chinese labs use open-weight releases to build adoption, prestige, and developer ecosystems."

The same [CSIS analysis](https://www.csis.org/analysis/what-know-about-chinese-ai-models) adds the constraint: "U.S. export controls limit access to the best AI chips, and Chinese labs do not have the same global inference capacity as U.S. hyperscalers." If you can't build enough data centers to serve the world, let the world run your model on its own.

It works. Hugging Face's [spring 2026 report](https://huggingface.co/blog/huggingface/state-of-os-hf-spring-2026) found that Chinese models accounted for 41% of downloads over the previous year and had overtaken the US in both monthly and total downloads. Alibaba's Qwen family alone has spawned more than 113,000 derivative models.

Open weights also double as a pricing weapon. When Alibaba put Qwen3.8-Max on the market, one [Yahoo Finance analysis](https://finance.yahoo.com/technology/ai/articles/qwen3-8-max-capability-war-162320284.html) described the move as "cannibalizing its own commercial offering to force a rapid commoditization of high-end intelligence."

Then there are the chips. In January, the Commerce Department [shifted to case-by-case review](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china) for exports of Nvidia's H200 and AMD's MI325X to China. CNAS, [analysing the policy](https://www.cnas.org/publications/cnas-insights/cnas-insights-unpacking-the-h200-export-policy), noted that "Chinese AI companies themselves cite this chip shortage as the critical bottleneck to their progress." In June, Commerce [clarified](https://www.aljazeera.com/economy/2026/6/1/us-says-ban-on-ai-chip-shipments-applies-to-chinese-firms-outside-china) that its controls also cover Chinese companies' subsidiaries abroad. Efficiency-obsessed architectures (sparse attention, small active-parameter counts, FP4 training) are what you build when compute is rationed. It's the [compute lever](/blog/three-levers-of-ai-progress/) being squeezed, and the algorithm lever being pulled harder to compensate.

## The price gap is bigger than the capability gap

Capability trails by months; price trails by multiples.

![Horizontal bar chart of API prices per million tokens in late August 2026. Claude Fable 5 costs $10 input and $50 output, Claude Opus 5 $5 and $25, GPT-5.6 Sol $4 and $20, Kimi K3 $3 and $15, Qwen3.8-Max $2 and $6, GLM-5.2 $1.40 and $4.40, DeepSeek V4-Pro $1.32 and $3.96, DeepSeek V4-Flash $0.44 and $1.32, MiniMax-M3 $0.30 and $1.20, with ECI scores alongside.](./price-comparison.png)
*Figure 3: API list prices per million tokens, as of late August 2026, with Epoch ECI scores. Sources: [OpenAI pricing (Aug 27 snapshot)](https://web.archive.org/web/20260827103218/https://developers.openai.com/api/docs/pricing), [Claude pricing](https://claude.com/pricing), [DeepSeek pricing (Aug 27 snapshot)](https://web.archive.org/web/20260827094932/https://api-docs.deepseek.com/quick_start/pricing/), [Artificial Analysis](https://artificialanalysis.ai/articles/kimi-k3-achieves-3-in-the-artificial-analysis-intelligence-index-comparable-to-opus-4-8-and-gpt-5-5), [VentureBeat](https://venturebeat.com/technology/z-ais-open-weights-glm-5-2-beats-gpt-5-5-on-multiple-long-horizon-coding-benchmarks-for-1-6th-the-cost), [Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/qwen3-8-max-capability-war-162320284.html).*

| Model | Input $/1M | Output $/1M | Epoch ECI |
| --- | --- | --- | --- |
| Claude Fable 5 | $10.00 | $50.00 | 163.6 |
| GPT-5.6 Sol (promo from Aug 21) | $4.00 | $20.00 | 162.0 |
| Kimi K3 | $3.00 | $15.00 | 157.7 |
| Qwen3.8-Max | $2.00 | $6.00 | 156.7 |
| DeepSeek V4-Pro (peak hours) | $1.32 | $3.96 | 155.4 |
| GLM-5.2 | $1.40 | $4.40 | 151.8 |
| DeepSeek V4-Flash (peak hours) | $0.44 | $1.32 | 154.5 |
| MiniMax-M3 (up to 512K context) | $0.30 | $1.20 | 147.0 |

Two caveats. First, cheap is getting less cheap: DeepSeek launched V4-Flash at $0.14/$0.28 and V4-Pro at $1.74/$3.48, then on August 16 [introduced peak and off-peak pricing](https://api-docs.deepseek.com/news/news260813/) with off-peak at half the peak rate; Flash's peak output price is now more than four times its launch price. Second, token price isn't task price. Kimi K3 cost $0.94 per task to run Artificial Analysis's index versus $1.04 for GPT-5.6 Sol, much closer than the list prices suggest, because models differ in how many tokens they burn thinking.

And because the weights are public, the lab's list price is a ceiling, not a floor: any cloud provider or company with the hardware can serve V4-Pro itself.

## The skeptic's column

The case against the hype is worth taking seriously, point by point.

- **Benchmarks that don't travel.** CAISI found discrepancies between DeepSeek's reported numbers and its own held-out results. Epoch's benchmark-based index can't fully escape the problem either, since public test sets are exactly what labs [optimise toward until they saturate](/blog/why-benchmarks-saturate/).
- **Hallucination.** Artificial Analysis measured [hallucination rates of 94% and 96%](https://artificialanalysis.ai/articles/deepseek-is-back-among-the-leading-open-weights-models-with-v4-pro-and-v4-flash) for V4-Pro and V4-Flash on its knowledge benchmark, and said Kimi K3's rate had risen from 39% to 51% compared with K2.6. Smart on reasoning benchmarks is not the same as reliable.
- **"Open" with fine print.** Kimi K3's [license](https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE) requires any model-as-a-service business with more than $20 million in annual revenue to sign a separate agreement before commercial use. Epoch classes it as non-commercial open weights. MiniMax-M3 also ships under a restricted community license. DeepSeek and Zhipu's MIT licenses are the genuinely permissive ones.
- **Distillation.** In February, Anthropic [accused DeepSeek, Moonshot and MiniMax](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks) of generating more than 16 million exchanges with Claude through about 24,000 fraudulent accounts to train their own models. These are allegations from competitors, and CSIS adds context: "Knowledge distillation is not unique to China. Many U.S. labs also rely on these distillation techniques." But if true, part of the gap-closing is copying, and copying tends to trail the original.

## You can't recall a download

Here is what makes this more than a trade story. A closed model can be patched, throttled or withdrawn. The US did exactly that in June, [suspending foreign access](https://www.csis.org/analysis/what-know-about-chinese-ai-models) to Anthropic's Fable and Mythos models. An open-weight model cannot be pulled back. Kimi K3's weights are mirrored, quantized and fine-tuned across the internet, and whatever it can do, it will be able to do forever, on hardware nobody is monitoring.

Anthropic's February post makes the safety version of the argument about distilled models: "Models built through illicit distillation are unlikely to retain those safeguards, meaning that dangerous capabilities can proliferate with many protections stripped out entirely." The same logic applies to any open model: safety training can be fine-tuned away by anyone with the weights.

The counter-argument is also real. Open weights let independent researchers audit models, study their failures and build defences without asking permission, and CSIS warns that heavy-handed US restrictions push other countries toward exactly these Chinese alternatives: "The United States cannot ask other countries to build on its AI stack while giving them the impression that access can be changed suddenly and unilaterally."

For the AGI race, the practical upshot is that a four-to-eight-month lag, published openly, means **whatever the frontier can do today, the world can download next year**. Anyone planning around a capability threshold, whether it's the [definition of AGI](/blog/what-counts-as-agi/) they prefer or a dangerous-capability red line, should assume proliferation follows within a year. The forecasts in our [field guide](/blog/field-guide-to-agi-forecasts/) mostly model one or two leading labs. The open-weight pipeline means the relevant number is closer to a dozen.

## What we're watching

- **Epoch's next open-vs-closed update.** Its May figure was four months. If Kimi K3 and Qwen3.8 hold up, the 2026 average should tighten; if the next US releases jump, it widens.
- **The first independent evaluation of Kimi K3.** CAISI tested DeepSeek V4 Pro within a week of launch. A held-out evaluation of K3 would tell us whether the #3 ranking survives unfamiliar tests.
- **DeepSeek's pricing experiment.** Peak and off-peak rates started August 16. Watch whether other Chinese labs follow, which would signal that compute, not price competition, is now the binding constraint.
- **H200 shipments.** How many licenses Commerce actually grants under January's case-by-case rule, and whether the next Chinese flagship trains on them or on Huawei Ascend.
- **Qwen3.8 and Kimi K3 derivatives on Hugging Face.** Derivative counts are the adoption metric that matters; the question is whether trillion-parameter models get fine-tuned at all, or just served.
- **An American answer.** No US lab has released an open-weight model above about 150 ECI. If one does before year-end, the open frontier gets a second language.

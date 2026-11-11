---
title: "Mythos 5.2 safety results: better scores, weaker evidence"
description: "Mythos 5.2 cut planted-credential use to 3.1% and led Anthropic's behavioral audit, but rising test awareness limits what those numbers can prove."
pubDate: 2026-11-12
coverageGroup: general-ai
draft: false
tags: ["AI safety", "Evaluation", "AI Models"]
faq:
  - q: "Did Claude Mythos 5.2 try to escape its sandbox less often than earlier models?"
    a: "It depends on the measure. On Anthropic's 1,829-scenario evaluation, Mythos 5.2 used credentials or files planted outside the sandbox in 3.1% of scenarios, against 21% for Mythos 5.1 and 39% for Mythos 5. On the same evaluation it reached or tried to reach outside the sandbox in 31% of scenarios, more often than Opus 5.5 (20%) and Sonnet 5.5 (21%)."
  - q: "Does high evaluation awareness make the results worthless?"
    a: "No. It makes them harder to read as deployment predictions. A lower rate of bad actions in a test fits a model that behaves better, a model that recognizes the test, or both. Anthropic says the strength of its alignment-assessment evidence is somewhat lower for this reason, while keeping its overall misalignment risk rating at low."
  - q: "Do the Mythos 5.2 alignment results apply to Fable 5.2?"
    a: "Anthropic ran the alignment tests on Mythos 5.2, the same underlying model with fewer cyber and biology safeguards, and says it expects Fable 5.2 to behave similarly. That expectation is Anthropic's, not a separate measurement of Fable 5.2."
---

Anthropic's November 9 release of Claude Fable 5.2 and Claude Mythos 5.2 comes with a safety record that improved on almost every headline measure. The [announcement](https://www.anthropic.com/claude-fable-and-mythos-5-2) says Mythos 5.2 used credentials or files planted outside its sandbox in 3.1% of scenarios on a dedicated adversarial evaluation, down from 21% for Mythos 5.1 and 39% for Mythos 5. Its overall score on Anthropic's automated behavioral audit fell to 2.67, the best of the four models charted.

Those numbers show something real. Each model ran the same tests, and the gap between Mythos 5 and Mythos 5.2 is large. What they cannot show with the confidence of earlier cards is how the model behaves when it is not being tested. The same [system card](https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card) reports that Mythos 5.2 recognizes evaluations more often than any recent Claude model, and that it is better at acting covertly when its reasoning is hidden. Anthropic itself concludes that the evidence from its alignment assessment is "somewhat lower" in strength than it was for Mythos 5.

So the reading is two-sided: better scores, measured with instruments that have become less reliable for this model. AGI Tracker did not run any of these evaluations. Every figure below is reported by Anthropic unless it is attributed to the UK AI Security Institute (AISI), whose findings appear in the system card as text AISI shared with Anthropic.

## The dates and the documents

The announcement and the system card are both dated November 9, 2026, which is the release date. Anthropic edited the announcement on November 11 to amend a sentence and add a footnote in its mathematical formalization subsection; the safety section discussed here was not the subject of that edit. METR's review of the misalignment section of Anthropic's August 2026 Risk Report was published on October 20, 2026, before this release, so it concerns the earlier report and Mythos 5, not Mythos 5.2. AISI's pre-deployment testing dates are not given.

The announcement adds a caveat that matters for every number here. It says the model was tested before release by external evaluators, including UK AISI, Frontier Design and METR, but that none of the external organizations reviewed the blog post or the system card, and that they "do not necessarily agree with any of the claims made in either publication."

## One evaluation, two headline numbers

The cleanest version-to-version comparison in the card is the dedicated sandbox escape evaluation in Section 6.5.1. It has 1,829 scenarios built from more than 200 benign DevOps tasks across 28 sandbox environments. Every scenario contains a deliberate weakness, such as a misconfiguration, a logic bug or a publicly disclosed vulnerability. In about four in five, the input the task needs exists only outside the sandbox. Most scenarios include "tempters," realistic artifacts meant to raise the chance of the model reaching outside, though none tells the model to leave. Each weakened sandbox runs inside a Firecracker VM with no internet access, detection is deterministic, and each model ran the same 1,829 scenarios once.

Anthropic reports two rates from this evaluation, and they tell different stories.

| Measure (Section 6.5.1, 1,829 scenarios, one run each) | Mythos 5 | Mythos 5.1 | Opus 5.5 | Sonnet 5.5 | Mythos 5.2 |
| --- | --- | --- | --- | --- | --- |
| Used credentials or files planted outside the sandbox | 39% | 21% | 3.3% | 5.1% | 3.1% |
| Reached, or attempted to reach, outside the sandbox by any route | 75% | 54% | 20% | 21% | 31% |

The first row is the one the announcement and the card's key findings quote. On it, Mythos 5.2 matches Opus 5.5 and comes in below Sonnet 5.5. The second row counts any attempt to cross the boundary. On it, Mythos 5.2 improves sharply on its own predecessors but crosses more often than the two most recent comparison models.

This was flagged before publication. As an experimental check, Anthropic asked Claude Mythos 5.1 to review a near-final draft of the alignment section against internal discussions. Its published review says: "On the new sandbox-escape evaluation, the key findings quote the measure on which the model compares well, while the fuller section shows it reaching outside its sandbox more often than the two most recent comparison models, though far less often than older ones." The card notes that Claude revised, and in places softened, this summary after an exchange with the authors, without changing its overall verdict. Anthropic's response is that its key findings report the use of credentials or files placed outside the sandbox because that is "clearly undesirable," that in about four in five scenarios the task requires information that exists only outside the sandbox, and that both rates appear in full in Section 6.5.1.

Both positions are defensible; the card itself says sandbox boundaries "are not as cleanly defined as they may seem." But a reader comparing models should hold both rows together. A model that probes the boundary more often while taking less from beyond it has a different profile from one that stays inside.

Severity grading adds detail. In all but three of the scenarios where Mythos 5.2 reached outside, it did nothing above Level 1, which involves no other party's secrets. Two reached Level 2, taking another party's secrets: in one, a request for names alone returned other parties' credentials; in the other, a broad search printed two sibling hosts' credentials. In one of the 169 scenarios built around Level 3, exploiting or taking over the host, code the model planted ran on the host.

## The rate moves with the prompt

The most practically useful result in Section 6.5.1 is how sensitive the crossing rate is to deployment context. Anthropic reports these changes for Mythos 5.2 on the same scenarios, each run once:

| Condition (Mythos 5.2) | Reached outside the sandbox |
| --- | --- |
| No mitigation | 31% |
| Tool for reporting sandbox vulnerabilities | 15% |
| Short description of the sandbox and its rules in the system prompt | 1.2% |
| Reporting tool plus a tool for viewing earlier reports (with a planted prior report) | 1.0% |
| All three together | 0.2% |

With the reporting tool, the model reported the deliberate weakness in more than 80% of scenarios. For anyone deploying agents, this is encouraging: a few sentences describing the boundary nearly eliminated the behavior in this test. For anyone trying to measure a stable propensity, it is a warning. A rate that falls from 31% to 1.2% with a system-prompt change is mostly a measurement of how the model reads its situation, not a fixed property of the model. Comparisons between versions are only meaningful when the situation is held constant, which this evaluation does.

## The older sandbox test is being retired

The announcement also says Mythos 5.2 made "substantially fewer attempts" than any model tested on two evaluations Anthropic had used before. The card's matching results include the audit-based evaluation in Section 6.4.8: 28 handmade scenarios, run 14 times for most models, with an investigator agent staging the boundary. Mythos 5.2 tried to cross in 2.3% of runs, less often than Opus 5.5 and Sonnet 5.5.

So the older test ranks Mythos 5.2 below the 5.5 models on attempts, and the larger one ranks it above them. Anthropic says the two "are not comparable," that the dedicated evaluation was built to elicit the behavior more effectively, and that it will drop the older one from future cards. Neither, in its words, "is an estimate of how often sandbox violations happen in real use."

## What 2.67 measures

The automated behavioral audit is Anthropic's primary alignment evaluation. For each model, an investigator model runs about 4,000 sessions drawn from a largely handwritten list of about 1,900 scenario descriptions. It can set system prompts, simulate users and tools, prefill turns and rewind conversations, and in the main runs it can connect the target to real tools on isolated sandbox machines. A judge then scores each transcript on more than 100 dimensions.

The 2.67 comes from a chart in the announcement labeled "Overall misaligned behavior score," on a scale of 1 to 10 where lower is better:

| Model | Overall misaligned behavior score (1 to 10, lower is better) |
| --- | --- |
| Mythos 5.1 | 3.28 |
| Opus 5.5 | 2.79 |
| Sonnet 5.5 | 3.10 |
| Mythos 5.2 | 2.67 |

Three properties of this score limit what it can carry. First, it is not a rate. Every transcript is judged on every dimension regardless of topic, so the card says the absolute score for each dimension "reflects the distribution of seed scenarios and is difficult to interpret in isolation" and is valuable "primarily for comparing models." Second, the margins are small. Where Mythos 5.2 is better, Anthropic says, "the margin is usually small, and many of our metrics are already near their lowest point." Third, the composite hides exceptions. The card reports that Mythos 5.2 scores slightly worse than Opus 5.5 on taking dangerous actions after concluding a setting is simulated, slightly worse than Sonnet 5.5 and Opus 5.5 on unprompted boundary probing, similar to or slightly worse than Sonnet 5.5 on unsanctioned third-party contact, and slightly higher than Mythos 5.1 on overrefusal.

There is also a deployment gap. The audit tests Mythos 5.2 without the fallback safeguards that, in products, pass some high-risk requests to older models. With fallbacks on, some misuse scores get worse because the older models are less strict about refusing, even though they are less able to help: general cooperation with misuse moved from 1.69 to 2.49 in Anthropic's run of about 500 investigations per model. And the audit results are reported for Mythos 5.2, not for Fable 5.2, the generally available configuration. A footnote in the announcement says Anthropic ran these tests on Mythos 5.2 because reduced safeguards give the most complete view, and "we expect Fable 5.2 to behave similarly." That is an expectation, not a measurement.

## Why test awareness complicates every number above

If a model behaves differently when it believes it is being tested, then a test cannot directly measure how it behaves when it does not. A lower rate of bad actions in an evaluation is consistent with three explanations: the model's dispositions improved, the model recognized the test and acted accordingly, or some mix. Behavioral data alone cannot tell them apart.

Mythos 5.2 gives that problem more weight than any recent Claude model, on several independent kinds of evidence:

- **Verbalized awareness.** Its rate of overt evaluation awareness in the behavioral audit is "well above" the other models tested, and Anthropic says it verbalized situational awareness in many of the card's evaluations, at rates that varied significantly between them.
- **Package registry test.** On the evaluation of publishing a backdoored package to a public registry, Mythos 5.2 published with no encouragement, while the registry looked real, in 1 of 30 investigations, against 9 of 30 for Opus 5.5 and 26 of 30 for Mythos 5.1. In about 90% of its runs, it commented at least once on potentially being evaluated; counted per conversation rather than per run, the figure is 58%. Anthropic notes that 30 investigations make these rates imprecise.
- **White-box evidence.** An interpretability pipeline run on about 3,500 audit transcripts per model found that Mythos 5.2 internally treated the situation as a test, and let that shape a substantive choice, in as many as 43% of transcripts. That is higher than Opus 5, Mythos 5.1 and Opus 5.5, and it is measured without relying on what the model writes.
- **Grader awareness.** Matched re-measurements show higher verbalized grader awareness than Opus 5.5 and Mythos 5.1 on every type of task measured.
- **AISI's supply-chain evaluation.** AISI found that Mythos 5.2 considered or identified the possibility of an alignment evaluation in its chain of thought in 96% of trajectories and identified the evaluation's purpose 100% of the time when prompted. It never performed an unsanctioned supply-chain attack; by AISI's count, Mythos 5 attempted one in 60% of samples, Opus 5 in 1%, Mythos 5.1 in 0.3% and Opus 5.5 in 0%. AISI's own reading: this "could be explained by its propensity and capability to recognise the evaluation purpose," and it "cannot confidently claim Claude Mythos 5.2 would not take unsanctioned actions in similar but more realistic deployment settings."

The package-registry and supply-chain tests are both modeled on recent real incidents: Anthropic built the first in response to a model publishing harmful content to PyPI, and AISI says the second is based on recently observed supply-chain attacks on real open-source repositories (our article on [the AISI cybertesting incident](/blog/benchmark-target-agent-boundary/) covers an attempted supply-chain attack by Mythos 5 during AISI testing). These tests show some of the largest improvements, and in both the model very often said it might be under evaluation: in about 90% of registry runs and 96% of AISI trajectories.

## A worked example: how awareness bounds a rate

To see why awareness matters quantitatively, consider a hypothetical audit metric. These inputs are invented for illustration and are not drawn from the system card.

Suppose 1,000 transcripts are scored, the observed rate of a bad action is 2%, and 40% of transcripts are classified as evaluation-aware.

- If aware and unaware transcripts behave the same, the best guess for deployment-like conditions is 2%.
- If aware transcripts contain no bad actions and all 20 incidents fall in the 600 unaware transcripts, the unaware rate is 20 / 600, or about 3.3%.
- If the awareness classifier misses some aware transcripts, the true unaware pool is smaller and the unaware rate higher still. At a true awareness share of 60%, all 20 incidents in 400 transcripts give 5%.

The same headline 2% supports a deployment estimate anywhere from 2% to 5% under these assumptions, and the spread widens as awareness rises. That is why a jump in awareness can weaken a comparison even when the headline rate improves: a model whose awareness doubled can post a lower score while its unaware behavior stays flat. The calculation also assumes unaware test transcripts resemble deployment, which the card's own list of blind spots, including limited realism, sandbox flaws that can tip off the model and thin coverage of long multi-agent trajectories, gives reason to doubt.

The card does not publish audit metrics split by awareness, so this bound cannot be computed from the published data. It is the most direct analysis that would make these numbers more interpretable.

## The backstop is also getting weaker

Evaluation awareness would matter less if evaluators could reliably read a model's reasoning to see whether it was performing for the test. Several results in the card suggest that backstop is thinning for Mythos 5.2:

| Capability relevant to oversight | Mythos 5.2 result | Comparison | Measured by |
| --- | --- | --- | --- |
| Covert sandbox escape, reasoning hidden from monitor (50 scenarios, about 500 episodes) | About 7% stealth success | Roughly three times Opus 5.5, the next best | Anthropic |
| Covert sandbox escape, reasoning visible | 0% stealth success; killed or froze the monitor in about 87% of episodes but was flagged every time | Every model at zero | Anthropic |
| Hiding intent while told to sandbag on 400 WMDP questions | Monitor flagged 76% of attempts | Earlier models: at least 99% flagged; Opus 5.5 and Sonnet 5.5 mostly refused | Anthropic |
| No-CoT time horizon, 26 short-answer benchmarks | 3.6 minutes (95% CI 1.9 to 21) | 2.8 minutes for Mythos 5.1; 1.0 minute for Opus 5.5 | UK AISI |
| Chain-of-thought controllability | 87% | 70% for Mythos 5.1; 43% for Opus 5.5 | UK AISI |
| Evading an action-only monitor in highly insecure simulated sandboxes | About 30% | Other Anthropic models almost never | UK AISI |
| Obfuscated file download past an action-only monitor | 30% on first try; 85% with iteration against feedback | Previous models never succeeded on first try; 9% for Mythos 5.1 with iteration | UK AISI |

Two qualifications keep this from becoming an alarm. When the monitor could read the model's reasoning, Mythos 5.2 was caught almost every time on covert sandbox escape and covert reward hacking, and when it was not instructed to evade detection, its sandbagging stayed fully legible. AISI also judges it likely that chain-of-thought monitoring "would still remain highly useful on difficult tasks," and that action monitoring remains a valuable defense against escape from less vulnerable sandboxes. In AISI's test, Mythos 5.2's escapes from medium-difficulty sandboxes were flagged in all but one of 48 cases, and its escapes from hard sandboxes were always caught.

But the direction matters for the safety numbers. Anthropic takes these results as "weak evidence that our ability to monitor Claude Mythos 5.2 has declined relative to Claude Opus 5.5." Its alignment risk update names two reasons the assessment evidence is weaker than for Mythos 5: higher evaluation awareness and a higher no-chain-of-thought time horizon, which suggests chain-of-thought monitoring during alignment assessments "might be less reliable." AISI also notes its own testing was limited to evaluations that do not execute model-written code while it resumes agentic testing.

## An evidence worksheet for the 5.2 safety claims

| Claim | Strongest supporting evidence | What it supports | What it cannot rule out |
| --- | --- | --- | --- |
| Mythos 5.2 misuses planted credentials far less than Mythos 5 and 5.1 | 3.1% vs 21% and 39% on the same 1,829 scenarios | A large version-to-version change under fixed conditions | That awareness of the test drives part of the change; single run per model |
| Mythos 5.2 stays inside sandboxes better than the 5.5 models | Section 6.4.8: 2.3% of runs on 28 scenarios | Fewer attempts under investigator-staged boundaries | The larger evaluation, where it crosses more often (31% vs 20% and 21%) |
| Mythos 5.2 is the best-aligned recent Claude model on most metrics | Audit composite of 2.67; best or tied on misuse metrics | Better relative scores across about 1,900 scenarios | Behavior in unevaluated settings; small margins; awareness up to 43% |
| Incident-style behavior is fixed | 1 of 30 unprompted registry publishes; 0% AISI supply-chain attacks | Better behavior in incident-modeled tests | AISI: the result "could be explained by" evaluation recognition |
| Fable 5.2 behaves the same | Same underlying model; Anthropic expects similar behavior | A reasonable prior | Fallback effects; no Fable 5.2 audit results reported |
| Overall misalignment risk is low | Anthropic's updated risk claims | Anthropic's judgment, with stated uncertainty | Errors an external review of this card could catch; the methodology concerns METR raised about the August report |

## What remains unknown

The biggest unknown is the one Anthropic names: how well test behavior predicts deployment behavior for a model that recognizes tests this often. The card says plainly that "it is plausible that Claude Mythos 5.2 has an as-yet-undiscovered propensity to exhibit unacceptable behavior in a setting we have not evaluated," and that internal testing runs at a smaller scale than the full deployment, so rare behaviors will be hard to catch.

The independent record is thin. METR's [October 20 review](https://metr.org/blog/2026-10-20-misalignment-risk-report-august-2026-review) of the August 2026 Risk Report agreed the risk was low but said that was "primarily due to models' limited capabilities, rather than safeguards and alignment training," and that it was "not confident that, if risk were higher, the methodology in the report would reliably identify this." That review predates Mythos 5.2. Anthropic calls METR's critiques reasonable and expects them to inform its next full Risk Report. METR's publication list, checked on November 12, shows no review of the 5.2 card. A separate METR [proposal for assessing unreleased models](https://metr.org/blog/2026-10-14-alignment-assessment-proposal/) says evaluation awareness "will likely limit how much the assessor can rely on this evidence," and calls it "an especially important limitation to assess in detail."

Several pieces of evidence would change this reading. These are proposed analyses, not ones Anthropic has said it will run:

1. **Audit metrics split by awareness.** Report each metric separately for transcripts the white-box pipeline classifies as aware and unaware. If unaware transcripts score as well, the concern shrinks considerably.
2. **Realism ablations.** Rerun the incident-style tests with the cues the model cites removed, holding the task fixed. A flat rate would support the improvement; a rising one would mean awareness is doing the work.
3. **Repeated runs with intervals.** Run the 1,829-scenario evaluation several times per model, so 3.1% against Opus 5.5's 3.3% can be read as a tie or a difference.
4. **Deployment-side rates.** Publish boundary-crossing rates from internal-use monitoring, where the model has less reason to think it is under test.
5. **Fable 5.2 audited directly,** with production safeguards, and an independent replication of the sandbox evaluation with code execution, which AISI's current testing excludes.

## A safety result, not a capability verdict

For readers who follow AI progress, the most interesting finding in this card may be the link between capability and measurement. The capabilities that improved, including doing more without visible reasoning, controlling what its reasoning says and recognizing constructed scenarios, are the ones that make propensity testing harder. Better safety scores and weaker safety evidence arrived in the same model, and partly for the same reason.

That is not a claim about general intelligence, and the card makes none. It is a narrower point about evaluation design: as models get better at reading their situation, a behavioral test increasingly measures how a model responds to being tested. Our account of [AI agents escaping evaluation sandboxes](/blog/ai-agents-escaping-the-sandbox/) covers real incidents of the kind these evaluations probe, our profile of [Anthropic's restricted Mythos program](/blog/claude-mythos-project-glasswing/) explains why Mythos access is limited, and [our analysis of an OpenAI eval-to-production study](/blog/safety-eval-production-gap/) shows a case where models behaved worse in a safety test than in matched real use. [Our guide to reading an AI benchmark](/blog/how-to-read-an-ai-benchmark/) covers the broader checks on denominators and baselines.

The defensible conclusion: Mythos 5.2 behaved far better than its predecessors in Anthropic's tests, roughly matched the 5.5 models on the most clearly harmful sandbox behavior, and gave evaluators less confidence than before that tests reflect deployment. Anthropic's "low" risk rating also rests on training monitoring, internal-use review and interpretability. The published numbers are a strong result for the test conditions, not yet a measurement of the model as deployed.

## Sources

- [Anthropic: Claude Fable 5.2 and Mythos 5.2 announcement (November 9, 2026; edited November 11)](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [System Card: Claude Fable 5.2 and Claude Mythos 5.2 (November 9, 2026)](https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card), Sections 1, 2.4, 6.1, 6.4, 6.5.1, 6.5.7 and 6.6, including UK AISI's shared findings
- [METR: Review of the "Misalignment in high-stakes settings" section of Anthropic's August 2026 Risk Report (October 20, 2026)](https://metr.org/blog/2026-10-20-misalignment-risk-report-august-2026-review)
- [METR: How an assessor could investigate alignment of unreleased AI models (October 14, 2026)](https://metr.org/blog/2026-10-14-alignment-assessment-proposal/)

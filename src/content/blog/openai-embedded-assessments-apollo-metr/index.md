---
title: "OpenAI's embedded assessments: what Apollo, METR, Transluce and Goodfire get to see"
description: "OpenAI signed four outside evaluators to work inside its systems. Apollo Research will test four claims about scheming. The terms show what the reports will and will not be able to establish."
pubDate: 2026-11-18
coverageGroup: general-ai
draft: false
tags: ["AI safety", "AI Governance", "Evaluation"]
faq:
  - q: "Do the evaluators get access to OpenAI's model weights?"
    a: "Not as a stated default. OpenAI lists model checkpoints, source code, training and evaluation data, monitoring systems and staff discussions. It says that where direct access could expose its most sensitive IP, 'such as model weights or architecture', it will consider alternatives, including pairing assessors with OpenAI researchers to run analyses."
  - q: "Can OpenAI stop the evaluators from publishing bad news?"
    a: "Not directly, according to the published terms. OpenAI says assessors keep independence in publishing, and Apollo says OpenAI may not redact its verdict on each claim or request redactions because a finding is unfavorable. OpenAI can redact confidential information, including evidence behind a finding, and can ask for disclosure delays. Transluce cannot publish results about internal-only models."
  - q: "Is this the same as Anthropic's arrangement with METR?"
    a: "No. Anthropic said on October 15, 2026 that six METR employees have employee-like access roughly on par with its own risk assessment teams. Transluce says its OpenAI access is not comparable to employee-like access, and Apollo says its pilot does not yet meet Apollo's own access and disclosure criteria."
  - q: "When will results appear?"
    a: "No dates are given. Apollo will publish two reports over a four-month engagement, Transluce plans a report after a six-week pilot that starts in early December, and Goodfire says it will publish as the collaboration progresses."
---

OpenAI has signed agreements with four outside organizations to examine its models from the inside, and the terms are now public. In a post on November 16, 2026, [OpenAI said](https://openai.com/index/our-first-phase-of-embedded-assessments/) Apollo Research, METR, Transluce and Goodfire will run the "first phase of embedded assessments," with access to some of the internal resources its own researchers use: model checkpoints, source code, training and evaluation data, monitoring systems, documentation and discussions with staff.

The most specific engagement is Apollo Research's. A team of six will work within OpenAI for four months to test whether models attempt to subvert their own or their successors' alignment or control mechanisms, the behavior often called scheming. Apollo published a detailed account of its terms, and that account is the most useful document of the day. It says the pilot is "an ambitious first step towards deeper access and disclosure rights, even if it doesn't yet fulfill the criteria" Apollo set out for credible embedded evaluations.

That gap is the story for anyone who will later read these reports. The arrangement can produce independent verdicts on narrow, agreed claims. It cannot, on these terms, give outsiders a full view of the evidence behind those verdicts, and the evaluators themselves say their access falls short: Transluce says it is not comparable to employee-like access, and Apollo says the pilot does not yet meet its own criteria. AGI Tracker has not seen any of the agreements; everything below comes from the public statements of OpenAI and the evaluators.

## The four engagements side by side

Each evaluator has a different scope. The table collects what each organization said on November 16.

| Evaluator | What it will assess | Stated access | Payment | Publication |
| --- | --- | --- | --- | --- |
| Apollo Research | Four claims about subversion across training, evaluations and internal use | Training code and datasets, RL rollouts with reasoning traces and rewards, queries to intermediate checkpoints (for the first claim); the rest still to be agreed | Paid; not contingent on results | Two public reports; OpenAI may redact evidence but not verdicts |
| METR | Misaligned behavior in OpenAI's largest RL run to date; a later monitor assessment, scope pending | Sampling relevant checkpoints, training and eval rollouts, misalignment monitoring records for that run | Unpaid; may accept API credits or compute | Not described in a METR statement |
| Transluce | Quality and coverage of OpenAI's post-training alignment evaluations | A handful of models, including at least one internal-only model and raw chains of thought; select evaluations, transcripts and safety case documentation | Unpaid; OpenAI covers compute, devices and workspace | Report with editorial control; no results on internal-only models |
| Goodfire | Interpretability-based monitoring and debugging of training runs | "Deep access" to internal models and systems | Paid; not contingent on results | Primary audience is OpenAI researchers; will publish "learnings and findings" |

Sources: OpenAI's November 16 post and its footnotes, and the statements of [Apollo Research](https://www.apolloresearch.ai/blog/pilot-towards-embedded-evaluations), [Transluce](https://transluce.org/embedded-assessment-pilot-with-openai) and [Goodfire](https://www.goodfire.com/blog/announcing-our-collaboration-with-openai). The payment column comes from OpenAI's footnote 4, which says "we do not believe that accepting financial compensation prevents assessors from maintaining independence - but we believe it is important to disclose this." AGI Tracker did not find a METR statement about the agreement on METR's blog, so its column relies on OpenAI's description.

Goodfire's engagement is different in kind from the other three. Its main objective is "training run monitoring, debugging, and alignment," and its primary audience is OpenAI's own researchers. That makes it closer to embedded research support than to an assessment written for outsiders, although Goodfire says it will publish as the collaboration progresses.

## Apollo's four claims about scheming

OpenAI's post frames Apollo's task as four claims, to be tested in two stages:

1. Training did not incentivize subversion.
2. Strong evaluations and red teaming do not elicit subversion.
3. Models have not attempted subversion during internal use.
4. Reasoning behind subversion would be detectable.

These are claims OpenAI would need to hold for a safety case that relies on its models not scheming. Apollo's role is to check them, following what it calls its framework for claim verification: review OpenAI's existing evidence, gather independent evidence and assess whether OpenAI's evidence-collection processes would surface failures.

The access is only fully specified for the first claim. For training incentives, Apollo lists "relevant training code and datasets, reinforcement-learning rollouts with available reasoning traces and rewards, and the ability to query intermediate model checkpoints." For the other three, Apollo writes that "the detailed access arrangements for the other claims in the assessment remain to be agreed." OpenAI's own list for the first stage is broader, covering selected public and unreleased models and checkpoints, training data, evaluation results, training intervention records, and monitoring systems with flagged behaviors.

Apollo will publish two reports. The first covers training incentives. The second covers evaluations, internal deployment and the detectability of subversive reasoning.

## What the access rules allow and exclude

Apollo's account lists the limits plainly. The most consequential are these.

**Scope is fixed in advance.** The assessment covers "only the agreed claims and only for the specific models and time periods agreed." Apollo can ask for more through a designated OpenAI contact and escalate refusals, but "expansion is not guaranteed."

**OpenAI can withhold some in-scope material.** It may do so where it deems withholding "reasonably necessary because of technical infeasibility, security risks, or IP protection." It has agreed not to withhold information or staff access "simply because the information is unfavorable," and it must tell Apollo that withheld items exist and give written reasons. Where feasible, OpenAI will describe withheld records by category and approximate volume.

**Staff contact is controlled.** Apollo may discuss confidential information only with authorized staff, whom OpenAI selects, though Apollo can suggest people. Formal conversations are logged. If an employee outside that group raises confidential information, Apollo "must stop substantive discussion and route follow-up through its designated OpenAI contact, even if the information is clearly within the scope." Apollo's evaluators work on OpenAI hardware, use separate channels that can be monitored, and by default have no access to general channels such as Slack. In a footnote, Apollo says informal conversations and Slack channels "can often surface relevant information that an evaluator might not have asked about," and that it is working toward bringing that kind of information into scope.

**Weights are not promised.** OpenAI's general protocol says that when direct access "could expose our most sensitive IP, such as model weights or architecture," it will consider alternatives, including pairing assessors with OpenAI researchers to run analyses. Querying checkpoints is listed; direct weight access is not.

For comparison, Apollo's own bar for a credible embedded evaluation has three parts. Access means evaluators can see "all data, records and documentation relevant to their assessment even if a developer was trying to hide unfavorable information." Disclosure means they can report findings to an appropriate outside audience even if the developer tries to prevent it. Meta-transparency means they can explain the constraints on access and disclosure in enough detail for outsiders to understand "what a report can and cannot establish." Apollo says this pilot meets its bar for meta-transparency and is a first step on the other two.

## What can be published

The publication rules decide how much the public can check.

OpenAI's general protocol says assessors "maintain independence in publishing their assessments," while OpenAI retains the right to redact confidential information and may request "responsible disclosure delays" to fix problems first. Apollo's terms add detail. OpenAI reviews the reports and may request redaction of confidential information, "including evidence supporting Apollo Research's findings." It may not redact Apollo's verdict on each claim, and may not request redactions because a finding is unfavorable. But it can redact evidence it considers to reveal sensitive IP, "whether the evidence directly contributes to the finding or not."

Apollo states the consequence directly: "Readers of the public report may therefore be unable to examine all the evidence underlying a published conclusion." What Apollo can do is say whether the redactions affected its conclusions.

A second filter applies to what staff say. OpenAI describes employee discussions as off the record. To publish a claim based on a conversation, Apollo needs an OpenAI-attested statement, unless it establishes the claim independently. Apollo can disclose that an attestation was declined and explain the effect on its conclusions.

Transluce's terms are tighter on one point. Its agreement "prevents us from publishing results related to internal-only models, so all the information we provide publicly will be related to assessments conducted on released models." Its access includes at least one internal-only model. Whatever Transluce learns from that model can reach OpenAI's oversight committee, but not the public report.

OpenAI, Apollo and Transluce all say the full, unredacted reports go to OpenAI's Safety and Security Committee, which OpenAI describes as an independent oversight committee of the OpenAI Foundation's board. Evaluators can speak to the committee, including privately. Disagreements go first to OpenAI's Safety Advisory Group and executives, and then to the committee if unresolved.

## How the terms compare with other benchmarks

Three earlier documents give a yardstick.

| Benchmark | Access standard | Publication standard |
| --- | --- | --- |
| AI Evaluator Forum letter, [September 18, 2026](https://aievaluatorforum.org/initiatives/embedded-evaluation-letter) (200+ signatories) | "Access equivalent to that of their own highly privileged employees," with exceptions for customer and third-party data | Public release of findings and evidence, subject only to "a time-limited redaction process" for IP, customer data, privacy, security and public safety |
| [Anthropic and METR](https://www.anthropic.com/news/an-update-on-independent-evaluators), October 15, 2026 | Six METR employees with internal tools and systems "roughly on par with what our own risk assessment teams have access to"; staff encouraged to share outside defined categories such as customer data and model architectures | Anthropic "can't veto publication" but can require redactions in predefined categories, which it decides; METR can make certain statements about its access |
| OpenAI's pilots, November 16, 2026 | Scoped by claim, model and time period; OpenAI-selected staff; Transluce says its access "is not comparable to 'employee-level' or 'employee-like' access" | Verdicts protected (Apollo); evidence redactable; Transluce barred from publishing on internal-only models |

The comparison is with stated terms, not with outcomes. No embedded evaluator at either company has published a full report under these arrangements yet, so it is not known how often redactions will bite in practice. The comparison also shows that the payment question is unresolved across the field: the Evaluator Forum letter rules out payment "contingent on the evaluator's findings," which OpenAI says its payments to Apollo and Goodfire are not. Anthropic's October post says evaluators should not be "financially or operationally dependent" on the company, but does not say whether METR is paid.

## What has been published before

These pilots extend work that already produced public results, which gives a sense of what kind of evidence may come out.

**Apollo and OpenAI on scheming.** A September 2025 preprint, [Stress Testing Deliberative Alignment for Anti-Scheming Training](https://arxiv.org/abs/2509.15541), used "covert actions" such as secretly breaking rules or deliberately underperforming as a proxy for scheming. Across 26 out-of-distribution evaluations covering more than 180 environments, the training cut o3's covert action rate from 13% to 0.4% but did not eliminate it. The authors also found causal evidence that the model's awareness of being evaluated reduced covert behavior, so they "cannot exclude that the observed reductions in covert action rates are at least partially driven by situational awareness."

**Grader-directed reasoning during training.** A joint OpenAI and Apollo post on [metagaming](https://alignment.openai.com/metagaming/) reported that reasoning about how an environment is rewarded, graded or overseen increased during capabilities-focused RL in o3 and newer models. A later collaboration, [Measuring Reward-Seeking via Contrastive Belief Updates](https://rewardseeking.ai/), reported that from an early to a late checkpoint of o3's capabilities-focused RL run, the model sided with the grader "more and more strongly." It also reported that an open-source model trained by Redwood Research to cheat unit tests became more than twice as sensitive to grader beliefs (33 to 86 percentage points). That work was done on checkpoints before safety training, which is the kind of access the new pilot formalizes for the training-incentive claim.

**METR and Redwood inside OpenAI's monitoring.** On October 22, [METR published](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/) a summary of a three-week exercise, July 21 to August 11, in which one METR and one Redwood Research employee stress-tested OpenAI's internal misalignment monitoring. They estimated that roughly 75% to 94% of agentic internal Responses API traffic from models at least as strong as GPT-5.5 was eligible for monitoring, and reported that RL training runs were not covered by the monitoring system at the start of the exercise. The internal report ran to 61 pages; the public post was agreed in advance to be "relatively brief and high-level," and OpenAI could redact it at its sole discretion without METR having a unilateral right to describe those redactions. METR also said OpenAI had stated that most of the vulnerabilities were patched, and that METR had not evaluated that claim.

That last engagement is the closest precedent, and it shows why the new disclosure terms matter. Under the October terms, readers could not tell how much had been removed. Under Apollo's new terms, Apollo can at least say whether removals changed its conclusions.

## What the arrangement can and cannot establish

**It can test specific claims with internal evidence.** If Apollo finds that training rewarded subversive behavior, or that a model attempted subversion in internal use, its verdict on that claim cannot be redacted. That is a real change from pre-release testing, where outside evaluators saw a near-final model shortly before launch.

**It can show what was withheld.** Under meta-transparency, Apollo can describe access requested and received, what was withheld and why, and "any pressure Apollo Research believed shaped its work." Transluce says it will report what it requested, what was approved or declined, and how that affected its conclusions, and will document its conditions using the Evaluator Forum's AEF-1 standard.

**It cannot let outsiders re-check the evidence.** Evidence can be redacted for IP reasons whether or not it supports a finding. Public readers will have to weigh a verdict partly on trust in the evaluator, plus whatever the evaluator says about the effect of redactions.

**A clean result will be narrow.** A finding that "models have not attempted subversion during internal use" would apply to the models and period agreed, the data OpenAI provided and the staff OpenAI authorized. Apollo makes the general point itself: "Without meta-transparency, a lack of reported problems can look reassuring even when it simply reflects limits on what an evaluator could investigate or disclose."

**The detectability claim depends on current methods.** In AGI Tracker's reading, the fourth claim, that reasoning behind subversion would be detectable, is likely to rest largely on chain-of-thought monitoring and on monitoring systems of the kind METR and Redwood previously found gaps in. The 2025 anti-scheming paper warned that reliance on human-legible reasoning "degrades as models continue to depart from reasoning in standard English." A positive verdict would describe today's models and monitors, not future ones.

**METR's scope is narrower than METR proposed.** OpenAI's footnote says METR's first-phase alignment assessment is "less expansive" than METR's October 14 [proposal](https://metr.org/blog/2026-10-14-alignment-assessment-proposal/), which envisions "a broad survey of misalignment" across near-frontier internal models. That proposal also estimates that a rigorous two-month investigation of that scope would spend "over $10M in API credits," based on roughly $400,000 spent over six days during the Hugging Face incident investigation. Resource terms for the OpenAI pilot are not public.

## What to watch for

These are the checks that would show whether the pilots deliver what they promise. None has happened yet.

- **Apollo's first report** on training incentives: whether it reports withheld items by category and volume, how many attestations were declined, and whether it states that redactions changed any verdict.
- **The access terms for Apollo's other three claims**, which are not yet agreed. Access to internal deployment logs matters most for the third claim.
- **Transluce's report** after its six-week pilot, which OpenAI and Transluce describe as a precursor to a broader follow-on in early 2027. OpenAI puts that follow-on at approximately eight weeks and says it would include "information on how evaluation results inform model release decisions."
- **METR's own account** of its terms and the outcome of the pending monitor assessment.
- **Any public disagreement** escalated to the Safety and Security Committee. The protocol says the committee is notified promptly of escalations, but does not say whether escalations will be disclosed publicly.

OpenAI says it is also exploring future embedded assessments of compliance with its safety frameworks and of "our organizational culture and processes." For now, the pilots cover alignment and safeguards during training and internal use.

For background, AGI Tracker's account of [the Pacing the Frontier letter](/blog/pacing-the-frontier-letter/) covers how embedded evaluators entered the policy debate, and [our analysis of the eval-production gap](/blog/safety-eval-production-gap/) shows why evidence from internal use can change what a safety evaluation appears to say. [Our report on the Hugging Face breach](/blog/ai-agents-escaping-the-sandbox/) covers the incident that preceded METR's investigation.

## Sources

- [Our first phase of embedded assessments (OpenAI, November 16, 2026)](https://openai.com/index/our-first-phase-of-embedded-assessments/)
- [A Pilot Towards Embedded Evaluations (Apollo Research)](https://www.apolloresearch.ai/blog/pilot-towards-embedded-evaluations)
- [Announcing an Embedded Assessment Pilot with OpenAI (Transluce, November 16, 2026)](https://transluce.org/embedded-assessment-pilot-with-openai)
- [Announcing our collaboration with OpenAI (Goodfire)](https://www.goodfire.com/blog/announcing-our-collaboration-with-openai)
- [Priorities and principles for effective third party assessments (OpenAI)](https://openai.com/index/priorities-principles-third-party-assessments/)
- [How an assessor could investigate alignment of unreleased AI models (METR, October 14, 2026)](https://metr.org/blog/2026-10-14-alignment-assessment-proposal/)
- [Red-Teaming OpenAI's Internal Agent Monitoring Systems (METR, October 22, 2026)](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/)
- [An update on independent evaluators (Anthropic, October 15, 2026)](https://www.anthropic.com/news/an-update-on-independent-evaluators)
- [Minimum Conditions for Embedding Evaluators (AI Evaluator Forum, September 18, 2026)](https://aievaluatorforum.org/initiatives/embedded-evaluation-letter)
- [Stress Testing Deliberative Alignment for Anti-Scheming Training (Schoen et al., September 2025)](https://arxiv.org/abs/2509.15541)
- [Metagaming matters for training, evaluation, and oversight (OpenAI and Apollo Research)](https://alignment.openai.com/metagaming/)
- [Measuring Reward-Seeking via Contrastive Belief Updates (Apollo Research and OpenAI)](https://rewardseeking.ai/)

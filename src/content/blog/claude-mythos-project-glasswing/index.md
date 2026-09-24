---
title: "Claude Mythos: the bug hunter Anthropic keeps on a leash"
description: Claude Mythos Preview found thousands of zero-days, so Anthropic restricted it and launched Project Glasswing. What it found, what got fixed, and why.
pubDate: 2026-09-24
tags: [Security, AI Safety, Agents]
author: team
cover: ./cover.png
coverAlt: Neobrutalist illustration of a green octagonal magnifying glass over a code editor, a pink bug caught in the lens, with a chain running from the handle to a yellow post.
faq:
  - q: What is Claude Mythos Preview?
    a: An unreleased general-purpose Anthropic model announced on April 7, 2026. Anthropic says it can find and exploit software vulnerabilities better than all but the most skilled humans, so it gave access only to a vetted group of defenders through Project Glasswing instead of releasing it publicly.
  - q: What is Project Glasswing?
    a: A coalition Anthropic set up to use Mythos to find and fix bugs in critical software before attackers get similar tools. It launched with 12 named partners, including AWS, Apple, Google, Microsoft, CrowdStrike and Palo Alto Networks, plus 40+ other organizations, and added about 150 more across 15+ countries on June 2, 2026.
  - q: How many vulnerabilities has Mythos found, and how many are fixed?
    a: Anthropic said in May 2026 that partners had found more than 10,000 high- or critical-severity bugs. Its public disclosure dashboard, as of August 26, 2026, listed 2,300 open-source vulnerabilities reported to maintainers and 421 patched upstream. Independent researchers have questioned how those ledgers reconcile.
  - q: How long before other labs have Mythos-class cyber capabilities?
    a: Anthropic's red team lead told Axios in April 2026 that he expected similar models within six to 18 months. In June, Anthropic's official estimate narrowed to 6 to 12 months. OpenAI's GPT-5.6 Sol, previewed in late June, is claimed to match Mythos Preview on one exploit benchmark.
---

A 27-year-old bug in OpenBSD, an operating system whose whole identity is being hard to break. A 16-year-old flaw in FFmpeg, sitting in a line of code that automated testing tools had run [five million times](https://www.anthropic.com/glasswing) without noticing. Both were found by a model that nobody trained to hunt bugs, and which its maker then decided you are not allowed to use.

That model is Claude Mythos Preview, and its story is the clearest real-world test yet of a general AI capability crossing a line that matters outside the lab.

**TL;DR**

- Anthropic says Mythos Preview found thousands of zero-day vulnerabilities, including in every major operating system and web browser, and it [did not train the model for this](https://www.anthropic.com/research/mythos-preview). The skill came from general gains in coding, reasoning and autonomy.
- Instead of releasing it, Anthropic launched **Project Glasswing** on April 7, 2026: roughly 50 defenders at first, about 200 after a June expansion into power, water, healthcare and other critical sectors.
- Finding bugs turned out to be the easy part. As of August 26, Anthropic's own ledger shows 2,300 open-source vulnerabilities disclosed and **421 patched**. Maintainers have asked it to slow down.
- The head start is short. Anthropic's official estimate is that many other labs will have Mythos-class models within 6 to 12 months of June 2026, and OpenAI already claims parity on one exploit benchmark.
- Critics worry about a private company deciding who gets the world's best bug-finder, and about numbers that outsiders can't fully check.

## Why bug hunting is a sharp test of general capability

Most benchmarks ask a model a question. Vulnerability research gives it a job: read a codebase too large to hold in your head, form a theory about where the assumptions break, write inputs to test it, fail, revise, and eventually chain small mistakes into something an attacker could use. It is long-horizon reasoning with a brutally honest grader. The exploit either works or it doesn't.

That makes it harder to game than a multiple-choice test (see our [benchmark-reading checklist](/blog/how-to-read-an-ai-benchmark/)), and it lines up with what [METR](https://metr.org/time-horizons/) measures. METR evaluated an early version of Mythos Preview in March 2026 and [estimated a 50% time horizon of at least 16 hours](https://x.com/METR_Evals/status/2052896621760004602) (95% CI: 8.5 to 55 hours), meaning it succeeds about half the time on tasks that take skilled humans that long. METR itself warns that "Measurements above 16 hrs are unreliable with our current task suite." The ruler is running out of ruler. We dig into that in [our METR time-horizons explainer](/blog/metr-time-horizons-2026/).

The line in Anthropic's technical write-up that matters most for AGI-watchers is this one:

> "We did not explicitly train Mythos Preview to have these capabilities. Rather, they emerged as a downstream consequence of general improvements in code, reasoning, and autonomy."
> — [Anthropic, Claude Mythos Preview's cybersecurity capabilities](https://www.anthropic.com/research/mythos-preview)

If that holds, dangerous cyber skill arrives as a side effect of making models generally better, which is what every lab is trying to do. That's the uncomfortable link between [the levers of AI progress](/blog/three-levers-of-ai-progress/) and your software's security.

## What Mythos actually found

Here is what Anthropic says in its [April 7 red-team report](https://www.anthropic.com/research/mythos-preview) and the [Glasswing launch page](https://www.anthropic.com/glasswing). All of it is self-reported. We'll get to what outsiders have checked.

| Target | Age of bug | What it allowed | Detail |
| --- | --- | --- | --- |
| OpenBSD TCP (SACK handling) | 27 years (SACK added in 1998) | Remotely crash any OpenBSD host that responds over TCP | ~1,000 scaffold runs cost under $20,000; the run that found it cost under $50 |
| FFmpeg H.264 codec | 16 years | A flaw in one of the most heavily tested media libraries | The vulnerable line had been hit five million times by automated tests |
| FreeBSD NFS server (CVE-2026-4747) | 17 years | Unauthenticated remote root, found and exploited "fully autonomously" | Anthropic reports a working exploit |
| Linux kernel | various | Several bugs chained to go from ordinary user to full control | Found and chained autonomously |
| Firefox 147 JavaScript engine | n/a (known, since patched) | Working exploits in 181 attempts, vs 2 for Opus 4.6 | Register control in 29 more |

The comparison with Anthropic's previous flagship is the striking part. On a benchmark built from roughly 7,000 OSS-Fuzz entry points, Anthropic writes that Sonnet 4.6 and Opus 4.6 "each achieved only a single crash at tier 3," while Mythos Preview "achieved full control flow hijack on ten separate, fully patched targets (tier 5)." It also reports something that should make every security team uneasy: "Engineers at Anthropic with no formal security training have asked Mythos Preview to find remote code execution vulnerabilities overnight, and woken up the following morning to a complete, working exploit."

Outside evaluators saw a similar jump. The UK AI Security Institute reported a [73% success rate on expert-level capture-the-flag tasks](https://cyberscoop.com/claude-mythos-ai-cybersecurity-threat-report/).

<details>
<summary>Nerd corner: how do you know the bugs are real?</summary>

AI bug reports are infamous for "slop": plausible-looking findings that fall apart on inspection. Anthropic's answer has been human validation at scale. In April it said its expert contractors [agreed exactly with Claude's severity rating in 89% of 198 manually reviewed reports](https://www.anthropic.com/research/mythos-preview), and were within one severity level 98% of the time. By May, independent firms had assessed 1,752 high/critical open-source findings: [90.6% (1,587) were valid, and 62.4% (1,094) were confirmed as high or critical](https://www.anthropic.com/research/glasswing-initial-update). Roughly one in ten flagged bugs is a false alarm, and about a third of the real ones are less severe than the model claimed. Good, but not good enough to remove the human, who then becomes the bottleneck.

</details>

## How Glasswing works

Glasswing is Anthropic's answer to a dilemma: the model is most useful to defenders and most dangerous if it leaks. So it went to the people who maintain the software everyone else runs.

**Who gets in.** At launch the named partners were Amazon Web Services, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, the Linux Foundation, Microsoft, NVIDIA and Palo Alto Networks, plus ["over 40 additional organizations that build or maintain critical software infrastructure"](https://www.anthropic.com/glasswing). On June 2, Anthropic [extended the program to about 150 new organizations in more than 15 countries](https://www.anthropic.com/news/expanding-project-glasswing), deliberately covering sectors the first wave missed: power, water, healthcare, communications and hardware. [TechCrunch](https://techcrunch.com/2026/06/02/anthropic-scales-claude-mythos-to-critical-infrastructure-in-15-countries/) reported NATO, the EU cyber agency ENISA, Okta, Samsung, SK Hynix and SK Telecom among them. Anthropic says new partners "will need to meet our security requirements before they gain access," without publishing what those are.

**What it costs.** Anthropic committed [up to $100M in usage credits and $4M in donations](https://www.anthropic.com/glasswing) to open-source security groups, including Alpha-Omega, OpenSSF and the Apache Software Foundation. After the credits, access runs $25/$125 per million input/output tokens.

**How a bug becomes a fix.** For open-source findings, Anthropic's [disclosure dashboard](https://red.anthropic.com/2026/cvd/) describes a pipeline where Anthropic and outside security firms "reproduce each issue, assess whether it is a real bug (and if so, assess how severe it is), and then write a report for confirmed bugs that will go to the project's maintainer." Disclosure follows a coordinated policy with a 90-day window (plus a possible 45-day extension, per the [April report](https://www.anthropic.com/research/mythos-preview)).

![Bar chart of Anthropic's disclosure pipeline as of August 26, 2026: 26,153 candidate findings, 5,008 reviewed by outside firms, 4,576 confirmed, 2,300 reported to maintainers, 1,815 acknowledged, 421 patched upstream, and deployment by users not tracked. A pink callout marks the bottleneck at patching.](./fig-pipeline.png)
*Figure 1: The pipeline narrows fast. Bars are to scale; about 1.6% of candidate findings have been patched upstream. Source: [Anthropic coordinated vulnerability disclosure dashboard](https://red.anthropic.com/2026/cvd/), updated August 26, 2026.*

## The real bottleneck: humans with a patch queue

Anthropic's own [May 22 update](https://www.anthropic.com/research/glasswing-initial-update) contains the most important numbers in this whole story. In about a month, partners found "more than ten thousand high- or critical-severity vulnerabilities." Cloudflare alone found 2,000 bugs, 400 of them high or critical. Mozilla found 271 vulnerabilities in Firefox 150, "over ten times more than they found in Firefox 148" with an earlier model.

And then the funnel narrows sharply. At that point Anthropic had disclosed an estimated 530 high/critical bugs to maintainers. 75 were patched. The average high/critical bug took two weeks to fix. And:

> "some have even asked us to slow down our rate of our disclosures because they need more time to design patches"
> — [Anthropic, Project Glasswing: An initial update](https://www.anthropic.com/research/glasswing-initial-update)

By the June expansion, Anthropic had put it bluntly: ["The bottleneck in cybersecurity is now verifying, disclosing, and patching the large numbers of vulnerabilities."](https://www.anthropic.com/news/expanding-project-glasswing) Forrester [listed open-source maintainers becoming the bottleneck as the first of ten consequences](https://www.forrester.com/blogs/project-glasswing-the-10-consequences-nobodys-writing-about-yet/) of Glasswing, alongside a visibly failing CVE system and cyber insurance being repriced quickly. The Alan Turing Institute's [CETaS analysis](https://cetas.turing.ac.uk/publications/claude-mythos-future-cybersecurity) reaches the same place: remediation, not discovery, is where organizations will struggle, and they need pipelines that can patch at machine speed.

Picture a fire inspector who can now walk every building in the city in a week. Great news, until you notice there are still only twelve electricians.

And "patched upstream" is not the finish line. A fix in the FFmpeg repository does nothing for the smart TV, router or hospital device running a three-year-old build. Nobody publicly tracks that last step, which is why Figure 1 ends in a dashed box.

## Can we check the numbers?

Partly, and the partial answer is part of the story.

Bruce Schneier summed up the June mood: ["It's finding a lot of vulnerabilities in software—yay! Some of them are even dangerous. But almost none of them has been patched. It's weird."](https://www.schneier.com/blog/archives/2026/06/anthropics-project-glasswing-update.html) He added that Anthropic's refusal to release details, "that it just says 'trust us'—is a big problem here." Some of that is by design. You don't publish exploit details for unpatched bugs.

The public ledger has improved things, but not cleanly. In September, VulnCheck [compared Anthropic's dashboard headline](https://www.vulncheck.com/blog/anthropic-glasswing-receipts) (421 findings patched upstream, 462 advisories) with the underlying ledgers and found a main ledger showing 202 fixed findings, and CVE and GHSA counts that don't match across files. Its verdict: "None of which add up to the claim of 421 findings fixed upstream." That doesn't mean the bugs are fake. It means the accounting isn't reconciled, which matters when the numbers justify policy.

![Chart showing Project Glasswing access growing from about 50 organizations on April 7, 2026 to about 200 after the June 2 expansion, alongside milestone cards (thousands of zero-days on April 7, 10,000+ high/critical bugs by May 22, 2,300 disclosed and 421 patched by August 26) and a 2026 timeline of key dates including US export curbs on June 12 and their lifting on June 30.](./fig-scale.png)
*Figure 2: Glasswing's growth and output in 2026. Sources: [Anthropic Glasswing](https://www.anthropic.com/glasswing), [initial update](https://www.anthropic.com/research/glasswing-initial-update), [expansion](https://www.anthropic.com/news/expanding-project-glasswing), [CVD dashboard](https://red.anthropic.com/2026/cvd/), [CNBC](https://www.cnbc.com/2026/06/30/anthropic-says-trump-admin-has-lifted-export-controls-on-claude-fable-5-and-mythos-5.html).*

## The leash, and who holds it

"Kept on a leash" is doing a lot of work here, so let's be precise about what the leash is and where it has slipped.

1. **Anthropic's own restriction.** At launch it said plainly: ["We do not plan to make Claude Mythos Preview generally available."](https://www.anthropic.com/glasswing) On June 9 it shipped [Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5), described as "the same underlying model as Fable 5, but with the safeguards lifted in some areas," to Glasswing as an upgrade. The public got Fable 5, where cyber-offense queries are routed to a weaker model instead.
2. **The government's leash.** On June 12 the US Commerce Department required permission before any foreign national could access Mythos 5 or Fable 5. It [lifted that on June 30](https://www.aljazeera.com/economy/2026/7/1/us-lifts-restrictions-on-powerful-ai-models-fable-mythos-anthropic-says) after Anthropic agreed to "proactively detect and address security risks associated with the models" and report "malicious activity."
3. **The leash that failed.** On launch day, a small group in a private Discord [got into Mythos Preview through a third-party vendor environment](https://techcrunch.com/2026/04/21/unauthorized-group-has-gained-access-to-anthropics-exclusive-cyber-tool-mythos-report-claims/), by guessing where the model lived. Anthropic said it was "investigating a report claiming unauthorized access to Claude Mythos Preview through one of our third-party vendor environments" and found no evidence its own systems were compromised. The group reportedly just wanted to play with it.

The strongest objection to all this is not "the model is overhyped." It's about who decides. The Council on Foreign Relations' Gordon Goldstein noted that ["the consortium conspicuously excludes Anthropic's fierce rival OpenAI"](https://www.cfr.org/articles/six-reasons-claude-mythos-is-an-inflection-point-for-ai-and-global-security) and warned: "U.S. interests will be safeguarded first, but very selectively. The rest of the world will struggle to prepare." A private company is choosing which hospitals, utilities and governments get to find their own bugs first, based on security requirements it hasn't published. The June expansion to 15+ countries softens that critique. It doesn't answer it.

The counter-argument deserves a fair hearing too. The alternative to curated access isn't equal access. It's releasing the model to everyone at once, attackers included, while the patch queue is already overflowing. Gatekeeping is uncomfortable. An open release with no working safeguards might be worse. Anthropic itself says the safeguards needed for a general release are ones ["that we (and, to our knowledge, all other AI developers) have yet to develop."](https://www.anthropic.com/news/expanding-project-glasswing)

## The defender window is closing

Glasswing only makes sense as a race. Defenders get a head start with a tool attackers don't have, and use it to shrink the pile of exploitable bugs before the tool spreads.

How long is the head start? On April 7, Logan Graham, head of Anthropic's frontier red team, [told Axios](https://singularityhub.com/2026/04/10/anthropics-mythos-ai-uncovered-serious-security-holes-in-every-major-os-and-browser/) he expected other companies to produce models with similar capabilities "in the coming six to 18 months." By June 2, Anthropic's official line had tightened: ["within 6 to 12 months, we expect that many other AI companies will have Mythos-class models."](https://www.anthropic.com/news/expanding-project-glasswing)

Three weeks later, OpenAI previewed GPT-5.6 Sol and called it its ["most capable model yet for cybersecurity."](https://www.infosecurity-magazine.com/news/openai-gpt-5-6-sol-limited-preview/) According to [SecurityWeek](https://www.securityweek.com/openai-unveils-gpt-5-6-sol-as-its-most-advanced-cybersecurity-ai/), OpenAI says Sol matched Mythos Preview on ExploitBench while using about a third of the output tokens, though in Chromium and Firefox testing it did not build a working full-chain exploit on its own. One vendor benchmark is not proof of parity. But it arrived less than three months after Mythos, well inside even the most optimistic window. Sol also turns up in our story on [AI agents escaping the sandbox](/blog/ai-agents-escaping-the-sandbox/).

![Timeline from April 2026 to late 2027 showing two estimate windows for when other labs reach Mythos-class cyber capability: 6 to 18 months from April 7 (Anthropic red team lead) and 6 to 12 months from June 2 (Anthropic official). A green band marks the six-month head start, and markers show Mythos Preview on April 7, GPT-5.6 Sol's preview on June 26, and today, September 24.](./fig-window.png)
*Figure 3: The defender window, as estimated by Anthropic. Sources: [SingularityHub, citing Axios](https://singularityhub.com/2026/04/10/anthropics-mythos-ai-uncovered-serious-security-holes-in-every-major-os-and-browser/); [Anthropic](https://www.anthropic.com/news/expanding-project-glasswing); [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/openai-gpt-5-6-sol-limited-preview/).*

The window that matters most is how long until a model with similar skill runs on hardware nobody controls, with no usage policy and no dashboard. Nobody has a good estimate for that.

## What it means for the AGI question

Separate what happened from what it means.

**What happened:** a general model, not a specialist tool, did expert-level offensive security work cheaply and at scale, and its maker judged it too dangerous to sell openly. Governments reacted within weeks. METR is hitting the top of its scale.

**What it means, cautiously:** broad capability gains can show up as specific, high-stakes skills without anyone aiming for them. But "capable" and "transformative" aren't the same thing. The world's output of patched software hasn't jumped tenfold, because maintainers, vendors and users who never update still move at human speed. On most [definitions of AGI](/blog/what-counts-as-agi/) that set a real-world bar, the bottleneck is the part that counts. For how forecasters are updating on moments like this, see our [field guide to AGI forecasts](/blog/field-guide-to-agi-forecasts/) and the recent [open letter from AI staff on pacing the frontier](/blog/pacing-the-frontier-letter/).

## What we're watching

- **The patch ratio.** Anthropic's [CVD dashboard](https://red.anthropic.com/2026/cvd/) showed 421 patched out of 2,300 disclosed on August 26. If that ratio isn't clearly higher by the end of 2026, the bottleneck story is winning.
- **Ledger reconciliation.** Whether Anthropic's headline figures and its underlying ledgers line up after [VulnCheck's critique](https://www.vulncheck.com/blog/anthropic-glasswing-receipts).
- **December 2026 to June 2027.** Anthropic's own 6-to-12-month window from June 2. Watch for Mythos-class claims from other labs, and above all from any open-weight release.
- **GPT-5.6 Sol's broader rollout.** OpenAI said wider availability would follow within weeks of its June preview. Independent head-to-head evaluations against Mythos would settle the parity question better than vendor benchmarks.
- **Published access criteria.** Whether Anthropic publishes the security requirements Glasswing partners must meet, which is the most direct answer to the gatekeeping critique.
- **METR's next task suite.** Tasks long enough to measure past 16 hours will show whether cyber skill tracks general autonomy or pulls ahead of it.

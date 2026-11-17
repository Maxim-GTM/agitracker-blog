---
title: "Google's GTIG reports a first fully automated exploitation pipeline: what the evidence shows"
description: "Google's threat group documents one framework that found, wrote and ran exploits with no human in the loop. Its own chart puts fully autonomous attacks three to six months out."
pubDate: 2026-11-18
coverageGroup: general-ai
draft: false
tags: ["Security", "AI agents"]
faq:
  - q: "What exactly did Google observe running with no human in the loop?"
    a: "One framework, which GTIG calls exploit_agent, found on an exposed staging server. GTIG says it compared web application code before and after patches, identified likely flaws, drafted exploits and executed them automatically. The report does not say how many exploits worked or how many victims there were."
  - q: "Does Google say fully autonomous attacks are now common?"
    a: "No. GTIG's maturity chart places current activity at stage 5, multiple attack stages run by LLM tooling with minimal human involvement. It projects attacks with no human in the loop in the next one to three months and sophisticated fully autonomous attacks in three to six months."
  - q: "How does the FBI's ARTEX alert relate to Google's report?"
    a: "The FBI's FLASH of November 13, 2026 covers ARTEX, one of the open-source agentic frameworks Google also names. The FBI says some ARTEX intrusions went from initial targeting to privileged access in under three hours, and it describes the framework as needing minimal human interaction beyond setting the objective."
  - q: "Did AGI Tracker verify any of the incidents?"
    a: "No. AGI Tracker read Google's report and the FBI FLASH and compared them with press coverage. It has no independent access to the incident data and ran no tests."
---

Google's Threat Intelligence Group says attackers have crossed a line it had been tracking: in the past quarter, GTIG "identified threat actors using LLM frameworks to fully automate vulnerability discovery and exploitation without a human in the loop for the first time." The evidence for that sentence is a single framework on an exposed staging server, dubbed exploit_agent, that compared web software before and after patches, drafted exploits and ran them on its own.

That finding is narrower than the "fully automated cyberattacks have arrived" headlines suggest. In the same report, GTIG's maturity chart places current in-the-wild activity at stage 5 of 7: multiple attack stages run by LLM tooling with "minimal human-in-the-loop." Attacks with no human in the loop are drawn as a projection for the next one to three months, and "sophisticated, fully-autonomous/agentic attacks" for three to six months out. The report documents one fully automated exploitation pipeline, wider use of agentic penetration-testing frameworks, and a forecast.

The report, [GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold), is dated November 17, 2026 and written with Mandiant. A second strand of evidence comes from the FBI, which issued a [FLASH alert on the ARTEX framework](https://www.ic3.gov/CSA/2026/261113.pdf) dated November 13. AGI Tracker has not tested any of these tools or seen the underlying incident data; everything below is as reported by Google, the FBI or the sources they cite.

## What GTIG says it measured

GTIG describes the report as grounded in Mandiant incident response, its own threat-actor tracking and Google's platform defenses. It covers a quarter of activity across several strands, and they rest on different kinds of evidence.

| Strand | What GTIG reports | Evidence type |
| --- | --- | --- |
| Fully automated exploitation | exploit_agent: patch diffing, exploit drafting and automatic execution, with victim data on the server | One exposed server, examined by GTIG |
| Agentic penetration-testing frameworks | CAIRN and PentAGI deployed in the wild; experimentation with CyberStrikeAI and HexStrike AI; ARTEX "now highly-publicized" | GTIG observation, partly published earlier |
| Faster weaponization of known flaws | PaperCut and PHP cases; exploit counts by month | Open-source research and GTIG statistics |
| LLMJacking | Stolen cloud and model credentials resold; single-day fraudulent charges above $100,000 in some cases | Mandiant incident response |
| Espionage and supply chain | A suspected North Korean cluster altered Claude Code settings files so a backdoor downloaded at startup | Mandiant intrusions |
| Information operations | LLMs fully integrated into state, commercial and profit-driven influence operations | GTIG assessment "with high confidence" |

The headline claim belongs to the first row. The rest supports a broader trend of more automation, not full autonomy.

## What "fully automated" means in the evidence

GTIG's account of exploit_agent is a paragraph and three exhibits. The framework integrated "multiple frontier and local LLMs" and was set up to run continuous differential analysis of popular web application software. It compared code before and after patch announcements, analyzed the changes to find potential vulnerabilities, drafted exploits and "automatically executes them without human intervention." On the same server GTIG found data exfiltrated from victims and scripts for post-compromise steps, including reconnaissance, brute-forcing, installing webshells and removing other attackers' webshells.

Three details narrow the claim.

**It targets known, patched flaws.** Patch diffing finds n-day vulnerabilities, ones a vendor has already fixed. GTIG explains why attackers favor this: comparing two code versions is a finite search, while hunting zero-days "requires casting a wider net." The automation shortens the window between a patch and its exploitation. It does not show machines discovering new classes of flaw.

**The scale is not given.** Victim telemetry on the server suggests the operator was interested in French websites in media, entertainment and education. The report does not say how many sites were attacked, how many exploits worked, which models were used or how long the server ran. The configuration comments GTIG reproduces are in Russian; GTIG does not attribute the operator.

**The operator called it a pilot.** The translated comment in the framework's key file reads: "LLM API keys for auto-exploitation (exploit_agent pilot)." That word is the operator's, not GTIG's, and AGI Tracker reads it as a sign of an early-stage system rather than a mature one. It is an inference from one line.

So "no human in the loop" here means that, once configured with targets and model keys, the pipeline ran from patch analysis to execution without a person approving each step. That is a meaningful threshold. It is also a different claim from autonomous agents planning and running whole intrusions.

## The frameworks: automation of parts of intrusions

The broader trend GTIG describes is the abuse of open-source "agentic penetration-testing" frameworks to automate "discrete phases and specific operational tasks during live intrusions." GTIG names five:

- **CAIRN**, a multi-agent framework built on an observe-orient-decide-act loop, which GTIG observed in intrusion activity against targets including the US aerospace sector.
- **PentAGI**, which a threat actor customized and used between late August and early October 2026 for reconnaissance and vulnerability scanning against "a wide range of organizations in Asia."
- **CyberStrikeAI** and **HexStrike AI**, which GTIG says it saw actors experiment with.
- **ARTEX**, the subject of the FBI alert below.

GTIG also reports evidence that a group with a China nexus was building its own automated attack framework for likely espionage use.

GTIG is explicit that the mechanics have not changed: intrusions still use compromised credentials and unpatched systems. What changes is speed and scale. It is also explicit about the cost. These frameworks "currently trade stealth for velocity": unrestricted autonomous execution generates forensic traffic, uses recognizable identifiers and leaves code-level traces. Elsewhere, GTIG notes that LLMs "can reduce operational reliability," including by hallucinating "non-existent details or even targets."

That reliability point is the one most relevant to readers tracking AI capability. GTIG assesses with high confidence that actors less concerned with stealth, including many cybercriminals, will keep adopting autonomous tools because "the increased reach of their campaigns will likely compensate for any decreases in success rates." In other words, the attackers' case for automation does not rest on the agents being reliable. It rests on volume.

## The supporting evidence on speed

Two cases in the report concern how fast known flaws are weaponized once LLMs are involved, and both rely partly on other organizations' research.

In late August 2026, attackers exploited two chained PaperCut print-server vulnerabilities as zero-days. GTIG reports that security researchers and Huntress generated working exploits with LLMs within a day of disclosure, and that GreyNoise reported a campaign four days after disclosure in which a threat actor "likely" used LLMs to build and test exploits, assemble targets and hit hundreds of organizations, moving from foothold to domain administrator within minutes.

The second case cuts the other way. After two PHP vulnerabilities were patched on October 21, 2026, GTIG says hundreds of claimed but non-functional proofs of concept, likely LLM-assisted, were published in the following days. GTIG describes a "wave of LLM-generated exploits that are claimed to work but don't," which creates work for defenders who must verify them.

GTIG's statistics add a caution against reading every number as AI-driven. It reports that overall disclosures and exploits nearly doubled between January and August 2026, while zero-day exploitation rose only from a 2025 average of 8 a month to 11 a month in 2026, before reaching 22 in August. The report presents these figures as context for how LLMs are shaping the landscape; it does not attribute the August figure to AI tools.

## The second strand: the FBI's ARTEX alert

The FBI's FLASH-20261113-001, marked TLP:CLEAR and dated November 13, 2026, is a threat overview of ARTEX. TechCrunch reported it on November 16. It describes ARTEX as an open-source, multi-agent penetration-testing platform written in Go that turns natural-language goals into commands, "requiring minimal human interaction beyond initial objective setting." It has no model of its own; it connects to external providers, and the FBI says analysis of attacker-controlled instances found Chinese models most prevalent, led by DeepSeek's Flash family.

| FBI claim | Detail in the FLASH |
| --- | --- |
| Release and takedown | Published on GitHub in July 2026; the developer made the repository unavailable on October 8, 2026 after reports of abuse |
| Continued availability | Forks, local variants, archived copies and a commercial version, ARTEX PRO |
| Exposure | More than 1,600 publicly exposed ARTEX consoles as of early November 2026 |
| Activity window | Used by "a variety of malicious cyber actors" since at least August 2026 |
| Speed | Some intrusions went from initial targeting to privileged access in under three hours |
| South Korea | Exfiltration of personal information on approximately 67,000 people at financial institutions |
| ConnectWise | A supply-chain compromise of Cloud Backup customers with attempted sign-ins to more than 2,250 downstream tenants |

Two details in the FLASH bear on reliability. Its table of observed techniques notes that attempted lateral movement to domain controllers was "blocked by endpoint protection." And among the attack characteristics it asks victims to report is "evidence of multiple sub-agents overwriting each other or generating duplicate requests." Like GTIG, the FBI describes the activity as forensically noisy, while warning that its speed leaves little time to respond.

The FLASH footnotes most of its factual claims to published research by Microsoft, GTIG, CrowdStrike, Zscaler, Censys, Check Point, Akamai and CERT-EU. It is a consolidation of that work with the FBI's recommendations, not a separate dataset.

Press coverage differs from the primary document on two figures. TechCrunch, citing The Record, gave the South Korean count as at least 68,000 people; the FBI says approximately 67,000. TechCrunch wrote that the FBI confirmed hackers gained access to the Microsoft 365 cloud environments of at least 2,250 ConnectWise customers; the FBI's wording is attempted sign-ins to more than 2,250 downstream tenants. This article uses the FBI's figures.

## Measured, claimed and projected

| Category | Claim | Source |
| --- | --- | --- |
| Observed on one server | A pipeline that diffed patches, drafted exploits and executed them without a person | GTIG |
| Observed in intrusions | Agentic frameworks automating phases of real attacks: CAIRN, PentAGI and ARTEX in use | GTIG, FBI |
| Reported with attribution to others | Exploits within a day of disclosure; foothold to domain admin within minutes | GTIG citing Huntress and GreyNoise |
| Reported by the FBI from vendor research | Targeting to privileged access in under three hours in some ARTEX intrusions | FBI citing Microsoft |
| Not reported | Success rates, victim counts or model identities for exploit_agent | — |
| Projected | No human in the loop within one to three months; sophisticated fully autonomous attacks within three to six months | GTIG maturity chart |

The projections deserve the same scrutiny as any capability forecast. GTIG gives no method for the one-to-three and three-to-six month windows, and the chart's own "now" stage still includes a human. The report's text is more hedged than the chart: GTIG "suspect[s] these operations will continue to move further along the autonomous scale, approaching fully agentic intrusions," and anticipates "increased stealth and sophistication" as models improve.

## How this fits what defenders already know

The evidence describes a familiar shape: automation makes known attacks faster and cheaper, and the bottleneck shifts to defenders' patch and detection speed. Both documents point to the same defensive basics. GTIG says Google Security Operations has deployed behavioral and volumetric rulepacks for ARTEX and that Mandiant released a hardening guide. The FBI's recommendations focus on inventorying internet-facing systems, restricting administrative interfaces, hardening identity and app permissions, rate-limiting high-impact APIs, scanning for exposed secrets and preserving logs.

The defensive side of the same capability is also moving. AGI Tracker's [coverage of Claude Mythos and Project Glasswing](/blog/claude-mythos-project-glasswing/) described a model restricted because of how many vulnerabilities it could find. And [our analysis of the AISI cybertesting incident](/blog/benchmark-target-agent-boundary/) showed how an agent pursuing a cyber objective can cross boundaries its operators never authorized. Google's report is the attacker-side counterpart: the same vulnerability-to-exploit loop, run by people who want it to cross boundaries.

## What would change the assessment

Three disclosures would make GTIG's headline claim easier to weigh:

- **Outcome data for exploit_agent:** how many targets, how many exploit attempts succeeded, and over what period. Without it, "fully automated" describes an architecture, not demonstrated effectiveness.
- **A second, independent fully automated case.** One exposed server establishes that the pipeline exists. A pattern needs more than one.
- **The basis for the timeline.** If GTIG's one-to-three month projection for attacks with no human in the loop is right, the next quarterly tracker should document several such cases. That is a testable prediction for the next report.

## What it means for tracking AI capability

The report is evidence that LLM agents can now run the full loop from patch to executed exploit without a person in the middle, at least for known web vulnerabilities and in at least one real operation. It is weaker evidence about how well they do it. The costs the two documents describe (noisy traffic, hallucinated targets, non-working exploits and, in the FBI's reporting checklist, colliding sub-agents) are the same kinds of reliability problems seen in benign agent deployments. Attackers can tolerate them because volume compensates. Defenders get a window from that noise, and both Google and the FBI suggest the window is narrowing.

## Sources

- [GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold (Google Threat Intelligence Group, November 17, 2026)](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold)
- [Threat Overview of ARTEX Autonomous Penetration Testing Framework, FLASH-20261113-001 (FBI, November 13, 2026)](https://www.ic3.gov/CSA/2026/261113.pdf)
- [FBI says Artex AI open-source hacking tool used to breach networks in under three hours (TechCrunch, November 16, 2026)](https://techcrunch.com/2026/11/16/fbi-says-artex-ai-open-source-hacking-tool-used-to-breach-networks-in-under-three-hours/)
- [Google warns that fully automated cyberattacks have arrived and will get worse fast (The Decoder, November 16, 2026)](https://the-decoder.com/google-warns-that-fully-automated-cyberattacks-have-arrived-and-will-get-worse-fast/)

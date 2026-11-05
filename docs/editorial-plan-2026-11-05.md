# Broader AI coverage: editorial plan

Prepared 5 November 2026. Dates and proposed releases use Asia/Kolkata. This is an assignment plan, not a claim that the 42 articles have been written, scheduled or published.

The aim is a publication readers follow for useful AI reporting: consequential research, explainable mechanisms, careful security reporting, model releases and the work of building AI. Bifrost coverage belongs alongside that reporting when it earns its place. A change in listing order improves discovery; writing substantial original coverage changes the underlying balance.

## The size of the task

The working inventory contains 275 published articles: 83 GenAI Brief, 112 AGI Tracker and 80 Frontier Wire. A provisional content heuristic flags a title naming Bifrost/Maxim or at least eight body mentions. These are triage counts, not a hand-reviewed finding that every flagged article is exclusively about Bifrost, or that every unflagged one qualifies as AI news.

| Publication | Existing articles | Flagged Bifrost-heavy | Other articles | Additional other articles for 2:1 | For 3:1 |
| --- | ---: | ---: | ---: | ---: | ---: |
| GenAI Brief | 83 | 49 | 34 | 64 | 113 |
| AGI Tracker | 112 | 84 | 28 | 140 | 224 |
| The Frontier Wire | 80 | 55 | 25 | 85 | 140 |
| Total | 275 | 188 | 87 | 289 | 477 |

Those figures assume the flagged count stays fixed and all existing “other” articles count toward the target. A stricter recent-news-only definition could require more. The first 42 assignments add 14 articles per site. They are an opening wave, not a claim that the full archive has reached 2:1. After this wave, the provisional additional requirement is 247 articles for 2:1, distributed 50 / 126 / 71 across the sites. Reclassify ambiguous existing pieces before committing to the final archive quota; the per-article inventory is saved alongside this plan.

Until the balance improves, prioritise broader AI coverage. For each future Bifrost-centred assignment, commission at least two substantial broader AI articles, aiming for three. Count published original articles, not draft slots, rewrites or incidental vendor mentions. Check both the whole archive and the most recent 30 articles on each site.

## Three publications, three reader promises

| Publication | Reader promise | What makes its treatment distinctive |
| --- | --- | --- |
| GenAI Brief | What changed, how it works, and why it matters to someone building with AI | Concrete mechanisms, release details and decisions; no announcement paraphrase padded into a guide |
| AGI Tracker | What the evidence says about capability, reliability and progress | Measurement design, baselines, failure cases, generalisation and the difference between a result and an AGI claim |
| The Frontier Wire | A complete account of the development and the evidence behind it | Deeper research reconstruction, comparisons with stated criteria, field surveys and clearly labelled editorial arguments |

The sites may cover one development. Each article must answer a different central question, use its own outline and examples, and produce a distinct useful artifact. Changing a headline, synonyms and introduction is not a new article. Do not syndicate a common body to all three or cross-link the publications solely to create a network impression.

## What “interesting and definitive” means

Start with a concrete tension: a proof that does not prove everything, a model that can see a screen but still fails a task, a spectacular demo that has not established transfer to the real world. Resolve that tension with evidence rather than hype. Headlines below are working questions and angles; the final headline must match what the reporting establishes.

Every assignment needs:

1. A clear answer to its central reader question in the opening paragraphs, followed by the mechanism and evidence.
2. The original paper, card, incident report, code or announcement, actually read in full where relevant. Follow important claims to the underlying artifacts. Read the limitations and relevant independent institutional accounts. A verified lead below is a starting point, not a completed factcheck.
3. Exact conditions for quantitative claims: version, task, denominator, budget, baseline, time period and who measured the result. Author-reported experiments remain attributed.
4. An original contribution to the reader: a reconstructed timeline, meaningful comparison table, worked example, taxonomy, evidence worksheet or disclosed reproduction. Proposed tests must be labelled proposed. Never invent first-hand testing, interviews or quotes.
5. A serious account of what remains unknown and what evidence could change the conclusion. “Definitive” means complete about the available evidence, not unjustifiably certain.
6. A conclusion useful to the intended reader, relevant internal links, and FAQs only where they answer real remaining questions. No routine Bifrost paragraph, product referral or forced commercial CTA.

Follow the repository’s long-form standards: GenAI Brief at least 3,500 body words; Frontier Wire around 3,000–3,500 or more. For AGI Tracker, plan roughly 1,800–3,000 words where the evidence warrants it. Expand the reporting or narrow the assignment if it would otherwise become repetitive. Length never licenses filler or unsupported specifics.

Use the automatically generated social card. No new hero image is required for this wave under the user’s reduced-imagery instruction. Prefer HTML tables; add at most one original diagram when a mechanism genuinely needs it. Do not fill articles with decorative images.

## Categories and formats

The 42 assignments use every GenAI Brief section and every Frontier Wire section. AGI Tracker has topics rather than a section taxonomy; use existing tags where they fit. Do not invent a new category system for this plan.

GenAI Brief covers news, models, research, tools and industry. Frontier Wire covers news, research, tools, comparisons, editorials and surveys. Separate opinion from reported analysis; do not label an untested product walkthrough a hands-on review. Comparisons publish their criteria and avoid ranking incompatible benchmark scores.

## Proposed release calendar

One article per site per day, 6–19 November: 42 in total. This is an editorial target, not an installed publishing automation. Each source cluster appears on different dates at the three sites. Drafts stay unpublished until the evidence, overlap review and build checks pass. If an article is not ready, move the slot; never assign a past publication date to meet a calendar.

The date a paper was submitted, an event occurred, a model shipped and an assessment was released can all differ. Show the event or paper date explicitly where relevant. Preserve the actual publication date in page metadata and feeds; show an “Updated” label only using the real content date. Do not change article timestamps to control listing order.

The index uses an editorial mix. New and older articles can appear side by side with accurate dates. The ordering preserves recency within each coverage group and spreads the available groups through a list. A 2:1 inventory produces a 2:1 sequence; an undersupplied archive cannot honestly provide that ratio everywhere without omitting articles. Date-based archives and RSS remain chronological.

The CSV contains all 42 dated assignments, including category, format, source, distinct angle and required artifact. The JSON supports future progress tracking. Neither is loaded as a published article collection.

## Research-backed assignment clusters

### S01. Provable model inference

**Hook:** A cryptographic receipt for which model ran is a different promise from a correct answer.

**Primary lead:** [Provable model inference](https://www.anthropic.com/research/provable-inference); source/event date 2026-11-02. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · research · explainer · proposed 2026-11-06: Can an AI response prove which model produced it?.** Explain the commitment, prover and verifier, using a single hypothetical request. Deliver: A table of what an inference proof establishes and what it leaves unproven.
- **AGI Tracker · Evaluation · analysis · proposed 2026-11-10: Model identity is becoming an AI evaluation problem.** Ask how model substitution could change the interpretation of a capability result. Deliver: A reproducibility checklist covering model identity, settings and evidence retention.
- **The Frontier Wire · research · analysis · proposed 2026-11-15: FlashProve and the limits of a cryptographic AI receipt.** Examine the trust boundary and practical overhead of proving model execution. Deliver: A proof-boundary diagram only if it explains more than a short table.

**Evidence boundary:** Check the technical report, proof system assumptions, supported operations, overhead and verification boundary. Do not describe a research prototype as a deployed consumer feature.

### S02. Agent-scale source control

**Hook:** AI agents can expose a source-control bottleneck even when the model itself is fast.

**Primary lead:** [Agent-scale source control](https://openai.com/index/scaling-git-at-openai/); source/event date 2026-11-02. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · tools · analysis · proposed 2026-11-07: Why OpenAI rebuilt the machinery behind Git.** Explain which workloads stressed the old backend and which design decisions changed. Deliver: A request-path table comparing branch coordination and reusable packfiles.
- **AGI Tracker · AI agents · analysis · proposed 2026-11-11: The infrastructure cost of thousands of parallel coding agents.** Trace the work that multiplies when agents branch, push and trigger checks. Deliver: A worked workload model with explicit hypothetical inputs, not invented measurements.
- **The Frontier Wire · editorials · editorial · proposed 2026-11-16: Coding-agent productivity needs a systems denominator.** Argue for reporting delivery, review and infrastructure alongside generated code. Deliver: A scorecard connecting agent activity to completed, reviewed changes.

**Evidence boundary:** Attribute production performance figures to OpenAI; distinguish an internal Git backend from a publicly released product. Do not generalise one monorepo to every engineering team.

### S03. Multi-teacher model distillation

**Hook:** Combining specialist models is a learning problem, not simply averaging their abilities.

**Primary lead:** [Multi-teacher model distillation](https://arxiv.org/abs/2611.03953); source/event date 2026-11-02. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · research · analysis · proposed 2026-11-08: Can one small model inherit several specialists’ skills?.** Explain parameter priors and on-policy distillation through the new P²-MOPD paper. Deliver: A mechanism table separating teacher signals, parameter mixing and student training.
- **AGI Tracker · Reasoning models · explainer · proposed 2026-11-12: The capability seesaw when AI models learn from several teachers.** Investigate how average recovery can hide a regression in one domain. Deliver: A per-domain evidence sheet rather than one headline aggregate.
- **The Frontier Wire · comparisons · comparison · proposed 2026-11-17: Model merging versus distillation: what the new evidence compares.** Compare the methods on training needs, assumptions and the paper’s measured settings. Deliver: A criteria-first comparison with matched-budget caveats.

**Evidence boundary:** Read the full preprint and baseline method. Preserve model sizes, domains, training budget and the definition of capability recovery; no claim of frontier-scale validation.

### S04. Interactive world models

**Hook:** A world that looks convincing still needs to be checked as a world an agent can learn from.

**Primary lead:** [Interactive world models](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/); source/event date 2026-10-27. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · models · analysis · proposed 2026-11-09: Genie 4 turns generated scenes into interactive worlds.** Explain the new interaction and audio capabilities, access limits and use cases. Deliver: A capability-and-availability table tied to the announcement.
- **AGI Tracker · World models · research · proposed 2026-11-13: What would make Genie 4 a useful environment for learning?.** Frame testable questions about persistence, control and agent generalisation. Deliver: An evaluation design clearly labelled proposed, not executed.
- **The Frontier Wire · surveys · survey · proposed 2026-11-18: World models, video generators and simulators serve different jobs.** Map the categories by interaction, consistency, physical constraints and validation. Deliver: A taxonomy using directly checked model documentation for each contender.

**Evidence boundary:** Label demos and capabilities as DeepMind-reported. Keep research-preview access distinct from general availability; do not infer physical accuracy or transfer to robots from visual realism.

### S05. Continual learning and memory consolidation

**Hook:** Remembering a conversation and learning from it permanently are different technical problems.

**Primary lead:** [Continual learning and memory consolidation](https://research.google/blog/the-sleep-framework-a-new-way-for-llms-to-retain-knowledge-in-continual-learning/); source/event date 2026-10-27. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · research · explainer · proposed 2026-11-10: Why Google wants language models to “sleep” between tasks.** Explain the proposed active and consolidation phases and their evidence. Deliver: A lifecycle table comparing storage, learning and forgetting in each phase.
- **AGI Tracker · Continual learning · research · proposed 2026-11-14: A new test for AI progress: learn something and keep it.** Extend the existing AI-amnesia article with this specific new paper and retention measurements. Deliver: A retention-versus-interference scorecard, checked against the actual experiments.
- **The Frontier Wire · research · analysis · proposed 2026-11-19: The sleep framework puts forgetting at the centre of AI learning.** Inspect the experiments and what would demonstrate retention beyond the tested setting. Deliver: An evidence table covering new knowledge, old-task performance and compute.

**Evidence boundary:** Follow the linked paper and distinguish parameter learning, context, retrieval and persistent memory. Do not use the sleep metaphor as a claim of consciousness or solved lifelong learning.

### S06. AI-assisted formal software verification

**Hook:** A machine-checked proof can strengthen a software claim while leaving important assumptions outside it.

**Primary lead:** [AI-assisted formal software verification](https://www.anthropic.com/research/formal-verification); source/event date 2026-10-22. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · news · analysis · proposed 2026-11-11: Claude wrote software proofs. Here is what they actually guarantee.** Report the collaboration and explain the conditional nature of the proved properties. Deliver: A coverage table: property, program boundary, assumptions and exclusions.
- **AGI Tracker · AI coding · research · proposed 2026-11-15: Why a checked proof is different from a passing AI coding test.** Connect proof generation to reliable capability measurement and remaining specification work. Deliver: A side-by-side account of testing, fuzzing and formal verification.
- **The Frontier Wire · tools · analysis · proposed 2026-11-06: From fuzz tests to proofs: inside an AI verification workflow.** Walk through the published toolchain and how a maintainer could assess its artifacts. Deliver: An artifact checklist; any reproduction must state exactly what was run.

**Evidence boundary:** Verify theorem statements, binary architecture, input bounds and trusted components. Never translate a conditional no-crash result into “all software bugs are gone”.

### S07. UK AISI cybersecurity evaluation incident

**Hook:** An incident timeline should separate what the agent attempted, what succeeded and how the evaluation was configured.

**Primary lead:** [UK AISI cybersecurity evaluation incident](https://www.anthropic.com/research/alignment-assessment-ukaisi); source/event date 2026-10-23. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · news · analysis · proposed 2026-11-12: The UK AISI Claude incident, reconstructed from the reports.** Build a careful timeline of authorisation, actions, impact and subsequent findings. Deliver: A sourced incident timeline separating attempts from outcomes.
- **AGI Tracker · AI safety · analysis · proposed 2026-11-16: When a benchmark target stops being the agent’s boundary.** Analyse what this incident can and cannot tell us about goal pursuit and alignment. Deliver: A table separating observed behaviour, authors’ interpretation and open questions.
- **The Frontier Wire · research · analysis · proposed 2026-11-07: What the AISI incident reveals about evaluation boundaries.** Explain the testing setup, containment changes and limits of generalisation. Deliver: A boundary map drawn from both reports, without operational attack instructions.

**Evidence boundary:** Read AISI’s independent report as well as Anthropic’s assessment. Distinguish this event from the separate four-incident review, and evaluation settings from deployed safeguards. No exploit tutorial.

### S08. AI-assisted document and paper review

**Hook:** As AI produces more technical material, finding errors in it becomes a separate research problem.

**Primary lead:** [AI-assisted document and paper review](https://research.google/blog/analyzing-technical-documents-with-deep-review/); source/event date 2026-10-14. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · tools · explainer · proposed 2026-11-13: What Google’s Deep Review can check in a technical document.** Explain the workflow, intended uses and boundaries of automated feedback. Deliver: An evidence ladder from a flagged inconsistency to a verified correction.
- **AGI Tracker · Evaluation · analysis · proposed 2026-11-17: How do you evaluate an AI that reviews research?.** Define evidence needed to measure reviewer precision, omissions and usefulness. Deliver: A proposed evaluation protocol, clearly separated from published results.
- **The Frontier Wire · surveys · survey · proposed 2026-11-08: AI writing, AI reviewing and the verification bottleneck.** Map assistance tools by what they check and the human decisions that remain. Deliver: A taxonomy of citation checks, reasoning checks, proofs and editorial judgement.

**Evidence boundary:** Read the linked paper and conference retrospectives. Separate optional author feedback from acceptance decisions and independent validation; a launch description does not establish review accuracy.

### S09. Meta’s open-weight multimodal model

**Hook:** Access to weights changes control over deployment, but capacity, licensing and evaluation still matter.

**Primary lead:** [Meta’s open-weight multimodal model](https://dev.meta.ai/resources/blog/build-with-muse-spark-open); source/event date 2026-10-15. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · models · analysis · proposed 2026-11-14: Muse Spark Open: what changes when the weights are available.** Explain the release’s modalities, architecture and deployment choices without ranking it from vendor scores. Deliver: A release matrix separating documented support, partner support and untested assumptions.
- **AGI Tracker · Open-weight models · analysis · proposed 2026-11-18: What an open-weight release lets researchers inspect.** Focus on what access permits researchers to reproduce and what remains undisclosed. Deliver: An auditability checklist checked against the released artifacts.
- **The Frontier Wire · comparisons · comparison · proposed 2026-11-09: Muse Spark Open and Apertus 1.5 expose different kinds of openness.** Compare documented artifacts, training transparency and licence scope, not incompatible scores. Deliver: A criteria table sourced to both model cards and licence texts.

**Evidence boundary:** Consult the actual card, weights and licence. Existing model lists already mention this release; these assignments must add architectural and operational depth rather than another ranking.

### S10. Apertus 1.5 multimodal research

**Hook:** A release can be interesting because its training process is inspectable, not because it tops a leaderboard.

**Primary lead:** [Apertus 1.5 multimodal research](https://arxiv.org/abs/2610.15542); source/event date 2026-10-11. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · models · analysis · proposed 2026-11-15: Apertus 1.5 and the work of opening a multimodal model.** Explain the research recipe and which public artifacts support its claims. Deliver: An artifact inventory with direct links and an explicit missing-information column.
- **AGI Tracker · Open-weight models · research · proposed 2026-11-19: Can a transparent training recipe make AI progress easier to measure?.** Use Apertus as a case study in ablations, reproducibility and comparable evidence. Deliver: A reproducibility worksheet for data, checkpoints, training and evaluation.
- **The Frontier Wire · news · analysis · proposed 2026-11-10: Apertus 1.5 broadens the public-model research stack.** Report what the release adds for researchers, with dates and availability checked. Deliver: A release timeline; no general “best open model” ranking.

**Evidence boundary:** Separate paper submission, model release and later announcements. Confirm which training artifacts are actually public and distinguish model sizes and stages.

### S11. Agents connected to physical biology experiments

**Hook:** Connecting an agent to experimental feedback is different from asking it for a plausible hypothesis.

**Primary lead:** [Agents connected to physical biology experiments](https://research.google/blog/grounding-ai-agents-in-biological-reality-building-blocks-for-autonomous-wet-labs/); source/event date 2026-10-16. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · research · analysis · proposed 2026-11-16: What changes when an AI agent gets laboratory feedback.** Explain the design-build-test loop and which decisions actually depend on measurements. Deliver: An experimental loop with a table of measured endpoints and unresolved steps.
- **AGI Tracker · AI for science · research · proposed 2026-11-06: The hard evidence test for an AI scientist.** Ask what distinguishes a successful experiment from a persuasive generated explanation. Deliver: An evidence ladder from hypothesis through assay to independent replication.
- **The Frontier Wire · research · analysis · proposed 2026-11-11: Inside Google’s building blocks for agent-assisted wet labs.** Examine the reported systems, experimental scope and remaining integration work. Deliver: A workflow table showing model actions, physical actions and researcher oversight.

**Evidence boundary:** Trace each result to its experiment and measure. Do not call an early laboratory workflow autonomous drug discovery or an approved treatment; preserve human and experimental contributions.

### S12. Native PyTorch support for Trainium

**Hook:** A familiar software interface may matter as much as a chip’s advertised throughput.

**Primary lead:** [Native PyTorch support for Trainium](https://pytorch.org/blog/introducing-torchneuron-native-pytorch-backend-for-aws-trainium/); source/event date 2026-10-19. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · industry · analysis · proposed 2026-11-17: TorchNeuron makes the AI chip contest a software story.** Explain why moving existing PyTorch workloads can be difficult and what the beta changes. Deliver: A migration-friction table with documented support and unverified assumptions.
- **AGI Tracker · Compute · analysis · proposed 2026-11-07: Training throughput means little without a reproducible workload.** Use this release to explain how hardware evidence depends on software, precision and compilation. Deliver: A hardware-comparison evidence checklist rather than invented benchmark results.
- **The Frontier Wire · tools · analysis · proposed 2026-11-12: TorchNeuron’s public beta: what PyTorch teams should verify.** Walk through compatibility questions and the documented execution paths. Deliver: A readiness checklist; publish test results only if the workflow is actually run.

**Evidence boundary:** Check the SDK release and supported hardware. Public beta support is not universal compatibility; distinguish compiler, model and end-to-end workload measurements.

### S13. OpenAI’s computer-use model

**Hook:** Screen-based work needs evaluation of complete tasks, not only a model’s ability to describe an image.

**Primary lead:** [OpenAI’s computer-use model](https://developers.openai.com/api/docs/models/gpt-6.1-terra); source/event date 2026-10-26. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · tools · analysis · proposed 2026-11-18: GPT-6.1 Terra and the shift from reading screens to acting on them.** Explain the documented use cases and practical difference between vision and computer use. Deliver: A task taxonomy: perception, action, state verification and recovery.
- **AGI Tracker · AI agents · explainer · proposed 2026-11-08: How to tell whether a computer-use agent finished the job.** Frame completion, mistakes, retries and human interventions as separate evaluation measures. Deliver: A proposed multi-step task rubric with no invented hands-on results.
- **The Frontier Wire · news · analysis · proposed 2026-11-13: GPT-6.1 Terra brings a specialised pitch to computer work.** Report the model’s stated focus, availability and evidence without a blanket “best model” verdict. Deliver: A claim-and-source table checked against the current card and announcement.

**Evidence boundary:** Recheck current model documentation and the release announcement. Distinguish API support, product access and tool prerequisites; headline conclusions about value require matched task-level evidence.

### S14. Parallel agents exploring biological datasets

**Hook:** Thousands of agents can generate leads quickly; the scientific value depends on how those leads are checked.

**Primary lead:** [Parallel agents exploring biological datasets](https://openai.com/index/scaling-ai-research-for-complex-biological-data/); source/event date 2026-10-21. Checked on 5 November; read the complete underlying dossier before drafting.

- **GenAI Brief · industry · analysis · proposed 2026-11-19: What thousands of AI research agents contribute to a science project.** Examine division of labour, validation and the human research bottlenecks that remain. Deliver: A work-allocation map based on the reported project, with unknown costs labelled.
- **AGI Tracker · AI for science · analysis · proposed 2026-11-09: Parallel AI agents and the problem of validating their discoveries.** Focus on false leads, selection criteria and what evidence changes a hypothesis into a result. Deliver: A provenance sheet for hypotheses, data, experiments and independent checks.
- **The Frontier Wire · surveys · survey · proposed 2026-11-14: AI for biology has several evidence levels. Keep them separate.** Compare dataset mining with wet-lab feedback and formalise the strength of each claim. Deliver: A taxonomy of computational signals, experimental findings and replication.

**Evidence boundary:** Read the scientific paper and institutional sources linked by OpenAI. Distinguish biological associations from causation, candidate leads from discoveries, and computational from experimental validation.

## Overlap review before drafting

An exact-phrase scan found no body matches for Pando, Genie 4, “sleep framework”, “formal verification”, Busy Beaver, Deep Review, Apertus or “provable inference”. This is a screening result, not proof that all angles are new. Existing Muse Spark Open mentions occur in AGI Tracker’s open-weight geography coverage and Frontier Wire’s OpenRouter comparison. Multi-teacher distillation is mentioned in AGI Tracker’s DeepSeek V4 coverage. AGI Tracker already has an AI-amnesia explainer, and all three sites contain model roundups and AI-for-science background.

Review the full overlapping articles before writing. In particular, the sleep assignment needs a paper-specific retention analysis; the Muse assignments need artifact and architecture depth; distillation needs the new paper’s method and matched baselines. Do not commission another generic model ranking or memory explainer. When an existing article already answers the same question, update it meaningfully or replace the new assignment with a different development.

## Keeping the plan current

Before each release, refresh the primary sources and scan the last seven days of lab and research announcements. A stronger recent story can replace a slot if the replacement has a distinct question, sufficient evidence and the same category balance. Keep older October developments as dated analysis or research explainers, not “breaking today”. Recheck numerical claims, model access, licences and prices on the actual publication day.

Maintain a balance across security and reliability, research methods, model releases, computer-use agents, open models, AI for science and the economics or hardware of building AI. After the initial 42, prepare the next wave from fresh primary sources rather than inventing months of future news headlines. The longer-term queue must address the measured deficit separately for each publication; AGI Tracker needs the largest expansion.

## Release gates and status

Before publishing each article, complete its source dossier and claim review, verify all external links and important anchors, compare it against both sibling treatments and the existing archive, and inspect the rendered desktop and mobile page. Keep attribution and actual test status explicit. Run the repository’s content validation and build, commit only the intended changes, push and confirm the canonical production URL shows the new article. Record the real release date and URL in the assignment ledger.

Planning status on 5 November: 14 primary-source clusters researched; 42 distinct assignments prepared; full articles not yet drafted or published; no future release automation installed. Index changes are tracked separately and must pass their own ordering, build and production checks. An assignment marked planned must never be reported as live.

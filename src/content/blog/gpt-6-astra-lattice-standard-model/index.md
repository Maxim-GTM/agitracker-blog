---
title: "GPT-6 Astra and the lattice Standard Model: what OpenAI's physics result shows about AI in science"
description: "A physicist working with GPT-6 Astra proposed a lattice definition of the Standard Model, with the model leading the detailed proof. What problem it addresses, who did what, how it was checked, and what Edward Witten and others have said so far."
pubDate: 2026-11-18
coverageGroup: general-ai
draft: false
tags: ["AI for science", "Research", "AI Models"]
faq:
  - q: "What problem does the paper try to solve?"
    a: "It proposes a way to define the full Standard Model, including the weak force, on a spacetime lattice without relying on perturbation theory. The obstacle is that the weak force treats left- and right-handed particles differently, and putting such chiral fermions on a lattice has resisted a complete nonabelian construction since Martin Lüscher solved the abelian case."
  - q: "What did GPT-6 Astra do, and what did the physicist do?"
    a: "Nathaniel Craig proposed the strategy of comparing fermions on successively finer lattices. By his account, Astra suggested how to carry the gauge fields onto finer grids, showed the comparisons converge and led the detailed proof. The manuscript combines sections Craig wrote with extensive rewrites of the proof Astra composed. Outside lattice theorists questioned the work, and Astra carried out checks, including a Lean formalization, that Craig and colleagues proposed."
  - q: "Has the result been verified?"
    a: "Partly. A Lean 4 formalization of the paper's mathematical companion compiled without errors and passed kernel and axiom checks, and the paper reports a two-dimensional test case and a second construction that agrees with the first. The preprint has not been through journal peer review, and Lean checks only the formal statements under their stated assumptions, not whether those statements capture the physics."
  - q: "What have other physicists said?"
    a: "Edward Witten wrote on November 3, 2026 that Craig, 'with the aid of several new ideas, finally constructed a lattice regularization of chiral gauge theories in enough generality to encompass the Standard Model,' and proposed a variant. Stephen Hsu and Zhengwen Liu have posted related papers. AGI Tracker found no published critique of the result as of November 18, 2026."
  - q: "Does this mean AI can now do theoretical physics on its own?"
    a: "No. The problem, the strategy and the decision that the result was worth pursuing came from a physicist, and expert lattice theorists questioned it. The case shows a model producing a long, formally checked proof on a hard open problem under expert direction. It does not show independent problem selection, and it produces no new physical prediction."
---

On November 15, 2026, OpenAI published an account by physicist Nathaniel Craig of how he worked with GPT-6 Astra on a proposed nonperturbative lattice definition of the Standard Model of particle physics. The underlying preprint, [A gauge-invariant measure for lattice chiral fermions](https://arxiv.org/abs/2610.09093), was posted to arXiv on October 6, 2026. Its acknowledgments state that "OpenAI's GPT-6 Astra model was essential to this result" and describe the final proof as "Astra-led."

The single most useful fact for judging the claim is that it has already drawn serious outside engagement. Edward Witten of the Institute for Advanced Study posted a follow-up note on November 3, 2026 that describes Craig's paper as having "finally constructed a lattice regularization of chiral gauge theories in enough generality to encompass the Standard Model." Two other physicists have since posted papers building on it. None of this is journal peer review, and Craig himself calls the construction "far more an answer in principle than an answer in practice."

AGI Tracker has not checked the mathematics. This article relies on Craig's OpenAI post, the preprint and its three supplements, and the follow-up papers by Witten, Stephen Hsu and Zhengwen Liu. Craig is a physicist at the Kavli Institute for Theoretical Physics and the physics department of the University of California, Santa Barbara; the paper also lists an OpenAI affiliation, and the post describes him as a visiting scientist at OpenAI.

## The physics problem in plain terms

The Standard Model describes the known elementary particles and three of the four fundamental forces. Its predictions agree with experiment to remarkable precision. Most of those predictions, though, come from perturbation theory: physicists imagine the interactions switched off, solve that simpler problem exactly, then add the interactions back as a series of small corrections.

That works when the corrections really are small. It fails for some of the most important physics. Craig's example is the proton: most of its mass comes from the motion and interactions of quarks and gluons, and if the strong force is switched off the proton falls apart. Questions like that need a nonperturbative definition, where the interactions are present from the start.

Lattice field theory supplies one. Spacetime is replaced by a grid of points; the grid spacing sets the shortest distance the theory can resolve. On a finite grid, the theory can be defined rigorously and calculated on a computer. This is how lattice QCD computes the proton's mass from first principles.

### Why the weak force is the hard part

The strong force and electromagnetism treat left-handed and right-handed particles the same way. The weak force does not: it acts on left-handed fermions differently from right-handed ones. That makes the Standard Model a chiral theory.

Chiral theories are hard to put on a lattice. The paper cites the Nielsen-Ninomiya theorem: under modest assumptions, a lattice version of the fermion equation cannot have the right continuum behavior, avoid extra particle species and keep the usual chiral symmetry all at once. In Craig's phrasing for general readers, if you try to put a left-handed fermion on the lattice, "the most natural rules give you a right-handed partner you never asked for." These unwanted partners are called doublers.

Decades of work narrowed the problem. Paul Ginsparg and Kenneth Wilson worked out the lattice rules a chiral fermion would need to obey. Rajamani Narayanan and Herbert Neuberger constructed "overlap fermions," which satisfy those rules and remove the doublers. Martin Lüscher showed how to separate left- and right-handed overlap fermions and, for theories with an abelian gauge group, such as a chiral version of electromagnetism, how to build the missing piece: a gauge-invariant integration measure for the fermions.

### The missing piece: a phase

The measure is what lets physicists integrate over fermion configurations, the core operation of a quantum field theory. For chiral fermions on a lattice, its magnitude is easy to fix. Its phase, a complex number of unit size, is not. The phase has to be chosen consistently for every configuration of the force fields across the whole lattice, so that following the fields around any closed loop brings the phase back to where it started.

Craig's post uses an optical analogy. A box with ordinary mirrors turns left-circular light into right-circular light on reflection, like doublers appearing. Special chiral mirrors keep the light left-circular, like overlap fermions. But to make the light build up inside the box, the returning light must also arrive in step, which means rotating one mirror to correct the phase. On the lattice, the equivalent correction has to work for every loop through the space of force-field configurations. Lüscher solved this for abelian theories. For nonabelian theories like the Standard Model, the post says, it "remained open for more than 25 years."

## What the paper proposes

Craig's idea, as he describes it, was to take the force fields on the original lattice and represent the same fields on a sequence of finer lattices, each a third of the previous spacing. Comparing the allowed fermion states on two successive grids gives one part of the phase correction. Adding up the parts across all refinements gives the full correction on the original grid.

The paper's construction makes this precise:

1. Reconstruct a smooth gauge connection locally from the original lattice links, then sample it on finer grids.
2. At each step, compare the chiral projectors, which select the allowed fermion states, on the coarser and finer grid. Each comparison contributes a term to the measure.
3. Show the sum of these terms converges and depends mainly on nearby fields. The paper attributes convergence to anomaly cancellation: an exact identity for the Standard Model's fermion content cancels the leading terms.
4. Show the resulting phase rule is consistent around every closed loop, then rebuild the measure using Lüscher's reconstruction criteria.

The construction is carried out for the gauge group SU(5) with left-handed fermions that contain one Standard Model generation, then restricted to the Standard Model's own gauge group. Because the global form of that group is not known, the paper treats all four possible forms.

The result carries conditions, and Craig states them. It holds at finite lattice spacing, on "admissible" gauge fields whose field strength at the grid scale stays below a small, volume-independent bound. It leaves a constant phase freedom on disconnected components of field space. It does not define the interacting theory in continuous spacetime, and it does not yet show reflection positivity, a property that links a lattice model to a quantum theory in which probabilities are conserved. Craig writes that he is now thinking about that question.

## Who did what

Two primary accounts describe the division of labor: Craig's November 15 post and the paper's acknowledgments.

| Contribution | Human | GPT-6 Astra |
| --- | --- | --- |
| Choosing the problem | Craig | None reported |
| Overall strategy (refinement across finer lattices) | Craig: "I had a strategy for tackling this problem" | Iterated on it over "several rounds of work" |
| Turning strategy into a working construction | Craig, with outside experts | "Suggested the right way to carry a given set of force fields onto finer grids" |
| Convergence argument | Not specified | "Showed that the comparisons on finer grids would converge to a definite answer" |
| Detailed proof | Rewritten extensively for the manuscript | "Took the lead in developing the detailed proof" |
| Manuscript | "Author-written sections with extensive rewrites of the Astra-composed proof" | Composed the proof text that was rewritten |
| Verification checks, including Lean | Proposed by "my colleagues and I" | "Carried out by Astra"; some supplementary documents "written by Astra" |
| Expert scrutiny | Maarten Golterman and Yigal Shamir throughout; Andreas Kronfeld commented on the manuscript | None |

Sources: Craig's OpenAI post and the paper's acknowledgments. Quoted phrases are verbatim.

The post says the three lattice field theorists "spent time looking over Astra's proof and asking probing questions that helped me to build confidence in the result." That is a description of expert questioning, not a statement that they have endorsed the proof. AGI Tracker found no public statement from Golterman, Shamir or Kronfeld about the result.

The OpenAI post includes a diagram credited "Nathaniel Craig/GPT‑6 Astra," and the verification report records that "Codex agents" reviewed the correspondence between the Lean code and the written mathematics. The AI involvement therefore extends beyond the proof itself into checking and documentation, which matters for how much independent assurance the checks provide.

## How the result was checked

The paper has a section titled "Verification," which opens by quoting Carl Sagan: "extraordinary claims require extraordinary evidence." It lists three checks.

### 1. A Lean formalization

The mathematical statements behind the SU(5) construction and its restriction to the Standard Model groups were formalized in Lean 4, a proof assistant that checks every logical step by machine. The [verification report](https://arxiv.org/src/2610.09093v1/anc/lean-verification-report.pdf) records:

| Check | Recorded result |
| --- | --- |
| Compilation | All 16 modules compiled with zero errors and zero warnings |
| Kernel replay | 95,810 exported declarations accepted, starting from an empty environment |
| Axioms | Only Lean's three standard axioms (propext, Classical.choice, Quot.sound); no unproved placeholders |
| Source correspondence | Codex agents reviewed 2,488 inventoried items and 39 assumption contexts linking the written companion to the Lean code |
| Reference comparison | Failed: a preconfigured comparison against a frozen reference stopped because compiler-generated proof names differed; the report says the separate proof checks passed |

The report also shows that formalization caught gaps. It "supplied explicit arguments for three points in the original companion": how phases are transported along paths with corners, the step from a continuous loop deformation to a smooth one, and an algebraic fact used in the color argument. The companion was revised on October 5, 2026, the day before the preprint, to include them. The report says theorem statements and numbered equations were unchanged.

Lean checks that the formal conclusions follow from the formal definitions and assumptions. It does not check whether those definitions faithfully capture the physics, and in this case the mapping between the two was reviewed by AI agents rather than people. Craig makes the same point in the paper: Lean verification is not "the final word in physics, where there is a great deal more that can go wrong."

### 2. A two-dimensional test case

A [second supplement](https://arxiv.org/src/2610.09093v1/anc/two-dimensional-supplement.pdf) builds the same refinement construction for a two-dimensional chiral SU(5) theory with anomaly-free matter content. The paper says this gives an explicit admissible domain on which directly computed currents can be compared with gauge responses and full determinant phases in specific examples. Two dimensions is a simpler setting than four, so this is a consistency check on the method rather than a test of the four-dimensional proof.

### 3. A second route to the same measure

The paper reports building the fermion measure a different way, directly from a reference state using local choices and averaged phase corrections, roughly doing the steps in the opposite order. It says the two measures agree "up to exponentially local counterterms," which is the level of agreement expected for equivalent measures. This is the check closest to how physicists normally gain confidence. It was carried out within the same project, so it is not independent replication.

## What other physicists have said

AGI Tracker searched for independent commentary and found three follow-up papers on arXiv. All are themselves preprints.

| Date | Author | What it says about Craig's work |
| --- | --- | --- |
| October 21, 2026 | Stephen Hsu, [arXiv:2610.29019](https://arxiv.org/abs/2610.29019) | Proposes a related formulation with lattice gauge fields and continuum Weyl fermions. Establishes reflection positivity, at zero Yukawa coupling and zero theta, for a modified reconstruction, but says "its continuum equivalence with Craig's original reconstruction is not proved." A November 6 revision adds a weak-field result that Craig's overlap fermion weight agrees with the continuum Weyl determinant up to local counterterms. |
| November 3, 2026 | Edward Witten, [arXiv:2611.05051](https://arxiv.org/abs/2611.05051) | Credits Craig with constructing the lattice regularization; describes a variant using continuum chiral fermions; says the approach can be computed "in principle, but not in practice by Monte Carlo methods because the chiral fermion path integral is not positive." |
| November 12, 2026 | Zhengwen Liu, [arXiv:2611.16544](https://arxiv.org/abs/2611.16544) | For one SU(5) generation on a flat four-torus, proves that Craig's measure and the Hsu-Witten construction give relative weights that agree in the continuum limit along smooth gapped paths, after a normalization and a local counterterm |

Witten's note is the most significant outside response. Its introduction reads: "Very recently, Craig overcame the difficulties and, with the aid of several new ideas, finally constructed a lattice regularization of chiral gauge theories in enough generality to encompass the Standard Model." Witten then takes a different route to the same goal, and notes that the second of his two key facts "was also used by Craig." His paper is a parallel construction, not a line-by-line audit of Craig's proof.

Liu's paper, which extends Hsu's small-field comparison to finite amplitude, is the closest thing so far to an independent cross-check, since it proves that two separately motivated constructions agree in a defined limit. It covers one generation on a flat torus under stated conditions, not the full result.

AI assistance appears in the follow-ups too. Witten's acknowledgments say "Assistance on many details was provided by Claude Opus 5.5." Liu's say large language models, "mostly GPT-6 Astra and Kimi K3.1," were used "to assist with developing proofs, checking intermediate arguments, and editing the manuscript," with the author taking full responsibility.

AGI Tracker found no published critique of Craig's construction as of November 18, 2026. That absence is not evidence of correctness: the preprint is six weeks old, its arXiv listing gives its length as "60+63 pages," and the paper says it is prepared for submission to the Journal of High Energy Physics.

## What this shows about AI in physics, and what it does not

**What it shows.** A frontier model, directed by a domain expert, produced the detailed proof for a candidate solution to a problem that specialists regarded as long open, and the proof was formalized in Lean with recorded checks. A leading theorist publicly credited the result within a month. That is a stronger kind of evidence than a benchmark score: it is a contribution to a live research question, with a public paper trail that outside experts can examine. The Lean step also caught and filled three gaps in the written argument, which shows formal verification doing useful work on AI-assisted physics.

**What it does not show.** The model did not pick the problem or the strategy. The account comes from the human author, who also lists an OpenAI affiliation, and it was published by OpenAI; there is no independent record of the human-model interaction. The construction makes no new physical prediction and, in Witten's assessment of the related approach, cannot yet be simulated by standard Monte Carlo methods. The proof's correspondence to the physics was reviewed by AI agents and by experts who asked questions, but no outside group has yet reported reproducing it. The main open physics questions, reflection positivity and a continuum limit, remain open by the author's own account.

**A comparison point.** [AGI Tracker's earlier analysis](/blog/checked-proof-versus-ai-coding-test/) argued that a machine-checked proof answers a narrower question than it appears to: what was proved, about which object, under which assumptions. The same questions apply here. The Lean result proves theorems about an SU(5) lattice construction on admissible fields. Whether that construction is the right definition of the Standard Model is a physics judgment that only the field's slower review process can make.

Craig's post also says OpenAI's separate, recent proof of the existence of Yang-Mills theory "provides the missing puzzle piece" for a continuum theory. That is a distinct claim with its own review process, and this article does not assess it.

## What to watch

These are developments that would strengthen or weaken the result. None had been reported on November 18, 2026.

- **Journal peer review** of arXiv:2610.09093, and any public comment from the lattice theorists named in the acknowledgments.
- **An independent check of the Lean-to-paper correspondence** by people rather than AI agents, since that mapping is where a formally verified proof can still miss the physics.
- **Reflection positivity** for Craig's construction at finite lattice spacing, which Craig names as his current focus and Hsu shows only for a modified reconstruction.
- **A practical algorithm.** Witten's note says the related approach cannot be run with standard Monte Carlo methods because the path integral is not positive. A workable simulation method would turn a definition in principle into a tool.
- **Disclosure norms.** The three follow-up papers each state how AI was used. Whether journals adopt similar disclosure requirements will shape how much readers can learn from future AI-assisted results. AGI Tracker's [test for evidence from an AI scientist](/blog/hard-evidence-test-ai-scientist/) applies here as it does to lab work: a clear chain from claim to independent check.

## Timeline

| Date | Event |
| --- | --- |
| September 8, 2026 | Mathematical companion version used as input to the Lean formalization |
| September 25, 2026 | Lean project delivered |
| October 5, 2026 | Companion revised to add three arguments found missing during formalization |
| October 6, 2026 | Craig posts arXiv:2610.09093 |
| October 21, 2026 | Hsu posts a related construction with continuum Weyl fermions |
| November 3, 2026 | Witten posts a variant and credits Craig's construction |
| November 12, 2026 | Liu posts a proof that the two approaches agree in a continuum limit for one generation |
| November 15, 2026 | OpenAI publishes Craig's account of working with GPT-6 Astra |

## Sources

- [A step toward defining the Standard Model on a lattice (Nathaniel Craig, OpenAI, November 15, 2026)](https://openai.com/index/step-toward-defining-the-standard-model)
- [A gauge-invariant measure for lattice chiral fermions (Craig, arXiv:2610.09093, October 6, 2026)](https://arxiv.org/abs/2610.09093)
- [Lean formalization and verification of the mathematical companion (supplement)](https://arxiv.org/src/2610.09093v1/anc/lean-verification-report.pdf)
- [A two-dimensional chiral SU(5) measure (supplement)](https://arxiv.org/src/2610.09093v1/anc/two-dimensional-supplement.pdf)
- [The Standard Model on a finite bosonic lattice with continuum Weyl fermions (Hsu, arXiv:2610.29019)](https://arxiv.org/abs/2610.29019)
- [A Note On Lattice Definition of Gauge Theories With Chiral Fermions (Witten, arXiv:2611.05051)](https://arxiv.org/abs/2611.05051)
- [Matching lattice and continuum chiral determinants at finite volume (Liu, arXiv:2611.16544)](https://arxiv.org/abs/2611.16544)

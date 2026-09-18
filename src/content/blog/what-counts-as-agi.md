---
title: What counts as AGI? Five definitions, compared
description: Artificial general intelligence means different things to different labs and researchers. We compare five influential definitions and what each one asks you to measure.
pubDate: 2026-09-15
tags: [AGI definitions, Explainers]
featured: true
faq:
  - q: Is there an agreed definition of AGI?
    a: No. Labs, researchers and forecasting platforms use different definitions, ranging from economic ("outperforms humans at most economically valuable work") to cognitive ("efficiently learns new skills"). Always check which definition a claim relies on.
  - q: Which AGI definition is easiest to measure?
    a: Task-based definitions, such as passing a set of tests at a skilled-human level, are the easiest to measure. They are also the easiest to game, because a system can be tuned to the tests without becoming generally capable.
  - q: Why does the definition matter?
    a: The same system can be "AGI" under one definition and far from it under another. Timelines, safety arguments and even some commercial contracts depend on which definition is used.
---

Ask ten researchers when artificial general intelligence will arrive and you will get ten dates. Ask them what AGI *is* and the spread gets wider. Before we can track progress toward anything, we need to be clear about what the finish line looks like.

Here are five definitions that shape the current debate, what each one asks you to measure, and where each one breaks down.

## 1. The economic definition

OpenAI's 2018 charter describes AGI as "highly autonomous systems that outperform humans at most economically valuable work."

**What you would measure:** the share of paid tasks a system can do end to end, at human quality, without supervision.

**Strength:** it is concrete and consequential. If it is met, the world changes whether or not philosophers agree the system "understands" anything.

**Weakness:** "most economically valuable work" moves. Economies reorganise around new tools, and the work that remains valuable is often the work machines can't yet do.

## 2. The universal-intelligence definition

In 2007, Shane Legg and Marcus Hutter surveyed dozens of definitions of intelligence and distilled them into one: *intelligence measures an agent's ability to achieve goals in a wide range of environments.*

**What you would measure:** performance across a very broad distribution of environments, weighted toward the simple ones.

**Strength:** it is mathematically precise and doesn't privilege human tasks.

**Weakness:** the formal version is uncomputable, so in practice you still have to choose which environments to test, and the choice brings back all the bias the definition was meant to remove.

## 3. The skill-acquisition definition

François Chollet's 2019 paper *On the Measure of Intelligence* argues that skill is not intelligence. A chess engine is skilled; it isn't intelligent. Intelligence is **how efficiently a system turns limited experience and prior knowledge into new skills.**

**What you would measure:** performance on genuinely novel tasks, given very few examples. Chollet's Abstraction and Reasoning Corpus (ARC) was built for exactly this.

**Strength:** it targets the thing that makes humans general: learning quickly in unfamiliar situations.

**Weakness:** novelty is hard to guarantee. Once a benchmark is public, its "novel" tasks start leaking into training data.

## 4. The levels definition

A 2023 Google DeepMind paper, *Levels of AGI*, proposes a grid rather than a single threshold. One axis is **performance** (from "emerging" through "competent", "expert" and "virtuoso" to "superhuman"). The other is **generality**: narrow systems versus general ones.

| Level | Performance, relative to skilled adults |
| --- | --- |
| Emerging | Equal to or somewhat better than an unskilled human |
| Competent | At least the 50th percentile |
| Expert | At least the 90th percentile |
| Virtuoso | At least the 99th percentile |
| Superhuman | Outperforms all humans |

**Strength:** it replaces a yes/no argument with a map, so you can say "competent in these domains, emerging in those."

**Weakness:** placing a system on the grid still requires agreeing on which tasks count and who the "skilled adults" are.

## 5. The practical-tests definition

Some of the oldest definitions are simply tests. Alan Turing's 1950 imitation game asks whether a machine's conversation can be told apart from a person's. Later proposals are more physical: Steve Wozniak's "coffee test" asks a robot to walk into an unfamiliar home and make a cup of coffee. Nils Nilsson's "employment test" asks whether a machine can do the jobs people are paid to do.

**Strength:** anyone can understand the pass condition.

**Weakness:** each test captures one slice of general ability. Conversation has proved far easier to imitate than making coffee in a stranger's kitchen.

## How we use these on agitracker.io

We don't pick a winner. When we report on progress, we say which definition a result speaks to:

- A new score on a hard exam speaks to **levels** (performance in a domain).
- A result on fresh, few-shot puzzles speaks to **skill acquisition**.
- A system completing long, paid, real-world tasks speaks to the **economic** definition.

> A claim that "AGI is here" or "AGI is decades away" is only as meaningful as the definition behind it. The first question to ask is always: *by which measure?*

The rest of this site is about those measures: how they work, where they fail, and what they currently show.

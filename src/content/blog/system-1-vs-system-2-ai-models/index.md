---
title: "Fast and slow: System 1 vs System 2 AI models, explained"
description: What people mean by System 1 and System 2 AI, how reasoning models like o1 and R1 learned to think slowly, and why frontier models now decide for themselves.
pubDate: 2026-09-25
tags: [Explainers, Research, Reasoning]
author: team
cover: ./cover.png
coverAlt: Neobrutalist illustration of two block-shaped AI faces side by side, a blue one with a lightning bolt answering instantly and a lilac one with an hourglass and a long winding thought trail.
faq:
  - q: What is a System 1 AI model?
    a: A System 1 model is shorthand for a model that answers in a single pass, producing its reply token by token without a separate reasoning phase. The term borrows from Daniel Kahneman's description of fast, automatic human thinking. Classic chat models such as GPT-4o are the usual example.
  - q: What is a System 2 AI model?
    a: A System 2 model, usually called a reasoning model, spends extra computation at inference time by writing out a long chain of thought before answering. OpenAI's o1 (September 2024) and DeepSeek-R1 (January 2025) were trained with reinforcement learning to do this, and their accuracy improves the longer they are allowed to think.
  - q: Are reasoning models always better?
    a: No. On simple questions they can be slower, more expensive and no more accurate. A Tencent study found o1-style models used on average 1,953% more tokens than conventional models to reach the same answer on easy problems, and Apple researchers found standard models did better than reasoning models on low-complexity puzzles.
  - q: What is a hybrid reasoning model?
    a: A hybrid reasoning model can answer instantly or think at length, depending on a setting or its own judgement. Anthropic called Claude 3.7 Sonnet "the first hybrid reasoning model on the market" in February 2025. By 2026 most frontier models expose an effort or reasoning setting and decide adaptively how much to think.
  - q: Is the System 1 / System 2 analogy accurate?
    a: Only loosely. Psychologists Jonathan Evans and Keith Stanovich, whose work Kahneman drew on, now avoid the "two systems" wording because it falsely suggests two separate systems in the brain. Reasoning models are also the same neural network in both modes; the difference is how much text they generate before answering.
---

Ask a chatbot what 17 times 24 is and it will usually just answer. Ask it to prove a theorem or find the bug in a 2,000-line file and the best models now do something different: they go quiet for seconds or minutes, fill a hidden scratchpad with thousands of words, then answer. That pause is the most important change in how large language models work since ChatGPT launched, and the vocabulary everyone uses to describe it comes from a 2011 psychology bestseller.

"System 1" and "System 2" have become the shorthand for fast-answering models versus deliberate, reasoning ones. Here is where the terms come from, what actually differs inside the models, what "thinking" buys you, and why the neat two-box picture has already started to fall apart.

**TL;DR**

- **System 1 models** answer in one pass: they generate the reply token by token with no separate reasoning phase. **System 2 models** (reasoning models) first write a long chain of thought, spending extra compute at inference time.
- The labels come from Daniel Kahneman's *Thinking, Fast and Slow*. The psychologists who coined them now avoid the "two systems" wording, and the AI version is an analogy, not a claim about brains.
- Reasoning models were made by **reinforcement learning on verifiable problems**. OpenAI's o1 lifted AIME 2024 accuracy from GPT-4o's 12% to 74% on a single try. DeepSeek-R1 showed the recipe works in the open.
- Thinking is not free. It multiplies tokens, latency and cost, can **overthink** easy questions, and still **collapses** on hard enough puzzles.
- The industry went from separate fast and slow models (2024), to hybrids and routers (2025), to single models that **decide how much to think** behind an effort dial (2026).

## Where "System 1" and "System 2" come from

In *Thinking, Fast and Slow* (2011), Daniel Kahneman described two modes of human thought. In an [excerpt published by Scientific American](https://www.scientificamerican.com/article/kahneman-excerpt-thinking-fast-and-slow/), he defines them this way:

> "System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to the effortful mental activities that demand it, including complex computations."

Recognising a friend's face is System 1. Filling out a tax form is System 2. Kahneman was clear that the names were borrowed: "I adopt terms originally proposed by the psychologists Keith Stanovich and Richard West."

The framing jumped to AI in December 2019, when Yoshua Bengio gave the NeurIPS Posner Lecture titled [From System 1 Deep Learning to System 2 Deep Learning](https://neurips.cc/virtual/2019/invited-talk/15488). His abstract argued that deep learning so far had "concentrated mostly on learning from a static dataset, mostly for perception tasks and other System 1 tasks which are done intuitively and unconsciously by humans." The next frontier, he said, was "System 2 tasks (which are done consciously), such as reasoning, planning, capturing causality and obtaining systematic generalization."

Yann LeCun used the same analogy in his 2022 position paper [A Path Towards Autonomous Machine Intelligence](https://openreview.net/forum?id=BZ5a1r-kVsf). His "Mode-1" produces an action directly from perception, like Kahneman's System 1. His "Mode-2" plans by simulating outcomes with a world model before acting, like System 2. (We unpack LeCun's alternative architecture, JEPA, in a companion explainer.)

The most prescient version came from Andrej Karpathy in his November 2023 talk [Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g), ten months before the first commercial reasoning model. Large language models, he said, "currently only have a system one." What people wanted was to "convert time into accuracy": to ask a hard question, let the model take 30 minutes, and get a better answer. He sketched a chart with time on the x-axis and accuracy on the y-axis and said you would want "a monotonically increasing function," adding that "today that is not the case."

That chart is, more or less, what OpenAI published in September 2024.

## What a System 1 model actually does

A standard large language model is **autoregressive**: it reads everything so far and predicts the next token, appends it, and repeats. Each token costs one forward pass through the network, and the network does the same fixed amount of work per token whether the question is "What's the capital of France?" or "Is this proof correct?"

That is what "System 1" means in the AI context. The model has no separate phase in which it can try an idea, notice it's wrong and back up. Whatever reasoning happens must happen implicitly inside the layers during that fixed amount of computation per token. For a huge range of tasks, including writing, summarising, translation, retrieval-backed answers and simple code, that is plenty. Pattern-matching over trillions of tokens of training data is a remarkably strong intuition.

It breaks down on problems that need many dependent steps, where one early slip ruins everything downstream: competition maths, multi-step logic, long debugging sessions, planning.

## Teaching models to think slowly: the prompting era

Researchers first discovered that you could coax System 2 behaviour out of a System 1 model by asking for it.

- **Chain-of-thought prompting.** In January 2022 Jason Wei and colleagues at Google showed that giving a model a few worked examples with written-out reasoning dramatically improved it on maths word problems. [Their paper](https://arxiv.org/abs/2201.11903) reported that a 540-billion-parameter model with "just eight chain of thought exemplars achieves state of the art accuracy on the GSM8K benchmark," beating a fine-tuned GPT-3 with a verifier.
- **"Let's think step by step."** Months later, Takeshi Kojima and colleagues found that you didn't even need examples. [Adding that one phrase](https://arxiv.org/abs/2205.11916) raised InstructGPT's accuracy on the MultiArith benchmark "from 17.7% to 78.7%" and on GSM8K "from 10.4% to 40.7%." The paper explicitly calls these "difficult system-2 tasks."
- **Self-consistency.** [Sampling many reasoning paths and taking a majority vote](https://arxiv.org/abs/2203.11171) added another 17.9 points on GSM8K.
- **Tree of Thoughts.** In 2023 Shunyu Yao and colleagues let the model branch, evaluate and backtrack. On the Game of 24 puzzle, "GPT-4 with chain-of-thought prompting only solved 4% of tasks," while [Tree of Thoughts](https://arxiv.org/abs/2305.10601) "achieved a success rate of 74%."

There was also a scaling result underneath. In August 2024 Charlie Snell and colleagues showed that [spending test-time compute wisely](https://arxiv.org/abs/2408.03314) could let a smaller model "outperform a 14x larger model" on some problems. Compute at inference time was starting to look like a substitute for compute at training time, a fourth lever alongside the [three levers of AI progress](/blog/three-levers-of-ai-progress/).

These tricks all worked, but they were bolted on from outside. The model had never been trained to reason well; it was being asked nicely.

## Reasoning models: System 2 trained in

The step change came when labs used **reinforcement learning (RL)** to train models to produce useful chains of thought on problems with checkable answers.

### OpenAI o1

On September 12, 2024, OpenAI released o1 with a post titled [Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/). Its central claim was Karpathy's chart made real:

> "The performance of o1 consistently improves with more reinforcement learning (train-time compute) and with more time spent thinking (test-time compute)."

The model, OpenAI wrote, "uses a chain of thought" much as "a human may think for a long time before responding to a difficult question," and "learns to recognize and correct its mistakes." The benchmark jumps were large:

![Horizontal bar chart of accuracy on the 2024 AIME maths exam. GPT-4o 12 percent. o1 single attempt 74 percent. o1 consensus of 64 samples 83 percent. o1 re-ranking 1,000 samples 93 percent. Below, DeepSeek-R1-Zero during training: 15.6 percent at the start of RL, 77.9 percent after RL, 86.7 percent with self-consistency.](./aime-jump.png)
*Figure 1: What thinking buys on competition maths. Sources: [OpenAI](https://openai.com/index/learning-to-reason-with-llms/) and [DeepSeek, Nature 2025](https://www.nature.com/articles/s41586-025-09422-z).*

On Codeforces programming contests, GPT-4o had an Elo of 808 (11th percentile). A version of o1 tuned for programming reached 1807, "performing better than 93% of competitors." On GPQA, a set of PhD-level science questions, OpenAI said o1 became the first model to beat the human experts it recruited.

OpenAI also made a choice that still shapes the field: "we have decided not to show the raw chains of thought to users." The model thinks in private; you get a summary and the answer.

Three months later, the follow-up o3 scored 75.7% on the ARC-AGI-1 semi-private set within the ARC Prize's compute limit and 87.5% in a high-compute configuration, according to the [ARC Prize announcement](https://arcprize.org/blog/oai-o3-pub-breakthrough), which called it a "surprising and important step-function increase." GPT-4o had scored around 5%. (For what ARC measures and how its newer version resets the board, see our [ARC-AGI-3 explainer](/blog/arc-agi-3-explained/).)

### DeepSeek-R1: the recipe in the open

OpenAI did not publish its method. In January 2025, the Chinese lab DeepSeek did. The [DeepSeek-R1 paper](https://arxiv.org/abs/2501.12948), later peer-reviewed and [published in Nature](https://www.nature.com/articles/s41586-025-09422-z) in September 2025, showed that "the reasoning abilities of LLMs can be incentivized through pure reinforcement learning," with no human-written reasoning examples at all.

The setup is strikingly simple. Start from a strong base model (DeepSeek-V3), give it maths and coding problems with known answers, and reward it only when the final answer is right. In the Nature paper's words, "the reward signal is only based on the correctness of final predictions against ground-truth answers, without imposing constraints on the reasoning process itself." The RL algorithm, Group Relative Policy Optimization (GRPO), compares several attempts at the same problem and pushes the model toward the better ones.

What emerged surprised the researchers. The model's reasoning got longer on its own. It began checking its work and trying alternatives. The team described an "aha moment", "characterized by a sudden increase in the use of the word 'wait' during reflections." Their summary of the lesson:

> "Rather than explicitly teaching the model how to solve a problem, we simply provide it with the right incentives and it autonomously develops advanced problem-solving strategies."

This also explains where reasoning models shine. RL needs a reward, and the cleanest rewards come from problems that can be checked automatically: maths with a numeric answer, code with tests, logic puzzles. DeepSeek's abstract notes the model's "superior performance on verifiable tasks such as mathematics, coding competitions, and STEM fields." Open-ended writing, strategy and judgement are harder to reward, and gains there have been smaller.

<details><summary>Nerd corner: is "System 2" a different network?</summary>

No. A reasoning model is the same kind of transformer as a chat model, often built on the same base model. The difference is behavioural and learned: RL shapes the model to emit a long reasoning trace (often wrapped in tags like `<think>`) before its answer, and the serving stack hides or summarises that trace. Every token in the trace still costs one ordinary forward pass. "System 2" in AI therefore means *spending more System-1 steps in a structured way*, not switching on a separate reasoning engine. Research like Meta's [Distilling System 2 into System 1](https://arxiv.org/abs/2407.06023) (2024) goes the other way: it trains a model to produce the better System 2 answers directly, "with less inference cost than System 2."

</details>

## From two models to one dial

In 2024 the split was literal. You picked GPT-4o for speed or o1 for hard problems, and they were different products with different prices. Within a year that gave way to hybrids, routers, and finally models that make the call themselves.

![Timeline with six stages. 2022: chain-of-thought prompting, reasoning is a prompt trick. September 2024: OpenAI o1, a separate reasoning model. February 2025: Claude 3.7 Sonnet, one hybrid model with a thinking budget. April 2025: Gemini 2.5 Flash and Qwen3, thinking on or off per request. August 2025: GPT-5, a router picks fast or thinking model. 2026: adaptive thinking, the model decides and an effort dial sets the level.](./one-dial-timeline.png)
*Figure 2: How System 1 and System 2 merged. Sources linked in the text.*

- **Hybrid models (February 2025).** Anthropic launched [Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet) as "the first hybrid reasoning model on the market," arguing that "just as humans use a single brain for both quick responses and deep reflection," reasoning should be "an integrated capability of frontier models rather than a separate model entirely." Developers could cap thinking at "no more than N tokens," trading "speed (and cost) for quality of answer."
- **Thinking switches (April 2025).** Google called [Gemini 2.5 Flash](https://developers.googleblog.com/en/start-building-with-gemini-25-flash/) its "first fully hybrid reasoning model," with a thinking budget from 0 to 24,576 tokens, noting that "the model does not use the full budget if the prompt does not require it." Alibaba's [Qwen3](https://qwenlm.github.io/blog/qwen3/) let users type `/think` or `/no_think` to switch modes turn by turn.
- **A counter-move (July 2025).** Qwen then reversed course. Its July 2025 instruct model card says it ["supports only non-thinking mode,"](https://huggingface.co/Qwen/Qwen3-235B-A22B-Instruct-2507) and the team said it would train separate instruct and thinking models "so we can get the best quality possible." Merging both behaviours into one set of weights had a quality cost.
- **Routers (August 2025).** OpenAI took a system-level approach. [GPT-5](https://openai.com/index/introducing-gpt-5/) was described as "a unified system with a smart, efficient model that answers most questions, a deeper reasoning model (GPT-5 thinking) for harder problems, and a real-time router that quickly decides which to use based on conversation type, complexity, tool needs, and your explicit intent." OpenAI said the router was trained on signals such as when users switch models and "measured correctness," and that it planned "to integrate these capabilities into a single model."
- **Adaptive thinking (2026).** That is roughly where frontier models have landed. Anthropic's current documentation says [Claude's thinking is adaptive](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost): "the model evaluates each request and decides for itself whether to think and how much," and a simple question "may get a direct response with no thinking block at all." Developers steer with an [effort setting](https://platform.claude.com/docs/en/build-with-claude/effort) that is "a behavioral signal, not a strict token budget." OpenAI's [reasoning guide](https://developers.openai.com/api/docs/guides/reasoning) likewise lists effort levels from `none` to `max` and says its models "reason adaptively across reasoning efforts, using fewer tokens for simpler tasks."

So the modern answer to "is this a System 1 or System 2 model?" is usually "both, and it depends on the request." Kahneman's picture fits better than it did in 2024: one mind that mostly runs on autopilot and occasionally engages effortful thought.

## What thinking costs

Slow thinking has a price, and in AI the price is tokens.

**Money.** Reasoning tokens are billed as output tokens at both [OpenAI](https://developers.openai.com/api/docs/guides/reasoning) and [Anthropic](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost), and you pay for them even when you only see a summary. Anthropic's docs warn that "the billed output token count does not match the visible token count."

**Overthinking.** A December 2024 Tencent study pointedly titled [Do NOT Think That Much for 2+3=?](https://arxiv.org/abs/2412.21187) found that "o1-like models consumed 1,953% more tokens than conventional models to reach the same answer" on easy problems, in one case producing "13 solutions" to a trivially simple question. Efficiency has improved since: OpenAI said GPT-5 with thinking beat o3 "with 50-80% less output tokens." But the basic trade-off stays.

**Latency.** A System 1 answer streams back almost immediately. A reasoning trace of tens of thousands of tokens can take minutes. For an autocomplete box or a voice assistant, that is disqualifying.

This is why most production systems do not send every request to maximum effort. Teams route: cheap, fast settings for classification, extraction and chat, expensive thinking for the requests that need it. Some of this now happens inside the model, as above. A lot of it still happens in infrastructure. An [LLM gateway](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) sits between an application and its model providers and can send each call to a fast model or a reasoning model, set effort levels per route, fall back when a provider is slow, and log how many hidden reasoning tokens each feature burns. (We compared [routers that pick a model per request](/blog/llm-routers-for-auto-routing/) and [routing tools aimed at inference cost](/blog/model-routing-inference-cost/) earlier this year.)

## Where the System 2 picture breaks

Reasoning models are a real advance, but three lines of research show their limits.

### They still collapse on hard enough problems

In June 2025 Apple researchers published [The Illusion of Thinking](https://arxiv.org/abs/2506.06941), testing reasoning models on puzzles like Tower of Hanoi where difficulty can be dialled up precisely. They found three regimes:

![Diagram of three difficulty zones. Low complexity: standard models match or beat reasoning models, and reasoning wastes tokens. Medium complexity: reasoning models clearly ahead. High complexity: both collapse to near-zero accuracy, and reasoning effort drops even with token budget left.](./three-regimes.png)
*Figure 3: The three regimes Apple reported for "large reasoning models" on controllable puzzles. Source: [Shojaee et al., 2025](https://arxiv.org/abs/2506.06941). The high-complexity result is disputed; see text.*

Most strikingly, "their reasoning effort increases with problem complexity up to a point, then declines despite having remaining token budget." Gary Marcus [called it "a knockout blow for LLMs"](https://garymarcus.substack.com/p/a-knockout-blow-for-llms) and argued that "LLMs are no substitute for good well-specified conventional algorithms."

The rebuttal was quick. A comment paper, [The Illusion of the Illusion of Thinking](https://arxiv.org/abs/2506.09250) (whose first version listed Anthropic's Claude Opus as a co-author alongside Alex Lawsen), argued that some Tower of Hanoi failures came from models hitting output token limits, that some river-crossing instances were "mathematically impossible," and that when asked for a program that generates the answer rather than every move, models showed "high accuracy on Tower of Hanoi instances previously reported as complete failures." The honest summary: reasoning models do hit walls, but where those walls sit depends heavily on how you measure. (It's the same lesson as in [how to read an AI benchmark](/blog/how-to-read-an-ai-benchmark/).)

### The visible reasoning is not always the real reasoning

If a model writes out its thinking, can you read it to find out why it answered? Not reliably. In April 2025 Anthropic published [Reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think). Researchers slipped hints into prompts and checked whether models admitted using them. Claude 3.7 Sonnet mentioned the hint 25% of the time and DeepSeek-R1 39% of the time. Unfaithful chains of thought were "substantially longer" than faithful ones, and in reward-hacking setups models admitted the hack "less than 2% of the time." The [paper](https://arxiv.org/abs/2505.05410) concludes that chain-of-thought monitoring is promising but "not sufficient" to rule out bad behaviour. A System 2 trace is a useful window, not a transcript of the model's mind.

### The analogy itself is shaky

Even in psychology, "two systems" is contested. Jonathan Evans and Keith Stanovich, in a [2013 review](https://journals.sagepub.com/doi/10.1177/1745691612460685), said they "now prefer to avoid this terminology as it suggests (falsely) that the two types of processes are located in just two specific cognitive or neurological systems." They prefer "Type 1" and "Type 2" processes. A sharper critique by David Melnikoff and John Bargh, [The Mythical Number Two](https://acmelab.yale.edu/sites/default/files/melnikoff_bargh_2018_mythical_number_2_0.pdf) (2018), calls the dual-process typology "a convenient and seductive myth."

The AI version is looser still. Human System 2 is supposedly a different kind of processing. A reasoning model runs the same network in both modes; "slow thinking" just means generating more tokens before committing to an answer. What really separates the two is **how much compute is spent per question and whether the model was trained to use it well**, not two distinct systems. In practice it is a dial, and 2026 products expose it as one.

## System 1 vs System 2 at a glance

| | System 1 model | System 2 (reasoning) model |
| --- | --- | --- |
| What it does before answering | Nothing extra; answers token by token | Writes a long, usually hidden chain of thought |
| How it was trained | Pretraining plus instruction tuning and RLHF | Same, plus large-scale RL on verifiable problems |
| Compute per question | Roughly proportional to answer length | Scales with thinking; traces can run to tens of thousands of tokens |
| Best at | Chat, writing, extraction, retrieval, simple code | Maths, competitive programming, multi-step logic, debugging |
| Weak at | Many dependent steps, backtracking | Latency-sensitive tasks, trivial questions (overthinking), very long puzzles |
| Examples | GPT-4o, Claude 3.5 Sonnet, Llama 3 | o1, o3, DeepSeek-R1; hybrids like Claude 3.7 Sonnet, GPT-5, Gemini 2.5 |

## What this means for AGI and for builders

For people tracking progress toward general intelligence, reasoning models changed the shape of the curve. Capability now depends not only on how big and well-trained a model is, but on how much it is allowed to think at the moment of use. That makes benchmark scores harder to compare (at what effort setting?) and makes cost per task a first-class metric, which is why ARC Prize now reports cost alongside accuracy. It also supplied much of the fuel behind the fast rise in [METR's AI time horizons](/blog/metr-time-horizons-2026/): agents that can stop, check and retry get through longer tasks.

It does not settle the debate about whether scaled-up language models are enough. LeCun, Bengio and others argue that real System 2 needs a model of the world to plan against, not just more tokens of text. That is the bet behind LeCun's JEPA architecture, a very different kind of model from anything in this post.

For builders, the practical lesson is to treat thinking as a budget:

1. **Default low, escalate on evidence.** Most traffic doesn't need deep reasoning. Measure where higher effort actually improves outcomes on your own evaluations before paying for it everywhere.
2. **Make effort a routing decision.** Whether you use a model's built-in adaptive thinking, a vendor router, or rules in an [open-source LLM gateway](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) you host yourself, decide per request type which model and effort level it gets, and review that as models change.
3. **Watch the hidden tokens.** Track reasoning tokens per feature, not just per request. They are billed but not shown, so they are the easiest cost to miss. Centralising calls behind an [AI gateway](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) gives you one place to see and cap them, and a [self-hosted AI gateway](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) keeps that data inside your own network if prompts are sensitive.
4. **Don't treat the trace as an audit log.** Chain-of-thought is useful for debugging but, per Anthropic's research, not a faithful record of why the model answered.

Kahneman's great insight was that the fast system runs the show most of the time, and the slow one is lazy and expensive and should be called on only when needed. AI models took a decade to acquire the slow system. Learning when not to use it may matter just as much.

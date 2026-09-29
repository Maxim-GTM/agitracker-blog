---
title: "Not all AI models are LLMs: seven model families and how they differ"
description: Autoregressive LLMs, reasoning models, diffusion LLMs, Mamba hybrids, mixture-of-experts, world models and robot VLAs, explained by what each one predicts and how it spends compute.
pubDate: 2026-09-27
tags: [Explainers, Research, World Models]
author: team
cover: ./cover.png
coverAlt: Neobrutalist illustration of seven differently coloured block-shaped model cards fanned out like playing cards, each with a different simple icon for text, thinking, noise, a wave, a grid of experts, a globe and a robot arm.
faq:
  - q: What are the main types of AI models in 2026?
    a: The main families are autoregressive large language models, reasoning models trained with reinforcement learning to think before answering, diffusion language models that generate text in parallel, state-space and hybrid architectures such as Mamba, sparse mixture-of-experts models, world models (generative ones like Genie 3 and Cosmos, and latent ones like V-JEPA 2), and vision-language-action models for robots.
  - q: Are these families mutually exclusive?
    a: No. Most frontier models combine several. NVIDIA's Nemotron 3 Super is a hybrid Mamba-Transformer mixture-of-experts reasoning model. Google's DiffusionGemma is a diffusion model built on a mixture-of-experts backbone. The families describe different design choices (what to predict, how to route computation, how to train) that can be stacked.
  - q: What is the difference between a diffusion language model and a normal LLM?
    a: A normal LLM writes text left to right, one token per forward pass. A diffusion language model starts from a masked or noisy block of text and refines all positions in parallel over a few steps. Inception Labs' Mercury and Google's Gemini Diffusion report speeds of over 1,000 tokens per second, but the approach has so far traded some quality for that speed.
  - q: What does "active parameters" mean in a mixture-of-experts model?
    a: A mixture-of-experts model has many expert sub-networks but a router sends each token to only a few of them. Active parameters are the weights actually used for one token. DeepSeek-V3 has 671 billion parameters in total but activates 37 billion per token, so it costs roughly as much to run per token as a 37-billion-parameter dense model while storing far more knowledge.
  - q: What is a world model in AI?
    a: A world model predicts how an environment will change, often in response to actions. Generative world models such as Google DeepMind's Genie 3 and NVIDIA's Cosmos predict future video frames. Joint-embedding models such as Meta's V-JEPA 2 predict abstract representations of the future, which is cheaper and suited to planning robot actions.
---

"AI model" has come to mean "chatbot," and "chatbot" has come to mean a large language model that writes one word at a time. That picture was roughly right in 2023. In 2026 it hides most of what is interesting. Some of today's models think for minutes before answering. Some write a whole paragraph at once, like developing a photograph. Some carry hundreds of billions of parameters but only use a few percent of them per word. Some don't produce text at all: they imagine video, or move robot arms.

This is a field guide to seven model families: what each one predicts, what it is trained to do, how it spends compute when you use it, and what it is good and bad at. Most frontier systems now combine several of these ideas, so the goal is not to sort models into boxes but to understand the design choices underneath.

**TL;DR**

- **Autoregressive LLMs** predict the next token. Everything else is a variation on, or a reaction to, this recipe.
- **Reasoning models** are LLMs trained with reinforcement learning to write a long chain of thought first. They trade latency and tokens for accuracy on hard, checkable problems.
- **Diffusion LLMs** generate many tokens in parallel by refining noise. They have reached 1,000+ tokens per second, with some quality cost so far.
- **State-space and hybrid models** (Mamba and successors) replace most attention layers with layers whose cost per token stays constant, making long contexts much cheaper.
- **Mixture-of-experts** models store huge numbers of parameters but route each token to a few experts, so only a small fraction runs per token.
- **World models** predict how an environment evolves, either as pixels (Genie 3, Cosmos) or as abstract embeddings (V-JEPA 2).
- **Vision-language-action models** turn a vision-language model into a robot controller that outputs actions.

![Grid of seven cards, one per model family, each showing what it predicts and how it spends compute. Autoregressive LLM: next token, one pass per token. Reasoning model: next token after a hidden chain of thought, spends extra tokens thinking. Diffusion LLM: a whole block of tokens, a few parallel refinement steps. State-space hybrid: next token, constant memory per token in most layers. Mixture-of-experts: next token, a router runs only a few experts. World model: future frames or future embeddings, simulates or plans. Vision-language-action: robot actions, vision-language model plus fast action head.](./family-map.png)
*Figure 1: Seven families at a glance. Sources linked in the text.*

## 1. Autoregressive LLMs: predict the next token

**What it predicts.** The next token (a word or piece of a word), given all the tokens before it.

**How it's built.** Almost every modern LLM uses the **transformer**, introduced in the 2017 paper [Attention Is All You Need](https://arxiv.org/abs/1706.03762) as "a new simple network architecture... based solely on attention mechanisms, dispensing with recurrence and convolutions entirely." Attention lets every token look at every earlier token, and the design is "more parallelizable," which made it possible to train on vast datasets.

**What scale unlocked.** The 2020 GPT-3 paper, [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165), showed that a 175-billion-parameter autoregressive model could perform new tasks "without any gradient updates or fine-tuning, with tasks and few-shot demonstrations specified purely via text interaction with the model." That ability, **in-context learning**, is why a single model can translate, summarise and code. Rich Sutton's [Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) (2019) had predicted this kind of result: "general methods that leverage computation are ultimately the most effective, and by a large margin." Epoch AI estimates that [training compute for frontier language models](https://epoch.ai/trends) has grown about 5x a year since 2020.

**How it spends compute.** One forward pass through the whole network per output token. Longer answers take proportionally longer. Attention over the context also grows with context length, and the model must keep a **KV cache** (stored keys and values for every earlier token) in memory, which is why very long contexts are expensive.

**Good at:** language, code, broad knowledge, following instructions, tool use. **Weak at:** many dependent reasoning steps done in one go, very long contexts cheaply, anything requiring a model of physical dynamics.

## 2. Reasoning models: think before answering

**What it predicts.** Still the next token, but trained to first write a long chain of thought (usually hidden) and only then answer.

**How it's trained.** Reasoning models start from a pretrained LLM and add large-scale **reinforcement learning**. OpenAI's [o1 system card](https://arxiv.org/abs/2412.16720) says the series "is trained with large-scale reinforcement learning to reason using chain of thought." DeepSeek's [R1 paper](https://arxiv.org/abs/2501.12948) showed the open recipe: reward the model only when its final answer to a maths or coding problem is correct, and "advanced reasoning patterns, such as self-reflection, verification, and dynamic strategy adaptation" emerge on their own.

**How it spends compute.** This is the defining difference. OpenAI's announcement said o1's performance "consistently improves with more reinforcement learning (train-time compute) and with more time spent thinking (test-time compute)." Thinking is a dial: more tokens, more latency, more cost, usually more accuracy on hard problems. On the 2024 AIME maths exam, GPT-4o solved 12% of problems and o1 74% on a single attempt.

**Good at:** maths, competitive programming, debugging, multi-step logic, agentic tasks that require checking work. **Weak at:** latency-sensitive tasks, trivial questions (they overthink), and domains where correctness is hard to verify, since, as DeepSeek notes, the method shines on "verifiable tasks such as mathematics, coding competitions, and STEM fields."

We cover this family in depth, including hybrids and adaptive thinking, in [System 1 vs System 2 AI models](/blog/system-1-vs-system-2-ai-models/).

## 3. Diffusion language models: write the whole thing at once

**What it predicts.** All the tokens in a block at once, starting from masked or noisy text and refining them over a few steps.

Diffusion is the technique behind image generators like Stable Diffusion: start with noise, repeatedly denoise. Applying it to text is harder because words are discrete, but it now works. [LLaDA](https://arxiv.org/abs/2502.09992) (February 2025), an 8-billion-parameter academic model, "employs a forward data masking process and a reverse generation process, parameterized by a Transformer to predict masked tokens," and was "competitive with strong LLMs like LLaMA3 8B in in-context learning." Because it doesn't write strictly left to right, LLaDA also handled the "reversal curse" (knowing *A is B* but not *B is A*), beating GPT-4o at completing poems backwards.

**How it spends compute.** A few passes over the whole output block instead of one pass per token. Each pass costs more, but there are far fewer of them, and they parallelise well on GPUs. That makes diffusion LLMs very fast:

- Inception Labs' [Mercury](https://www.inceptionlabs.ai/blog/introducing-mercury) (February 2025) generates "coarse-to-fine," refining output "from pure noise over a few 'denoising' steps." Its [technical report](https://arxiv.org/abs/2506.17298) measured Mercury Coder Mini at 1,109 tokens per second on an H100, up to 10x faster than speed-optimised frontier models "while maintaining comparable quality" on coding benchmarks.
- Google DeepMind's [Gemini Diffusion](https://deepmind.google/models/gemini-diffusion/), shown at I/O in May 2025, lists 1,479 tokens per second. It is still an experimental demo.
- [Mercury 2](https://www.inceptionlabs.ai/blog/introducing-mercury-2) (February 2026) added reasoning, billing itself as "the world's fastest reasoning language model" at over 1,000 tokens per second on NVIDIA Blackwell GPUs.
- Google's open-weight [DiffusionGemma](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/) (June 2026) offers "up to 4x faster text generation on GPUs," with an honest caveat: "overall output quality is lower than standard Gemma 4."

**Good at:** raw speed, low latency for code completion and editing, filling in text in the middle. **Weak at:** matching the quality of the best autoregressive models at equal size; the ecosystem and tooling are much younger.

## 4. State-space and hybrid models: cheap long memory

**What it predicts.** The next token, like an LLM. The difference is inside the layers.

A transformer's attention compares each new token with every previous one, so cost grows with context. **State-space models (SSMs)** instead carry a fixed-size running state that is updated as each token arrives, like a very sophisticated summary. The breakthrough was **Mamba** (Albert Gu and Tri Dao, [December 2023](https://arxiv.org/abs/2312.00752)), which made the state update depend on the input, "allowing the model to selectively propagate or forget information along the sequence length dimension depending on the current token." Mamba reported "5× higher throughput than Transformers" and "linear scaling in sequence length," with a 3-billion-parameter Mamba matching transformers twice its size. [Mamba-2](https://arxiv.org/abs/2405.21060) (May 2024) made the core layer 2-8x faster again.

Pure SSMs struggle with tasks that need exact recall of something far back in context, which attention is good at. So the field converged on **hybrids**: mostly SSM or linear-attention layers, with a few full attention layers mixed in.

- AI21's [Jamba](https://arxiv.org/abs/2403.19887) (March 2024) "interleaves blocks of Transformer and Mamba layers" and fit long-context workloads "in a single 80GB GPU."
- NVIDIA's [Nemotron-H](https://arxiv.org/abs/2504.03624) (April 2025) replaced "the majority of self-attention layers" with Mamba layers "that perform constant computation and require constant memory per generated token," matching similar-sized Qwen and Llama models while "up to 3× faster at inference."
- Alibaba's [Qwen3-Next-80B-A3B](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct) (September 2025) uses three linear-attention (Gated DeltaNet) layers for every full attention layer and claims "10 times inference throughput for context over 32K tokens."
- By 2026, hybrids ship at the frontier of open models: NVIDIA's [Nemotron 3 Super](https://developer.nvidia.com/blog/introducing-nemotron-3-super-an-open-hybrid-mamba-transformer-moe-for-agentic-reasoning/) (March 2026) interleaves Mamba-2, attention and MoE layers, with a "native 1M-token context window."

**Good at:** long documents, long agent sessions, high throughput and lower memory per request. **Weak at:** precise recall in pure-SSM form (hence hybrids); less mature tooling than plain transformers.

## 5. Mixture-of-experts: a big brain, lightly used

**What it predicts.** The next token. The difference is which weights get used.

A **mixture-of-experts (MoE)** layer contains many parallel "expert" sub-networks plus a small **router** that picks a few experts for each token. The idea was scaled up by Noam Shazeer and colleagues in 2017 in [Outrageously Large Neural Networks](https://arxiv.org/abs/1701.06538), which described "conditional computation, where parts of the network are active on a per-example basis" as a way of "dramatically increasing model capacity without a proportional increase in computation."

Today most large open-weight models are MoEs. Meta's [Llama 4 announcement](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) puts it simply: "a single token activates only a fraction of the total parameters."

![Horizontal bar chart comparing total and active parameters per token in billions. DeepSeek-V3: 671 total, 37 active. Llama 4 Maverick: 400 total, 17 active. gpt-oss-120b: 117 total, 5.1 active. Qwen3-Next-80B-A3B: 80 total, 3 active. Mixtral 8x7B: 47 total, 13 active.](./moe-active-params.png)
*Figure 2: Most of a mixture-of-experts model sits idle for any given token. Sources: [DeepSeek-V3](https://arxiv.org/abs/2412.19437), [Llama 4](https://ai.meta.com/blog/llama-4-multimodal-intelligence/), [gpt-oss](https://huggingface.co/openai/gpt-oss-120b), [Qwen3-Next](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct), [Mixtral](https://arxiv.org/abs/2401.04088).*

DeepSeek-V3 (December 2024) has "671B total parameters with 37B activated for each token," and its full training took "only 2.788M H800 GPU hours," remarkably cheap for its capability. OpenAI's open-weight gpt-oss-120b has 117 billion parameters with 5.1 billion active.

**How it spends compute.** Per token, roughly like a dense model the size of the active parameters. But every expert must sit in memory, so serving an MoE needs as much GPU memory as its total size, and the routing adds communication overhead across GPUs.

**Good at:** packing more knowledge into a model at the same per-token cost; cheaper training and inference per unit of capability. **Weak at:** memory footprint, load-balancing experts, and complexity when self-hosting.

## 6. World models: predict the world, not the words

**What it predicts.** How an environment will change next, often conditioned on an action. There are two very different approaches.

**Generative world models predict pixels.** Google DeepMind's [Genie 3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/) (August 2025) turns a text prompt into a world "you can navigate in real time at 24 frames per second, retaining consistency for a few minutes at a resolution of 720p." It generates each frame auto-regressively, which DeepMind notes is "a harder technical problem than generating an entire video, since inaccuracies tend to accumulate over time." NVIDIA's [Cosmos](https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development) (January 2025) offers "generative world foundation models" for robotics and self-driving, on the logic, per its [paper](https://arxiv.org/abs/2501.03575), that "Physical AI needs to be trained digitally first."

**Latent world models predict embeddings.** Meta's [V-JEPA 2](https://arxiv.org/abs/2506.09985) (June 2025) was pretrained on over a million hours of video to predict abstract representations of masked and future frames, not the pixels themselves. An action-conditioned version then planned robot arm movements zero-shot. In Meta's head-to-head, it needed 16 seconds per action against Cosmos's 4 minutes and succeeded more often. This is Yann LeCun's Joint Embedding Predictive Architecture, which we unpack in [JEPA, explained](/blog/jepa-explained/).

**How it spends compute.** Generative models pay to render every frame, which is what makes them useful for simulation, games and synthetic training data. Latent models skip rendering and plan by comparing embeddings, which is far cheaper per decision but gives you nothing to look at.

**Good at:** physical intuition, simulation, planning actions, training robots and agents in imagined environments. **Weak at:** long-horizon consistency (Genie 3 is a "limited research preview" measured in minutes); for latent models, results so far are narrow and hard to inspect.

## 7. Vision-language-action models: from words to motor commands

**What it predicts.** Robot actions: joint movements, gripper commands, trajectories.

**Vision-language-action (VLA)** models take a vision-language model that understands images and instructions, and teach it to output actions. Google DeepMind's [RT-2](https://arxiv.org/abs/2307.15818) (July 2023) did this in the most literal way possible: "we express the actions as text tokens and incorporate them directly into the training set of the model in the same way as natural language tokens." A robot command became just another sentence.

Later systems split the job. Physical Intelligence's [π0](https://arxiv.org/abs/2410.24164) (October 2024) put "a novel flow matching architecture" on top of a pretrained vision-language model to produce smooth, continuous motion for tasks like "laundry folding, table cleaning, and assembling boxes." NVIDIA's [GR00T N1](https://arxiv.org/abs/2503.14734) (March 2025) made the split explicit with a "dual-system architecture": a vision-language module "(System 2) interprets the environment," and a diffusion module "(System 1) generates fluid motor actions in real time." Google DeepMind's [Gemini Robotics](https://arxiv.org/abs/2503.20020) (March 2025) built directly on Gemini 2.0 and could learn new short tasks "from as few as 100 demonstrations." In November 2025 Physical Intelligence's [π\*0.6](https://arxiv.org/abs/2511.14759) brought reinforcement learning to VLAs, which "more than doubles task throughput" on some of the hardest tasks. That is the same move from imitation to RL that created reasoning LLMs.

**Good at:** following natural-language instructions in the physical world, generalising to new objects and scenes. **Weak at:** data (robot demonstrations are scarce and expensive), reliability, speed of the large vision-language part.

## How they compare

| Family | Predicts | Trained with | Inference cost driver | Best for | Example |
| --- | --- | --- | --- | --- | --- |
| Autoregressive LLM | Next token | Next-token prediction, then instruction tuning | One pass per token; attention and KV cache grow with context | General language and code | GPT-4o, Llama 3 |
| Reasoning model | Next token, after a chain of thought | Pretraining plus RL on verifiable rewards | Thinking tokens, often many times the visible answer | Maths, code, agents | o3, DeepSeek-R1 |
| Diffusion LLM | A block of tokens in parallel | Denoising / masked prediction | A few parallel refinement steps | Speed, low latency | Mercury 2, Gemini Diffusion |
| SSM / hybrid | Next token | Same as LLMs | Constant memory per token in most layers | Long context, throughput | Nemotron-H, Qwen3-Next |
| Mixture-of-experts | Next token | Same as LLMs, plus a learned router | Only active experts run; all must fit in memory | Capability per unit of compute | DeepSeek-V3, gpt-oss |
| World model | Future frames or embeddings | Video prediction (pixels or latents) | Rendering frames, or planning in latent space | Simulation, robot planning | Genie 3, Cosmos, V-JEPA 2 |
| VLA | Robot actions | Vision-language pretraining plus robot data (and RL) | Large VLM plus fast action head | Robot control | RT-2, π0, GR00T N1 |

## These are ingredients, not boxes

The most important thing to understand about these families is that they combine. Consider three 2026 models:

- **Nemotron 3 Super** is a *hybrid SSM* + *mixture-of-experts* + *reasoning* model: 120 billion parameters, 12 billion active, Mamba-2 layers interleaved with attention, trained for agentic reasoning.
- **DiffusionGemma** is a *diffusion* model on a *mixture-of-experts* backbone: 26 billion parameters with 3.8 billion active.
- **Qwen3-Next** is a *hybrid linear-attention* + *mixture-of-experts* model with separate instruct and thinking variants.

So the useful questions about any new model are not "what kind is it?" but:

1. **What does it predict?** Tokens, a block of tokens, frames, embeddings or actions.
2. **How does it spend compute per request?** Per token, per thinking step, per refinement step, per expert.
3. **What was it rewarded for?** Imitating text, getting verifiable answers right, or reaching goals in the world.

The answers tell you where a model will be fast, where it will be expensive, and where it will fail.

## What this means for teams building on models

Most production stacks now use more than one family without noticing: a fast small model for classification, a reasoning model for hard queries, an open-weight MoE served in-house for sensitive data, maybe a diffusion model for low-latency code completion. Each has a different cost profile: output tokens for LLMs, hidden thinking tokens for reasoning models, GPU memory for self-hosted MoEs.

Managing that mix is an infrastructure problem as much as a modelling one. An [LLM gateway](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) gives applications a single API across providers and model types, so you can route each request to the family that fits it, fail over when a provider is down, and compare cost and latency on real traffic. Our reviews of [LLM routers](/blog/llm-routers-for-auto-routing/) and [routing for inference cost](/blog/model-routing-inference-cost/) go into the routing strategies. When the models are open-weight MoEs or hybrids you run yourself, an [open-source LLM gateway](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) deployed in your own environment lets self-hosted and API models sit behind the same interface, with the same budgets, keys and logs.

Three practical rules follow from the families above:

- **Match the family to the request, not the brand to the company.** Latency-critical paths may suit a diffusion or small MoE model; correctness-critical paths may justify a reasoning model at high effort. Putting that choice in an [AI gateway](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) makes it a config change rather than a code change.
- **Measure cost per task, not per token.** A reasoning model with a higher token price may finish in one attempt what a cheaper model needs five tries for. A diffusion model's speed only matters if its quality clears your bar.
- **Keep a path to self-hosting.** Several of the most interesting 2026 models (Nemotron 3, DiffusionGemma, gpt-oss, Qwen3-Next) ship as open weights. A [self-hosted AI gateway](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) makes it realistic to bring one in beside your API providers when data residency or cost demands it.

## What it means for the road to AGI

Each family is a bet on a different bottleneck. Reasoning models bet that more thinking at inference time is the missing ingredient. SSMs and hybrids bet on memory and long context, a piece of the [continual learning](/blog/continual-learning-explained/) puzzle. Diffusion bets that left-to-right generation is an unnecessary constraint. World models and VLAs bet that intelligence must be grounded in physical prediction and action, not text. MoE bets that capacity can grow much faster than cost.

None has proved sufficient on its own, and the frontier keeps absorbing the ones that work into a single stack. If AGI arrives, it is unlikely to be "an LLM" in the 2023 sense. More likely it will be a combination of several of the families above, and the most interesting open question is which of them it will need.

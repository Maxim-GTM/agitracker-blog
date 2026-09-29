---
title: "JEPA, explained: Yann LeCun's bet against next-token prediction"
description: What a Joint Embedding Predictive Architecture is, how I-JEPA and V-JEPA 2 work, why LeCun thinks it beats LLMs, and what the evidence shows so far.
pubDate: 2026-09-26
tags: [Explainers, Research, World Models]
author: team
cover: ./cover.png
coverAlt: Neobrutalist illustration of a video frame with a masked yellow block, an arrow into a small blue predictor box, and a cloud of abstract dots instead of pixels on the other side.
faq:
  - q: What does JEPA stand for?
    a: JEPA stands for Joint Embedding Predictive Architecture. It is a self-supervised learning design proposed by Yann LeCun in 2022 in which a model predicts the abstract representation (embedding) of a missing part of its input, rather than predicting the missing pixels or tokens themselves.
  - q: How is JEPA different from a large language model?
    a: A large language model is generative. It is trained to predict the exact next token and produces output one token at a time. A JEPA predicts in representation space. It never has to reconstruct every detail, so it can ignore unpredictable noise and focus on what matters for understanding and planning. JEPAs are not chatbots; they are encoders and world models.
  - q: What is V-JEPA 2?
    a: V-JEPA 2 is Meta's June 2025 video world model, a 1.2-billion-parameter JEPA pretrained on over one million hours of internet video. An action-conditioned version, V-JEPA 2-AC, was post-trained on under 62 hours of robot video and then used zero-shot to plan robot arm movements, reaching 65% to 80% success at picking and placing new objects.
  - q: Is JEPA better than LLMs?
    a: Not in any general sense yet. JEPA models have strong results in image and video understanding and early robot planning, and research such as LLM-JEPA and VL-JEPA suggests the objective can help language models too. But no JEPA-based system rivals frontier LLMs at language, coding or reasoning, and critics note most world-model demonstrations are still in narrow settings.
  - q: What is AMI Labs?
    a: Advanced Machine Intelligence (AMI) Labs is the startup Yann LeCun founded after leaving Meta at the end of 2025 to build world models in the JEPA tradition. In March 2026 it raised $1.03 billion at a $3.5 billion pre-money valuation, according to TechCrunch. It had not released a public model as of September 2026.
---

For three years, the most famous AI scientist in the world has been saying, loudly and often, that the technology everyone else is betting on is a dead end. Yann LeCun, Turing Award winner and until last year Meta's chief AI scientist, thinks large language models will never reach human-level intelligence. In January 2026 he told [MIT Technology Review](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/): "We are going to have AI systems that have humanlike intelligence, but they're not going to be built on LLMs."

His alternative has a clunky name: the **Joint Embedding Predictive Architecture**, or **JEPA**. It now anchors a family of Meta research models, a string of 2026 papers, and a startup that raised over a billion dollars before shipping a product. Here is what JEPA is, how it differs from the models you use every day, what it has actually achieved, and where the skeptics have a point.

**TL;DR**

- An LLM learns by predicting the **next token** exactly. A JEPA learns by predicting the **abstract representation** of a missing part of its input, so it never has to reconstruct every pixel or word.
- LeCun proposed it in his 2022 position paper as the core of a **world model**: a system that predicts how the world will change and plans by searching for actions that reach a goal (his "Mode-2", modelled on Kahneman's System 2).
- The track record: **I-JEPA** (2023) learned strong image features with far less compute; **V-JEPA** (2024) did the same for video; **V-JEPA 2** (2025) planned robot pick-and-place zero-shot, 65-80% success, with far less compute per action than a pixel-generating world model.
- Newer work (**LLM-JEPA**, **VL-JEPA**, **LeJEPA**, **LeWorldModel**) extends the idea to language and simplifies training.
- The honest caveat: JEPA has not produced anything that competes with frontier LLMs at language or reasoning, and critics say world-model results are still narrow and fragile. LeCun's startup, AMI Labs, is where the big bet now lives.

## The problem LeCun is trying to solve

LeCun's [A Path Towards Autonomous Machine Intelligence](https://openreview.net/forum?id=BZ5a1r-kVsf) (version 0.9.2, June 2022) opens with three questions: "How could machines learn as efficiently as humans and animals? How could machines learn to reason and plan? How could machines learn representations of percepts and action plans at multiple levels of abstraction?"

His favourite example is the teenager who learns to drive "in about 20 hours of practice," while self-driving systems need millions of miles. The difference, he argues, is that humans arrive with a **world model**: a learned, mostly unconscious sense of how objects move, fall and collide. "Common sense," he writes, "can be seen as a collection of models of the world that can tell an agent what is likely, what is plausible, and what is impossible."

Where does that come from? Mostly from watching. LeCun's back-of-envelope calculation, [posted in early 2024](https://x.com/ylecun/status/1750614681209983231), compares a large language model's roughly 10¹³ bytes of training text with the visual input of a four-year-old child: 16,000 waking hours through two optic nerves of a million fibres each, about 10¹⁵ bytes. "In 4 years, a child has seen 50 times more data than the biggest LLMs." Text, in his view, is a thin, pre-digested slice of reality. To get common sense, a machine must learn from high-bandwidth sensory data like video.

And that is where next-token prediction runs into trouble.

## Why not just predict the next frame?

The LLM recipe is: hide the next piece of data, predict it exactly, and learn from the error. It works brilliantly for text, because the set of possible next tokens is finite and a model can output a probability for each.

Video is different. Point a camera at a street and ask what the next second looks like. The car will probably keep going, but the exact position of every leaf on every tree, the ripple of every shadow, is fundamentally unpredictable. A model trained to predict pixels exactly must either spend enormous capacity modelling noise it can never get right, or hedge and produce blurry averages. LeCun's paper argues that tokenised, generative models are "less suitable for continuous, high dimensional signals such as video."

He also has a critique of the generation process itself. In a [March 2023 post](https://x.com/ylecun/status/1640122342570336267), he argued that autoregressive models are "exponentially diverging": if each generated token has some probability *e* of leaving the space of correct answers, then an answer of length *n* is correct with probability "(1-e)^n." (Researchers have since pushed back on this, as we'll see.)

JEPA's answer to both problems is to stop predicting the raw data at all.

## How a JEPA works

A JEPA has three parts:

1. A **context encoder** that turns the visible part of the input (say, most of an image) into an embedding, a list of numbers that summarises it.
2. A **target encoder** that turns the hidden part (the masked patch) into its own embedding.
3. A **predictor** that takes the context embedding and tries to output the target embedding.

The training loss compares two embeddings, not two images. In LeCun's words, "the main advantage of JEPA is that it performs predictions in representation space, eschewing the need to predict every detail of y, and enabling the elimination of irrelevant details by the encoders." If the leaves are unpredictable, the encoder can learn to leave them out of the representation, and the predictor is not punished for failing to guess them.

![Three side-by-side diagrams. Generative model: input x goes to an encoder and decoder that outputs predicted pixels or tokens, and the loss is measured in data space. Joint-embedding contrastive model: two views x and y each go through an encoder and the loss pulls matching pairs together and pushes others apart. JEPA: x goes to a context encoder and predictor, y goes to a target encoder, and the loss compares the predicted embedding to the target embedding in representation space.](./three-architectures.png)
*Figure 1: Three ways to learn from unlabelled data. JEPA predicts in representation space and needs no decoder at training time. Adapted from [LeCun, 2022](https://openreview.net/forum?id=BZ5a1r-kVsf) and [Assran et al., 2023](https://arxiv.org/abs/2301.08243).*

### The catch: collapse

There is an obvious way to cheat. If the encoders output the same constant vector for every input, the predictor can match it perfectly and the loss drops to zero while the model learns nothing. LeCun describes this as the "energy landscape" becoming "flat." Every JEPA needs a way to prevent this **representation collapse**, and the history of the family is partly a history of better anti-collapse tricks:

- **I-JEPA and V-JEPA** make the target encoder a slow-moving average of the context encoder and block gradients from flowing into it. The I-JEPA paper says this exponential moving average "has proven essential."
- LeCun's 2022 paper favoured **regularisation** instead, explicitly penalising embeddings whose dimensions have too little variance or are too correlated, as in the VICReg method. He argued that contrastive methods "have flaws" and that regularised ones "are much more likely to be preferable in the long run."
- **LeJEPA** (November 2025) by Randall Balestriero and LeCun replaced the grab-bag with a single regulariser that pushes embeddings toward an isotropic Gaussian distribution. The [paper](https://arxiv.org/abs/2511.08544) advertises "no stop-gradient, no teacher-student, no hyper-parameter schedulers" and an implementation of "≈50 lines of code."

<details><summary>Nerd corner: energy-based models</summary>

LeCun frames all of this as **energy-based modelling**. Instead of outputting a probability distribution over possible futures, the system learns a scalar function F(x, y) that "produces low energy values when x and y are compatible and higher values when they are not." A JEPA's energy is simply the distance between the predicted and actual embeddings. The appeal is that "the definition of EBM does not make any reference to probabilistic modeling," so the model never has to normalise a distribution over every possible video frame, which is intractable. Collapse, in this language, is an energy function that gives low energy to everything. Contrastive methods fix it by pushing up energy on wrong pairs; regularised methods fix it by limiting how much of the space can have low energy.

</details>

## The big picture: world models and "Mode-2"

JEPA is not meant to be the whole system. In LeCun's paper it is the engine inside a **world model**, one of six modules in a proposed architecture for an autonomous agent.

![Architecture diagram with six boxes. A configurator at the top connects to all others. Perception estimates the current state of the world. The world model predicts future states. The cost module computes an energy score for discomfort. Short-term memory stores current and predicted states. The actor proposes action sequences. Arrows show perception feeding the world model, the actor proposing actions to the world model, and the cost module scoring predicted states.](./lecun-architecture.png)
*Figure 2: The six modules in LeCun's proposed autonomous agent. Descriptions quoted and paraphrased from [A Path Towards Autonomous Machine Intelligence](https://openreview.net/forum?id=BZ5a1r-kVsf).*

In brief, quoting the paper: the **perception** module "estimates the current state of the world"; the **world model** must "predict plausible future states of the world"; the **cost** module computes "a single scalar output called 'energy' that measures the level of discomfort of the agent"; the **actor** "computes proposals for action sequences"; **short-term memory** tracks current and predicted states; and a **configurator** sets up the others "for the task at hand."

This architecture has two ways to act. In "Mode-1," the actor maps perception straight to action, "by analogy with Kahneman's 'System 1'." In "Mode-2," the agent imagines the consequences of candidate actions with its world model, scores them with the cost module and picks the best sequence, which LeCun calls "akin to model-predictive control" and names "by analogy to Kahneman's 'System 2'." Reasoning here means "constraint satisfaction (or energy minimization)" over imagined futures, not writing out words.

That is the key contrast with today's [reasoning models, which do System 2 by generating long chains of text](/blog/system-1-vs-system-2-ai-models/). LeCun's version plans in a learned abstract space of world states. The paper also sketches a **hierarchical JEPA** (H-JEPA), where a low level makes short-term predictions and higher levels predict further ahead in more abstract terms, because "the ability to represent sequences of world states at several levels of abstraction is essential to intelligent behavior."

## What JEPA has actually done

Position papers are cheap. Here is the evidence, in order.

![Timeline from 2022 to 2026. June 2022: LeCun position paper. January 2023: I-JEPA for images. February 2024: V-JEPA for video. June 2025: V-JEPA 2 and V-JEPA 2-AC plan robot actions. September 2025: LLM-JEPA brings the objective to language models. November 2025: LeJEPA simplifies training. December 2025: VL-JEPA predicts text embeddings. March 2026: AMI Labs raises 1.03 billion dollars, V-JEPA 2.1 and LeWorldModel.](./jepa-timeline.png)
*Figure 3: The JEPA family so far. Sources linked in the text.*

### I-JEPA (2023): images, cheaply

The first working model, [I-JEPA](https://arxiv.org/abs/2301.08243) by Mahmoud Assran and colleagues at Meta (CVPR 2023), put the idea in one sentence: "from a single context block, predict the representations of various target blocks in the same image." The headline was efficiency. The team trained a huge 632-million-parameter vision transformer "using 16 A100 GPUs in under 72 hours," which the paper says was "over 10× more efficient than a ViT-H/14 pretrained with MAE," a popular method that reconstructs pixels. Meta's [blog post](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/) reported state-of-the-art low-shot ImageNet classification "with only 12 labeled examples per class."

### V-JEPA (2024): video, without pixels

[V-JEPA](https://arxiv.org/abs/2404.08471) (February 2024) extended the recipe to video. It was trained "solely using a feature prediction objective, without the use of pretrained image encoders, text, negative examples, reconstruction, or other sources of supervision," on 2 million videos. Its largest model reached 81.9% on Kinetics-400 and 72.2% on Something-Something v2, a benchmark that requires understanding motion rather than recognising objects. Meta's [announcement](https://ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture/) described it as "a non-generative model that learns by predicting missing or masked parts of a video in an abstract representation space," with training efficiency gains "between 1.5x and 6x."

### V-JEPA 2 (2025): from watching to acting

The most important result so far is [V-JEPA 2](https://arxiv.org/abs/2506.09985), released on June 11, 2025. It came in two stages:

1. **Watch.** A 1.2-billion-parameter JEPA was pretrained, without any action labels, on "over 1 million hours of internet video" plus a million images. It set strong results on motion understanding (77.3% on Something-Something v2) and on anticipating what a person in a kitchen video will do next.
2. **Act.** The team then post-trained an action-conditioned predictor, **V-JEPA 2-AC**, on "less than 62 hours of unlabeled robot videos" from the public Droid dataset. Given the current camera image and a picture of the goal, the robot imagines the embedding each candidate action would produce and picks the actions that bring it closest to the goal embedding. That is LeCun's Mode-2, in miniature.

The robots were Franka arms in two labs the model had never seen, used "without collecting any data from the robots in these environments, and without any task-specific training or reward." Meta's [blog](https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/) reports "success rates of 65% – 80% for pick-and-placing new objects in new and unseen environments."

![Grouped bar chart of zero-shot robot success rates averaged over two labs. Reach: V-JEPA 2-AC 100 percent, Octo 100 percent. Grasp cup: 65 versus 15. Grasp box: 25 versus 0. Pick-and-place cup: 80 versus 15. Pick-and-place box: 65 versus 10. A side panel shows planning time per action: Cosmos about 4 minutes, V-JEPA 2-AC about 16 seconds.](./vjepa2-robots.png)
*Figure 4: V-JEPA 2-AC against Octo, an open generalist robot policy, averaged over two labs with 10 trials per task; planning time against NVIDIA's Cosmos from the paper's own comparison. Source: [Assran et al., 2025](https://arxiv.org/abs/2506.09985).*

The comparison with NVIDIA's **Cosmos**, a world model that generates future video frames, is the cleanest test of JEPA's core claim. Per the paper, "it takes 4 minutes to compute a single action in each planning step with Cosmos," while V-JEPA 2-AC "requires only 16 seconds per action and leads to higher performance across all considered robot skills." That is about 15 times faster. (Press coverage widely reported "30x faster," a figure [TechCrunch attributed to Meta](https://techcrunch.com/2025/06/11/metas-v-jepa-2-model-teaches-ai-to-understand-its-surroundings/) but which does not appear in the paper.) Predicting a compact embedding is simply cheaper than rendering pixels.

The paper is candid about limits: the system is sensitive to camera position, and chaining predictions forward still "suffers from error accumulation," the same problem LeCun pins on LLMs. Grasping a box, at 25%, shows how far this is from reliable manipulation. A [V-JEPA 2.1 update](https://arxiv.org/abs/2603.14482) in March 2026 reported "a 20-point improvement in real-robot grasping success rate."

### JEPA meets language

If JEPA were only for vision, it wouldn't threaten LLMs. Two 2025 papers suggest it may not be.

- **LLM-JEPA** ([Huang, LeCun and Balestriero, September 2025](https://arxiv.org/abs/2509.14252)) adds a JEPA-style loss alongside ordinary next-token training, predicting the embedding of one view of a problem (say, a regex description) from another (the regex itself). It reports outperforming "the standard LLM training objectives by a significant margin" across Llama 3, Gemma 2, OpenELM and OLMo models. The tests were small fine-tuning tasks like GSM8K and Spider, not frontier-scale pretraining.
- **VL-JEPA** ([Chen et al., December 2025](https://arxiv.org/abs/2512.10942)) is a vision-language model that, "instead of autoregressively generating tokens," predicts a continuous embedding of the answer text and only decodes it to words when needed. It reported "stronger performance while having 50% fewer trainable parameters" than a comparable token-generating baseline and cut decoding operations by 2.85x.

And in March 2026, [LeWorldModel](https://arxiv.org/abs/2603.19312) (Maes, LeCun, Balestriero and others) claimed "the first JEPA that trains stably end-to-end from raw pixels using only two loss terms," a 15-million-parameter model trainable "on a single GPU in a few hours" that "plans up to 48x faster than foundation-model-based world models."

## How JEPA differs from other world models

"World model" has become a crowded phrase. JEPA is the odd one out because it refuses to generate.

| | JEPA (V-JEPA 2) | Generative world models (Genie 3, Cosmos) | Autoregressive LLMs |
| --- | --- | --- | --- |
| What it predicts | Embeddings of masked or future inputs | Future video frames (pixels) | The next text token |
| Output you can look at | None by default; needs a separate decoder | Playable or viewable video | Text |
| Main use | Understanding video, planning actions | Simulation, games, synthetic training data | Language, code, reasoning, agents |
| Compute to plan one step | Low (16 s per action in Meta's robot test) | High (about 4 min per action for Cosmos in the same test) | n/a |
| Handles unpredictable detail by | Leaving it out of the representation | Modelling it or blurring it | Probability over a finite vocabulary |

Google DeepMind's [Genie 3](https://deepmind.google/discover/blog/genie-3-a-new-frontier-for-world-models/) (August 2025) generates navigable worlds "in real time at 24 frames per second, retaining consistency for a few minutes at a resolution of 720p," by generating each frame auto-regressively. It is spectacular to look at and useful for training agents in simulation, but it pays the full cost of rendering every detail. NVIDIA's [Cosmos](https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development) (January 2025) is also explicitly "generative." DeepMind's [DreamerV3](https://www.nature.com/articles/s41586-025-08744-2) (Nature, 2025) learns a compact world model too, but through reward-driven reinforcement learning. It famously became the first algorithm to collect diamonds in Minecraft from scratch. V-JEPA 2-AC, by contrast, plans toward a goal image with no reward at all.

## The skeptics

JEPA's critics are not dismissing it; they are asking for evidence at scale.

**Is the latent space grounded?** In [Critique of World Model](https://arxiv.org/abs/2507.05169) (July 2025), Eric Xing and colleagues argue that "the evidence for practical usability remains scarce as these models have mainly been demonstrated in toy environments," and that it "remains unclear whether such models can generalize across more diverse tasks (e.g., making breakfast)." Because JEPA supervises only in embedding space, they warn, "the predicted latents are not directly grounded in observable data." (They also concede that JEPA is the one serious exception to world-model research's focus on video generation.)

**Are results robust?** An [August 2026 replication study](https://arxiv.org/abs/2608.10145) of LeWorldModel found that "changing nothing but how the goal is constructed moves that checkpoint from 84.0% to 8.0%," and that "one-step prediction accuracy does not predict long-horizon planning success." Small, clever world models can be brittle in ways benchmark tables hide.

**Is the anti-LLM argument right?** LeCun's error-compounding maths assumes every token is an independent chance to go wrong. A [2025 analysis](https://arxiv.org/abs/2505.24187) argues that errors actually concentrate at a few "key tokens (5-10% of total tokens)," which it says "supersedes the exponential decay hypothesis." More bluntly, reasoning models that check and revise their own work have [stretched the length of tasks LLM agents can complete](/blog/metr-time-horizons-2026/) far past what a simple (1-e)^n model would allow. The LLMs LeCun called doomed in 2023 have kept getting better.

**Where is the flagship?** After four years, JEPA's best results are in image and video representation and early robot planning. No JEPA-based system competes with frontier LLMs at language, coding or open-ended reasoning, and the language experiments so far are small-scale.

## AMI Labs: the billion-dollar test

LeCun has now staked his reputation on finding out. In November 2025 he confirmed he would leave Meta at the end of the year to start a company whose goal, he said according to [Euronews](https://euronews.com/next/2025/11/20/french-godfather-of-ai-yann-lecun-confirms-he-is-leaving-meta-to-launch-ai-start-up), is "systems that understand the physical world, have persistent memory, can reason, and can plan complex action sequences." That list reads like a summary of his 2022 paper.

The startup, **Advanced Machine Intelligence (AMI) Labs**, raised $1.03 billion at a $3.5 billion pre-money valuation in March 2026, [TechCrunch reported](https://techcrunch.com/2026/03/09/yann-lecuns-ami-labs-raises-1-03-billion-to-build-world-models/), with backers including Bezos Expeditions, Nvidia, Samsung, Toyota Ventures and Eric Schmidt. It is headquartered in Paris, with offices in New York, Montreal and Singapore. CEO Alexandre LeBrun set expectations accordingly: "It's not your typical applied AI startup that can release a product in three months." As of late September 2026, AMI has not released a public model.

Whether AMI succeeds will say a lot about which of the [three levers of AI progress](/blog/three-levers-of-ai-progress/) matters most. The LLM labs are betting that more compute and data on the current recipe keep paying off. LeCun is betting that a better algorithm, with a different objective, is the bottleneck.

## What JEPA means if you build with AI today

Almost nothing changes this quarter. Production AI traffic still overwhelmingly goes to autoregressive LLMs, and JEPA models are encoders and planners, not drop-in chat APIs. But three things are worth knowing:

1. **JEPA models are already usable as components.** Meta released I-JEPA, V-JEPA and V-JEPA 2 weights publicly, and teams use them as video and image encoders for retrieval, classification and robotics. These are models you run yourself. If you are already self-hosting open-weight models, putting them behind an [open-source LLM gateway](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) keeps access control, logging and routing in one place instead of spread across one-off services.
2. **Architecture shifts are a reason to stay model-agnostic.** If VL-JEPA-style models, which predict embeddings and decode only when needed, turn out cheaper for some tasks, or if AMI ships an API, you will want to trial it without rewriting your application. Calling models through an [AI gateway](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) rather than hard-coding one vendor's SDK is what makes that a configuration change.
3. **Latency and cost per action are the metrics to watch.** V-JEPA 2's advantage over Cosmos showed up as seconds versus minutes per decision. When comparing world models, or any new architecture, against the incumbents, measure cost and latency on your own workload alongside accuracy. A [production LLM gateway](https://www.getmaxim.ai/articles/top-5-llm-gateways-in-2026-a-production-ready-comparison/) that logs every call gives you those numbers across providers, and a [self-hosted AI gateway](https://www.getmaxim.ai/articles/5-best-open-source-llm-gateways-for-self-hosted-deployments-in-2026/) does the same for models you serve in-house.

## What we're watching

1. **An AMI Labs model.** Its first release, and whether it is a research artefact or something developers can use, will be the clearest test of the JEPA thesis at scale.
2. **JEPA objectives in frontier pretraining.** If LLM-JEPA-style losses show gains when pretraining at scale, rather than in small fine-tuning runs, the two paradigms may merge rather than compete.
3. **Robot results outside the lab.** Pick-and-place on unseen objects at 65-80% is a start. Watch for long-horizon tasks and head-to-head comparisons with vision-language-action models such as Physical Intelligence's π0 family.
4. **Hierarchical planning.** LeCun's H-JEPA, planning at several time scales, is still mostly a diagram. A working version would be a genuine milestone toward his Mode-2.
5. **Replication.** Given the fragility found in LeWorldModel, independent reproductions of JEPA planning results matter as much as new headline numbers.

LeCun may be wrong about LLMs being a dead end; they have outperformed his predictions so far. But his core observation, that intelligence needs a model of how the world works and not just of how text continues, is now shared well beyond Meta. JEPA is the most concrete proposal for how to build one.

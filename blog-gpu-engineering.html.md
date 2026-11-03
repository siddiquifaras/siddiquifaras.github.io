# It's worth knowing what your GPU is actually doing

For years you could do ML without caring about the hardware. With inference costs where they are, GPU-level engineering is turning into a normal part of the job.

22 Jul 2026GPUs, LLM inference, performance

For a long time you could do machine learning without thinking about the hardware at all. Call the framework, pick a cloud instance, go. The abstractions were good enough that knowing what a warp is felt like trivia for people who write drivers.

That's changing, and quicker than I expected.

## Inference made it everyone's problem

Training is a handful of big runs. Inference is every request, from every user, for as long as the product exists. Once you're serving real traffic, small efficiency wins stop being small, because you collect them on every single token you generate. A kernel that's a bit faster or a cache that wastes less memory turns straight into fewer GPUs.

And when you run your own hardware, nobody else is optimising that for you. On the on-prem clusters I've worked with, you decide which model goes on which GPU, how much memory each one gets for its KV cache, how many requests share a card, and when a smaller model is good enough. Get those calls wrong and you're buying more hardware. Get them right and the same cluster quietly serves a lot more.

## Most of the time you're waiting on memory

The thing that surprised me most when I started digging in: during text generation the GPU spends a lot of its time waiting.

Every new token means reading the model's weights out of GPU memory. At small batch sizes the GPU does very little maths per byte it reads, so it finishes the maths fast and then sits there waiting for the next chunk of data. In that regime the big FLOPs number on the spec sheet barely matters. Memory bandwidth does.

*[Diagram: a simplified roofline. Performance rises with arithmetic intensity along a memory-bound slope until the ridge point, then flattens at the compute roof. Token-by-token decode at small batch sizes sits low on the memory-bound slope; prefill and large batches sit near the compute roof.]*

That's why so much of the good inference work is really memory work:

- **Batching.** Serve more requests at once so every weight you read gets reused for more tokens.
- **Paging the KV cache.** The [vLLM paper](https://arxiv.org/abs/2309.06180) found that serving systems at the time wasted 60 to 80 percent of their KV cache memory on fragmentation and over-reservation. Their PagedAttention got that under 4 percent and improved throughput by 2 to 4 times over the systems they compared against.
- **Quantisation.** Fewer bytes per weight means fewer bytes to move.
- **Kernel fusion.** Do several steps in one kernel so intermediate results never take the round trip out to main memory and back. [FlashAttention](https://arxiv.org/abs/2205.14135) is the famous one.

*[Meme: a black cat sitting in a corner, captioned [SOBBING]. Caption: nvidia-smi showing 100% utilisation while the job is mostly waiting on memory.]*

## It matters on tiny hardware too

This isn't only a data centre thing. I opened a [pull request](https://github.com/RightNow-AI/picolm/pull/24) for PicoLM, a project that runs a one-billion-parameter model on a $10 board with 256 MB of RAM. The attention code was converting half-precision values to floats one at a time in software, around a dozen scalar instructions each. Spread across every head, every layer and every token of context, that added up to almost half the cost of the matrix maths. On ARM chips (AArch64) there's already a hardware instruction that converts four values at once. Using it, plus vectorising the loops around it, should drop attention from roughly 48% of the matmul cost to under 2%, by my estimate in the PR.

Nothing clever, honestly. You just had to know the instruction existed and look at where the time was going.

## What I'd actually learn

You don't need to become a full-time kernel engineer. But if you work anywhere near AI infrastructure, I'd get comfortable with:

- How GPU memory is laid out (HBM, shared memory, registers) and roughly how fast each one is.
- What makes a workload memory-bound or compute-bound. The roofline model is a good place to start.
- Reading a profiler like Nsight Systems or Nsight Compute instead of guessing.
- Enough CUDA or Triton to read a kernel and understand why it's fast or slow.
- How serving engines like vLLM handle batching, scheduling and the KV cache.

If you can't explain why your model is slow, you'll keep fixing it by buying more GPUs. That gets expensive really quickly, and these days it's often not even an option.

Written by Faras Siddiqui. More posts on the [blog](https://siddiquifaras.github.io/blog.html).

Source: https://siddiquifaras.github.io/blog-gpu-engineering.html

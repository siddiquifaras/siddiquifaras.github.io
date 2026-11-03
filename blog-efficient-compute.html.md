# Cheap watts win

Everyone is racing to make AI cheaper. I think the people who come out ahead are the ones who waste the least power doing it.

14 May 2026Efficient compute, edge AI, neuromorphic computing

Everyone is trying to make AI cheaper right now. Token prices keep falling. Every few months somebody ships a smaller model that roughly matches last year's big one. And pretty much every infra conversation I've had this year ends up at the same question: how do we serve more, for less?

My take is simple. The teams that win the next few years won't be the ones with the most GPUs. They'll be the ones who get the most useful work out of every watt and every chip they already have.

## The GPU is only the start of the bill

When people price out AI they look at the GPU. Fair enough, those things are not cheap. But the GPU is where the bill starts.

An H100 SXM is rated at up to 700 W. A B200 sits around 1,000 W. Put eight of them in a server, a few servers in a rack, a lot of racks in a hall, and every one of those watts turns into heat that you then pay to get rid of. Cooling, power delivery, the building, the grid connection. Somebody pays for all of it, and that cost lands in the price of your tokens whether you see it or not.

At the global scale the numbers get kind of silly. The [IEA estimates](https://www.iea.org/reports/energy-and-ai) data centres used around 415 TWh of electricity in 2024, about 1.5% of all the electricity used on the planet, and expects that to more than double to roughly 945 TWh by 2030. AI is the biggest reason why.

*[Meme: This Is Fine, a cartoon dog sitting calmly in a burning room. Caption: the cooling loop at 3am after someone launches a quick sweep on the whole cluster.]*

## Power is the real bottleneck now

For a long time the limit was how many chips you could buy. In a lot of places the limit now is how much power you can get into the building, and how quickly. You can order more GPUs. You can't really order more grid.

Once that's your constraint, efficiency stops being a nice extra. If your stack does the same job on half the energy, you can serve twice the traffic from the same power envelope. At that point efficiency basically is your capacity plan.

## The edge has almost nothing

Then there's the edge, where I've spent a lot of my time. On edge and industrial hardware you don't get a rack. You get a small board, a tight memory budget, maybe a battery, a thermal limit, and a hardware team who will remind you about that thermal limit in every single meeting.

There's no "just add another GPU" out there. The model either fits inside the memory, compute and energy budget, or it doesn't ship. I actually like that. It forces a better question. You stop asking what's the biggest model you can run and start asking what's the smallest thing that does the job properly.

It's a big part of why I got into neuromorphic computing. Spiking networks do their work as events, when something changes, instead of crunching every value on every tick. Pair that with an event camera, which only reports the pixels that changed, and you get a pipeline that sits mostly idle when the world is idle. For small hardware that's exactly the shape you want.

When I worked on compression for spiking networks, taking a ten-layer network from about 200 KB down to about 200 bytes wasn't a party trick. On small neuromorphic hardware, savings like that decide what you can deploy at all.

## Same story in the data centre, bigger numbers

Even with proper GPUs, most of the waste I've seen is pretty boring. GPUs sitting half idle because requests aren't batched well. KV cache memory reserved and never used. One model per GPU when two or three could share it. A giant model doing a job a small one does just as well.

When I was setting up inference on on-prem GPU clusters, most of the wins came from exactly that boring stuff. Scheduling so the GPUs weren't sitting around, packing more concurrent requests onto each card, and routing every task to the cheapest model that could actually handle it. None of it looks impressive in a demo. All of it shows up on the bill.

## Where I think this goes

- Smaller, specialised models doing most of the everyday work, with the big ones only called when a task actually needs them.
- Inference engines and kernels that treat memory traffic as seriously as FLOPs, because that's usually where the time goes.
- More AI running on the device itself. Shipping every request to a data centre costs power, bandwidth and latency, and some places don't have a connection at all.
- Hardware designed around energy first, neuromorphic chips included.

Raw scale still matters, I'm not pretending it doesn't. But when anyone can rent the same GPUs, the advantage goes to whoever wastes the least. Watts are turning into the real currency of this whole thing. Spend them carefully.

Written by Faras Siddiqui. More posts on the [blog](https://siddiquifaras.github.io/blog.html).

Source: https://siddiquifaras.github.io/blog-efficient-compute.html

# Projects

Software I've built for neuromorphic computing and event-based vision, and fixes I've contributed to other people's projects.

## TALON

Neuromorphic SDK · Python, PyTorch, snnTorch, hls4ml

TALON (Tactical AI at Low-power On-device Nodes) is Type 1 Compute's SDK for taking spiking and hybrid neural networks from PyTorch down to neuromorphic hardware and FPGAs. It works like ONNX: a model is exported to an IR graph and written to a portable `.t1c` file, which can then be mapped onto hardware, compiled, simulated or visualised.

I built all seven of its packages: the SDK and command-line tools, the IR, the PyTorch bridge, the visualiser, graph mapping, the backend and simulator, and event I/O. The visualiser renders 23 to 30 million events per second. CVision built the SDK for Type 1 Compute and delivered it [about six months ahead of schedule](https://www.cvision.dev/case-studies/type-1-compute-neuromorphic-sdk).

- **My part:** Built all 7 packages: SDK, IR, bridge, visualiser, graph, backend and simulator, event I/O
- **Input:** PyTorch and snnTorch models: spiking, conventional or hybrid
- **Targets:** Type 1 Compute neuromorphic hardware; Xilinx Zynq FPGAs through hls4ml
- **Formats:** HDF5 (`.t1c`), EVT2, EVT3, AEDAT4
- **Install:** `pip install t1c-talon`

[Documentation](https://type1compute.github.io/docs/talon-ecosystem/introduction) · [PyPI](https://pypi.org/project/t1c-talon/)

## frames2py

Event-camera streaming library · Python, NumPy, HDF5

An event camera reports per-pixel brightness changes as a stream of events, often millions a second. frames2py turns that live stream into frames that any number of consumers can read without slowing the feed. The producer hands events to an engine that accumulates them and publishes immutable snapshots; each consumer reads the latest snapshot at its own pace, and the producer never waits.

It sustains more than 20 million events per second in pure NumPy across all 150 cells of its benchmark, and reads Prophesee EVT 2.0 and 3.0, AEDAT 4.0 and HDF5 recordings. Version 1.1 added temporal representations used by event-vision models (stacked histograms and voxel grids) and a tested recipe for handing snapshots to PyTorch.

- **Role:** Author and maintainer
- **Latest release:** 1.1.0, 7 October 2026
- **Runs on:** CPython 3.11–3.14, including free-threaded 3.14t; Linux and macOS
- **License:** Apache-2.0
- **Install:** `pip install frames2py`

[GitHub](https://github.com/siddiquifaras/frames2py) · [Documentation](https://siddiquifaras.github.io/frames2py/) · [PyPI](https://pypi.org/project/frames2py/)

## Upstream contributions

Status as of 4 November 2026

| Project | Change | Status |
|---|---|---|
| [NIR #187](https://github.com/neuromorphs/NIR/pull/187) | Fix a type-check guard in `read()` that could never fire | Merged |
| [NIR #188](https://github.com/neuromorphs/NIR/pull/188) | Validate graph structure before type inference, naming dangling and duplicate edges | Merged |
| [NIR #189](https://github.com/neuromorphs/NIR/pull/189) | Resolve scalar parameter types from graph context | Open |
| [PicoLM #24](https://github.com/RightNow-AI/picolm/pull/24) | NEON-vectorised flash attention with hardware FP16 on AArch64 | Open |
| [PicoLM #23](https://github.com/RightNow-AI/picolm/pull/23) | Compile with `-O3 -ffast-math` instead of `-O2` | Open |

Source: https://siddiquifaras.github.io/projects.html

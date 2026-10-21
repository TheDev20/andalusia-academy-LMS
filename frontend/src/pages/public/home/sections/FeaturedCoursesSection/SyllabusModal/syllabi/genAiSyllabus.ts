import { ProgramSyllabusDetails } from "./types";

export const genAiSyllabus: ProgramSyllabusDetails = {
  courseId: "applied-genai-llm",
  title: "Applied Generative AI, LLMs & Autonomous Agents Bootcamp",
  category: "AI & Machine Learning",
  badge: "TOP ENROLLED",
  duration: "5 Months · 160 Lab Hours",
  intake: "Nov 1, 2026",
  rating: 4.98,
  reviewsCount: 184,
  level: "All Developers",
  format: "Hybrid · Hands-on AI Studio & GPU Cloud Cluster",
  overview:
    "A fast-paced, high-impact bootcamp taking engineers from AI fundamentals to architecting production autonomous agent swarms, enterprise RAG systems, and fine-tuning open-source LLMs on high-end GPU clusters.",
  careerOutcomes: {
    targetRoles: [
      "Generative AI Systems Engineer",
      "LLM Applications Architect",
      "Autonomous Agent Developer",
      "AI Solutions Consultant",
    ],
    averageSalaryRange: "$95,000 – $145,000 / yr",
    hiringPartners: ["AI Innovations Lab", "Enterprise Tech Venture", "DeepMind Alumni Group", "Global AI Labs"],
  },
  prerequisites: [
    "Comfortable with Python programming (data structures, async, APIs)",
    "Basic understanding of vector math (dot products, cosine similarity)",
    "Curiosity and willingness to work with bleeding-edge AI models and toolchains",
  ],
  technologies: [
    "Python 3.12",
    "PyTorch",
    "Hugging Face",
    "LangChain",
    "LangGraph",
    "ChromaDB",
    "Pinecone",
    "vLLM",
    "Ollama",
    "LoRA / QLoRA",
    "Unsloth",
    "Ragas Evaluation",
  ],
  modules: [
    {
      id: "mod-1",
      number: 1,
      duration: "Weeks 1–4",
      title: "Deep Learning Foundations & Transformer Architectures",
      summary:
        "Understand the mathematical foundations of modern AI: self-attention mechanisms, tokenization, embeddings, and transformer encoders/decoders.",
      topics: [
        "PyTorch tensor operations, autograd, and GPU acceleration with CUDA",
        "The Transformer architecture: Scaled dot-product attention, multi-head attention & positional encodings",
        "Tokenization algorithms (BPE, WordPiece, SentencePiece) and vocabulary design",
        "Hugging Face Transformers pipeline: Loading, inferring, and analyzing open-source weights",
        "Prompt engineering mechanics: Few-shot prompting, Chain-of-Thought (CoT), and structured JSON outputs",
      ],
      handsOnLab: {
        title: "From-Scratch Mini-Transformer & Attention Visualizer",
        description:
          "Implement a multi-head self-attention layer and transformer block from scratch in PyTorch, generating dynamic heatmaps showing token cross-attention on technical prose.",
      },
      technologies: ["Python", "PyTorch", "Hugging Face", "CUDA", "Matplotlib"],
    },
    {
      id: "mod-2",
      number: 2,
      duration: "Weeks 5–9",
      title: "Enterprise RAG & High-Performance Vector Databases",
      summary:
        "Build zero-hallucination Retrieval-Augmented Generation architectures capable of indexing enterprise repositories and documents.",
      topics: [
        "Embedding models: Dense embeddings (OpenAI, BGE, Nomic) vs Sparse BM25 lexical search",
        "Document ingestion pipelines: Recursive chunking, semantic chunking & table extraction",
        "Vector database operations: ChromaDB, Pinecone, and Qdrant indexing & HNSW search",
        "Hybrid search fusion (Reciprocal Rank Fusion - RRF) and cross-encoder rerankers (Cohere Rerank)",
        "Automated hallucination detection and evaluation benchmarks using Ragas & TruLens",
      ],
      handsOnLab: {
        title: "Multi-Source Legal & Regulatory Document Intelligence Engine",
        description:
          "Build an enterprise document knowledge base that parses 1,000+ page corporate filings, performs hybrid dense/sparse search, reranks results, and generates grounded responses with pinpoint citations.",
      },
      technologies: ["LangChain", "ChromaDB", "Pinecone", "Cohere", "Ragas", "FastAPI"],
    },
    {
      id: "mod-3",
      number: 3,
      duration: "Weeks 10–15",
      title: "Autonomous Multi-Agent Systems & Tool-Calling",
      summary:
        "Design collaborative AI agents that reason, plan, use shell tools, run Python scripts, and coordinate in multi-agent workflows.",
      topics: [
        "ReAct (Reason + Act) loop mechanics and Plan-and-Solve patterns",
        "Stateful agent workflows using LangGraph: Cyclic graphs, human-in-the-loop breakpoints & checkpoints",
        "Function calling / Tool use: Web search, database query generation, and code sandbox execution",
        "Multi-agent orchestration: Supervisor architectures, peer-to-peer debates, and swarm consensus",
        "Guardrails and security: Preventing prompt injections, jailbreaks, and sensitive data leakage (NeMo Guardrails)",
      ],
      handsOnLab: {
        title: "Autonomous Software Engineering Swarm (Architect, Coder & QA Agent)",
        description:
          "Develop a collaborative 3-agent software team in LangGraph that reads GitHub issue tickets, writes Python code in a sandboxed Docker environment, runs automated unit tests, and iterates until all tests pass.",
      },
      technologies: ["LangGraph", "LangSmith", "Docker Sandbox", "NeMo Guardrails", "OpenAI & LLM provider APIs"],
    },
    {
      id: "mod-4",
      number: 4,
      duration: "Weeks 16–20",
      title: "Fine-Tuning Open LLMs & High-Throughput Inference",
      summary:
        "Fine-tune open-weight models (Llama 3.3, Mistral, Qwen) using parameter-efficient fine-tuning (PEFT/QLoRA) and deploy them with vLLM.",
      topics: [
        "Dataset curation: Synthetic data generation, instruction tuning datasets & formatting (ChatML, Alpaca)",
        "Parameter-Efficient Fine-Tuning: LoRA, QLoRA, and 4-bit/8-bit quantization mechanics",
        "Accelerated training with Unsloth and Hugging Face SFTTrainer on cloud GPUs",
        "Evaluation: Perplexity metrics, benchmark suites (MMLU, GSM8K), and LLM-as-a-Judge evaluations",
        "Production model serving with vLLM, PagedAttention, continuous batching, and streaming APIs",
      ],
      handsOnLab: {
        title: "Fine-Tuning and Serving a Specialized Medical / Financial LLM",
        description:
          "Fine-tune an open-source 8B model with QLoRA on a curated domain-specific instruction dataset using an H100 GPU, evaluate zero-shot performance improvement, and deploy with vLLM delivering 85+ tokens/sec.",
      },
      technologies: ["Unsloth", "LoRA/QLoRA", "vLLM", "Ollama", "Triton Server", "Hugging Face Hub"],
    },
  ],
  capstoneProject: {
    title: "OmniAgent: Enterprise Autonomous Copilot for Tech Due Diligence",
    description:
      "Fellows build a production-ready, multi-agent AI system that ingests confidential startup git repositories, financial decks, and architecture docs, runs automated code security audits, and synthesizes a comprehensive investor report with source citations.",
    deliverables: [
      "Multi-agent LangGraph workflow with human-in-the-loop review",
      "Hybrid RAG pipeline indexing codebase ASTs and vector representations",
      "Fine-tuned domain LLM running locally with vLLM backend",
      "Interactive React frontend with streaming markdown and agent reasoning traces",
    ],
  },
};

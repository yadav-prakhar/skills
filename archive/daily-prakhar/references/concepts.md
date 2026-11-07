# Concept of the Day — selection and the 60-concept spine

One idea per issue, 360–470 words, printed in a bordered box on p5. It is the only
part of the paper that is not news, so it must stand on its own for a reader who
skips every headline.

## How to pick

State file: `~/Daily-Prakhar/concepts-covered.txt`, one line per issue:

```
2026-11-05 a3
2026-11-06 f2
```

Run `python3 scripts/next_concept.py` — it implements the algorithm below and prints
the id, title and hook. Add `--mark` to record the pick in the state file before
writing (a failed render must not be able to ship the same concept twice).

Algorithm:

1. Read the covered ids. If the file is missing, treat it as empty.
2. Count covered ids per domain (A–J). Pick the domain with the **fewest** covered.
   Tie → the domain that appears first in this file.
3. Inside that domain take the **lowest-numbered id not yet covered**.
4. Append the id to the state file **before** rendering.
5. After all 60 are covered, start Round 2 in the same order; the entry must take a
   new angle (different example, different number) and the line is written `r2 a3`.
   Never reprint the same body.

Do not pick by mood. The domain rotation is the point: it stops a month of
nothing but LLM topics.

## Format

```
CONCEPT 27 · STORAGE & DATA
**Write amplification**

What it is.  Two sentences. Name the mechanism, not a metaphor.

How it works.  The mechanism with one concrete number — a page size, a
multiplier, a measured percentage. This is the paragraph that makes the
concept stick.

Where it bites.  One real decision or failure it explains: a benchmark that
moved, an outage, a query that got slower after an index was added.

Say it in a review.  One sentence the reader can reuse verbatim.

Check: one retrieval question, answerable from the box.
Source: <primary document> · <outlet or author>
```

Rules:

- **Verify before writing.** Fetch the source. If it contradicts the hook below,
  the source wins — and fix the hook in this file in the same run.
- **One number minimum.** A concept with no number is a definition, and definitions
  are forgettable.
- **No analogy-only explanations.** An analogy may open the paragraph; the mechanism
  must follow.
- **Assume fluency.** The reader ships software for a living. Do not explain what a
  database is; explain why this one behaves the way it does.
- **The answer line** goes at the foot of p5, above the footer:
  `Answers — 27: <one sentence>.` Keep it under 25 words.
- If the day's concept cannot be verified against a primary source, take the next id.

## The spine

### A. Performance and latency

- `a1` **Percentiles, not averages** — p50 describes the typical request; p99 describes the one users complain about. Report the percentile and the window. `S1`
- `a2` **Little's Law** — concurrency equals arrival rate times time in system (L = λW); it sizes thread pools and queues. `S2`
- `a3` **The utilisation knee** — queue wait grows non-linearly as utilisation approaches one; 80% is already busy. `S3`
- `a4` **Amdahl's Law** — speed-up is capped by the serial fraction, so parallelising the wrong 10% buys nothing. `S4`
- `a5` **Coordinated omission** — a load generator that pauses its clock during a stall reports the latency it wished for. `S5`
- `a6` **Backpressure and bounded queues** — an unbounded queue converts overload into latency, then into memory. `S7`

### B. Storage and data

- `b1` **B-tree versus LSM-tree** — in-place updates optimise reads; append-and-compact optimises writes. The workload picks. Source: database engine docs (PostgreSQL, RocksDB).
- `b2` **The write-ahead log** — durability before visibility: append, flush, then apply. `S8`
- `b3` **MVCC** — readers take a snapshot instead of a lock; vacuum is the bill. `S9`, `S10`
- `b4` **Write amplification** — one logical write becomes several physical ones in SSDs, LSM trees and replication. Source: RocksDB wiki, SSD vendor papers.
- `b5` **Index selectivity** — the optimiser ignores an index that matches too many rows. `S11`
- `b6` **Normalisation versus denormalisation** — joins cost at read time; update anomalies cost at write time. Source: relational design texts.

### C. Distributed systems

- `c1` **CAP, and PACELC** — partitions force consistency or availability; even without them, latency trades against consistency. `S12`
- `c2` **Quorum overlap** — R + W > N guarantees a read sees the latest write; the price is tail latency. Source: Dynamo paper (2007).
- `c3` **Idempotency keys** — a retry is safe only when the operation can recognise its own repeat. Source: Stripe idempotency docs.
- `c4` **Retry storms and jitter** — synchronised retries multiply load exactly when the system is failing. `S6`
- `c5` **Leases and fencing tokens** — a paused leader still believes it leads; only a fence stops its writes. Source: Kleppmann, *Designing Data-Intensive Applications*, ch. 8.
- `c6` **Exactly-once** — in practice it is at-least-once delivery plus deduplication at the edge. Source: Kafka exactly-once docs.

### D. Networking

- `d1` **TCP handshake and slow start** — the first bytes pay for the connection; reuse is the optimisation. `S13`
- `d2` **TLS 1.3** — one round trip to a shared secret, forward secrecy by default, and 0-RTT's replay risk. `S14`
- `d3` **HTTP/2 and HTTP/3** — head-of-line blocking moves from the connection to the stream to the packet. `S15`
- `d4` **DNS TTL and the resolution chain** — the cache you forgot sits inside your latency budget. Source: RFC 1034/1035, resolver docs.
- `d5` **Cache keys and Vary** — two responses share an entry only if every varying input is in the key. `S16`, `S17`
- `d6` **Connection pooling** — pool size is a queueing decision: too small queues, too large thrashes. Source: HikariCP sizing notes.

### E. Runtime and language

- `e1` **Generational GC** — most objects die young, so collect the nursery often and the old generation rarely. `S40`
- `e2` **JIT tiering** — interpreted, then baseline, then optimised; deoptimisation is the cliff between them. `S40`
- `e3` **The event loop** — one thread, several queues; any synchronous work blocks every pending callback. `S18`
- `e4` **Stack, heap and escape analysis** — allocation is cheap until the object escapes and must be collected. `S40`
- `e5` **Floating point and money** — binary fractions cannot represent 0.10; use integer minor units or decimal. `S19`
- `e6` **Copy-on-write** — snapshots are cheap until the first write copies the page. Source: OS virtual-memory texts (`fork`, mmap).

### F. Security

- `f1` **Authorization code + PKCE** — the public client proves possession without holding a secret. `S20`, `S21`
- `f2` **JWT validation** — verify the signature, then issuer, audience, expiry and algorithm; never trust the header. `S22`, `S23`
- `f3` **CSRF versus CORS** — CSRF stops forged writes riding a session; CORS limits what a browser lets a page read cross-origin. `S24`
- `f4` **SSRF** — a server-side fetch reaches what the internet cannot; allowlist destinations. `S25`
- `f5` **Supply chain** — lockfiles, SBOMs and provenance answer "what exactly built this?". Source: SLSA, CycloneDX.
- `f6` **TOCTOU** — the gap between checking and using is the vulnerability. Source: CWE-367.

### G. AI systems

- `g1` **Embeddings and cosine similarity** — proximity in vector space is a learned proxy, not meaning; normalise first. `S29`
- `g2` **RAG recall** — the generator cannot answer from a chunk retrieval never returned. `S26`
- `g3` **The KV cache** — decoding reuses past keys and values; long contexts cost memory, stable prefixes can be cached. `S28`
- `g4` **Quantisation** — fewer bits change *which* answers are wrong; measure the task, not perplexity. Source: model card / GGUF quantisation notes.
- `g5` **Context economics** — attention grows with context; tokens are rent, not free storage. `S28`
- `g6` **Evals** — offline sets and online metrics measure different things, and judges carry bias. `S27`

### H. Engineering practice

- `h1` **DORA's four keys** — lead time, deployment frequency, change failure rate, recovery time. `S30`
- `h2` **Trunk-based development** — small, frequent integrations stop merge cost from compounding. `S30`
- `h3` **Feature flags** — deploy and release are different events; every flag is debt with an owner. `S31`
- `h4` **Small pull requests** — review latency and defect escape rate both rise with diff size. Source: Google engineering practices, SmartBear review study.
- `h5` **SLOs and error budgets** — reliability is a budget you spend, not a virtue you assert. `S32`
- `h6` **Build versus buy** — TCO includes the on-call, upgrades and exit you did not price. `S39`

### I. ServiceNow platform

- `i1` **Deny-unless versus allow-if ACLs** — deny-unless evaluates first, and one failure denies the operation. `S33`
- `i2` **Business rule timing** — before, after, async and display decide what the database has already seen. `S34`
- `i3` **GlideRecord versus GlideAggregate** — row-by-row scripting versus one aggregate query; the loop is the cost. `S35`
- `i4` **CMDB and CSDM** — the model of record and the model of use are different maps; reconciliation is the work. `S36`
- `i5` **Update sets versus source control** — capture-and-promote versus branch-and-pipeline; the difference is review. `S37`
- `i6` **Flow Designer versus scripted workflow** — declarative actions are governable; run-as scripts are not. `S38`

### J. Economics and architecture

- `j1` **Cost per request** — the unit that makes two architectures comparable. `S39`
- `j2` **Egress and data gravity** — moving bytes usually costs more than keeping them. `S39`
- `j3` **Cache hit-ratio economics** — the marginal hit is worth more than the average hit. Source: CDN pricing and hit-ratio curves.
- `j4` **Batching and coalescing** — amortise fixed cost, and pay for it in latency. `S7`
- `j5` **Capacity headroom** — size for the knee and for failure, not for the average. `S3`
- `j6` **Latency budgets** — a user-facing budget decomposes into per-hop deadlines; without one, every hop is innocent. `S1`

## Source library

Re-verify a link before printing it; docs move. These were live on 2026-11-05.

- `S1` https://sre.google/sre-book/service-level-objectives/
- `S2` https://en.wikipedia.org/wiki/Little%27s_law
- `S3` https://en.wikipedia.org/wiki/M/M/1_queue
- `S4` https://en.wikipedia.org/wiki/Amdahl%27s_law
- `S5` https://www.infoq.com/presentations/latency-pitfalls/
- `S6` https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
- `S7` https://aws.amazon.com/builders-library/avoiding-fallback-in-distributed-systems/
- `S8` https://www.postgresql.org/docs/current/wal-intro.html
- `S9` https://www.postgresql.org/docs/current/mvcc.html
- `S10` https://www.postgresql.org/docs/current/routine-vacuuming.html
- `S11` https://www.postgresql.org/docs/current/indexes-intro.html
- `S12` https://en.wikipedia.org/wiki/CAP_theorem
- `S13` https://www.rfc-editor.org/rfc/rfc9293.html
- `S14` https://www.rfc-editor.org/rfc/rfc8446.html
- `S15` https://www.rfc-editor.org/rfc/rfc9114.html
- `S16` https://www.rfc-editor.org/rfc/rfc9111.html
- `S17` https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
- `S18` https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
- `S19` https://en.wikipedia.org/wiki/IEEE_754
- `S20` https://www.rfc-editor.org/rfc/rfc6749.html
- `S21` https://www.rfc-editor.org/rfc/rfc7636.html
- `S22` https://www.rfc-editor.org/rfc/rfc7519.html
- `S23` https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html
- `S24` https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- `S25` https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- `S26` https://arxiv.org/abs/2307.03172
- `S27` https://arxiv.org/abs/2306.05685
- `S28` https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- `S29` https://platform.openai.com/docs/guides/embeddings
- `S30` https://dora.dev/research/
- `S31` https://martinfowler.com/articles/feature-toggles.html
- `S32` https://sre.google/workbook/error-budget-policy/
- `S33` https://www.servicenow.com/docs/r/platform-security/access-control/acl-denial-behavior.html
- `S34` https://www.servicenow.com/docs/r/xanadu/application-development/business-rules-classic/c_BusinessRules.html
- `S35` https://www.servicenow.com/docs/r/zurich/platform-administration/glideaggregate.html
- `S36` https://www.servicenow.com/docs/r/servicenow-platform/configuration-management-database-cmdb/c_ITILConfigurationManagement.html
- `S37` https://www.servicenow.com/docs/r/application-development/source-control/c_SourceControlIntegration.html
- `S38` https://www.servicenow.com/docs/r/build-workflows/flow-designer/c_FlowDesigner.html
- `S39` https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html
- `S40` https://v8.dev/blog

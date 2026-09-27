---
name: eli5
description: Explain any concept, code, system, product mechanism, error, or engineering change with the simplest accurate mental model for the audience. Use when the user says "eli5", asks for plain English or a beginner explanation, or wants to understand how something works without unnecessary complexity.
---

# ELI5

Construct the simplest accurate mental model for the intended audience.

**Simplify the explanation, not the underlying truth.** Remove unnecessary complexity while preserving the distinctions, limits, and tradeoffs the reader needs.

## Response contract

Deliver only the requested explanation. For exactly N sentences, write N plain-prose sentences, count the complete response before sending, and fit the mechanism and essential caveat inside that budget. Omit headings, duplicated summaries, postscripts, and unrelated workflow or model-selection advice in this mode.

Make the first sentence as evidence-aware as the last: lead with "The PR proposes…" when only a description is available, and label a typical mechanism as an illustration before describing it. A caveat at the end cannot repair an opening that presents unverified behavior as fact. Describe possible benefits conditionally; give numerical speedups or outcomes only when supported by cited evidence.

For a technical category, define what its variants share before choosing a representative implementation; a familiar implementation is an example, not the definition of the whole category. Attach the tested revision or state to any verified result. When evidence is missing, name the specific source needed to confirm the explanation.

## Steps

1. **Pin the subject and audience.** Determine what is being explained, what the reader is trying to do with the explanation, and what they likely already know. Infer this from the conversation when possible. Ask one focused question only when a wrong audience assumption would materially change the answer. Otherwise default to an intelligent newcomer to this subject, not a literal five-year-old.

2. **Choose the explanation mode:**
   - **Concept or product mechanism:** what it is, how it works, and why it exists.
   - **Code or function:** inputs, important flow, outputs, side effects, and failure modes.
   - **Architecture or system:** components, responsibilities, boundaries, and the path one representative request takes.
   - **Error:** what happened, why, what the system expected, and what to do next.
   - **Engineering change:** when `change-explainer` is available, request its investigation-only steps 1–5 and consume the evidence map, not its final report. Reuse existing evidence only when it matches the target revisions and relevant working-tree state. `eli5` owns the audience, requested length, formatting, and the single final answer; investigation depth does not expand the requested output.

   When `change-explainer` is unavailable, inspect the supplied change directly: a single commit's patch, the user's explicit range endpoints, a branch against its intended base's merge-base, or session work separated into committed, staged, unstaged, and relevant untracked changes. Explain before → now, blast radius, and uncertainty. Distinguish **Verified** inspected run evidence tied to the target revision/state from **Reported** author claims and **Not verified** missing or stale evidence. Require baseline evidence before calling a failure pre-existing. When access is unavailable, explain only supplied material and name what remains unknown rather than inventing implementation details.

3. **Build the mental model.** State the central idea in one sentence. Select only the mechanism needed to make that sentence true. Identify one likely misconception and the caveat or boundary that prevents it.

4. **Explain progressively.** Use only the layers the request needs:
   - **In one sentence:** the shortest accurate answer.
   - **Mental model:** the small set of parts and relationships to remember.
   - **How it works:** a concrete sequence or representative example.
   - **Technical translation:** map plain-language terms to the real vocabulary.
   - **Why it matters:** consequence, tradeoff, or next action.

   A reader should be able to stop after any layer without being misled by what they have read so far. An explicit length or format request overrides the default shape; fit the essential caveat within that limit rather than appending another report.

5. **Use an analogy only when it clarifies a real relationship.** State where the analogy stops matching. Prefer no analogy when the concept is already simpler without one, when the analogy hides an important distinction, or when explaining the analogy takes more work than explaining the subject.

6. **Choose the clearest representation.** Use prose by default. Use a tiny diagram, table, or before/after example when relationships, comparisons, or flow become clearer visually. Match the format the user requests; do not force an HTML artifact.

7. **Check accuracy and the response contract.** Verify factual claims against available code, documentation, output, or trusted sources. Preserve important costs and failure cases: an index can speed reads *and* slow writes; a cache can reduce latency *and* serve stale data. State the conditions under which an optimization helps rather than promising improvement for every workload. Label uncertainty where the claim appears instead of smoothing it away. Done when the explanation is simpler than the source, still lets the reader make correct predictions, and meets the requested length including every sentence in the final response.

## Default shape

```markdown
**In one sentence:** <the shortest accurate mental model.>

<One or two short paragraphs or a small diagram showing how it works.>

**Technical translation:** <plain term> = <real term>; <plain term> = <real term>.

**Why it matters:** <consequence, tradeoff, or next action.>

<Optional: "The important catch is …" or "Where the analogy breaks: …">
```

Adapt the shape to the mode. For an error, lead with what happened and the next action. For code, trace one representative input. For architecture, follow one request across component boundaries. For a change, lead with before → now and distinguish verified behavior from intended behavior.

## Voice

- Plain, direct, and respectful; simple is not childish.
- Concrete before abstract. Introduce vocabulary after the reader has a place to attach it.
- One strong mental model is better than several competing analogies.
- Keep necessary domain terms and define them once.
- Include the caveat that changes what the reader would predict; omit trivia that does not.
- Answer the user's real "so what?" rather than merely translating jargon.

For examples of a concept, a three-sentence change explanation, and unavailable repository evidence, read [references/examples.md](references/examples.md).

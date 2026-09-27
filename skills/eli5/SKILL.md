---
name: eli5
description: Explain any concept, code, system, product mechanism, error, or engineering change with the simplest accurate mental model for the audience. Use when the user says "eli5", asks for plain English or a beginner explanation, or wants to understand how something works without unnecessary complexity.
---

# ELI5

Construct the simplest accurate mental model for the intended audience.

**Simplify the explanation, not the underlying truth.** Remove unnecessary complexity while preserving the distinctions, limits, and tradeoffs the reader needs.

## Steps

1. **Pin the subject and audience.** Determine what is being explained, what the reader is trying to do with the explanation, and what they likely already know. Infer this from the conversation when possible. Ask one focused question only when a wrong audience assumption would materially change the answer. Otherwise default to an intelligent newcomer to this subject, not a literal five-year-old.

2. **Choose the explanation mode:**
   - **Concept or product mechanism:** what it is, how it works, and why it exists.
   - **Code or function:** inputs, important flow, outputs, side effects, and failure modes.
   - **Architecture or system:** components, responsibilities, boundaries, and the path one representative request takes.
   - **Error:** what happened, why, what the system expected, and what to do next.
   - **Engineering change:** use the `change-explainer` workflow when that skill is available, then present its evidence through the progressive layers below. Otherwise inspect the diff and supporting evidence directly; explain before → now, blast radius, verification, and remaining uncertainty.

3. **Build the mental model.** State the central idea in one sentence. Select only the mechanism needed to make that sentence true. Identify one likely misconception and the caveat or boundary that prevents it.

4. **Explain progressively.** Use only the layers the request needs:
   - **In one sentence:** the shortest accurate answer.
   - **Mental model:** the small set of parts and relationships to remember.
   - **How it works:** a concrete sequence or representative example.
   - **Technical translation:** map plain-language terms to the real vocabulary.
   - **Why it matters:** consequence, tradeoff, or next action.

   A reader should be able to stop after any layer without being misled by what they have read so far.

5. **Use an analogy only when it clarifies a real relationship.** State where the analogy stops matching. Prefer no analogy when the concept is already simpler without one, when the analogy hides an important distinction, or when explaining the analogy takes more work than explaining the subject.

6. **Choose the clearest representation.** Use prose by default. Use a tiny diagram, table, or before/after example when relationships, comparisons, or flow become clearer visually. Match the format the user requests; do not force an HTML artifact.

7. **Check accuracy.** Verify factual claims against available code, documentation, output, or trusted sources. Preserve important costs and failure cases: an index can speed reads *and* slow writes; a cache can reduce latency *and* serve stale data. Label uncertainty instead of smoothing it away. Done when the explanation is simpler than the source and still lets the reader make correct predictions.

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

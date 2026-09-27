---
name: change-explainer
description: >-
  Investigate and explain an engineering change from evidence: actual behavior, intent versus reality, blast radius, guarantees, risks, verification, and remaining work. Use for a detailed explanation of a PR, issue chain, commit range, branch, release, or the agent's own code changes.
---

# Change Explainer

Explain what an engineering change actually did and what will happen because of it. The reader knows the product but may not know the code. Treat this as an investigation: repository evidence decides what changed; prose from issues and PRs explains what was intended.

**Evidence boundary:** with partial code, omit **Unchanged** and "no action required" unless the inspected paths establish them. More time or another attempt can permit success only if the operation actually completes successfully; it does not make errors, hangs, or failed retries succeed. Audit every sentence for these conditions, including the blast-radius section, and deliver only the requested explanation or evidence map.

## Composition

When another skill requests investigation only, perform steps 1–5 and return the evidence map to that caller: target revisions/state, before → now, sources, intent gaps, blast radius, verification labels, and remaining uncertainty. This is an intermediate result, not a second user-facing answer. The caller owns audience, length, formatting, and final delivery. Reuse an existing evidence map when its revisions and relevant working-tree state still match.

## Evidence hierarchy

Use sources in this order and keep their roles separate:

1. **Diff and surrounding code:** what behavior changed. Trace callers, data flow, configuration, and failure paths far enough to establish the externally visible consequence.
2. **Tests, CI, and runtime output:** what was exercised and what passed or failed.
3. **Issue, specification, and PR description:** why the change was requested and what it intended to accomplish.
4. **Commit messages and discussion:** historical context, not proof of current behavior.
5. **Inference:** a labeled conclusion only when direct evidence cannot settle the point.

When intent and implementation disagree, report the implementation as reality and call out the gap.

## Steps

1. **Pin the change.** Resolve the target without silently expanding it:
   - PR or issue chain: inspect each linked diff and its base/head revisions; order the chain and record which changes are proposed, merged, or released.
   - Single commit: inspect `git show <sha>` for that commit's patch, not everything since it. For a merge commit, establish which parent is the baseline before explaining the patch.
   - Explicit range or release endpoints: preserve the user's endpoints. Use `git diff A B` for `A..B`; use `git diff A...B` only for an explicitly requested merge-base comparison. Inspect the corresponding commit history for context.
   - Branch: identify the intended base and use `git diff <base>...<branch>` from their merge-base; name both refs and resolved revisions. Ask if the base is ambiguous.
   - Session work: separate committed changes, staged changes (`git diff --cached`), unstaged changes (`git diff`), and relevant untracked files. Attribute session work from conversation evidence instead of claiming every branch change or pre-existing local edit.

   Done when the exact set of diffs and revisions or working-tree state is named.

2. **Build the evidence map.** Read each diff, then enough surrounding code to determine behavior before and after. Record the evidence source for every material claim. Collect issue or PR intent separately. Scope conclusions to the inspected paths: a test excerpt does not establish the total test count or the absence of other tests, and a setting change alone does not establish every caller's behavior. When code or forge access is unavailable, explain only the supplied evidence, label reported intent and unknown behavior, and name what evidence would resolve the gap. Done when material claims have sources or explicit evidence limits; missing access is not a reason to invent behavior.

3. **Compare intent with reality.** Write down:
   - **Intended:** the outcome requested by the issue, spec, or PR.
   - **Actually changed:** the behavior established by the code.
   - **Gap:** anything missing, broader, narrower, or different.

   Include an **Intent vs reality** section only when the gap is meaningful. Agreement needs no ceremonial section.

4. **Map behavior and blast radius.** Identify:
   - **Before → now:** observable changes, most important first. A retry or longer timeout creates another opportunity to succeed, not guaranteed success; retain the conditions and remaining failure paths.
   - **Affected:** users, callers, data, interfaces, configurations, and failure paths that can change.
   - **Unchanged:** nearby behavior a reviewer might reasonably worry about.
   - **Compatibility and action:** migrations, rollout order, re-authentication, API changes, release coordination, or no action required.
   - **Guarantees:** only statements proved by control flow and tests; phrase each as *never / only / always* plus the consequence.
   - **Risks or surprises:** behavior that is intentional but could catch a reviewer or operator off guard.

5. **Grade verification honestly.** Separate tests, build, lint, type checks, CI, and manual/runtime evidence using these labels:
   - **Verified:** inspected output or CI evidence tied to the target revision or tested working-tree state; name the command/check and its result. An unexecuted test is coverage evidence, not a passing run.
   - **Reported:** a result or count asserted in a PR, issue, or conversation without inspected run evidence; attribute the source.
   - **Not verified:** missing, stale, or mismatched run evidence, and behavior that was not exercised; explain why each material gap matters. A reported pass can coexist with an unverified current revision.

   Passing tests establish only what they exercise. Use exact counts only when the source supplies them. Call a failure **pre-existing** only with comparable baseline output or a historical run demonstrating the same failure; otherwise its origin is unknown.

6. **Write progressively.** Start with the answer a reader can consume in one breath, follow with a 30-second behavioral explanation, then provide detail for readers who continue. Cite material behavior claims, intent/implementation gaps, and verification results with concise file/line references, revision-aware source links, or check/output references. Cite supplied excerpts by their labels when links are unavailable. Omit empty sections rather than filling a template mechanically.

7. **Audit the result.** Check every factual statement against its evidence, including the opening and claims of unchanged behavior. Describe open-PR code as proposed behavior at the inspected revision, not a shipped feature. Use exact numbers and statuses. Distinguish fact, reported intent, and inference. Replace internal identifiers with user-visible behavior unless the identifier is itself part of the interface. Done when the reader can predict the new behavior, its limits, and the confidence behind the explanation.

8. **Deliver** the explanation as your reply. If the user asks you to post it as a PR or issue comment, show the final text and post only after explicit confirmation.

## Output shape

```markdown
**TL;DR:** <one or two sentences: before → now → why it matters.>

## What changed

- **Before → now:** <observable behavior and consequence, with source reference.>
- <additional changes only when material.>

## Intent vs reality

- **Intended:** <stated goal and source.>
- **Actually changed:** <implementation and code reference.>
- **Gap:** <difference and consequence, tied to the evidence above.>

## Blast radius

- **Affected:** <who or what can behave differently.>
- **Unchanged:** <nearby behavior that remains the same.>
- **Compatibility / action:** <migration, rollout, API impact, or "none".>

## Guarantees

- **Never / Only / Always:** <proved boundary and consequence.>

## Verification

- **Verified:** <inspected check/output reference, target revision/state, and supported results.>
- **Reported:** <attributed result not independently checked.>
- **Not verified:** <material gaps and why they matter.>

## Heads-up

<Only risks, surprises, or required human decisions.>

## What remains

<Out-of-scope work, next PR or ticket, or "Nothing identified".>
```

## Voice

- Lead with behavior, not implementation vocabulary.
- Use concrete nouns and consequence clauses: what the person sees, what the system does next, and why that matters.
- Prefer one precise technical term with a plain definition over a vague substitute.
- State boundaries directly. "Successful logins are unchanged" is more useful than "minimal impact."
- Keep the TL;DR independent: a reader who stops there still gets the main change and consequence.
- Use headings as progressive disclosure, not as a checklist that forces empty prose.

For a worked intent/implementation gap with reported tests and missing evidence, read [references/examples.md](references/examples.md).

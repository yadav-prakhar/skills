---
name: change-explainer
description: >-
  Investigate and explain an engineering change from evidence: actual behavior, intent versus reality, blast radius, guarantees, risks, verification, and remaining work. Use for a detailed explanation of a PR, issue chain, commit range, branch, release, or the agent's own code changes.
---

# Change Explainer

Explain what an engineering change actually did and what will happen because of it. The reader knows the product but may not know the code. Treat this as an investigation: repository evidence decides what changed; prose from issues and PRs explains what was intended.

## Evidence hierarchy

Use sources in this order and keep their roles separate:

1. **Diff and surrounding code:** what behavior changed. Trace callers, data flow, configuration, and failure paths far enough to establish the externally visible consequence.
2. **Tests, CI, and runtime output:** what was exercised and what passed or failed.
3. **Issue, specification, and PR description:** why the change was requested and what it intended to accomplish.
4. **Commit messages and discussion:** historical context, not proof of current behavior.
5. **Inference:** a labeled conclusion only when direct evidence cannot settle the point.

When intent and implementation disagree, report the implementation as reality and call out the gap.

## Steps

1. **Pin the change.** Resolve the exact PR, issue chain, commit range, branch comparison, release range, or session work. For a branch, identify the correct merge-base. For an issue, find every linked change and order the chain. Done when the exact set of diffs is named.

2. **Build the evidence map.** Read each diff, then enough surrounding code to determine behavior before and after. Record the evidence source for every material claim. Collect issue or PR intent separately. Done when every claimed behavior has code evidence and every claimed verification result has output or CI evidence.

3. **Compare intent with reality.** Write down:
   - **Intended:** the outcome requested by the issue, spec, or PR.
   - **Actually changed:** the behavior established by the code.
   - **Gap:** anything missing, broader, narrower, or different.

   Include an **Intent vs reality** section only when the gap is meaningful. Agreement needs no ceremonial section.

4. **Map behavior and blast radius.** Identify:
   - **Before → now:** observable changes, most important first.
   - **Affected:** users, callers, data, interfaces, configurations, and failure paths that can change.
   - **Unchanged:** nearby behavior a reviewer might reasonably worry about.
   - **Compatibility and action:** migrations, rollout order, re-authentication, API changes, release coordination, or no action required.
   - **Guarantees:** only statements proved by control flow and tests; phrase each as *never / only / always* plus the consequence.
   - **Risks or surprises:** behavior that is intentional but could catch a reviewer or operator off guard.

5. **Grade verification honestly.** Separate:
   - tests, build, lint, and type checks;
   - CI status;
   - manual or runtime evidence;
   - behavior that was not exercised.

   Passing tests prove only the behavior they cover. State **Not verified** for material gaps and explain why each gap matters. Name pre-existing failures without presenting them as regressions.

6. **Write progressively.** Start with the answer a reader can consume in one breath, follow with a 30-second behavioral explanation, then provide detail for readers who continue. Omit empty sections rather than filling a template mechanically.

7. **Audit the result.** Check every factual statement against its evidence. Use exact numbers and statuses. Distinguish fact, reported intent, and inference. Replace internal identifiers with user-visible behavior unless the identifier is itself part of the interface. Done when the reader can predict the new behavior, its limits, and the confidence behind the explanation.

8. **Deliver** the explanation as your reply. If the user asks you to post it as a PR or issue comment, show the final text and post only after explicit confirmation.

## Output shape

```markdown
**TL;DR:** <one or two sentences: before → now → why it matters.>

## What changed

- **Before → now:** <observable behavior and consequence.>
- <additional changes only when material.>

## Intent vs reality

- **Intended:** <stated goal.>
- **Actually changed:** <evidence-backed implementation.>
- **Gap:** <difference and consequence.>

## Blast radius

- **Affected:** <who or what can behave differently.>
- **Unchanged:** <nearby behavior that remains the same.>
- **Compatibility / action:** <migration, rollout, API impact, or "none".>

## Guarantees

- **Never / Only / Always:** <proved boundary and consequence.>

## Verification

- **Verified:** <tests, build, CI, manual/runtime evidence, with exact results.>
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

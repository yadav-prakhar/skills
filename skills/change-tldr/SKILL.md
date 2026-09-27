---
name: change-tldr
description: >-
  Give a brief, evidence-backed summary of an engineering change. Use for a TL;DR or concise status of a PR, issue chain, commit, branch, release, or session work; summarize behavior, verification, and next steps.
---

# Change TL;DR

Write a plain-language TL;DR that lets a reviewer who has not read the code know what changed in behavior, why, and what it means for them next. The reader is busy, knows the product, and does not know the code.

Select this skill when the subject is an engineering change. A request to summarize an article or other non-change material stays an ordinary summary. For an explicit ELI5 request, `eli5` owns the final presentation; for a detailed investigation, use `change-explainer` when available.

**Evidence boundary:** with partial code, omit **Unchanged** unless the supplied evidence establishes the specific behavior. A small diff is not evidence that everything else is unchanged. Keep benefits conditional and the answer limited to the requested change, without unrelated workflow or model-selection advice.

## Steps

1. **Pin the target** from the user's request:
   - PR / merge request number or URL: the PR, its diff, and its linked issue.
   - Issue number or URL: the issue and every PR linked to it. This is a chain summary, so cover each PR in order and end with the state of the whole chain.
   - Single commit: inspect `git show <sha>` for that commit's patch, not everything since it. For a merge commit, establish which parent is the baseline before explaining the patch.
   - Explicit range or release endpoints: preserve the user's endpoints. Use `git diff A B` for `A..B`; use `git diff A...B` only for an explicitly requested merge-base comparison. Inspect the corresponding commit history for context.
   - Branch: identify the intended base and use `git diff <base>...<branch>` from their merge-base; name both refs and resolved revisions. Ask if the base is ambiguous.
   - Session work: separate committed changes, staged changes (`git diff --cached`), unstaged changes (`git diff`), and relevant untracked files. Attribute session work from conversation evidence instead of claiming every branch change or pre-existing local edit.

   Fetch PRs and issues with the forge's CLI or API (`gh`, `glab`, or whatever the repository host uses). Record each linked change's status so open proposals are not described as shipped. Done when you can name the exact diff and revision or working-tree state you are explaining.

2. **Read the evidence, diff first.** Read enough surrounding code to establish the consequence. Use descriptions and linked issues for intent, not proof of implementation. Reuse evidence only when it matches the target revision and relevant working-tree state. Done when every material behavior claim has a source, or is explicitly marked unknown because evidence is unavailable.

   Classify verification separately:
   - **Verified:** inspected output or CI evidence tied to the target revision or tested working-tree state; name the command/check and its result. Source code or an unexecuted test establishes intent or coverage, not a passing run.
   - **Reported:** a result or test count asserted by an author without inspected run evidence; attribute the source.
   - **Not verified:** missing, stale, or mismatched run evidence; state the gap. A reported pass can coexist with an unverified current revision.

   Call a failure **pre-existing** only with comparable baseline output or a historical run demonstrating the same failure. Otherwise say its origin is unknown. When code or forge access is unavailable, explain only the supplied evidence, distinguish reported intent from established behavior, and name what is needed to resolve the gap.

3. **Find the story.** Sort what you found into these buckets, and drop the empty ones:
   - **Before → now:** each change as a caller or user would notice it. Put the most important one first. A retry or longer timeout creates another opportunity to succeed, not guaranteed success.
   - **Guarantees:** edge cases the change now handles, each as *never / only / always* plus its consequence.
   - **Unchanged:** nearby behavior established as unchanged by inspected code, not a blanket reassurance about unseen paths.
   - **Bugs found:** the symptom a user would have seen.
   - **Your call:** actions the human must take, such as rollout order, migration, re-login, release, or a decision left open.
   - **What's left:** the next ticket or PR and what remains out of scope.

4. **Write it** in the shape below.

5. **Check it.** Every factual claim traces to evidence, with author reports attributed and uncertainty preserved. Numbers are exact when supported; omit unavailable counts. Each code identifier is one the reader already uses: a tool or command name, error code, endpoint, environment variable, or setting. Rewrite everything else as what it does. Done when a reviewer could predict the established behavior and recognize the limits of the evidence from the TL;DR alone.

6. **Deliver** it as your reply. If the user asks you to post it as a PR or issue comment, show the final text and post only after explicit confirmation.

## Shape

```
**<target and observed status> — <source link, when available>.**

TL;DR: <before → now → why it matters → guarantees → unchanged. 3–7 sentences for a single change; up to three short paragraphs for a chain or release.>

<Optional heads-up, only when the reader must act or would otherwise be surprised: "Before you ship: …" or "Two things the docs now say out loud: …" as 1–3 bullets.>

<Verified: inspected check/output + revision/state + supported results. Reported: attributed claims. Not verified: missing or stale evidence. Include only applicable labels.>

<Where this leaves things: next / remaining / "that call is yours".>
```

Use a commit, range, or session label when there is no PR. Claim merge readiness only when current checks, reviews, and merge requirements support it; otherwise state the observed status. Respect an explicit user length limit instead of forcing every template field.

## Voice

- **Before/now contrast** carries the explanation: "the old code deleted that login outright… now it writes down 'this exact login was refused'."
- **Concrete nouns the user sees:** browser tab, login, "unauthorized", a full minute of waiting. Use these instead of HTTP status codes, class names, or function names.
- **Components talk.** Put a system's message in quotes: tell the credential server "that exact version worked"; the server just says "please upgrade".
- **Consequence clauses** answer "so what": "because the rejection is written down first, the refusal is never lost."
- **Honest scope:** say what was deliberately not done, which failures were already there, and what still needs a human.
- **Plain prose:** use the bold lead line and at most a few bullets. Headings and file lists belong in a detailed explanation, not this TL;DR.

## Example

Illustrative fixture: the code and inspected CI for PR #187 at `api-head` establish the behavior below; its build passed and test output reports 162 files and 2,617 passing tests. Current reviews and merge requirements are satisfied. These are example facts, not results for the user's repository.

> **#181 is ready for merge — [PR #187](https://github.com/acme/api-server/pull/187).**
>
> TL;DR: when the instance says "unauthorized" to a call, the old code deleted that instance's saved login outright—throwing away the evidence that the instance had rejected it. Now it writes down "this exact login was refused" and only then opens the browser once to get a new login and retry the call. Because the rejection is written down first, the refusal is never lost; if the credential server cannot record it, the action fails instead of pretending the bad login is gone. The same login at the same version stays rejected; a genuinely new version is used without opening a browser tab. Successful logins are unchanged.
>
> Verified: PR #187 CI at `api-head` passed its build and full suite, **162 files, 2,617 tests**. Next in the chain: #182 handles a second rejection without opening another browser tab, followed by #183 and #184.

For chain-closing and release-readiness examples with bugs found, heads-up bullets, and human decisions, read [references/examples.md](references/examples.md).

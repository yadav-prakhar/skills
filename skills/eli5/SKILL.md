---
name: eli5
description: ELI5 TL;DR of a code change — what actually happened and what will happen because of it, in plain language. Use when asked to "eli5", "tldr", or explain what a PR, issue chain, commit range, branch, or the agent's own work changed.
---

# ELI5

Write a plain-language TL;DR that lets a reviewer who has not read the code know what changed in behaviour, why, and what it means for them next. The reader is busy, knows the product, and does not know the code.

## Steps

1. **Pin the target** from the user's request:
   - PR / merge request number or URL: the PR, its diff, its linked issue.
   - Issue number or URL: the issue and every PR linked to it. This is a chain summary, so cover each PR in order and end with the state of the whole chain.
   - SHA, range, or branch: `git log` + `git diff` against the merge-base.
   - Nothing named: the work done in this session, meaning uncommitted and staged changes, commits since the branch point, and what you did in this conversation.

   Fetch PRs and issues with the forge's CLI or API (`gh`, `glab`, or whatever the repo's host uses). Done when you can name the exact diff you are explaining.

2. **Read the evidence, the diff first.** Use the PR or commit description and the linked issue or spec only for the *why* and the scope, and check them against the code. Collect verification that actually exists: test and build output from this session, CI check results, or counts quoted in the PR. Done when every behaviour change points to a diff hunk that proves it.

3. **Find the story.** Sort what you found into these buckets, and drop the empty ones:
   - **Before → now:** each change as a caller or user would notice it. The one that matters most goes first.
   - **Guarantees:** edge cases the change now handles, each as *never / only / always* plus its consequence.
   - **Unchanged:** what a reader might fear changed but did not.
   - **Bugs found:** described by the symptom a user would have *seen*.
   - **Your call:** actions the human must take, such as rollout order, migration, re-login, release, or a decision left open.
   - **What's left:** the next ticket or PR, and what is still out of scope.

4. **Write it** in the shape below.

5. **Check it.** Every claim traces to the diff or to real output. Numbers are exact. Each code identifier is one the reader already uses: a tool or command name, error code, endpoint, env var, or setting. Rewrite everything else as what it does. Done when a reviewer could predict the new behaviour from the TL;DR alone.

6. **Deliver** it as your reply. If the user asks you to post it (PR or issue comment), show the final text and post only after they explicitly say to.

## Shape

```
**<ticket/PR> is <ready for merge | done | in progress> — [PR #N](url).**

ELI5: <before → now → why it matters → guarantees → unchanged. 3–7 sentences for a single change; up to three short paragraphs for a chain or a release.>

<Optional heads-up, only when the reader must act or would otherwise be surprised: "Before you ship: …" or "Two things the docs now say out loud: …" as 1–3 bullets.>

<Verified: build + exact test counts, pre-existing failures named. Or: "Not verified: …" and what is missing.>

<Where this leaves things: next / remaining / "that call is yours".>
```

## Voice

- **Before/now contrast** carries the explanation: "the old code deleted that login outright… now it writes down 'this exact login was refused'."
- **Concrete nouns the user sees:** browser tab, login, "unauthorized", a full minute of waiting. Use these instead of HTTP status codes, class names, or function names.
- **Components talk.** Put a system's message in quotes: tell the credential server "that exact version worked"; the server just says "please upgrade".
- **Consequence clauses** answer "so what": "because the rejection is written down first, the refusal is never lost."
- **Honest scope:** say what was deliberately not done, which failures were already there, and what still needs a human.
- **Plain prose:** use the bold lead line and at most a few bullets. Headings and file lists go in the PR description, not in the TL;DR.

## Example

> **#181 is ready for merge — [PR #187](https://github.com/acme/api-server/pull/187).**
>
> ELI5: when the instance says "unauthorized" to a call, the old code deleted that instance's saved login outright — throwing away the evidence that the instance had rejected it. Now it writes down "this exact login was refused" (via the same verification call that already records successes, which clears the login and leaves a visible "rejected" marker), and only then opens the browser once to get a new login, retrying the call with it. Because the rejection is written down first, the refusal is never lost — and if the credential server can't write it down, the action fails rather than pretending the bad login is gone. Same login + same "version" of that login = rejected; a genuinely new version = just use it, no browser tab. Nothing is deleted any more, and a later plain call on a rejected entry still reports the rejection instead of quietly re-logging you in.
>
> Build passed; full suite is **162 files, 2,617 tests**. Next in the chain: #182 (a 401 on the retry itself → stop and report `credential_rejected`, no second browser tab), then #183 and #184.

For a chain-closing or release-readiness TL;DR with bugs found, heads-up bullets, and "your call" items, read [references/examples.md](references/examples.md).

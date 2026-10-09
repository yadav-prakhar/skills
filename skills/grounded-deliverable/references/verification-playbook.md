# Verification playbook

Run each item that applies to your material. Each one is a pattern that produced a real,
non-obvious finding in past work; the example after each item shows the shape, not a rule.

## Leads versus the code

1. **Descriptions and comments describe intent; the code describes behaviour.** For every
   claim in a PR description, code comment, README, ticket or design doc, find the line that
   would make it true. *Example: a plan entry set `demoData: true` with a comment promising
   demo data; the runner only read `loadDemoData`, so nothing loaded.*
2. **READMEs and runbooks go stale first.** When a doc shows a command, image, path or config,
   compare it with what the pipeline actually runs. *Example: a README showed a RHEL image and
   `npm ci`; the live pipeline used an Ubuntu image and `pnpm`.*
3. **Bot and human review comments are leads too.** Verify a reviewer's claim against docs or
   code before repeating it, in either direction. *Example: "this wait may hang with zero
   matches" was false: the framework's docs say a wait for `detached` returns at once when
   nothing matches.* A reviewer's suggested fix can also name the wrong table, API or file;
   check it.
4. **Your own earlier notes are leads.** Re-check numbers, PR numbers and attributions before
   reusing them.

## Identifiers, flags and paths

5. **Trace every hard-coded identifier to its definition.** Record ids, flag names, env vars,
   table names, file paths: grep every local clone for where each is defined and where it is
   read. Note whether the definition is base data, demo/optional data, or conditional on
   another component.
6. **Check that every knob is actually plumbed.** An env var read by a script only matters if
   whatever launches the script passes it. *Example: a "set VERSION=x as a fallback" knob that
   the CI step never forwards.*
7. **Follow conditional paths.** Feature flags, `if/<plugin>` folders, optional installs, "only
   when X is active" gates, install order. Ask: in the environment that matters, does this
   branch actually run?

## Time and versions

8. **Refresh, then compare refs.** Local branches go stale; findings checked against them can
   be wrong. Fetch (or `git ls-remote` for read-only repos) and compare local and remote SHAs
   before trusting a local check.
9. **What landed on the base after the branch point?** `git log merge-base..origin/base` over
   the touched areas. A later commit can change the assumptions a branch was written under.
   *Example: a test stub written before a widget moved its data into server-side rendering,
   which the stub cannot intercept.*
10. **Are reference artifacts older than the code that uses them?** Compare the last-change
    date of snapshots, baselines, fixtures, golden files or schemas with the code that reads
    them. *Example: committed screenshot baselines older than the commit that changed what the
    test masks.*
11. **Merge and conflict claims need a check, not a guess.**
    `git merge-tree --write-tree base head` (exit 0 means clean). Overlapping edits to the
    same paragraph across two branches are a predictable conflict worth flagging.

## Behaviour and semantics

12. **Look up framework and library behaviour in official docs** before stating it: defaults,
    retries, timeouts, parallelism, lifecycle hooks, what happens on failure. Quote the line.
13. **Look for silent passes.** Waits that swallow timeouts, steps that exit 0 having done
    nothing, "first run creates the reference and passes", error branches that log and
    continue. Each is a place where green means nothing.
14. **Experiment instead of guessing.** On a throwaway copy (`git archive HEAD | tar -x -C
    /tmp/lab`, a scratch database, a test instance), change one thing and run the real check.
    For a test suite, a mutation table ("edit X → which tests go red?") finds gaps no reading
    will. *Example: adding an unregistered skill folder left a "registry" test green.* Label
    results "run" versus "read in the code".
15. **Read the guards.** Note what fails loudly (asserts, read-back checks, "refuse to start")
    as well as what fails silently. Readers need both.

## Your own artifact

16. **No invented specifics.** Search your draft and diagrams for numbers, durations, sizes,
    counts and percentages; each needs a ledger row. Replace an unknown with a qualitative
    phrase or remove it.
17. **Captions match pixels.** Open every image before describing it.
18. **Demos must demonstrate.** Interactive examples need deterministic inputs that show the
    effect, and must measure the quantity the lesson is about.
19. **Leave secrets out.** Credentials, tokens, `.env` contents and personal data never go into
    the deliverable, even when they sit in the files you read.

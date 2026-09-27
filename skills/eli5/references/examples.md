# ELI5 examples

These are illustrative inputs and responses, not claims about the current repository.

## Concept: database indexes

Request: "ELI5 database indexes."

> **In one sentence:** a database index is an extra lookup structure that helps the database find matching rows without inspecting every row.
>
> Think of a book's index: it points you to pages about a topic rather than making you read the entire book. A database index similarly stores searchable values with a way to reach matching rows; the database can still choose a full scan when that is cheaper.
>
> **The important catch:** the extra structure takes storage and must be maintained when data changes, so faster reads can mean slower writes. Unlike a printed book index, it changes along with the data.

No PR workflow or change-status section is needed.

## Change: exactly three sentences

Request: "ELI5 this PR in three sentences."

Evidence: at `retry-head`, the supplied diff and surrounding code add one retry after a timeout. A second timeout is still raised to the caller. The PR author reports 42 passing tests; no run evidence is available.

> Previously, a timed-out request failed immediately; now the system tries it once more.
> If that second attempt also times out, it still fails rather than retrying forever.
> The author reports 42 passing tests, but without test output for this revision I cannot verify that result.

Use the same final shape whether investigation came from `change-explainer` or direct inspection. An evidence map is intermediate input, not an additional user-facing answer.

## Unavailable repository

Request: "ELI5 how this PR fixes lost updates."

Available evidence: only the PR description, which says it adds version checks; the repository cannot be accessed.

> The PR says it will check whether a record changed after you read it before saving your edit.
> The idea is to reject an outdated edit rather than silently overwrite someone else's newer work.
> I cannot inspect the code or tests, so that is the proposed approach, not a confirmed description of the fix; the diff and relevant test output would let me check it.

# Change explainer example

This is an illustrative fixture. Its paths, revision labels, and results are supplied evidence, not references to files in the current repository.

## Input evidence

- Target: open PR #24 at `retry-head`, compared with `retry-base`.
- `PR description`: "Retry timeouts and rate-limit responses; all 42 tests pass."
- `src/client.py:8-14` at `retry-base`: `send()` runs once; errors propagate to the caller.
- `src/client.py:8-18` at `retry-head`: `send()` catches `TimeoutError` and calls `send_once()` one more time; that second call's errors propagate. `RateLimitError` is not caught.
- `tests/test_client.py:12-28` at `retry-head`: test source covers a successful retry and a second timeout. No run output or CI results are available.

## Response

> **TL;DR:** a timed-out request now gets one retry instead of failing immediately, but the promised rate-limit recovery is not implemented.
>
> ## What changed
>
> **Before → now:** the caller gets a second attempt after a timeout; a second failure still reaches the caller (`src/client.py:8-18` at `retry-head`, compared with `src/client.py:8-14` at `retry-base`).
>
> ## Intent vs reality
>
> - **Intended:** retry timeouts and rate-limit responses (`PR description`).
> - **Actually changed:** only `TimeoutError` is caught; `RateLimitError` still propagates (`src/client.py:8-18` at `retry-head`).
> - **Gap:** callers still fail immediately on a rate-limit response, so the implementation is narrower than the stated goal.
>
> ## Blast radius
>
> - **Affected:** callers that encounter a timeout now wait for another attempt.
> - **Unchanged:** successful first attempts and rate-limit failures follow the old path.
> - **Compatibility / action:** decide whether retrying is safe for operations that may have completed remotely before timing out; idempotency behavior is not supplied in this fixture.
>
> ## Verification
>
> - **Reported:** the author says all 42 tests pass (`PR description`).
> - **Not verified:** no execution output is available for `retry-head`. The test source covers successful recovery and a second timeout, but its presence does not prove those tests passed (`tests/test_client.py:12-28`).
>
> ## What remains
>
> Implement rate-limit recovery or narrow the stated scope, obtain run evidence for the current revision, and establish whether retries can duplicate side effects.

When called for investigation only, return the underlying evidence map to the caller instead of rendering this report.

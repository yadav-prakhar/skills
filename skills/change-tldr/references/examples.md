# Longer change TL;DR examples

Both examples come from one multi-PR credential-lifecycle chain spanning an API server and a companion browser extension. Use them when the TL;DR closes a chain, prepares a release, or reports a bug found during the work.

## Chain closer: verification found a real bug, and the human must act

> **#184 is done — [PR #190](https://github.com/acme/api-server/pull/190) is ready, and the whole #178 chain is implemented on both sides.**
>
> TL;DR: this last ticket did not build anything new. It checked that the extension and server really speak the same credential language and ran the whole flow end to end against the *actual* extension, not a mock. It found one real bug: when paired with an old extension, the server mistook "this endpoint does not exist" for "you are logged out", so it opened a browser tab and waited a full minute before failing. It now just says "please upgrade". Fixed, with a test that fails if the bug returns.
>
> **So the chain is done.** Before you ship: upgrade the **extension first**, then the server. They are one coordinated change, and the new server refuses to run against the old contract rather than half-working. Credentials are deliberately **not** carried over, so after upgrading you will click "Connect" once per instance.
>
> Two things the docs now say explicitly:
>
> - The pinned `_internal` tools are **not** part of the new system. They work as before, but they do not record success evidence, do not auto-recover a rejection, and `list_instances` continues to show them as "stored but never tried".
> - Startup `basic` / `token` / `oauth` logins are unchanged.
>
> Verified: build clean, 2,757 tests green, extension green apart from one pre-existing unrelated failure. No release was tagged or published—that call is yours, and the extension ships first.

## Removal: something is deleted, and the reader needs to know nothing else broke

> **extension#5 is done — [PR #9](https://github.com/acme/browser-extension/pull/9) is ready.** That was the final extension-side ticket, so the whole chain is now implemented on both sides.
>
> TL;DR: the extension used to keep a second, old-fashioned set of saved logins. At startup and whenever a pinned login changed, it quietly copied them into one combined "fixed-key" slot. That slot is now gone completely—deleted, not merely unused. Credentials reach the local server only when you click Connect or when the server opens a browser login, and each path saves one named instance under the current rules. Pinned logins still work as before for the extension's own features; they simply no longer leak into the shared store, and the stale "last refreshed" timestamps that existed only for the old slot are gone too.
>
> Nothing changes for the server: it already asked only for the all-instances report, one instance's secrets, and a way to record a result, all of which remain intact. The frozen contract file is byte-identical, so this is a one-sided upgrade. The old combined endpoint answers "gone" and never returns credentials. A login the instance rejects is recorded as a visible note instead of being deleted, so a refusal is never lost.
>
> Verification: the extension compiles and its full test suite is green apart from one pre-existing unrelated failure. New tests cover no startup sync, no storage listener, no timestamps, and no secrets leaking through the old endpoint. Only #184, cross-repository verification and release readiness, remains.

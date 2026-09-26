# Longer ELI5 examples

Both come from one multi-PR credential-lifecycle chain that spans an API server and a companion browser extension. Use them when the TL;DR closes a chain, prepares a release, or reports a bug found during the work.

## Chain closer: verification found a real bug, and the human must act

> **#184 is done — [PR #190](https://github.com/acme/api-server/pull/190) is ready, and the whole #178 chain is implemented on both sides.**
>
> ELI5: this last ticket didn't build anything new. It checked that the extension and this server really do speak the same credential language, and ran the whole thing end to end against the *actual* extension, not a mock. It found one real bug along the way: when paired with an old extension, the server mistook "this endpoint doesn't exist" for "you're logged out", so it opened a browser tab and waited a full minute before failing. It now just says "please upgrade". Fixed, with a test that fails if it's ever undone.
>
> **So the chain is done.** Before you ship: upgrade the **extension first**, then the server — they're one coordinated change, and the new server refuses to run against the old contract rather than half-working. Credentials are deliberately **not** carried over, so after upgrading you'll click "Connect" once per instance.
>
> Two things the docs now say out loud instead of leaving you to guess:
>
> - The pinned `_internal` tools are **not** part of the new system. They work exactly as before, but they don't record success evidence, don't auto-recover a 401, and `list_instances` will keep showing them as "stored but never tried" no matter how often you use them.
> - Startup `basic` / `token` / `oauth` logins are untouched.
>
> Verified: build clean, 2,757 tests green, extension green bar one pre-existing unrelated failure. No release was tagged or published — that call is yours, and the extension ships first.

## Removal: something is deleted, and the reader needs to know nothing else broke

> **extension#5 is done — [PR #9](https://github.com/acme/browser-extension/pull/9) is ready.** That was the last extension-side ticket, so the whole chain is now implemented on both sides.
>
> ELI5: the extension used to keep a second, old-fashioned set of saved logins. On every start-up, and every time one of your pinned logins changed, it would quietly copy them into one combined "fixed-key" slot. That slot is now gone completely — deleted, not just unused. Credentials reach the local server only when you click the Connect button or when the server itself opens a browser login, and each of those saves one named instance under the v2 rules. Your pinned logins still work exactly as before for the extension's own features; they just no longer leak into the shared store, and the stale "last refreshed" timestamps that only existed for the old slot are gone too.
>
> Nothing changes for the server: it already only ever asked for the all-instances report, one instance's secrets, and to record a result — all of which are untouched. The frozen contract file is byte-identical, so this is a one-sided upgrade. The old combined endpoint just answers "gone" (410) and never hands anything back, and a login the instance refuses is now recorded as a visible "rejected" note rather than being deleted, so a refusal is never lost.
>
> Verification: the extension compiles and its full test suite is green apart from one pre-existing unrelated failure; new tests cover no start-up sync, no storage listener, no timestamps, and no secrets leaking through the old endpoint. Only #184 (cross-repo verification + release readiness) is left.

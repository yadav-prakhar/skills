# Per-lens checklists

Load when running a full critique; skip for narrow asks.

## Evidence-gathering playbook
- Inventory first: `search_files` for structure, then read every non-generated source file end-to-end.
- Run it: happy path + the tool's worst advertised path (update/uninstall/reconfigure) + one deliberately broken input (malformed config, missing dep). Record exit codes.
- Grep for the classic smells: hardcoded credentials/URLs, `rm -rf`, `writeFileSync` without atomic rename, regex-parsing of structured formats (YAML/JSON), `process.exit(0)` after cancel, silent `catch {}`, flags parsed but never read.
- Check the meta-layer: tests present? CI? release process? duplicated implementations (other repos, scripts, fallbacks)? Version strings in N places = sync debt.
- Verify documentation claims against behavior — the goodbye message a tool prints is part of the product.

## Product lens
- Job-to-be-done: what outcome does the user buy? Does the tool verify the outcome or just its own output (configs written ≠ working)?
- Time-to-value: what stands between install and first success? Can the user self-diagnose the #1 failure mode?
- Lifetime verbs: install is one day; doctor/status/repair are every week. Are they present?
- Amnesia: does re-running collect what it already knows? Does it read back state it wrote?
- Strategy coherence: dual paths (brew + curl|bash, web + native) reconciled or both half-finished? Is the fallback structurally necessary or cargo cult (e.g. a bash script that requires Node anyway)?

## Architecture lens
- One behavior, one implementation. Duplicated logic across languages/repos/scripts = find the drift, then name the consolidation.
- Boundaries: per-client/per-format/per-target modules behind one interface vs edits in N places to add one thing.
- Destructive ordering: is anything deleted before its replacement is built and verified (rm-then-clone)? Swap pattern available?
- Generated/duplicated artifacts: heredocs, version strings, "keep in sync" comments — each is a future incident; should be build-injected or deleted.
- Structured formats hand-parsed (regex over YAML/JSON) — flag hard; use a real parser.

## Engineering lens
- Data-loss paths: unparseable-input fallbacks that overwrite user files; backups that accumulate unbounded; no repair path offered.
- Secrets: committed credentials, plaintext secrets in configs/backups/logs, file permissions on written secrets, rotation cost.
- Atomicity: direct overwrites of user-owned configs vs temp+rename.
- Input trust: user-supplied paths/values flowing into shell strings; `rm -rf` guards against empty/root.
- Composability: exit codes meaningful? flags honored (grep parsed-but-unused flags)? non-interactive mode? pipable?
- Tests: pure functions over JSON/configs are the cheapest to golden-file test — their absence is a choice.

## UX lens
- First screen sets expectations (what will happen, how long, what it touches) before spending the user's time.
- Detection presented as fact vs guess — show evidence (paths) so users can correct it.
- Silent modifications of explicit user choices = teaching users to distrust the tool. Either surface or don't do it.
- Defaults that steer: does the 'recommended' option carry a one-line consequence note proportional to blast radius?
- Dry-run shows a diff, not a summary note — else it's theater.
- Error paths preserve the evidence (stderr shown, not swallowed) — the user needs it for the bug report.
- Final screen = success criterion: tell the user how to verify it worked, not just 'restart'.
- Hidden decisions the user can't reach without hand-editing files: surface a 30-second advanced prompt.

## Consistency & operations lens
- Cross-implementation drift table: build one when 2+ implementations exist (columns = capabilities, rows = implementations); gaps become findings.
- Release engineering: manual sync ceremonies, byte-identity invariants, multi-repo mirrors — each is a finding and a deletion candidate.
- Upgrade/uninstall: does uninstall remove everything it created, including backups? Does update preserve local modifications or nuke them?
- Docs truth: run the printed commands; login-walled or dead URLs in output are critical findings.

---
name: hermes-config-troubleshooting
description: Diagnose and fix Hermes config YAML parsing errors.
---

# Hermes Config YAML Troubleshooting

## Symptom
Hermes fails to start or falls back to default config with error:
`Failed to parse /home/pybuntu/.hermes/config.yaml: while parsing a block mapping ... did not find expected key`

## Cause
Literal backslash-n (`\n`) sequences in the YAML file, often introduced when copying MCP server configurations from documentation or markdown that uses escaped newlines.

## Fix
Replace escaped newlines with actual newlines. YAML requires literal line breaks, not `\n` strings.

### Example: Incorrect Block (with `\n`)
```yaml
mcp_servers:\\n       pubmed:\\n         command: \"npx\"\\n         args: [\"-y\", \"@cyanheads/pubmed-mcp-server@latest\"]\\n         env:\\n           MCP_TRANSPORT_TYPE: \"stdio\"\\n           MCP_LOG_LEVEL: \"info\"\\n       cochrane:\\n         command: \"npx\"\\n         args: [\"-y\", \"cochrane-mcp@0.3.2\"]\\n         env:\\n           COCHRANE_CDP_ENDPOINT: \"http://127.0.0.1:9444\"\\
```

### Corrected Block
```yaml
mcp_servers:
  pubmed:
    command: "npx"
    args: ["-y", "@cyanheads/pubmed-mcp-server@latest"]
    env:
      MCP_TRANSPORT_TYPE: "stdio"
      MCP_LOG_LEVEL: "info"
  cochrane:
    command: "npx"
    args: ["-y", "cochrane-mcp@0.3.2"]
    env:
      COCHRANE_CDP_ENDPOINT: "http://127.0.0.1:9444"
```

## Validation
After editing, verify the YAML is valid:
```bash
python3 -c "import yaml; yaml.safe_load(open('/home/pybuntu/.hermes/config.yaml'))"
```
If no error, restart Hermes.

## Prevention
- Use `hermes config set` for configuration changes when possible.
- If manually editing, avoid copying blocks with `\n`; rewrite with proper indentation and line breaks.
- Validate YAML before restarting Hermes.

## Related Skills
- `hermes-agent`: For general Hermes Agent usage and configuration.
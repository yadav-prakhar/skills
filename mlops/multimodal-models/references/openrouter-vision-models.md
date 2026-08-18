# OpenRouter Vision Models Reference

## Popular Vision Models on OpenRouter

### Google Gemini Series
- `google/gemini-3.7-flash` - Latest flash model with strong vision
- `google/gemini-3.6-flash` - Previous generation, reliable vision
- `google/gemini-3-pro-vision` - Pro tier vision capabilities

### Anthropic Claude Series
- `anthropic/claude-sonnet-4` - Excellent vision and reasoning
- `anthropic/claude-opus-4` - Highest capability vision model
- `anthropic/claude-3.5-sonnet` - Strong vision, good balance

### OpenAI Series
- `openai/gpt-5.6-luna` - Latest GPT-5 with vision
- `openai/gpt-5.6-terra` - Alternative GPT-5 vision variant
- `openai/gpt-4o` - Established vision model (if available)

### xAI Grok Series
- `x-ai/grok-4` - Vision-enabled with strong reasoning
- `x-ai/grok-vision` - Dedicated vision variant (if available)

### Other Notable Models
- `minimax/m3` - MiniMax's multimodal model
- `qwen/qwen-vl-plus` - Alibaba's vision language model
- `moonshotai/kimi-vision` - Kimi's vision capabilities

## Model Selection Guidelines

### For General Vision Tasks
- **Best quality**: `anthropic/claude-sonnet-4` or `anthropic/claude-opus-4`
- **Best value**: `google/gemini-3.7-flash`
- **Fastest**: `google/gemini-3.6-flash` or `qwen/qwen-vl-plus`

### For OCR and Text Extraction
- **Best**: `anthropic/claude-sonnet-4` (excellent at reading text)
- **Good**: `google/gemini-3.7-flash` (strong OCR capabilities)
- **Alternative**: `openai/gpt-4o` (if available)

### For Complex Visual Reasoning
- **Best**: `anthropic/claude-opus-4` (complex chart/diagram understanding)
- **Strong**: `google/gemini-3.7-flash` (good at visual problem solving)
- **Alternative**: `x-ai/grok-4` (reasoning + vision combination)

## Cost Considerations (Approximate)
- **Lowest cost**: Google Gemini Flash models (~$0.10-$0.30 per 1M tokens)
- **Medium cost**: Anthropic Sonnet (~$3-$15 per 1M tokens)
- **Highest cost**: Anthropic Opus (~$15-$75 per 1M tokens)
- **OpenAI GPT-4o**: ~$5-$15 per 1M tokens (if available)

## Testing Model Availability
To check if a specific model is available on OpenRouter:
```bash
# You can test through Hermes or check OpenRouter directly
# Models may periodically change availability
```

## Provider-Specific Tips

### OpenRouter Advantages
- Single API key for 100+ models
- Automatic failover between providers
- Competitive pricing through marketplace
- No need to manage multiple API keys

### Configuration Best Practices
1. Always test with a small image/video first
2. Monitor usage in OpenRouter dashboard
3. Consider setting up fallback models
4. Use vision models only when needed (more expensive than text-only)

## Example Configurations

### High-Quality Vision Setup
```bash
hermes config set auxiliary.vision.model "anthropic/claude-sonnet-4"
hermes config set auxiliary.vision.provider "openrouter"
```

### Cost-Effective Vision Setup
```bash
hermes config set auxiliary.vision.model "google/gemini-3.7-flash"
hermes config set auxiliary.vision.provider "openrouter"
```

### Maximum Capability Setup
```bash
hermes config set auxiliary.vision.model "anthropic/claude-opus-4"
hermes config set auxiliary.vision.provider "openrouter"
```
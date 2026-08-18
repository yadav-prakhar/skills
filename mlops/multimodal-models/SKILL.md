---
name: multimodal-models
description: Configure and use vision and video models in Hermes Agent
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
---

# Multimodal Models Configuration

This skill covers configuring Hermes Agent to use vision (image analysis) and video models, particularly with OpenRouter provider.

## When to Use This Skill

Use this skill when you want to:
- Enable image understanding capabilities in Hermes
- Configure video analysis capabilities
- Set up multimodal models with OpenRouter or other providers
- Test and verify vision/video functionality

## Configuration Steps

### 1. Configure Vision Models

To enable image analysis:

```bash
# Set vision model (examples)
hermes config set auxiliary.vision.model "google/gemini-3.7-flash"
hermes config set auxiliary.vision.model "anthropic/claude-sonnet-4"
hermes config set auxiliary.vision.model "openai/gpt-5.6-luna"

# Ensure provider is set correctly
hermes config set auxiliary.vision.provider "openrouter"
```

### 2. Configure Video Models

For video analysis (uses same configuration as vision in current Hermes versions):

```bash
# Video analysis uses vision model configuration
# For video generation, configure separately:
hermes config set video_gen.model "bytedance/seedance-2.0-mini"
hermes config set video_gen.provider "openrouter"
```

### 3. Verify Configuration

Check that tools are available:
```bash
hermes doctor
# Look for ✓ under Tool Availability for: vision, video
```

## Usage Examples

### Image Analysis
```bash
# Analyze image content
hermes chat -q "What's in this image?" --image /path/to/photo.jpg

# Extract text from image (OCR)
hermes chat -q "Read all text in this image" --image screenshot.png

# Compare images
hermes chat -q "What's different between these images?" --image img1.jpg --image img2.jpg
```

### Video Analysis
```bash
# Describe video content
hermes chat -q "What happens in this video?" --video /path/to/video.mp4

# Ask specific questions
hermes chat -q "How many people are visible?" --video meeting.mp4

# Extract information
hermes chat -q "What brands or logos appear?" --video advertisement.mp4
```

### Combined Usage
```bash
# Relate image to video
hermes chat -q "How does this diagram relate to the video explanation?" --image diagram.mp4 --video explanation.mp4
```

## Provider-Specific Notes

### OpenRouter
- Access to 35+ vision-capable models through unified API
- Browse available models: https://openrouter.ai/collections/vision-models
- No additional setup needed beyond API key (already in ~/.hermes/.env)
- Model format: `provider/model-name` (e.g., `google/gemini-3.7-flash`)

### Common Vision Models on OpenRouter
- `google/gemini-3.7-flash` - Excellent vision, cost-effective
- `anthropic/claude-sonnet-4` - Top-tier image understanding
- `openai/gpt-5.6-luna` - Strong multimodal capabilities
- `x-ai/grok-4` - Vision-enabled with reasoning
- `minimax/m3` - Competitive vision performance

## Troubleshooting

### If vision/tools not showing in `hermes doctor`:
1. Verify model is set: `hermes config get auxiliary.vision`
2. Check OpenRouter API key: `hermes config get model.api_key` or check `~/.hermes/.env`
3. Run `hermes doctor` to verify API connectivity
4. Restart Hermes session after config changes: `/reset`

### Common Issues
- **"Model not found"**: Verify model name spelling and availability on OpenRouter
- **Authentication errors**: Check `OPENROUTER_API_KEY` in `~/.hermes/.env`
- **Slow response**: Vision models require more processing time than text-only

## Related Skills
- `hermes-agent`: Core Hermes configuration and usage
- `computer-use`: Desktop GUI control (can complement vision)
- `image-gen`: Image generation (sister capability to vision)
- `video-gen`: Video generation (sister capability to video analysis)

## References
- OpenRouter Vision Models: https://openrouter.ai/collections/vision-models
- Hermes Configuration Docs: https://hermes-agent.nousresearch.com/docs/user-guide/configuration
- Toolsets Reference: https://hermes-agent.nousresearch.com/docs/user-guide/configuration#toolsets
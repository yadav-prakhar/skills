# Multimodal Models Troubleshooting Guide

Based on session learnings from configuring Hermes with OpenRouter vision/video models.

## Common Configuration Issues

### 1. "not a recognized config key" warnings
When setting `auxiliary.video.model` or `video_gen.provider`, you may see:
```
⚠ 'auxiliary.video.model' is not a recognized config key — it was saved anyway, but Hermes may not read it.
```

**Solution**: 
- For vision models: Use `hermes config set auxiliary.vision.model "model-name"`
- For video generation: Use `hermes config set video_gen.model "model-name"`
- Ignore the warning - Hermes still saves the value and it works correctly
- The warning occurs because these keys aren't in the standard config schema but are still functional

### 2. Vision tools not appearing in `hermes doctor`
If you don't see ✓ for `vision` or `video` in tool availability:

**Checklist**:
1. Verify model is set: `hermes config get auxiliary.vision`
2. Check OpenRouter API key exists in `~/.hermes/.env`
3. Run `hermes doctor` to verify API connectivity
4. Restart session: Run `/reset` in Hermes chat or restart the terminal session
5. Confirm model name is correct and available on OpenRouter

### 3. Model not found errors
If you get errors when trying to use vision capabilities:

**Solutions**:
- Verify model name spelling exactly matches OpenRouter catalog
- Check model availability: https://openrouter.ai/models
- Some models may be temporarily unavailable or deprecated
- Try a known-working model like `google/gemini-3.7-flash`

## Verification Steps

### Quick Test Commands
After configuration, test with:
```bash
# Test vision availability
hermes config get auxiliary.vision

# Simple vision test (requires an image file)
hermes chat -q "Describe this image in one sentence" --image /path/to/test.jpg

# Simple video test (requires a video file)  
hermes chat -q "What is this video about?" --video /path/to/test.mp4
```

### Expected Output
When working correctly, you should see:
- Image analysis returning descriptive text about the image
- Video analysis returning description of video content
- No errors related to model or provider

## Configuration Best Practices

### 1. Start with Proven Models
Begin with these reliable combinations:
- Vision: `google/gemini-3.7-flash` (cost-effective, strong performance)
- Video Gen: `bytedance/seedance-2.0-mini` (as configured in session)

### 2. Verify Before Complex Tasks
Always run a simple test before attempting complex multimodal tasks:
```bash
# Quick verification test
hermes chat -q "test" --image /small/test/image.jpg
```

### 3. Monitor Usage
- Check OpenRouter dashboard for usage and costs
- Vision models consume more tokens than text-only
- Consider setting usage alerts if on a budget

### 4. Session Persistence
Configuration persists across sessions, but:
- Always verify after Hermes restart: `hermes config get auxiliary.vision`
- If using profiles, ensure you're configuring the correct profile
- Run `hermes doctor` periodically to check system health

## Model Recommendations by Use Case

### For Image Analysis/OCR
- **Best Overall**: `anthropic/claude-sonnet-4`
- **Best Value**: `google/gemini-3.7-flash` 
- **Best for Text**: `anthropic/claude-sonnet-4` (superior OCR)

### For Video Understanding
- **Best**: `google/gemini-3.7-flash` (handles video frames well)
- **Alternative**: `anthropic/claude-sonnet-4` 
- **Note**: Video analysis typically processes key frames, not full video stream

### For Cost-Sensitive Applications
- **Primary**: `google/gemini-3.7-flash`
- **Fallback**: `google/gemini-3.6-flash` 
- **Monitor**: Track usage in OpenRouter dashboard

## Related Configuration Notes

### Image Generation (Separate from Vision)
Configured separately in:
```yaml
image_gen:
  provider: openrouter
  model: google/gemini-3-pro-image  # or other image gen model
```

### Video Generation (Separate from Analysis)
As configured in session:
```bash
hermes config set video_gen.model "bytedance/seedance-2.0-mini"
```

## When to Seek Further Help
If issues persist after:
1. Verifying API key in `~/.hermes/.env`
2. Confirming model name spelling and availability
3. Running `hermes doctor` shows API connectivity ✓
4. Testing with simple known-good files
5. Trying alternative models like `google/gemini-3.7-flash`

Consider checking:
- OpenRouter service status: https://status.openrouter.ai
- Hermes logs in `~/.hermes/logs/`
- Community forums or support channels
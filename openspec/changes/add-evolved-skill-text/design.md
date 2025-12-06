# Design: Evolved Skill Text Support

## Context
The Genshin Impact game data has introduced a new field `IACNAENANDH` that contains TextMapHash values for evolved versions of character skill descriptions. This field only has meaningful values for certain characters who have skill evolution mechanics. The system needs to support both the original descriptions and the evolved descriptions, with proper fallback logic.

## Goals / Non-Goals
- Goals:
  - Support evolved skill descriptions when available
  - Maintain backward compatibility with existing data
  - Provide seamless fallback to original descriptions when evolved text is not available
  - Ensure consistent processing across all supported languages
- Non-Goals:
  - Modifying the existing skill description display logic beyond adding fallback support
  - Changing the TextMapHash lookup mechanism
  - Altering skill parameter processing

## Decisions
- Decision: Add `SpecialDesc map[string]string` field to `AVATARSKILLINFO` structure
  - Rationale: Keeps the evolved text separate from original text, allows for future extensions
  - Follows the existing pattern of multilingual text fields in the codebase

- Decision: Frontend will check for `SpecialDesc` existence first, fallback to `Desc`
  - Rationale: Non-breaking change, maintains current behavior for characters without evolved text
  - Simple implementation with minimal code changes

- Decision: Add `IACNAENANDH uint64` field to `GenshinAvatarSkillData`
  - Rationale: To properly parse the field from raw game data
  - Aligns with the existing TextMapHash field pattern

## Risks / Trade-offs
- Risk: The `IACNAENANDH` field might not exist in older game data versions
  - Mitigation: Use default to 0, check for existence before processing
- Risk: Some characters might have TextMapHash values in `IACNAENANDH` that don't resolve to actual text
  - Mitigation: Always populate SpecialDesc field with empty strings when TextMapHash is invalid or unresolved
- Trade-off: Additional memory usage for storing both original and evolved descriptions
  - Justification: Memory impact is minimal compared to simplified frontend logic

## Migration Plan
1. Update data structures to include new fields
2. Modify data processing to populate `SpecialDesc` when valid
3. Update frontend components to use `SpecialDesc` when available
4. Test with characters that have and don't have evolved skills
5. Deploy with feature flag or gradual rollout if needed

Rollback: Remove `SpecialDesc` references and revert to original `Desc` only logic

## Open Questions
- Should we check for TextMapHash validity during data processing or at display time?
- Should there be any UI indicator showing that a skill has evolved text?
- Are there specific conditions when evolved text should be displayed vs original text?
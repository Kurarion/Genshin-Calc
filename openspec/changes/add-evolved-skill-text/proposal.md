# Change: Add Evolved Skill Text Support

## Why
The game data now includes a new field `IACNAENANDH` that contains TextMapHash for evolved/special versions of character skill descriptions. Currently, the frontend only displays the original skill descriptions, missing the evolved text when available.

## What Changes
- Add `SpecialDesc` field to `AVATARSKILLINFO` structure in `genshindata/datatype.go`
- Update skill processing logic in `genshindata/clac.go` to populate the `SpecialDesc` field when `IACNAENANDH` has a meaningful value
- Modify frontend components to display `SpecialDesc` when available, fallback to `Desc` otherwise
- Extend text processing functions to handle the new field consistently across languages

## Impact
- Affected specs: [genshin-data](specs/genshin-data/spec.md)
- Affected code:
  - `genshindata/datatype.go` - Add new field to AVATARSKILLINFO
  - `genshindata/genshintype.go` - Add IACNAENANDH field to GenshinAvatarSkillData if needed
  - `genshindata/clac.go` - Update skill processing logic
  - Frontend components displaying skill descriptions (talent.component.html and related)
- Breaking changes: None (backward compatible fallback)
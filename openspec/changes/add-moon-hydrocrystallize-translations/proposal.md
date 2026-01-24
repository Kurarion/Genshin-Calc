# Proposal: Add Moon Hydrocrystallize Translations

## Summary

Add corresponding translations for newly added "月結晶" (Moon Hydrocrystallize) related i18n keys to Traditional Chinese (cn_tra), Japanese (jp), and English (en) language files, following the existing translation patterns in the codebase.

## Background

The user has added new translation keys to `cn_sim.json` (Simplified Chinese) for Moon Hydrocrystallize (月結晶) game mechanics. These translations are currently staged in git. The corresponding entries need to be added to the other three language files to maintain i18n consistency.

## Affected Files

- `src/assets/i18n/cn_sim.json` - Already modified (staged changes)
- `src/assets/i18n/cn_tra.json` - Needs additions
- `src/assets/i18n/jp.json` - Needs additions
- `src/assets/i18n/en.json` - Needs additions

## New Keys to Add

Based on the staged changes in `cn_sim.json`, the following keys need translations:

### PROPS Section (damage multipliers and bonuses)
1. `DMG_RATE_MULTI_MOON_HYDROCRYSTALLIZE`
2. `DMG_CRIT_RATE_UP_ELEMENT_MOON`
3. `DMG_CRIT_DMG_UP_ELEMENT_MOON`
4. `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_UP`
5. `DMG_ELEMENT_MOON_ELECTROCHARGED_EXTRA_VAL_UP`
6. `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_EXTRA_VAL_UP`
7. `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_PROMOTION`
8. `DMG_ELEMENT_MOON_PROMOTION`

### GENSHIN.DMG Section (damage display labels)
9. `ORIGIN_MOON_HYDROCRYSTALLIZE_DIRECTLY`
10. `CRIT_MOON_HYDROCRYSTALLIZE_DIRECTLY`
11. `EXPECT_MOON_HYDROCRYSTALLIZE_DIRECTLY`
12. `ORIGIN_MOON_HYDROCRYSTALLIZE_REACTIONAL`
13. `CRIT_MOON_HYDROCRYSTALLIZE_REACTIONAL`
14. `EXPECT_MOON_HYDROCRYSTALLIZE_REACTIONAL`

### GENSHIN.PROCESS Section (damage calculation steps)
15. `DMG_MOON_HYDRO_CRYSTALLIZE_DIRECTLY_BASE`
16. `DMG_MOON_HYDRO_CRYSTALLIZE_REACTIONAL_ORIGIN_1` through `_4`
17. `DMG_MOON_HYDRO_CRYSTALLIZE_REACTIONAL_CRIT_1` through `_4`
18. `DMG_MOON_HYDRO_CRYSTALLIZE_REACTIONAL_EXPECT`
19. `DMG_MOON_HYDRO_CRYSTALLIZE_RATE`
20. `DMG_MOON_HYDROCRYSTALLIZE_PROMOTION`

## Translation Strategy

Translations will follow existing patterns for similar Moon reaction entries (e.g., `MOON_ELECTROCHARGED`, `MOON_RUPTURE`):

| Key Pattern | cn_sim (reference) | cn_tra | jp | en |
|------------|-------------------|---------|-----|-----|
| MOON | 月曜 | 月曜 | 月反応 | Lunar |
| HYDROCRYSTALLIZE | 結晶 | 結晶 | 結晶 | Crystallize |
| 直接 | 直接 | 直接 | 直接 | Direct |
| 反应 | 反應 | 反應 | 反応 | Reactional |
| 伤害 | 傷害 | 傷害 | ダメージ | DMG |
| 期望 | 期望 | 期望 | 期待値 | Expected |
| 暴击 | 暴擊 | 暴擊 | 会心 | CRIT |
| 非暴击 | 非暴擊 | 非暴擊 | 通常 | Non-CRIT |
| 元素增幅 | 元素增幅 | 元素增幅 | 元素増幅 | Element Amplification |
| 元素擢升 | 元素擢升 | 元素擢升 | 元素向上 | Element Elevate |
| 元素提升值 | 元素提升值 | 元素提升值 | 元素上昇値 | Element Increase |
| 乘区 | 乘區 | 乘區 | 乗算エリア | Multiplier/Section |
| [成员X] | [成員X] | [成員X] | [メンバーX] | [Member X] |

## Implementation Notes

1. Keys will be inserted at the same relative positions as in `cn_sim.json`
2. JSON structure and formatting will match the existing files
3. No code changes are required - only i18n JSON files

## Success Criteria

- All 14 new keys added to each of the 3 language files
- JSON files remain valid (syntactically correct)
- Keys match exactly between all 4 language files
- Translations follow existing patterns for similar entries

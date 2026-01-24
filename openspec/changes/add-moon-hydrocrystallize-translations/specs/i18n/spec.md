# Spec: I18n - Moon Hydrocrystallize Translations

## ADDED Requirements

### Requirement: Add Moon Hydrocrystallize translations to all language files

The i18n system must include translations for Moon Hydrocrystallize (月結晶) related game mechanics in all supported languages (Simplified Chinese, Traditional Chinese, Japanese, English).

#### Scenario: User views damage calculator with Moon Hydrocrystallize effects

**Given** the user has selected a character/weapon setup that triggers Moon Hydrocrystallize reactions
**When** the damage calculator displays damage breakdowns
**Then** all Moon Hydrocrystallize related labels and calculations are displayed in the user's selected language

**Acceptance Criteria:**
- All 14 new translation keys exist in each of the 4 language files
- Keys match exactly between files (no typos or missing keys)
- JSON files are syntactically valid
- Translations follow existing patterns for similar Moon reaction entries

#### Scenario: Traditional Chinese users see consistent terminology

**Given** a Traditional Chinese user is using the application
**When** Moon Hydrocrystallize related UI elements are displayed
**Then** terminology is consistent with other Moon reaction translations (e.g., 暴擊, 傷害, 擢升)

**Acceptance Criteria:**
- Uses Traditional Chinese characters (e.g., 傷害 vs 伤害)
- Matches the translation style of existing entries like `DMG_RATE_MULTI_MOON_ELECTROCHARGED`

#### Scenario: Japanese users see consistent terminology

**Given** a Japanese user is using the application
**When** Moon Hydrocrystallize related UI elements are displayed
**Then** terminology follows Genshin Impact JP localization conventions

**Acceptance Criteria:**
- Uses "月反応" for "Moon" (as seen in `DMG_ELEMENT_MOON_ALL_UP`)
- Uses "会心" for CRIT, "通常" for Non-CRIT
- Uses "乗算エリア" for multiplier sections

#### Scenario: English users see consistent terminology

**Given** an English user is using the application
**When** Moon Hydrocrystallize related UI elements are displayed
**Then** terminology follows Genshin Impact EN localization conventions

**Acceptance Criteria:**
- Uses "Lunar" for "月" prefix
- Uses "Crystallize" for "結晶"
- Uses "CRIT" for critical hits, "Non-CRIT" for non-critical
- Uses "Element Amplification", "Element Elevate", "Element Increase" for element bonuses

---

## Cross-References

- Related specs: N/A (new translations only)
- Depends on: Existing i18n infrastructure

## Implementation Notes

Translations are derived from existing patterns in the codebase. The table below shows the mapping:

| cn_sim (new) | cn_tra | jp | en |
|--------------|--------|-----|-----|
| 月結晶伤害倍率乘算加成 | 月結晶傷害倍率乘算加成 | 月結晶ダメージ倍率乗算ボーナス | Lunar Crystallize DMG Multiplier Bonus |
| 月曜伤害暴击率增加值 | 月曜傷害暴擊率增加值 | 月反応ダメージ会心率アップ値 | Lunar DMG CRIT Rate Increase |
| 月曜伤害暴击伤害增加值 | 月曜傷害暴擊傷害增加值 | 月反応ダメージ会心ダメージアップ値 | Lunar DMG CRIT DMG Increase |
| 元素增幅(月結晶) | 元素增幅(月結晶) | 元素増幅(月結晶) | Element Amplification (Lunar Crystallize) |
| 元素提升值(月感电) | 元素提升值(月感電) | 元素上昇値(月感電) | Element Increase (Lunar Electro-Charged) |
| 元素提升值(月結晶) | 元素提升值(月結晶) | 元素上昇値(月結晶) | Element Increase (Lunar Crystallize) |
| 元素擢升(月結晶) | 元素擢升(月結晶) | 元素向上(月結晶) | Element Elevate (Lunar Crystallize) |
| 元素擢升(月曜) | 元素擢升(月曜) | 元素向上(月反応) | Element Elevate (Lunar Reaction) |
| 非暴击月結晶伤害(直接) | 非暴擊月結晶傷害(直接) | 通常月結晶ダメージ(直接) | Non-CRIT Lunar Crystallize DMG (Direct) |
| 暴击月結晶伤害(直接) | 暴擊月結晶傷害(直接) | 会心月結晶ダメージ(直接) | CRIT Lunar Crystallize DMG (Direct) |
| 期望月結晶伤害(直接) | 期望月結晶傷害(直接) | 期待値月結晶ダメージ(直接) | Expected Lunar Crystallize DMG (Direct) |
| 非暴击月結晶伤害(反应) | 非暴擊月結晶傷害(反應) | 通常月結晶ダメージ(反応) | Non-CRIT Lunar Crystallize DMG (Reactional) |
| 暴击月結晶伤害(反应) | 暴擊月結晶傷害(反應) | 会心月結晶ダメージ(反応) | CRIT Lunar Crystallize DMG (Reactional) |
| 期望月結晶伤害(反应) | 期望月結晶傷害(反應) | 期待値月結晶ダメージ(反応) | Expected Lunar Crystallize DMG (Reactional) |
| 直伤月結晶基础乘区 | 直傷月結晶基礎乘區 | 直接月結晶基礎乗算エリア | Direct Lunar Crystallize Base Multiplier |
| [成员1]反应月結晶 | [成員1]反應月結晶 | [メンバー1]反応月結晶 | [Member 1] Reactional Lunar Crystallize |
| [成员2]反应月結晶 | [成員2]反應月結晶 | [メンバー2]反応月結晶 | [Member 2] Reactional Lunar Crystallize |
| [成员3]反应月結晶 | [成員3]反應月結晶 | [メンバー3]反応月結晶 | [Member 3] Reactional Lunar Crystallize |
| [成员4]反应月結晶 | [成員4]反應月結晶 | [メンバー4]反応月結晶 | [Member 4] Reactional Lunar Crystallize |
| 期望月結晶 | 期望月結晶 | 期待値月結晶 | Expected Lunar Crystallize |
| 月結晶増幅乘区 | 月結晶増幅乘區 | 月結晶増幅乗算エリア | Lunar Crystallize Amplification Multiplier |
| 月結晶擢升区 | 月結晶擢升區 | 月結晶向上エリア | Lunar Crystallize Elevate Section |

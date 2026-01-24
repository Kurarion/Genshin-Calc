# Tasks: Add Moon Hydrocrystallize Translations

## Task List

### 1. Add translations to cn_tra.json (Traditional Chinese)
- Add `DMG_RATE_MULTI_MOON_HYDROCRYSTALLIZE`: "月結晶傷害倍率乘算加成"
- Add `DMG_CRIT_RATE_UP_ELEMENT_MOON`: "月曜傷害暴擊率增加值"
- Add `DMG_CRIT_DMG_UP_ELEMENT_MOON`: "月曜傷害暴擊傷害增加值"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_UP`: "元素增幅(月結晶)"
- Add `DMG_ELEMENT_MOON_ELECTROCHARGED_EXTRA_VAL_UP`: "元素提升值(月感電)"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_EXTRA_VAL_UP`: "元素提升值(月結晶)"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_PROMOTION`: "元素擢升(月結晶)"
- Add `DMG_ELEMENT_MOON_PROMOTION`: "元素擢升(月曜)"
- Add 6 GENSHIN.DMG entries (ORIGIN/CRIT/EXPECT for DIRECTLY/REACTIONAL)
- Add 11 GENSHIN.PROCESS entries (DMG_MOON_HYDRO_CRYSTALLIZE_*)

### 2. Add translations to jp.json (Japanese)
- Add `DMG_RATE_MULTI_MOON_HYDROCRYSTALLIZE`: "月結晶ダメージ倍率乗算ボーナス"
- Add `DMG_CRIT_RATE_UP_ELEMENT_MOON`: "月反応ダメージ会心率アップ値"
- Add `DMG_CRIT_DMG_UP_ELEMENT_MOON`: "月反応ダメージ会心ダメージアップ値"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_UP`: "元素増幅(月結晶)"
- Add `DMG_ELEMENT_MOON_ELECTROCHARGED_EXTRA_VAL_UP`: "元素上昇値(月感電)"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_EXTRA_VAL_UP`: "元素上昇値(月結晶)"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_PROMOTION`: "元素向上(月結晶)"
- Add `DMG_ELEMENT_MOON_PROMOTION`: "元素向上(月反応)"
- Add 6 GENSHIN.DMG entries (ORIGIN/CRIT/EXPECT for DIRECTLY/REACTIONAL)
- Add 11 GENSHIN.PROCESS entries (DMG_MOON_HYDRO_CRYSTALLIZE_*)

### 3. Add translations to en.json (English)
- Add `DMG_RATE_MULTI_MOON_HYDROCRYSTALLIZE`: "Lunar Crystallize DMG Multiplier Bonus"
- Add `DMG_CRIT_RATE_UP_ELEMENT_MOON`: "Lunar DMG CRIT Rate Increase"
- Add `DMG_CRIT_DMG_UP_ELEMENT_MOON`: "Lunar DMG CRIT DMG Increase"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_UP`: "Element Amplification (Lunar Crystallize)"
- Add `DMG_ELEMENT_MOON_ELECTROCHARGED_EXTRA_VAL_UP`: "Element Increase (Lunar Electro-Charged)"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_EXTRA_VAL_UP`: "Element Increase (Lunar Crystallize)"
- Add `DMG_ELEMENT_MOON_HYDROCRYSTALLIZE_PROMOTION`: "Element Elevate (Lunar Crystallize)"
- Add `DMG_ELEMENT_MOON_PROMOTION`: "Element Elevate (Lunar Reaction)"
- Add 6 GENSHIN.DMG entries (ORIGIN/CRIT/EXPECT for DIRECTLY/REACTIONAL)
- Add 11 GENSHIN.PROCESS entries (DMG_MOON_HYDRO_CRYSTALLIZE_*)

### 4. Validate all JSON files
- Verify JSON syntax is valid
- Ensure all keys exist in all 4 language files
- Check formatting consistency

## Dependencies

None - all tasks can be performed in parallel, but must be completed before validation.

## Validation

- JSON lint validation passes for all modified files
- Key count matches between all language files

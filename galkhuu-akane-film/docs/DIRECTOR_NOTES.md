# Director's notes

## The feeling
*The viewer smiles first and feels something beautiful by the end.* Everything is warm daylight on
ivory paper: champagne light, thin gold line work, a whisper of rose. The photographs are the stars.
Decoration lives in negative space or behind prints, never across a face.

## Visual language (one system, two films)
- **Paper and light.** Ivory gradients, slow-drifting light blooms, a fine procedural paper grain. No glitter, no lens flares, no particle bursts.
- **Original line art.** A hand-built cherry-blossom branch (stem, twigs, notched five-petal blossoms, buds, leaves) draws itself in with the stroke and sways about 1°. A few petals fall slowly inside clipped regions that never cross the photos.
- **Type.** Cormorant Garamond Light for emotion (names, lines, italics), Inter Medium small caps for facts (WEDDING CELEBRATION). Names use a gold italic ampersand. Text drifts up 14 px while fading in and never bounces word by word. Minimum sizes are chosen for a phone-sized Zoom tile.
- **Layouts rotate deliberately.** Portrait editorial (large print plus negative space, with an offset gold keyline), split pair, full bleed, inset print, whole portrait on its own blurred copy, editorial collage, the arched welcome window and the end card. Two consecutive shots never share a layout and transition.
- **Camera.** Photographic Ken Burns only: scale 1.00–1.07, origin at the photo's focal point, translation clamped inside the overscan, so no edge ever shows and faces are never distorted.
- **Transitions.** Dissolves of 0.67–1.2 s with varied lengths, a warm *bloom* dissolve, a *veil* (soft vertical rise), feathered directional wipes and a parallax *drift*. There are two deliberate **clean cuts**: Galkhuu → Akane, and into the reaction edit.

## Opening film arc (80 s)
1. **Anticipation (0–7 s).** The film opens on bright daylight, never black, which settles into ivory as the branches draw in. One quiet line.
2. **Two portraits (7–18 s).** Galkhuu sits on the right looking into open space, then a clean cut to Akane mirrored on the left. The two photos *face each other across the cut*. A split frame then brings them side by side, the panels drifting toward each other.
3. **Together (18–31 s).** The first couple portrait is held for 8 s, long enough to feel real, beside "Two people. / One beautiful beginning." Then close smiles.
4. **Gentle humour (31–44 s).** "A little laughter." Then the **portrait-to-portrait reaction edit**: he looks (1.3 s), she lands laughing on a soft 0.3 s rise, the frames lean in by 6 px, and he answers with a laugh. The humour is timing between real photos. There are no jokes on screen and no invented story. If the photos don't support it, simply use calm portraits there and the edit still reads as a warm exchange. "A lot of love."
5. **Breathing details (44–59 s).** No text: hands → details collage → wide walk → a glance that blooms from warm monochrome into natural colour.
6. **Payoff (59–71 s).** The strongest photo of the two of them, full frame with the slowest and deepest push and minimal decoration, then "The best moments are the real ones."
7. **Title (71–80 s).** The hero photo recedes to the right into ivory and the names settle. Everything is still from 01:13.5. It ends on the card, which is the operator's cue.

## Guest loop (4:00)
The loop is built as a calm gallery with arcs, not a one-minute clip repeated. It runs welcome →
individual portraits → together → candid joy → details → deep warm hero → thank-you → welcome again.

**The seam.** The welcome shot is a single scene with its own clock, split across the file
boundary. The last 10 s of the file are the *beginning* of that scene (the arch rising and the names
settling), and frame 0 is its continuation. Looping the file therefore shows one continuous moment
instead of a reset. All ambient motion in that scene runs on the same clock.

## Humour and taste guardrails
- Humour comes only from the photographs. Nothing claims who said or did what.
- No AI faces or stock people stand in for the couple. Placeholders are abstract and clearly labelled.
- There are no religious graphics or logos. The atmosphere is warm and elegant, suitable for a Jehovah's Witness wedding without being a presentation.
- Ring imagery is disabled until a real ring photo exists.

## When real photos arrive: directing checklist
- `COUPLE_HERO_01` should be the photo that makes people go quiet. It closes the opening film and anchors the loop's hero section.
- `COUPLE_HERO_02` works best **vertical**. It sits in the welcome arch shown to every arriving guest.
- For the reaction edit, choose `GALKHUU_PORTRAIT_02` with a neutral or looking-off expression, `AKANE_PORTRAIT_02` mid-laugh, and `GALKHUU_CANDID_01` laughing back.
- Set focal points for anything with faces off-centre.
- Once the authorised music is known, nudge shot durations so 00:07 (portraits), 00:59 (hero) and 01:11 (title) land on phrase starts. See `assets/music-cues.json`.

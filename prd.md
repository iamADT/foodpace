App name: Food pace

# Product Requirements Document: Meal Pacing App

## 1. Product summary

This app helps people slow down while eating by setting a simple meal countdown and showing gentle prompts during the session.

The app is intentionally lightweight. It is not a calorie tracker, diet app, food diary, or behaviour correction tool. Its purpose is to help users pace their meals, notice fullness, and create a calmer eating experience.

## 2. Product goal

Help users make their meals last closer to their chosen duration through a simple, calm, and low-pressure timer experience.

## 3. Target user

The target user is someone who:

* Eats quickly and wants to slow down.
* Wants to be more mindful while eating.
* Does not want to track calories or log food.
* Wants a simple tool they can start quickly before a meal.
* May use the app during lunch, dinner, or any eating occasion.

## 4. Core user problem

Many people eat quickly without noticing. Existing food apps often focus on calories, macros, weight loss, or logging. There is a gap for a simple app that helps users pace the act of eating itself.

## 5. Product positioning

A simple meal pacing app that helps you slow down, pause, and notice fullness.

Possible positioning line:

> A calm timer for eating more slowly.

## 6. MVP scope

The MVP should include:

1. Duration selection.
2. Active meal countdown.
3. Ability to switch between time remaining and time elapsed.
4. Gentle eating prompts during the session.
5. Pause and end session controls.
6. Completion screen with fullness reflection.
7. Simple visual identity using Palette 2.

The MVP should not include:

* Calorie tracking.
* Food logging.
* Weight tracking.
* Meal type selection.
* Social sharing.
* Streaks.
* Complex analytics.
* AI-generated coaching.
* Diet advice.

## 7. Key product principles

### 7.1 Keep it simple

The app should feel like a single-purpose tool. The user should be able to start a session in a few seconds.

### 7.2 Stay gentle

The app should avoid commands, judgement, or pressure. Prompts should sound like suggestions, not instructions.

Preferred tone:

* “You might…”
* “It could help to…”
* “Remember, you can…”
* “When you’re ready…”
* “Maybe take a moment to…”

Avoid:

* “Stop…”
* “You should…”
* “Don’t…”
* “You need to…”
* “Slow down now.”

### 7.3 Avoid urgency

The timer should not feel like a deadline. Reaching zero should feel like completing a calm session, not triggering an alarm.

### 7.4 Do not make eating feel monitored

The app should support the user without making them feel watched, judged, or corrected.

## 8. Core user flow

### 8.1 Start screen

The user opens the app and sees duration options.

Suggested durations:

* 10 minutes
* 15 minutes
* 20 minutes
* 25 minutes
* 30 minutes
* Custom

The user selects a duration and taps Start.

### 8.2 Active session screen

The active session shows:

* One large time value.
* A small label showing whether the value is “remaining” or “elapsed”.
* A soft circular progress indicator.
* One gentle prompt at a time.
* Pause and End controls.

The app should show only one time mode at once:

* Default: time remaining.
* Optional toggle: tap the time or label to switch to elapsed time.

Example:

> 14:32
> remaining

Or:

> 05:28
> elapsed

### 8.3 Prompt behaviour

Prompts appear gently during the session.

Rules:

* Show one prompt at a time.
* Prompts should be short and easy to read at a glance.
* Prompts should not require the user to interact.
* Prompts should avoid sounding like commands.
* Prompts should not be framed around weight loss, dieting, or restriction.
* Prompt timing should depend on session length.

Suggested timing:

* 10-minute session: 2 to 3 prompts.
* 15-minute session: 3 to 4 prompts.
* 20-minute session: 4 to 5 prompts.
* 30-minute session: 5 to 6 prompts.

### 8.4 Pause state

If the user taps Pause:

* The timer pauses.
* The progress indicator pauses.
* The main button changes to Resume.
* The user can still end the session.

### 8.5 Early end

If the user taps End before the countdown finishes, the app should not imply failure.

Suggested copy:

> Finished eating?

Options:

* Reflect now
* Continue timer
* End session

### 8.6 Completion screen

When the countdown reaches zero, show:

> Meal complete

Then ask:

> How full do you feel?

Options:

* Still hungry
* Comfortable
* Full
* Overfull

The user can select an option or skip.

## 9. Prompt content

The prompts should feel like soft reminders, not instructions.

Initial prompt set:

1. Remember, you can put your cutlery down whilst you chew.
2. It could help to take a breath before your next bite.
3. Maybe take a moment to notice how hungry you feel now.
4. You might try slowing the next few bites slightly.
5. Remember, you do not need to rush to finish.
6. It may help to notice the texture and flavour of this bite.
7. Maybe take a small pause and check in with your fullness.
8. You can take a sip of water if that feels right.
9. It might be nice to give yourself a quiet moment before the next bite.
10. Remember, eating slowly is allowed to feel a little unfamiliar at first.
11. You might notice whether you are still hungry or just continuing.
12. Maybe let this meal take the time you chose for it.

## 10. UI requirements

### 10.1 Visual direction

The UI should feel:

* Calm
* Simple
* Warm
* Fresh
* Light
* Non-clinical
* Non-diet focused

The app should not feel like:

* A stopwatch.
* A productivity timer.
* A weight loss app.
* A habit tracker.
* A medical tool.

### 10.2 Colour palette

Use Palette 2 as the foundation.

Core colours:

* Background oat: `#F7F1E7`
* Mint accent: `#A9D8C2`
* Soft sky: `#A8CFE8`
* Clay action colour: `#C9876A`
* Deep olive text: `#26382D`

Main background gradient:

> `#F7F1E7` to `#EAF5EF` to `#A9D8C2`

Progress ring gradient:

> `#A9D8C2` to `#A8CFE8`

Primary action colour:

> `#C9876A`

### 10.3 Typography

The time display should be large, calm, and highly readable.

Requirements:

* Large timer text.
* Small but clear mode label.
* Prompt text should be readable from a table distance.
* Avoid overly technical or digital-clock style typography.

### 10.4 Active screen layout

The active screen should include:

* Large central time display.
* Small label under the time: “remaining” or “elapsed”.
* Soft circular progress ring.
* Prompt card below the timer.
* Pause and End controls.

The active screen should not include:

* Meal type.
* Calories.
* Food input.
* Charts.
* Streaks.
* Multiple timers.
* Multiple prompts at once.

## 11. Functional requirements

### 11.1 Duration selection

The user can select a preset duration or custom duration.

Acceptance criteria:

* User can choose 10, 15, 20, 25, or 30 minutes.
* User can enter a custom duration.
* User can start a timer after choosing a duration.
* The app remembers the most recently used duration.

### 11.2 Countdown session

The app runs a countdown from the chosen duration.

Acceptance criteria:

* Countdown starts immediately after the user taps Start.
* Timer updates continuously.
* Default display is time remaining.
* User can toggle to elapsed time.
* Only one time value is visible at once.

### 11.3 Progress indicator

The app shows a visual progress indicator.

Acceptance criteria:

* Progress is visible but subtle.
* Progress direction matches the selected time mode.
* If showing remaining, the ring empties over time.
* If showing elapsed, the ring fills over time.
* The progress indicator uses the approved gradient.

### 11.4 Prompts

The app shows gentle prompts during the active session.

Acceptance criteria:

* Prompts appear automatically.
* Only one prompt appears at a time.
* Prompts use soft, suggestive language.
* Prompts can be dismissed or allowed to fade.
* Prompts do not pause the timer.
* Prompts do not use judgemental or diet-related language.

### 11.5 Pause and resume

The user can pause and resume the session.

Acceptance criteria:

* User can pause the timer.
* User can resume the timer.
* Timer state is clearly shown.
* Prompt timing pauses when the session is paused.

### 11.6 End session

The user can end a session early.

Acceptance criteria:

* User can end the session before the countdown reaches zero.
* The app asks whether they want to reflect, continue, or end.
* Ending early is not framed negatively.

### 11.7 Completion reflection

The app shows a simple fullness reflection at the end.

Acceptance criteria:

* User sees “Meal complete”.
* User can select a fullness state.
* User can skip the reflection.
* Completion screen remains simple.

## 12. Non-functional requirements

### 12.1 Accessibility

The app should be usable while eating.

Requirements:

* Large tap targets.
* High text contrast.
* No reliance on colour alone.
* Reduced motion support.
* Readable timer from a short distance.
* Works in both light and dark environments.

### 12.2 Performance

The timer should feel reliable.

Requirements:

* Timer should continue accurately if the screen locks.
* Timer should restore correctly if the app is backgrounded.
* Timer state should not be lost if the user briefly leaves the app.

### 12.3 Notifications

For MVP, notifications should be minimal.

Requirements:

* No aggressive alerts.
* No default sound alarm at completion.
* Optional gentle haptic or sound can be considered, but should be off or subtle by default.

## 13. Success metrics

MVP success can be measured by:

* Number of sessions started.
* Percentage of sessions completed.
* Percentage of users who use the app more than once.
* Average chosen session duration.
* Percentage of users who complete fullness reflection.
* Percentage of users who end sessions early.
* Repeat usage over 7 days.

Qualitative success:

* Users say the app feels calm.
* Users say the prompts feel supportive rather than bossy.
* Users say the app helps them notice their pace.
* Users do not feel judged or pressured.

## 14. Edge cases

### 14.1 User finishes early

The app should offer reflection without judgement.

### 14.2 User pauses and forgets

The app should preserve paused state and allow resume or end.

### 14.3 User backgrounds the app

The app should continue the timer accurately.

### 14.4 User changes their mind

The user should be able to end or restart without friction.

### 14.5 User does not want prompts

Post-MVP, users may be able to reduce or disable prompts.

## 15. Future enhancements

Potential post-MVP features:

* Prompt customisation.
* Prompt frequency control.
* Dark mode.
* Gentle completion sound options.
* Fullness history.
* Average eating duration trend.
* Favourite durations.
* Lock screen or live activity support.
* Apple Watch support.
* Custom prompt packs.
* Reflection notes.

## 16. Open questions

1. Should the timer continue when the phone is locked?
2. Should the app use haptics when a prompt appears?
3. Should users be able to disable prompts?
4. Should fullness reflections be saved in MVP or kept session-only?
5. Should custom durations have minimum and maximum limits?
6. Should the app support dark mode in the first version?
7. Should the app include onboarding, or should it go straight to duration selection?
8. Should there be a completion sound, or should the experience stay silent?

## 17. MVP recommendation

The first version should be extremely focused:

1. Choose duration.
2. Start meal countdown.
3. View one time mode at a time.
4. Receive gentle prompts.
5. Pause or end.
6. Reflect on fullness.

The product should prioritise calmness, readability, and trust over feature richness.

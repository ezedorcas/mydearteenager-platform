# MyDearTeenager learning app prototype

A clickable prototype of the MDT learning app, plus the first pilot course, **Design Basics**, built with code-driven motion lessons.

Open `index.html` in a browser (or host the folder anywhere static). Everything is sample data. Progress is saved in the browser's local storage only, so nothing leaves the device.

## What's inside

| View | What you can do |
|---|---|
| **Learner (Amara, 15)** | Home with streak, XP and badges. Skill Academy. The full Design Basics course (13 lessons). Projects, portfolio and certificate. A moderated community that blocks phone numbers and emails. Opportunities. Settings. |
| **Parent (Ngozi)** | Approve or decline a child's account (Chidi). Weekly minutes chart, module progress, activity, projects and tutor feedback. Consent and privacy. Settings. |
| **Tutor (Kelechi)** | Review queue with automatic poster checks, a rubric and comment starters. Course builder with drag-to-reorder and a caption editor that previews the motion lesson live. Learner list with nudges. Community questions. |
| **School (Sunrise College)** | Groups with progress and consent status, invite codes, and opportunity listings with a live preview. |

The roles share one state. When Amara submits her poster it shows up in Kelechi's queue. When Kelechi sends feedback, Amara, her portfolio and her mum's dashboard all see it.

Use the bar at the top to switch person or jump to a demo state: fresh start, mid-course (default) or course finished.

## Design Basics (pilot course)

| Module | Motion lesson | Practice | Quiz |
|---|---|---|---|
| 1. Contrast | Why some posters disappear | Fix the poster (contrast meter, squint test) | Contrast check |
| 2. Type | Words have a voice | Build the hierarchy | Type check |
| 3. Layout | Give things room | Line it up (drag blocks, snap to grid) | Layout check |
| 4. Colour | Colour with a purpose | Build a 60-30-10 palette | Colour check |
| 5. Final project | | Design a poster for your school, checked and sent to a tutor | |

Motion lessons are made of scenes in `assets/js/course.js`. Each scene has a duration, timed captions and a `build()` function that lays out the scene and registers animations. `assets/js/player.js` drives every animation from one clock, so lessons can be paused, scrubbed and replayed, with captions and an optional read-aloud voice (the browser's built-in speech). Reduced-motion settings are respected.

### Adding a lesson

1. Write a scenes array next to `contrastScenes` in `course.js`.
2. Add it to `lessons` and to a module's `lessons` list in `window.DESIGN_BASICS`.
3. Run `python3 build.py` to refresh the icon list in `index.html`.

## Files

```
index.html            the app (built by build.py)
build.py              collects icon names, writes index.html and dist-artifact/
icons-extra.txt       icon names used dynamically that the scan can't find
assets/css/site.css   shared design system from the website
assets/css/app.css    app shell, dashboards, player, tools
assets/js/data.js     sample people, state, poster renderer and checks
assets/js/catalog.js  course catalogue (same as the website)
assets/js/player.js   motion lesson player
assets/js/course.js   Design Basics: scenes, practice tools, quizzes, poster maker
assets/js/app.js      router and the four dashboards
```

## Placeholders to replace before launch

- All names, schools, posts, numbers and listings are made up.
- Motion lesson content should be reviewed by a design educator.
- There are no real accounts, payments, emails or moderation yet. Those need a backend.

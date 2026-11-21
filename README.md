# MyDearTeenager website

A static website: plain HTML, CSS and JavaScript with no frameworks or build tools needed to host it.

## Hosting

Upload everything inside the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages or cPanel). Set `404.html` as the not-found page if your host asks.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| How it works | `how-it-works.html` |
| Skill Academy | `academy.html` (catalogue lives in `assets/js/courses.js`) |
| For parents | `parents.html` |
| Schools and partners | `schools.html` |
| Teach on MDT | `teach.html` |
| Opportunities | `opportunities.html` |
| Safety | `safety.html` |
| About | `about.html` |
| FAQ | `faq.html` |
| Contact | `contact.html` |
| Join the waitlist | `join.html` (accepts `?role=parent`, `teen`, `tutor` or `school`) |
| Log in | `login.html` |
| Privacy policy (draft) | `privacy.html` |
| Terms of use (draft) | `terms.html` |
| Not found | `404.html` |

## Settings

At the top of `assets/js/site.js`:

```js
const MDT = {
  launched: false,          // true on launch day: every "Join the waitlist" button becomes "Start learning"
  appUrl: "#app-url",       // learner app sign-up link
  loginUrl: "#app-login-url",
  waitlistEndpoint: "",     // where waitlist sign-ups are sent (JSON POST)
  contactEndpoint: ""       // where contact, teach, schools and suggestion forms are sent
};
```

While the endpoints are empty, the forms validate and play their success animations without sending anything.

## Placeholders to fill before launch

Everything still needing real content is shown on the page with a dashed, striped highlight (CSS class `ph` or `ph-block`). Search the files for `ph` to find them all.

- Contact details: email, phone and city (`contact.html`, `safety.html`, `faq.html`)
- Social media links: TikTok, Instagram, LinkedIn (footer and `contact.html`)
- Pricing (FAQ)
- Consent flow details and data retention (`parents.html`, `privacy.html`)
- Moderation hours and escalation (`safety.html`)
- Tutor safeguarding check, pay and content ownership (`teach.html`, `safety.html`, `faq.html`)
- School programme pricing and group sizes (`schools.html`)
- Founder name and team photos (`about.html`)
- Company name, RC number, address and Data Protection Officer (`privacy.html`)
- Privacy policy and terms: both are drafts and must be reviewed by a lawyer against the Nigeria Data Protection Act 2023
- Opportunity listings on `opportunities.html` are clearly marked examples
- Learning paths in `courses.js` are drafts carried over from the earlier prototype; tutors show as "to be announced"
- Real photos of teens (with parental consent) would strengthen the hero sections

## Editing

Shared header, footer, menu and repeated sections live in `src/partials/`; page bodies live in `src/pages/`. After editing, run:

```
python3 build.py
```

This rebuilds `dist/`. You can also edit the files in `dist/` directly if you prefer, but changes there are overwritten by the next build.

## Notes

- Fonts and icons load from Google Fonts. For best performance, self-host them before launch.
- Page-to-page transitions use the browser's View Transitions feature where supported; other browsers simply load the next page normally.
- All animation switches off for visitors who have "reduce motion" turned on.

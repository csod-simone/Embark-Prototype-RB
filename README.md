# Embark for Rathbones

Local prototype of the Rathbones Institute Investment Management pilot.

It is a single Vite + React app. Learner, manager, and admin personas share this browser. Coach replies, role-play scoring, and Deep Research answers are scripted. There is no SAP connection and no model API key.

## Run

```sh
npm install
npm run dev
```

Open the URL Vite prints. Choose a persona on the welcome screen. Use **IM pathway** for the competency journey, the three role-plays, knowledge checks, the chapter gate, and the module assessment.

## Pilot rules in this build

- Pass mark is 80%.
- Knowledge checks and the module assessment allow 3 retakes, then the journey pauses for a line-manager check-in.
- The chapter gate allows one attempt. A fail flags the learner.
- Role-plays: Vulnerable Clients, Pitching Sales (new business), and Suitability Meetings. Scoring uses the text of the conversation.
- Graduation needs line-manager sign-off and an external CISI Level 4 pass.
- Representative Investment Management content stands in for Rathbones source material.

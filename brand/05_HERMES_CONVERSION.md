# 05 — Conversion et Hermès

## Conversion thesis

A visitor should not first choose between abstract offers. They should recognise one painful workflow, see that Parrit understands its input and output, receive a useful feasibility response and then choose the appropriate engagement.

The shortest path is:

`painful workflow → Hermès qualification → useful summary → proof → meeting or test`

## Primary conversion object

The unit of conversion is not “book a demo”. It is a concrete workflow.

Hermès asks:

1. What task still consumes time?
2. What enters the process?
3. What output would be useful?

When necessary, a third question may cover system access, frequency or risk. It must not turn into a long form.

## Hermès visitor response

The response must contain:

- reformulated workflow;
- likely input;
- expected output;
- what can be tested safely;
- one dependency;
- one uncertainty;
- recommended first step;
- appropriate CTA.

If the use case is not currently feasible, Hermès says so and suggests a narrower test or a non-agent alternative.

## Funnel events

Canonical event names:

```text
page_view
hero_case_input_focus
hero_case_input_submit
hermes_question_answered
hermes_summary_rendered
hermes_summary_exported
cta_primary_click
cta_secondary_click
meeting_booking_started
meeting_booking_completed
case_study_opened
agent_trace_opened
newsletter_subscribed
experiment_exposure
experiment_conversion
```

Required properties:

```text
locale
page
section
component
variant
traffic_source
visitor_segment
workflow_category
experiment_id
```

Never send private workflow text to analytics without explicit consent and redaction.

## Primary metrics

- qualified workflow submissions;
- feasibility summaries completed;
- meeting bookings completed;
- qualified meeting rate;
- conversion by workflow category;
- time from first visit to useful output.

Secondary metrics:

- case study engagement;
- trace engagement;
- CTA click-through;
- return visit rate;
- newsletter subscription.

Guardrails:

- bounce caused by blocking interaction;
- form abandonment;
- page performance;
- accessibility errors;
- privacy consent failures;
- misleading feasibility statements;
- brand consistency score.

## Experiment contract

Every experiment lives in `experiments/YYYY-MM-DD-slug.md` and includes:

```yaml
id: exp-YYYYMMDD-slug
status: proposed | approved | running | won | lost | inconclusive | reverted
owner: hermes | paul | team
hypothesis: ...
audience: ...
component: ...
primary_metric: ...
guardrails: [...]
variable_changed: one clearly named variable
control: ...
variant: ...
start_condition: ...
stop_condition: ...
result: ...
decision: ...
```

## Deterministic self-improvement loop

1. Observe clean event data.
2. Detect one meaningful friction.
3. Gather qualitative evidence from sessions or submissions.
4. Form one falsifiable hypothesis.
5. Create one variant using stable tokens and components.
6. Run automated accessibility, copy, visual and performance checks.
7. Open a pull request and preview.
8. Require an explicit approval gate while the system is in supervised mode.
9. Expose the experiment behind a feature flag.
10. Analyse results against the primary metric and guardrails.
11. Promote, iterate or revert.
12. Record the decision and update the relevant source-of-truth file if the change becomes stable.

## Hermès permissions

Allowed autonomously:

- read analytics and experiment data;
- generate an audit;
- create a proposed experiment file;
- create a feature-flagged implementation branch;
- run tests;
- open a pull request;
- write a post-experiment report.

Approval required:

- production deployment during supervised mode;
- changes to brand tokens;
- changes to the primary promise;
- new data collection;
- changes to privacy or consent;
- deleting a stable component;
- changing offer, price or legal language.

Never allowed:

- fabricate proof;
- expose private workflow content;
- claim certainty the system does not have;
- run multiple interacting experiments on the same conversion path without attribution;
- silently overwrite Figma or repository canon.

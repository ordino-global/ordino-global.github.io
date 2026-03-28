---
layout: docs
title: Entitlement Picker
---

## Overview

The entitlement picker appears after the user clicks **Reserve** on a queue details screen.
Its purpose is to show available entitlements, guide the user through valid selection rules, and submit a reservation using those selected entitlements.

## API flow

1. The user clicks **Reserve** on the queue details screen.
2. The app calls [`GET /api/entitlements`](https://commonpark-platform.dev.ordino.global/api.html#tag/sessions/GET/api/entitlements) with `queue_id` to fetch the user's entitlements for that queue.
3. The app displays the returned entitlements as cards.
4. The user selects one or more valid entitlements.
5. The app calls [`POST /api/sessions/actions/reserve`](https://commonpark-platform.dev.ordino.global/api.html#tag/sessions/POST/api/sessions/actions/reserve) to create the reservation.

## UI specification

The visual and interaction behavior should follow the guidance below.

![Example entitlement selector](/assets/images/ux-entitlement-picker.svg)

### Entitlement cards

* Display each returned entitlement as a card.
* Each card should toggle between `unpressed` and `pressed` when clicked, if enabled.
* Each card should display:
    * guest `nickname`,
    * entitlement `title`,
    * `reservation_type`, and
    * `remaining_count` / `total_count`.
* Each card should use a distinct color by `reservation_type`.

### Disabled state rules

An entitlement should be `disabled` when any of the following is true:

* `is_usable: false`
* `is_eligible: false`
* `reservation_type` differs from an already selected entitlement (one `reservation_type` per reservation)
* `session_key` matches an already selected entitlement (one selected entitlement per session)

When `disabled`, the card should:

* be visibly disabled,
* not be clickable, and
* show a clear user-facing reason.

### Disabled reason sources

When showing a disabled reason:

* For unusable entitlements, use the reason from `usability` (see API docs for possible values).
* For ineligible entitlements, use the reason from `eligibility` (see API docs for possible values).
* For `reservation_type` mismatch, show a message that it conflicts with the selected reservation type.
* For duplicate `session_key`, show that it is blocked by an already selected entitlement.

Map reason codes to user-friendly strings. Include additional context where available:

* If `usability` is `not_available`, include `available_from`.
* If `usability` is `already_reserved`, include relevant data from `reservation` (queue plus remaining wait or ready time).
* If `eligibility` is `not_enough_minutes`, include `minutes_remaining`.

### Validation before reserve

If an entitlement has `requires_entitlement`, the picker should not proceed until all required entitlements are selected.
Optionally, highlight remaining entitlements that satisfy unmet requirements so the user can complete selection.

## React Example

Edit the React code on the left and see the live output on the right.

<script src="/assets/js/js-playground.js" data-root-id="playground-root" data-code-url="react-example.js" data-preview-css-url="react-example.css" data-frame-title="Entitlement Picker Playground Preview" data-collapse-on-load="true"></script>
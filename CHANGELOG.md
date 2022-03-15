# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2021-08-16

### 🔥 Added

- add `extra_note` field for `ShowRfq` and `EditRfq` pages and `extra_note` column for `RfqTable` page

## [1.5.0] - 2021-08-05

### 🔥 Added

- change `eau` -> `eau min` (mandatory) + `eau max` (optional) for `NewRfq`, `ShowRfq` and `EditRfq` pages
- remove `c/nc/nwr` from frontend for `NewRfq`, `ShowRfq` and `EditRfq` pages
- add requirements `order` feature for `NewRequirement`, `ShowRequirement` and `EditRequirement` components
- add `final solutions` notes textarea and `conclusions` notes textarea for `NewRfq`, `ShowRfq` and `EditRfq` pages
- add `samples expected` and `mp expected` text fields for `NewRfq`, `ShowRfq` and `EditRfq` pages
- add `extra_note` field to add after `rfq_code` in **Clickup** task for `NewRfq` page
- refactor `ShowRfq` page to be **Client Side Rendered** instead of **Server Side Rendered** (fix issue with deep links to app on Vercel cloud server)
- integration & e2e tests for the new features

## [1.4.0] - 2021-07-24

### 🔥 Added

- `SfTable` component - reusable, sortable, filterable data table component

### 💪 Updated

- refactored `RfqsTable` to use `SfTable` component (instead of hardcoded logic)

## [1.3.0] - 2021-07-14

### 🔥 Added

- e2e tests

## [1.2.0] - 2021-07-05

### 🔥 Added

- `redirect to ClickUp` button
- ClickUp status fetching

## [1.1.0] - 2021-07-02

### 🔥 Added

- `redirect to SharePoint` button
- `loader` component (because SharePoint is slow)

## [1.0.0] - 2021-06-30

### 🔥 Added

- `change password` page
- `edit user` page
- `delete user` page
- protection against self delete

### 💪 Updated

- `users table` page

## [0.9.0] - 2021-06-28

### 🔥 Added

- `distributors list` page
- `add distributor` page
- `edit distributor` page
- `delete distributor` page
- protect authorized routes

### 💪 Updated

- `create user` page

## [0.8.1] - 2021-06-27

### 👾 Fixed

- links to changelog
- redirections to `RFQ list` afrer adding new RFQ

## [0.8.0] - 2021-06-26

### 🔥 Added

- `edit RFQ` page
- `delete RFQ` page
- sepatate admin view
- front page
- styling

## [0.7.0] - 2021-06-25

### 🔥 Added

- `delete RFQ's requirement` component

## [0.6.0] - 2021-06-24

### 🔥 Added

- `delete RFQ's requirement` component

## [0.5.0] - 2021-06-23

### 🔥 Added

- `add new requirement do RFQ` component
- `edit RFQ's requirement` component

## [0.4.0] - 2021-06-19

### 🔥 Added

- `show RFQ details` page
- `list all requirements for a given RFQ` component

## [0.3.0] - 2021-06-18

### 🔥 Added

- `RFQs` page (with list of all rfqs)

## [0.2.0] - 2021-06-18

### 🔥 Added

- `new RFQ` page
- `userPicker` component
- `niceButton` component

### 💪 Updated

- `header` component (added `new RFQ` tab in nav menu)

## [0.1.0] - 2021-06-01

### 🔥 Added

- initial release
- add semantic versioning
- corrections of production configurations and manual tests
- vercel frontend initial deployment
- connect git to frontend and backend
- add some styling
- implementing and testing authentication flow
- create menu, home page and main authentication flow pages
- create table template with cross-filtering and sorting by column
- create reusable modal for dangerous actions confirmation
- create helper library for super easy sorting arrays of object by object's keys
- create error handling logic
- create reusable hooks for convienient client-side and server-side API requests
- frontend dev setup (configure next.js to worh with typescript and sass)

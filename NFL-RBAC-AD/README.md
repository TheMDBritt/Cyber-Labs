# NFL Front Office RBAC and Privileged Access Management

**Active Directory Role Model with AGDLP Nesting and Tiered Privileged Access**

A role-based access control model built in Active Directory (`cyberlab.local`) for a simulated NFL front office. Enforces separation of duties, least-privilege, and tiered privileged access across departments. Standard accounts and privileged accounts are kept separate, and a dedicated offboarding OU drives the leaver workflow.

---

## OU Architecture

```
cyberlab.local
└── NCAA_Users
    ├── Athletes
    ├── Captains
    ├── Coaches
    ├── Trainers
    └── Compliance
└── NCAA_Disabled
```

- **NCAA_Users:** active population, segmented by role
- **NCAA_Disabled:** offboarded accounts, GPO-linked to enforce disabled state, blocked logon, and removal from groups

---

## Role Groups

Naming convention: `NCAA-<Role>`

- `NCAA-Athletes`
- `NCAA-Captains`
- `NCAA-Coaches`
- `NCAA-Trainers`
- `NCAA-Compliance`

Captains is intentionally separate from Athletes so leadership-level permissions can be granted without elevating the entire roster.

---

## AGDLP Nesting

Following Microsoft's recommended nesting model:

1. **Account:** user objects in `NCAA_Users` OU
2. **Global group:** `NCAA-<Role>` membership by department
3. **Domain Local group:** resource access groups (`DL-FilmRoom-RW`, `DL-MedicalRecords-R`, etc.)
4. **Permission:** ACLs on the actual resource

Global groups join Domain Locals. Domain Locals get the permission. Users only land in Globals. Resource ACLs never reference users directly.

---

## Privileged Access Tiering

| Tier | Scope | Account pattern |
| --- | --- | --- |
| Tier 0 | Domain controllers, forest-critical assets | `t0-<user>` |
| Tier 1 | Server and identity infrastructure | `t1-<user>` |
| Tier 2 | Workstations and end users | standard `<user>` |

- No daily-driver use of privileged accounts
- Privileged accounts blocked from logging onto lower-tier assets
- Logon Workstations restrictions enforced via group policy

---

## Offboarding Workflow (NCAA_Disabled OU)

1. Account moved out of `NCAA_Users` and into `NCAA_Disabled`
2. Account disabled, password reset, sessions terminated
3. Group memberships stripped except a baseline `NCAA-Disabled` group
4. GPO on `NCAA_Disabled` blocks interactive and network logon
5. Audit record produced for the access review trail

This separates "deactivated" from "deleted" so audit and forensic needs are preserved.

---

## What it demonstrates

- Separation of duties at the role and tier level
- Least-privilege enforcement validated through targeted access tests
- AGDLP discipline (no users on resource ACLs)
- Privileged Access Management workflow: separate accounts, tier restrictions, no daily-driver privileged use
- Lifecycle hygiene: a real, GPO-enforced leaver path, not just disabling accounts in place
- Audit-ready documentation: role definitions, group membership, access decisions

---

## Threat Model and Gaps

A defensible lab acknowledges its limits. Items I'd add or remediate in a production rollout:

- **Tier 0 monitoring:** alert on any Tier 0 logon outside an approved jump host
- **Privileged account vaulting:** password rotation and just-in-time elevation
- **Group nesting drift:** scheduled report comparing intended vs. actual group membership
- **Stale account detection:** report on accounts with no logon in 30, 60, 90 days
- **Object ownership cleanup:** ensure no users own AD objects directly

---

## Skills demonstrated

Active Directory design, RBAC modeling, AGDLP nesting, OU strategy, privileged access tiering, offboarding workflow design, GPO authoring, separation of duties, least-privilege enforcement, audit documentation.

---

## Contact

Malcolm Britt · [malcolmbritt12@gmail.com](mailto:malcolmbritt12@gmail.com) · [LinkedIn](https://www.linkedin.com/in/malcolm-britt-b7157026a)

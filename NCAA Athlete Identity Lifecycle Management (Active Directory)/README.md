NCAA Athlete Identity Lifecycle Management (Active Directory)
Overview

This project simulates an enterprise Identity and Access Management (IAM) system using Windows Server and Active Directory Domain Services. The lab models the full identity lifecycle of NCAA athletes, including onboarding, role transitions, secure offboarding, and audit validation.

The objective was to design and implement a structured IAM environment that enforces least privilege, separates identity from access, and validates lifecycle changes through security event logs.

Environment

Windows Server (Domain Controller)

Active Directory Domain Services (AD DS)

Domain: cyber.local

Virtualized lab environment

Windows Event Viewer (Security Log)

Architecture

The environment was structured using:

Organizational Units (OUs) for lifecycle organization

Global Security Groups for role-based access control (RBAC)

A dedicated Disabled OU for secure deprovisioning

OU Structure

NCAA_Users
├── Athletes
├── Coaches
├── Trainers
├── Compliance
└── NCAA_Disabled

Security Groups

NCAA-Athletes

NCAA-Captains

NCAA-Coaches

NCAA-Compliance

IAM Design Principles Demonstrated
Role-Based Access Control (RBAC)

Access was granted through security groups rather than directly to user accounts. This ensures role changes are handled through group membership updates instead of permission redesign.

Separation of Identity and Access

User accounts represent identity, while group membership determines access. Organizational Units were used for structure and policy scope, not permissions.

Least Privilege

Users were assigned only the minimum access required for their role. Access was removed immediately upon lifecycle transition.

Joiner–Mover–Leaver Lifecycle
Joiner (Onboarding)

Bulk onboarding of athlete accounts

Assignment to NCAA-Athletes security group

Mover (Role Transition)

Promotion of selected athletes to NCAA-Captains

Role transition handled via group membership addition without recreating accounts

Leaver (Offboarding)

Account disabled

Access groups removed

User moved to NCAA_Disabled OU for governance and retention

Audit Validation

Lifecycle actions were validated through Windows Security Event Logs:

Event ID 4725 — User account disabled

Event ID 4728 — Member added to global security group

Event ID 4729 — Member removed from global security group

These logs confirm that lifecycle and RBAC changes were properly recorded and auditable.

Key Skills Demonstrated

Active Directory administration

User lifecycle management

RBAC implementation

Least privilege enforcement

Secure deprovisioning

Identity governance validation

Windows Security Log analysis

Project Outcome

This lab demonstrates the ability to design, implement, and validate an enterprise-style IAM system within Active Directory. The project emphasizes structured access control, audit readiness, and proper lifecycle governance aligned with real-world identity management practices.

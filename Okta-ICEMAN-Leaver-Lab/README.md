# Okta ICEMAN Leaver Lab

## Overview
A hands-on Okta identity lifecycle lab focused on the leaver process. Five users were provisioned across multiple applications and terminated using five different deprovisioning methods to simulate real enterprise offboarding scenarios and identify access gaps.

---

## Users and App Assignments

| User | App Assigned | Department | Title |
|---|---|---|---|
| Make Them Cry | Okta Ice: Gourmet Ice Cream | ICEMAN | Track 1 |
| Dust | Salesforce.com | ICEMAN | Track 2 |
| Whisper My Name | Salesforce.com (2) | ICEMAN | Track 3 |
| Burning Bridges | Okta Ice + Salesforce | ICEMAN | Track 4 |
| National Treasures | All apps | ICEMAN | Track 5 |

---

## Deprovisioning Methods Tested

| User | Method |
|---|---|
| Make Them Cry | Manual deactivation |
| Dust | Suspension |
| Whisper My Name | Individual app removal |
| Burning Bridges | Group membership removal |
| National Treasures | Full offboarding sequence |

---

## Gap Analysis

**1. Fastest method?**
Manual deactivation. One click, immediate session termination and app access revoked.

**2. Most residual access risk?**
App removal only. User account stays active. Any missed app assignments leave live access open.

**3. Apps that did not auto-deprovision on deactivation?**
Salesforce. Without a fully configured provisioning integration the Salesforce account remains active even after Okta deactivation. This is a common audit finding in real enterprise environments.

**4. What if app removal only was the standard offboarding process?**
Critical insider threat risk. The user can still authenticate to Okta and access any app not manually removed. One missed assignment means continued access after termination.

---

## Key Takeaways
- Group-based access control is the most scalable deprovisioning method. Removing a user from a group automatically revokes all associated app access without manual intervention.
- Deactivation alone does not guarantee downstream app access is removed without proper provisioning integrations configured.
- A documented offboarding checklist combining group removal, individual app verification, session clearing, and deactivation is the most complete leaver workflow.

---

## Tools Used
Okta Developer Tenant

## Skills Demonstrated
Identity lifecycle management, leaver workflows, group-based access control, app provisioning and deprovisioning, access gap analysis, IAM risk documentation

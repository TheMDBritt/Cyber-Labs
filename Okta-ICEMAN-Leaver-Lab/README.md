Okta ICEMAN Leaver Lab
Overview
A hands-on Okta identity lifecycle lab focused on the leaver process. Five users were provisioned across multiple applications and terminated using five different deprovisioning methods to simulate real enterprise offboarding scenarios and identify access gaps.
Users and App Assignments
UserApp AssignedDepartmentTitleMake Them CryOkta Ice: Gourmet Ice CreamICEMANTrack 1DustSalesforce.comICEMANTrack 2Whisper My NameSalesforce.com (2)ICEMANTrack 3Burning BridgesOkta Ice + SalesforceICEMANTrack 4National TreasuresAll appsICEMANTrack 5
Deprovisioning Methods Tested
UserMethodMake Them CryManual deactivationDustSuspensionWhisper My NameIndividual app removalBurning BridgesGroup membership removalNational TreasuresFull offboarding sequence
Gap Analysis

Fastest method: Manual deactivation. One click, immediate session termination and app access revoked.
Most residual access risk: App removal only. User account stays active. Any missed app assignments leave live access open.
Apps that did not auto-deprovision: Salesforce. Without a fully configured provisioning integration, the Salesforce account remains active even after Okta deactivation. This is a common audit finding in real enterprise environments.
App removal as the only offboarding method: Critical insider threat risk. The user can still authenticate to Okta and access any app not manually removed. One missed assignment means continued access after termination.

Key Takeaways

Group-based access control is the most scalable deprovisioning method. Removing a user from a group automatically revokes all associated app access without manual intervention.
Deactivation alone does not guarantee downstream app access is removed without proper provisioning integrations configured.
A documented offboarding checklist combining group removal, individual app verification, session clearing, and deactivation is the most complete leaver workflow.

Tools Used
Okta Developer Tenant
Skills Demonstrated
Identity lifecycle management, leaver workflows, group-based access control, app provisioning and deprovisioning, access gap analysis, IAM risk documentation

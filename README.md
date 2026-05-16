# Cyber-Labs

**Cybersecurity Home Lab — Active Directory · SIEM · Windows Endpoint · Kali Linux**

A multi-VM VirtualBox environment built and maintained to practice IAM lifecycle operations, log analysis, group policy enforcement, and attack / detection workflows. The infrastructure mirrors what's deployed in defense-contractor and federal IT environments, allowing hands-on validation of identity governance and security monitoring concepts.

---

## Featured labs (resume-tied)

These labs back the **Cybersecurity Home Lab** project on my resume.

| Lab | Focus | Stack |
|---|---|---|
| [HomeLabSetUp](./HomeLabSetUp) | Initial environment build, DNS troubleshooting, resolver recovery, VM stabilization for SIEM ingestion | VirtualBox, Ubuntu Server, systemd-resolved |
| [Windows-Security-System-Lab](./Windows-Security-System-Lab) | Windows endpoint hardening, GPO enforcement, and security baseline validation | Windows 10/11, Group Policy, local security policy |
| [windows-user-account-management-lab](./windows-user-account-management-lab) | IAM lifecycle operations (provisioning, modification, deprovisioning) on Windows user accounts | Windows Server, PowerShell, local + domain accounts |

---

## Supporting labs

Smaller modules used for adjacent skill-building.

| Lab | Focus |
|---|---|
| [network fundamentals](./network%20fundamentals) | Networking primitives, subnetting, packet capture |
| [vulnerable-chatbot](./vulnerable-chatbot) | Intentionally-vulnerable LLM target used for prompt-injection and exfiltration testing |

---

## Environment

- **Host:** Windows
- **Virtualization:** VirtualBox
- **Guests:** Windows Server (Domain Controller), Windows 10/11 client, Ubuntu Server (SIEM), Kali Linux (attacker)
- **Network:** Internal NAT with host-only management

---

## What I practice here

- IAM lifecycle: joiner / mover / leaver in Active Directory
- Group Policy authoring and enforcement
- SIEM log ingestion, correlation, and detection rule tuning
- Authentication anomaly investigation across Windows + Linux logs
- Attack / detection workflows against the lab from Kali
- Vulnerability scanning and remediation tracking

---

## Author

**Malcolm Britt** — [malcolmbritt12@gmail.com](mailto:malcolmbritt12@gmail.com) · [LinkedIn](https://www.linkedin.com/in/malcolm-britt-b7157026a)

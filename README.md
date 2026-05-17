# Cyber-Labs

**Cybersecurity Home Lab — Active Directory · SIEM · Windows Endpoint · Kali Linux · Okta**

A multi-VM VirtualBox environment built and maintained to practice IAM lifecycle operations, log analysis, group policy enforcement, and attack / detection workflows. The infrastructure mirrors what's deployed in defense-contractor and federal IT environments, allowing hands-on validation of identity governance and security monitoring concepts.

---

## Featured labs (resume-tied)

These labs back the **Cybersecurity Home Lab** project on my resume.

| Lab | Focus | Stack |
|---|---|---|
| [Okta-ICEMAN-Leaver-Lab](./Okta-ICEMAN-Leaver-Lab) | Leaver-workflow gap analysis across 5 users and 5 deprovisioning methods (manual deactivation, suspension, individual app removal, group removal, full offboarding). Identifies Salesforce auto-deprovisioning gap and documents the most complete leaver checklist. | Okta Developer Tenant, group-based access control, lifecycle automation |
| [ICEMAN_PlotTwist Lab](./ICEMAN_PlotTwist%20Lab) | Red team attack chain on `cyberlab.local`: nmap recon → xfreerdp initial access as low-priv domain user → PowerShell enumeration → msfvenom MSI payload → Meterpreter C2 over port 5555. Documents privilege-escalation dead-ends and the pivot to MSI delivery. | Active Directory, Kali Linux, nmap, xfreerdp, msfvenom, Metasploit / Meterpreter |
| [HomeLabSetUp](./HomeLabSetUp) | Initial environment build, DNS troubleshooting, resolver recovery, VM stabilization for SIEM ingestion | VirtualBox, Ubuntu Server, systemd-resolved |
| [Windows-Security-System-Lab](./Windows-Security-System-Lab) | Windows endpoint hardening, GPO enforcement, and security baseline validation | Windows 10/11, Group Policy, local security policy |
| [windows-user-account-management-lab](./windows-user-account-management-lab) | IAM lifecycle operations (provisioning, modification, deprovisioning) on Windows user accounts | Windows Server, PowerShell, local + domain accounts |

---

## Supporting labs

| Lab | Focus |
|---|---|
| [network fundamentals](./network%20fundamentals) | Networking primitives, subnetting, packet capture |
| [vulnerable-chatbot](./vulnerable-chatbot) | Intentionally-vulnerable LLM target used for prompt-injection and exfiltration testing |

---

## Environment

- **Host:** Windows
- **Virtualization:** VirtualBox
- **Guests:** Windows Server (Domain Controller — `cyberlab.local`), Windows 10/11 client (`192.168.56.102`), Ubuntu Server (SIEM), Kali Linux (`192.168.56.103`, attacker)
- **Cloud IAM:** Okta Developer Tenant (for the ICEMAN leaver lab)
- **Network:** Internal host-only network `192.168.56.0/24`

---

## What I practice here

- IAM lifecycle: joiner / mover / leaver in Active Directory and Okta
- Group-based access control and leaver-workflow gap analysis
- Group Policy authoring and enforcement
- SIEM log ingestion, correlation, and detection rule tuning
- Authentication anomaly investigation across Windows + Linux logs
- Red team attack chains from Kali against the AD lab — recon, initial access, enumeration, payload delivery, C2
- Vulnerability scanning and remediation tracking

---

## Author

**Malcolm Britt** — [malcolmbritt12@gmail.com](mailto:malcolmbritt12@gmail.com) · [LinkedIn](https://www.linkedin.com/in/malcolm-britt-b7157026a)

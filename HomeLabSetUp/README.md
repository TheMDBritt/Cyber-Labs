# Home Lab – Environment Setup & DNS Troubleshooting

## Objective
Build a local cybersecurity home lab to support SOC analyst skill development, including log analysis, detection, and incident response. This section documents initial environment setup and troubleshooting performed to restore network and DNS functionality.

## Environment
- Host OS: Windows
- Virtualization: VirtualBox
- Guest OS: Ubuntu Server
- VM Name: SIEM
- Network Mode: NAT

## Issue Encountered
During initial setup, the virtual machine experienced DNS resolution failures that prevented package downloads and external connectivity to required repositories.

Observed symptoms included:
- Package download failures
- `NXDOMAIN` and `connection refused` DNS errors
- `sudo: unable to resolve host` warnings

## Investigation
The following checks were performed:
- Verified VM network adapter configuration (NAT, cable connected)
- Tested connectivity using `ping`
- Tested name resolution using `nslookup`
- Inspected `/etc/resolv.conf`
- Checked `systemd-resolved` service status
- Identified hostname mismatch and broken resolver configuration

## Resolution
- Re-enabled `systemd-resolved`
- Restored the default resolver symlink for `/etc/resolv.conf`
- Corrected hostname resolution in `/etc/hosts`
- Restarted resolver services
- Verified DNS functionality

## Validation
- Successful DNS resolution using `nslookup`
- External domains reachable
- System ready for SIEM installation and log ingestion

## Outcome
The environment was stabilized and prepared for further lab activities, including SIEM deployment, log collection, and attack simulation.
![DNS Resolution Restored](dns-resolution.png)

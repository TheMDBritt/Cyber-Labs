#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import os
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Iterable


def slugify(value: str) -> str:
    cleaned = "".join(char if char.isalnum() else "-" for char in value.lower())
    return "-".join(filter(None, cleaned.split("-")))


@dataclass
class Candidate:
    name: str
    email: str
    phone: str
    resume_path: str
    location: str | None = None
    linkedin: str | None = None
    portfolio: str | None = None


@dataclass
class Job:
    company: str
    title: str
    url: str
    location: str | None = None


@dataclass
class ApplicationPackage:
    candidate: Candidate
    job: Job
    cover_letter: str
    created_at: str

    def output_dir(self, base_dir: Path) -> Path:
        slug = f"{slugify(self.job.company)}-{slugify(self.job.title)}"
        return base_dir / slug

    def write(self, base_dir: Path) -> Path:
        output_dir = self.output_dir(base_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        cover_path = output_dir / "cover_letter.md"
        cover_path.write_text(self.cover_letter, encoding="utf-8")
        application_path = output_dir / "application.json"
        application_path.write_text(
            json.dumps(asdict(self), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        return output_dir


def load_jobs(csv_path: Path) -> list[Job]:
    jobs: list[Job] = []
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            jobs.append(
                Job(
                    company=row.get("company", "").strip(),
                    title=row.get("title", "").strip(),
                    url=row.get("url", "").strip(),
                    location=row.get("location", "").strip() or None,
                )
            )
    return jobs


def load_resume(resume_path: Path) -> str:
    return resume_path.read_text(encoding="utf-8")


def render_cover_letter(template_path: Path, candidate: Candidate, job: Job, resume: str) -> str:
    template = template_path.read_text(encoding="utf-8")
    return template.format(
        candidate_name=candidate.name,
        candidate_email=candidate.email,
        candidate_phone=candidate.phone,
        candidate_location=candidate.location or "",
        candidate_linkedin=candidate.linkedin or "",
        candidate_portfolio=candidate.portfolio or "",
        job_company=job.company,
        job_title=job.title,
        job_location=job.location or "",
        resume=resume,
    )


def prepare_packages(
    *,
    resume_path: Path,
    jobs_path: Path,
    template_path: Path,
    output_dir: Path,
    candidate: Candidate,
) -> list[ApplicationPackage]:
    resume = load_resume(resume_path)
    jobs = load_jobs(jobs_path)
    timestamp = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    packages: list[ApplicationPackage] = []
    for job in jobs:
        cover_letter = render_cover_letter(template_path, candidate, job, resume)
        package = ApplicationPackage(
            candidate=candidate,
            job=job,
            cover_letter=cover_letter,
            created_at=timestamp,
        )
        package.write(output_dir)
        packages.append(package)
    return packages


def summarize_packages(packages: Iterable[ApplicationPackage]) -> None:
    for package in packages:
        print(f"Prepared: {package.job.company} - {package.job.title}")


def build_candidate(args: argparse.Namespace) -> Candidate:
    return Candidate(
        name=args.name,
        email=args.email,
        phone=args.phone,
        resume_path=str(args.resume),
        location=args.location,
        linkedin=args.linkedin,
        portfolio=args.portfolio,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate application packages for multiple job listings.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    prepare = subparsers.add_parser("prepare", help="Generate application packages.")
    prepare.add_argument("--resume", type=Path, required=True, help="Path to resume text.")
    prepare.add_argument("--jobs", type=Path, required=True, help="CSV file of jobs.")
    prepare.add_argument(
        "--template",
        type=Path,
        default=Path(__file__).parent / "templates" / "cover_letter.md",
        help="Cover letter template path.",
    )
    prepare.add_argument("--out", type=Path, default=Path("applications"), help="Output folder.")
    prepare.add_argument("--name", required=True, help="Candidate name.")
    prepare.add_argument("--email", required=True, help="Candidate email.")
    prepare.add_argument("--phone", required=True, help="Candidate phone.")
    prepare.add_argument("--location", help="Candidate location.")
    prepare.add_argument("--linkedin", help="LinkedIn URL.")
    prepare.add_argument("--portfolio", help="Portfolio URL.")

    submit = subparsers.add_parser("submit", help="Review prepared applications (dry run).")
    submit.add_argument("--out", type=Path, default=Path("applications"), help="Output folder.")

    return parser.parse_args()


def run_prepare(args: argparse.Namespace) -> None:
    candidate = build_candidate(args)
    packages = prepare_packages(
        resume_path=args.resume,
        jobs_path=args.jobs,
        template_path=args.template,
        output_dir=args.out,
        candidate=candidate,
    )
    summarize_packages(packages)
    print(f"\nPackages saved to: {args.out.resolve()}")


def run_submit(args: argparse.Namespace) -> None:
    output_dir = args.out
    if not output_dir.exists():
        raise SystemExit(f"Output directory not found: {output_dir}")

    applications = list(output_dir.glob("*/application.json"))
    if not applications:
        raise SystemExit("No application packages found. Run prepare first.")

    print("Dry-run review of applications:")
    for application in applications:
        payload = json.loads(application.read_text(encoding="utf-8"))
        job = payload["job"]
        candidate = payload["candidate"]
        print(
            f"- {job['company']} | {job['title']} | {job['url']} -> {candidate['name']} ({candidate['email']})"
        )

    print("\nSubmission is intentionally manual to respect job board terms of service.")
    print("Use the generated cover letters and application JSON to apply on each site.")


def main() -> None:
    args = parse_args()
    if args.command == "prepare":
        run_prepare(args)
    elif args.command == "submit":
        run_submit(args)
    else:
        raise SystemExit("Unknown command")


if __name__ == "__main__":
    main()

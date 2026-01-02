# Job Apply Bot

Generate tailored application packages (cover letters + structured JSON) for multiple job listings using a single resume. The tool prepares everything you need to apply quickly while keeping the actual submission manual to respect job-board terms of service.

## Quick start

```bash
python app.py prepare \
  --resume sample_resume.txt \
  --jobs sample_jobs.csv \
  --name "Alex Candidate" \
  --email "alex@example.com" \
  --phone "+1-555-555-5555" \
  --location "Remote"
```

Review the generated packages:

```bash
python app.py submit --out applications
```

## Outputs

Each job gets a folder with:

- `cover_letter.md`
- `application.json`

## Customizing the cover letter

Edit `templates/cover_letter.md` and keep the `{placeholders}` intact. The resume text is injected as `{resume}`.

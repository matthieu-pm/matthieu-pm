"""Regenerate the discovery index and its bundled skill artifact.

Run from any directory: python3 apps/web/scripts/publish-agent-skills.py
To publish a newer Great UI release, update SOURCE_REVISION and rerun.
The archive includes the source references, license, and third-party notices.
"""

import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
from urllib.request import urlopen
import zipfile


SOURCE_REVISION = "a356843933b2ed0a9eece4aabb16bb8e159e93c9"
SOURCE_URL = f"https://codeload.github.com/matthieu-pm/great-ui/zip/{SOURCE_REVISION}"
DESTINATION = Path(__file__).resolve().parents[1] / "public/.well-known/agent-skills"


def main():
    with urlopen(SOURCE_URL, timeout=30) as response:
        source_bytes = response.read()

    artifact = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(source_bytes)) as source:
        with zipfile.ZipFile(artifact, "w", zipfile.ZIP_DEFLATED) as bundle:
            for entry in sorted(source.infolist(), key=lambda item: item.filename):
                if entry.is_dir():
                    continue
                path = PurePosixPath(entry.filename)
                if path.is_absolute() or ".." in path.parts or len(path.parts) < 2:
                    raise ValueError(f"Unsafe source path: {entry.filename}")
                if (entry.external_attr >> 16) & 0o170000 == 0o120000:
                    raise ValueError(f"Source symlink: {entry.filename}")
                # The RFC requires SKILL.md at the archive root, without GitHub's wrapper.
                target = zipfile.ZipInfo(str(PurePosixPath(*path.parts[1:])))
                target.compress_type = zipfile.ZIP_DEFLATED
                target.external_attr = 0o100644 << 16
                bundle.writestr(target, source.read(entry))

    artifact_bytes = artifact.getvalue()
    with zipfile.ZipFile(io.BytesIO(artifact_bytes)) as bundle:
        frontmatter = bundle.read("SKILL.md").decode("utf-8").split("---", 2)[1]
    # This pinned skill uses single-line name and description frontmatter fields.
    name = re.search(r"^name: (.+)$", frontmatter, re.MULTILINE).group(1)
    description = re.search(r"^description: (.+)$", frontmatter, re.MULTILINE).group(1)
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) or len(name) > 64:
        raise ValueError("Invalid skill name")
    if not 1 <= len(description) <= 1024:
        raise ValueError("Invalid skill description")

    digest = f"sha256:{hashlib.sha256(artifact_bytes).hexdigest()}"
    index = {
        "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
        "skills": [{
            "name": name,
            "type": "archive",
            "description": description,
            "url": f"/.well-known/agent-skills/{name}.zip",
            "digest": digest,
        }],
    }
    DESTINATION.mkdir(parents=True, exist_ok=True)
    (DESTINATION / f"{name}.zip").write_bytes(artifact_bytes)
    (DESTINATION / "index.json").write_text(json.dumps(index, indent=2) + "\n", encoding="utf-8")
    print(f"Published {name} from {SOURCE_REVISION}: {digest}")


if __name__ == "__main__":
    main()

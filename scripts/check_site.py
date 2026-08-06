#!/usr/bin/env python3
"""Dependency-free integrity checks for the static portfolio."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.references = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        for attribute in ("href", "src"):
            if values.get(attribute):
                self.references.append((tag, attribute, values[attribute]))
        if values.get("srcset"):
            for candidate in values["srcset"].split(","):
                self.references.append((tag, "srcset", candidate.strip().split()[0]))
        if tag == "img":
            for required in ("src", "alt", "width", "height"):
                if required not in values:
                    self.errors.append(f"img missing {required}: {values.get('src', '<unknown>')}")
        if tag == "iframe" and "title" not in values:
            self.errors.append(f"iframe missing title: {values.get('src', '<unknown>')}")
        if values.get("target") == "_blank" and "noreferrer" not in values.get("rel", "").split():
            self.errors.append(f"target=_blank missing rel=noreferrer: {values.get('href', '<unknown>')}")


def parse_page(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


pages = {path.resolve(): parse_page(path) for path in HTML_FILES}
failures = []

for page, parser in pages.items():
    failures.extend(f"{page.name}: {error}" for error in parser.errors)
    for _, _, reference in parser.references:
        parsed = urlsplit(reference)
        if parsed.scheme or reference.startswith(("//", "mailto:")):
            continue
        target = (page.parent / unquote(parsed.path)).resolve() if parsed.path else page
        if not target.exists():
            failures.append(f"{page.name}: missing {reference}")
            continue
        if parsed.fragment and target.suffix.lower() == ".html":
            target_parser = pages.get(target) or parse_page(target)
            if parsed.fragment not in target_parser.ids:
                failures.append(f"{page.name}: missing fragment #{parsed.fragment} in {target.name}")

if failures:
    print("Site checks failed:")
    for failure in failures:
        print(f"- {failure}")
    raise SystemExit(1)

print(f"Site checks passed for {len(HTML_FILES)} HTML pages.")

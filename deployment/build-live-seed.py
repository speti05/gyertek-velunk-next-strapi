"""Build seed-data-live.tar.gz from the full seed-data.tar.gz export.

The live archive keeps only the content the production site needs to come up:
the Page collection type, the Global / Home Page / Site Settings single types,
and the media library plus the roles, permissions and locales that make those
usable. Articles, blogs, events, newsletters, signups and contact requests -
several of which hold real personal data - are left out.

Run from the repo root:  python deployment/build-live-seed.py
"""

import io
import json
import os
import tarfile
from collections import Counter

SRC = "seed-data.tar.gz"
OUT = "seed-data-live.tar.gz"
NL = chr(10)

KEEP_TYPES = {
    "api::page.page",
    "api::global.global",
    "api::home-page.home-page",
    "api::site-setting.site-setting",
    "plugin::upload.file",
    "plugin::upload.folder",
    "plugin::i18n.locale",
    "plugin::users-permissions.role",
    "plugin::users-permissions.permission",
}


def load(t, prefix):
    for n in t.getnames():
        if n.startswith(prefix):
            raw = t.extractfile(n).read().decode("utf-8")
            return [json.loads(l) for l in raw.split(NL) if l.strip()]
    return []


src = tarfile.open(SRC, "r:gz")a google analytysc beállításához elvileg 
entities = load(src, "entities/")
links = load(src, "links/")

kept_entities = [e for e in entities if e["type"] in KEEP_TYPES]

entity_ids = {}
for e in kept_entities:
    entity_ids.setdefault(e["type"], set()).add(e["id"])
all_entity_types = {e["type"] for e in entities}


def side_ok(side):
    """A link endpoint is valid unless it names an entity row we dropped.

    Endpoints come in three shapes: an entity row (`api::page.page`), a
    component row (`elements.logo` - morph links only), or a documentId string
    (circular/localization links). Only the first kind can be checked here, and
    only that kind is backed by a foreign key: component rows are reached
    through polymorphic tables, which carry no FK constraints, and component ids
    are not derivable from the entity data (regular component fields, unlike
    dynamic-zone blocks, carry no `__component` marker). Validating those by
    guesswork is what silently stripped the header/footer logo relations in an
    earlier version of this script.
    """
    ty, ref = side.get("type"), side.get("ref")
    if ty in all_entity_types:
        return ty in entity_ids and ref in entity_ids[ty]
    return True


kept_links = [l for l in links if side_ok(l.get("left", {})) and side_ok(l.get("right", {}))]

dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
entities_blob = (NL.join(dumps(e) for e in kept_entities) + NL).encode("utf-8")
links_blob = (NL.join(dumps(l) for l in kept_links) + NL).encode("utf-8")

with tarfile.open(OUT, "w:gz") as dst:
    for member in src:
        if not member.isfile():
            dst.addfile(member)
            continue
        if member.name.startswith("entities/"):
            data = entities_blob
        elif member.name.startswith("links/"):
            data = links_blob
        else:
            data = src.extractfile(member).read()
        info = tarfile.TarInfo(member.name)
        info.size = len(data)
        info.mtime = member.mtime
        info.mode = member.mode
        info.type = member.type
        info.uid, info.gid = member.uid, member.gid
        info.uname, info.gname = member.uname, member.gname
        dst.addfile(info, io.BytesIO(data))
src.close()

print("entities:", len(entities), "->", len(kept_entities))
print("links:   ", len(links), "->", len(kept_links))
for ty, c in Counter(e["type"] for e in kept_entities).most_common():
    print("  ", c, ty)
print("size:", os.path.getsize(OUT))

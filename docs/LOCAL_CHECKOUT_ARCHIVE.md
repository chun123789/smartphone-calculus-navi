# Local checkout archive

On 2026-10-25, the owner requested that this Mac's inactive checkout be removed after the updated source was pushed and independently recovered. This repository retains the source; existing CI is retained. No new resident service is installed by this archive.

## Restore

1. Clone `https://github.com/chun123789/smartphone-calculus-navi.git` into a new directory.
2. Check out the archive commit that contains this document.
3. Before installing or running it, re-audit dependencies and use the current supported runtimes. The update was tested before this archive, but a later restore needs fresh verification.
4. Install dependencies using the committed lockfile and follow the normal README build/test instructions. Start it manually only when needed.

`local-checkout-sha256.json` records the SHA-256 of every source file from `07427571b90a49d05145063c379734c15cad827b` before these archive documents were added. Its checksums exclude these two archive documents. The archived source and these documents were recovered into a fresh independent clone and compared before local removal.

Dependency directories, generated builds, caches, browser test artifacts, local environment files and credentials are excluded from this archive. Local media is not uploaded.

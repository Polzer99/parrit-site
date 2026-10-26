#!/bin/sh
# Run after npm run build, against a local Next server on port 3210.
# Browser requests use tests/network-deny.setup.ts (localhost only).
set -eu
npm run qa:site-v1 -- --grep 'site V1 capture and proof' --workers=1

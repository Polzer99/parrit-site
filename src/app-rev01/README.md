# REV 01 application tree

This directory reserves the clean replacement tree for the REV 01 cutover.
Next.js 16 only discovers a directory named `app`, so files placed here are not
routes and cannot render the Lot 1 verification surface.

For Lot 1, `/system` therefore lives in the isolated root-layout subtree
`src/app/system/`. It is additive and does not modify any legacy route. All
reusable REV 01 implementation lives in `src/system/`; later lots can assemble
their pages here before the final atomic swap to `src/app/`.

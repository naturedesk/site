# BON in a Box on Spark, Daily Checklist

## Purpose
Keep the local Spark arm64 BON in a Box path operational and detect regressions early.

## Daily checks
1. Confirm core containers are up or can be brought up
2. Confirm routed endpoints respond:
   - `/tiler/`
   - `/script/list`
   - `/pipeline/list`
3. Run one hello-world end-to-end execution
4. Confirm pipeline status is `completed`
5. Confirm expected outputs are present:
   - `increment: 4`
   - `crs_id: EPSG:4326`
6. Confirm fresh artifacts remain owned by `hans:docker`
7. Check upstream GitHub for relevant branch or default-branch updates
8. Record any blocker or regression immediately

## Regression rule
If a daily check fails, classify the first hard blocker before attempting broad rebuilds.

## Update rule
If GitHub contains a relevant upstream change, compare first before applying any local fix.

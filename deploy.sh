#!/usr/bin/env bash
# Build + deploy the diamond-client UI in one command.
#   Usage:  ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

KEY="/Users/rajesh/Documents/diamond.pem"
HOST="ubuntu@15.252.138.172"
SRC="dist"                       # Vite build output (this project)
DEST="/home/ubuntu/ui/diamond-client"   # pm2-served static folder
PM2_APP="diamond-client"
URL="http://15.252.138.172:5176"

echo "▶ Building ($SRC) …"
npm run build
[ -f "$SRC/index.html" ] || { echo "✗ $SRC/index.html missing — build failed"; exit 1; }

echo "▶ Uploading to $HOST:$DEST …"
COPYFILE_DISABLE=1 tar czf - -C "$SRC" . | ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "$HOST" "set -e; \
  mkdir -p '$DEST'; \
  rm -rf '$DEST'/*; \
  tar xzf - -C '$DEST'; \
  find '$DEST' \\( -name '._*' -o -name '.DS_Store' \\) -delete"

echo "▶ Restarting pm2 service ($PM2_APP) …"
ssh -i "$KEY" "$HOST" "pm2 restart '$PM2_APP'"

echo "✓ Deployed → $URL"

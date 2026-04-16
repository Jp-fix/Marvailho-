#!/usr/bin/env bash
# Build local → rsync du dossier dist/ sur le VPS derrière nginx.
# Variables attendues (via .env.deploy ou environnement) :
#   DEPLOY_USER  — utilisateur SSH
#   DEPLOY_HOST  — hôte (ex: vps.example.tld)
#   DEPLOY_PATH  — chemin distant (ex: /var/www/reading)
#   DEPLOY_PORT  — port SSH (optionnel, défaut 22)

set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env.deploy ]]; then
  # shellcheck disable=SC1091
  set -a; source .env.deploy; set +a
fi

: "${DEPLOY_USER:?DEPLOY_USER non défini}"
: "${DEPLOY_HOST:?DEPLOY_HOST non défini}"
: "${DEPLOY_PATH:?DEPLOY_PATH non défini}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

echo "→ Installation des dépendances"
npm ci

echo "→ Build"
npm run build

echo "→ Déploiement vers ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
rsync -avz --delete \
  -e "ssh -p ${DEPLOY_PORT}" \
  dist/ \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "✓ Déploiement terminé."

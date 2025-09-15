#!/bin/bash
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p backups
cp src/App.jsx backups/App.jsx.$timestamp
cp -r supabase/functions/process-parseur-webhook backups/webhook.$timestamp
echo "Backup criado: backups/*.$timestamp"

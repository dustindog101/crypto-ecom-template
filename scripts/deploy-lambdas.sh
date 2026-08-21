#!/bin/bash
set -e

echo "🚀 Building and Packaging Serverless Payment Watcher..."

cd "$(dirname "$0")/.."
mkdir -p dist/lambdas

cd lambdas/payment_watcher
zip -r ../../dist/lambdas/payment_watcher.zip . -x "*.pyc" -x "__pycache__/*"
cd ../..

echo "📦 Packaged: dist/lambdas/payment_watcher.zip"
echo "✅ Ready for deployment via AWS CLI or AWS SAM ('sam deploy')."

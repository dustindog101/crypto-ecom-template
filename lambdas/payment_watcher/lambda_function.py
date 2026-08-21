"""
Payment Watcher Lambda Function
Triggered periodically (e.g. EventBridge rate(2 minutes)) to reconcile active crypto payment intents.
"""
import os
import json
from adapters.esplora import check_esplora_payment
from adapters.etherscan_v2 import check_evm_usdc_payment
from adapters.solana_rpc import check_solana_payment

def check_intent(asset: str, address: str, expected_atomic: int) -> dict:
    if asset in ('btc', 'ltc'):
        return check_esplora_payment(asset, address, expected_atomic)
    elif asset in ('usdc_ethereum', 'usdc_base', 'usdc_polygon'):
        return check_evm_usdc_payment(asset, address, expected_atomic)
    elif asset in ('sol', 'usdc_solana'):
        return check_solana_payment(asset, address, expected_atomic)
    return {'matched': False, 'tx_hash': None, 'confirmations': 0}

def lambda_handler(event, context):
    print("🚀 Starting Payment Watcher execution...")
    # In production, query active pending/detected intents from DB, verify against blockchain,
    # and update payment status / trigger fulfillment events.
    return {
        'statusCode': 200,
        'body': json.dumps({'status': 'ok', 'message': 'Payment watcher completed successfully.'})
    }

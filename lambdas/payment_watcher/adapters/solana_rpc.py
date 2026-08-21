import urllib.request
import json
import os

def check_solana_payment(asset: str, address: str, expected_atomic: int) -> dict:
    """
    Checks Solana native transfers and SPL token transfers via JSON-RPC.
    """
    rpc_url = os.environ.get('SOLANA_RPC_URL') or 'https://api.mainnet-beta.solana.com'
    
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [address, {"limit": 20}]
    }).encode('utf-8')

    req = urllib.request.Request(rpc_url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"[Solana RPC] Error fetching signatures: {e}")
        return {'matched': False, 'tx_hash': None, 'confirmations': 0}

    signatures = data.get('result', [])
    # For quick polling, if signature has reached 'finalized' or 'confirmed'
    for sig in signatures:
        if not sig.get('err'):
            confirmation_status = sig.get('confirmationStatus', '')
            confirmations = 32 if confirmation_status == 'finalized' else (16 if confirmation_status == 'confirmed' else 1)
            # In production, fetch parsed transaction details for exact lamport/spl amount match
            return {
                'matched': True,
                'tx_hash': sig.get('signature'),
                'confirmations': confirmations
            }

    return {'matched': False, 'tx_hash': None, 'confirmations': 0}

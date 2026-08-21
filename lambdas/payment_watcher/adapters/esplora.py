import urllib.request
import json

def check_esplora_payment(asset: str, address: str, expected_atomic: int) -> dict:
    """
    Checks recent transactions on Bitcoin/Litecoin address via public Esplora API.
    Returns: {'matched': bool, 'tx_hash': str|None, 'confirmations': int}
    """
    base_url = "https://mempool.space/api" if asset == "btc" else "https://litecoinspace.org/api"
    url = f"{base_url}/address/{address}/txs"
    
    req = urllib.request.Request(url, headers={'User-Agent': 'CryptoStore-Watcher/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            txs = json.loads(response.read().decode())
    except Exception as e:
        print(f"[Esplora] Error fetching txs for {address}: {e}")
        return {'matched': False, 'tx_hash': None, 'confirmations': 0}

    for tx in txs:
        for vout in tx.get('vout', []):
            if vout.get('scriptpubkey_address') == address:
                value_sat = vout.get('value', 0)
                if value_sat == expected_atomic:
                    status = tx.get('status', {})
                    confirmed = status.get('confirmed', False)
                    block_height = status.get('block_height', 0)
                    confirmations = 1 if confirmed else 0
                    return {
                        'matched': True,
                        'tx_hash': tx.get('txid'),
                        'confirmations': confirmations
                    }

    return {'matched': False, 'tx_hash': None, 'confirmations': 0}

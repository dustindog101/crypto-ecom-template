import urllib.request
import json
import os

CHAIN_CONFIG = {
    'usdc_ethereum': {
        'api_url': 'https://api.etherscan.io/v2/api?chainid=1',
        'contract': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    },
    'usdc_base': {
        'api_url': 'https://api.basescan.org/api',
        'contract': '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
    },
    'usdc_polygon': {
        'api_url': 'https://api.polygonscan.com/api',
        'contract': '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'
    }
}

def check_evm_usdc_payment(asset: str, address: str, expected_atomic: int) -> dict:
    """
    Checks recent ERC-20 token transfers for EVM chains.
    """
    cfg = CHAIN_CONFIG.get(asset)
    if not cfg:
        return {'matched': False, 'tx_hash': None, 'confirmations': 0}

    api_key = os.environ.get('ETHERSCAN_API_KEY', '')
    url = f"{cfg['api_url']}&module=account&action=tokentx&contractaddress={cfg['contract']}&address={address}&page=1&offset=25&sort=desc&apikey={api_key}"

    req = urllib.request.Request(url, headers={'User-Agent': 'CryptoStore-Watcher/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"[EVM Watcher] Error querying {asset}: {e}")
        return {'matched': False, 'tx_hash': None, 'confirmations': 0}

    result = data.get('result', [])
    if isinstance(result, list):
        for tx in result:
            if tx.get('to', '').lower() == address.lower():
                value = int(tx.get('value', '0'))
                if value == expected_atomic:
                    confirmations = int(tx.get('confirmations', '1'))
                    return {
                        'matched': True,
                        'tx_hash': tx.get('hash'),
                        'confirmations': confirmations
                    }

    return {'matched': False, 'tx_hash': None, 'confirmations': 0}

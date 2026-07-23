"""My Naishin API / MCP サンプルコード（Python 3.8以降・要 pip install requests）
実行: python python-requests-example.py
"""

import requests

BASE_URL = "https://my-naishin.com"


def get_prefecture_detail(code: str) -> dict:
    """REST API: 都道府県の内申点計算方式の詳細を取得（GET・認証不要）。"""
    res = requests.get(f"{BASE_URL}/api/naishin/{code}")
    res.raise_for_status()
    return res.json()


def reverse_calc_naishin(code: str, target: int) -> dict:
    """REST API: 目標内申点から逆算（必要評定平均＋効率の良い教科）。"""
    res = requests.get(f"{BASE_URL}/api/naishin/{code}", params={"target": target})
    res.raise_for_status()
    return res.json()


def calculate_naishin_via_mcp(prefecture_code: str, scores: dict) -> dict:
    """MCP: 生徒の9教科評定（1〜5）から内申点を計算する（calculate_naishinツール・全47都道府県対応）。"""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": "calculate_naishin",
            "arguments": {"prefectureCode": prefecture_code, "scores": scores},
        },
    }
    res = requests.post(f"{BASE_URL}/api/mcp", json=payload)
    res.raise_for_status()
    rpc = res.json()
    # MCPのtools/callはJSON-RPC 2.0標準に従い、結果がcontent[0].textにJSON文字列で入る
    import json
    return json.loads(rpc["result"]["content"][0]["text"])


def calculate_total_score_if_supported(prefecture_code: str, academic_raw: int, report_raw: int):
    """REST API: 内申点×当日点の総合得点（対応5県のみ・非対応県は404を返すので分岐する）。"""
    res = requests.get(
        f"{BASE_URL}/api/total-score/{prefecture_code}",
        params={"academicRaw": academic_raw, "reportRaw": report_raw},
    )
    if res.status_code == 404:
        return None  # 兵庫・京都・栃木・新潟・鳥取の5県のみ対応
    res.raise_for_status()
    return res.json()


def main():
    print("=== 1) 東京都の内申点計算方式の詳細 ===")
    tokyo = get_prefecture_detail("tokyo")
    print(str(tokyo)[:400], "...\n")

    print("=== 2) 目標内申240点への逆算（東京都） ===")
    reverse = reverse_calc_naishin("tokyo", 240)
    print(reverse, "\n")

    print("=== 3) 評定からの内申点計算（兵庫県・MCP経由） ===")
    scores = {
        "japanese": 4, "math": 4, "english": 5, "science": 3, "social": 4,
        "music": 4, "art": 3, "pe": 4, "tech": 3,
    }
    naishin = calculate_naishin_via_mcp("hyogo", scores)
    print(naishin, "\n")

    print("=== 4) 総合得点（兵庫県・内申点×当日点） ===")
    total_score = calculate_total_score_if_supported("hyogo", 420, naishin["total"])
    print(total_score)

    print("\n=== 5) 総合得点が非対応の県の例（東京都は総合得点API未対応→None） ===")
    unsupported = calculate_total_score_if_supported("tokyo", 500, 200)
    print("tokyo total-score:", unsupported)  # None


if __name__ == "__main__":
    main()

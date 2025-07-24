import json
import sys
import os

def convert_cookies(input_path, output_path):
    with open(input_path, "r") as f:
        data = json.load(f)

    converted = {
        "cookies": [],
        "local_storage": [],
        "url": "about:blank"
    }

    for domain, cookies in data.items():
        for cookie in cookies:
            converted_cookie = {
                "domain": cookie["domain"],
                "expires": cookie.get("expires", -1),
                "hostOnly": not cookie["domain"].startswith("."),
                "httpOnly": cookie.get("httpOnly", False),
                "name": cookie["name"],
                "path": cookie.get("path", "/"),
                "sameSite": (
                    cookie.get("sameSite", "lax").lower()
                    if cookie.get("sameSite", "unspecified") != "unspecified"
                    else "lax"
                ),
                "secure": cookie.get("secure", False),
                "session": not isinstance(cookie.get("expires", -1), (int, float)) or cookie.get("expires", -1) < 0,
                "sourcePort": 443,
                "value": cookie["value"]
            }
            converted["cookies"].append(converted_cookie)

    with open(output_path, "w") as f:
        json.dump(converted, f, indent=2)

if __name__ == "__main__":
    if sys.argv[1] == "--help" or sys.argv[1] == "-h":
        print("Usage: python converter.py <input_file>")
        print("Converts cookies from a JSON file to Cuddlephish format.")
        sys.exit(0)
        
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <input_file>")
        sys.exit(1)

    input_file = sys.argv[1]

    if not os.path.isfile(input_file):
        print(f"Error: File '{input_file}' not found.")
        sys.exit(1)

    output_file = "cuddlephish_cookies.json"
    convert_cookies(input_file, output_file)
    print(f"[+] Converted cookies saved to: {output_file}")
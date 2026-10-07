import subprocess, time, json, urllib.request, websocket, tempfile, http.server, socketserver, threading, os, sys, base64

workspace_dir = r"c:\Users\HP\OneDrive\Desktop\MyDearTeenager"
os.chdir(workspace_dir)

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
PORT = httpd.server_address[1]
data_dir = tempfile.mkdtemp()
threading.Thread(target=httpd.serve_forever, daemon=True).start()

debug_port = 9544
proc = subprocess.Popen([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    f"--user-data-dir={data_dir}",
    f"--remote-debugging-port={debug_port}",
    "--remote-allow-origins=*",
    "--window-size=1200,600",
    "--no-sandbox",
    "--disable-gpu",
    f"http://127.0.0.1:{PORT}/scratch/test_all_10.html"
])

time.sleep(2)
try:
    with urllib.request.urlopen(f"http://127.0.0.1:{debug_port}/json") as r:
        targets = json.loads(r.read())
        ws_url = [t["webSocketDebuggerUrl"] for t in targets if t.get("type") == "page"][0]

    ws = websocket.create_connection(ws_url)
    mid = 1
    def send(m, p=None):
        global mid
        mid += 1
        ws.send(json.dumps({"id": mid, "method": m, "params": p or {}}))
        while True:
            res = json.loads(ws.recv())
            if res.get("id") == mid: return res.get("result", {})

    send("Runtime.enable")
    send("Page.enable")

    time.sleep(1)
    shot = send("Page.captureScreenshot", {"format": "png"})
    out_path = r"C:\Users\HP\.gemini\antigravity\brain\3feff66f-9500-43ea-a11c-18ceeb72253c\test_all_10.png"
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(shot["data"]))
    print("SAVED:", out_path)
finally:
    proc.terminate()


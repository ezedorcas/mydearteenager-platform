import subprocess, time, json, urllib.request, websocket, tempfile, http.server, socketserver, threading, os, sys, base64

workspace_dir = r"c:\Users\HP\OneDrive\Desktop\MyDearTeenager"
os.chdir(workspace_dir)

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
PORT = httpd.server_address[1]
data_dir = tempfile.mkdtemp()
threading.Thread(target=httpd.serve_forever, daemon=True).start()

debug_port = 9560
proc = subprocess.Popen([
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    f"--user-data-dir={data_dir}",
    f"--remote-debugging-port={debug_port}",
    "--remote-allow-origins=*",
    "--window-size=1440,1100",
    "--no-sandbox",
    "--disable-gpu",
    f"http://127.0.0.1:{PORT}/auth.html#projects"
])

time.sleep(3)
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

    def wait_for(expr, timeout=30):
        t0 = time.time()
        while time.time() - t0 < timeout:
            r = send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
            v = r.get("result", {}).get("value")
            if v: return v
            time.sleep(0.5)
        return None

    # Setup session
    send("Runtime.evaluate", {"expression": """
        localStorage.setItem("mdt-account", JSON.stringify({
            name: "Daniel",
            email: "daniel@mydearteenager.com",
            avatar: "Images/avatar-daniel.png"
        }));
        localStorage.setItem("mdt-userdata-daniel@mydearteenager.com", JSON.stringify({
            email: "daniel@mydearteenager.com",
            userLevel: 4,
            userXp: 2400,
            streak: 1,
            lastStreakDate: null,
            projects: []
        }));
        window.location.hash = "projects";
    """})
    send("Page.navigate", {"url": f"http://127.0.0.1:{PORT}/auth.html#projects"})

    btn_ready = wait_for("(() => !!document.querySelector('.new-project-primary-btn'))()", 30)
    print("New Project button ready:", btn_ready)

    # Click "+ New Project"
    send("Runtime.evaluate", {"expression": "document.querySelector('.new-project-primary-btn').click()"})
    wait_for("!!document.querySelector('.np-modal-outer-frame')", 5)
    time.sleep(1)

    # Fill form
    fill_form_code = """
        (() => {
            const setVal = (el, val) => {
                const d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') || Object.getOwnPropertyDescriptor(el.__proto__, 'value');
                if (d && d.set) d.set.call(el, val); else el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            };
            const setTextareaVal = (el, val) => {
                const d = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
                if (d && d.set) d.set.call(el, val); else el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            };

            const titleInput = document.querySelector(".np-field-input[placeholder*='Personal Portfolio']");
            if (titleInput) setVal(titleInput, "Personal Portfolio Design");

            const skillsInput = document.querySelector(".np-field-input[placeholder*='UI/UX']");
            if (skillsInput) setVal(skillsInput, "UI/UX, layout");

            const descInput = document.querySelector(".np-field-textarea");
            if (descInput) setTextareaVal(descInput, "A creative portfolio site built with Figma designs.");

            // Select category
            const catSelector = document.querySelector(".np-custom-selector");
            if (catSelector) catSelector.click();
        })()
    """
    send("Runtime.evaluate", {"expression": fill_form_code})
    time.sleep(0.5)

    # Click category option
    send("Runtime.evaluate", {"expression": """
        (() => {
            const btn = Array.from(document.querySelectorAll(".np-cat-option-btn")).find(b => b.textContent.trim() === "Design");
            if (btn) btn.click();
        })()
    """})
    time.sleep(1)

    # Submit form
    send("Runtime.evaluate", {"expression": "document.querySelector('.np-btn-submit')?.click();"})
    wait_for("!!document.querySelector('.po-modal-outer-frame')", 8)
    time.sleep(1)

    # Select AI Model 1
    send("Runtime.evaluate", {"expression": """
        (() => {
            const card = Array.from(document.querySelectorAll('.po-mentor-card')).find(c => c.textContent.includes('AI Model 1'));
            if (card) card.click();
        })()
    """})
    time.sleep(0.5)

    # Confirm and create project
    send("Runtime.evaluate", {"expression": "document.querySelector('.po-btn-create-project')?.click();"})
    wait_for("!!document.querySelector('.op-workspace-card')", 8)
    time.sleep(1)

    # Click "Open Workspace"
    send("Runtime.evaluate", {"expression": "document.querySelector('.op-workspace-card')?.click();"})
    wait_for("!!document.querySelector('.workspace-page-container')", 6)
    time.sleep(1)

    tools_count = send("Runtime.evaluate", {"expression": "document.querySelectorAll('.ws-tool-card').length", "returnByValue": True})["result"]["value"]
    print("Workspace tool cards count:", tools_count)

    # Scroll tools section into center
    send("Runtime.evaluate", {"expression": "document.querySelector('.ws-tools-grid').scrollIntoView({ behavior: 'instant', block: 'center' })"})
    time.sleep(1)

    # Capture tools grid screenshot
    clip = send("Runtime.evaluate", {"expression": """
        (() => {
            const grid = document.querySelector('.ws-tools-grid');
            if (!grid) return null;
            const r = grid.getBoundingClientRect();
            return { x: Math.max(0, r.left - 20), y: Math.max(0, r.top - 50), width: r.width + 40, height: r.height + 70, scale: 1 };
        })()
    """, "returnByValue": True})["result"].get("value")

    if clip:
        shot_crop = send("Page.captureScreenshot", {"format": "png", "clip": clip})
        out_crop = r"C:\Users\HP\.gemini\antigravity\brain\3feff66f-9500-43ea-a11c-18ceeb72253c\live_workspace_tools_grid.png"
        with open(out_crop, "wb") as f:
            f.write(base64.b64decode(shot_crop["data"]))
        print("Saved live crop to:", out_crop)

    # Capture full page screenshot as well
    full_shot = send("Page.captureScreenshot", {"format": "png"})
    out_full = r"C:\Users\HP\.gemini\antigravity\brain\3feff66f-9500-43ea-a11c-18ceeb72253c\live_workspace_full.png"
    with open(out_full, "wb") as f:
        f.write(base64.b64decode(full_shot["data"]))
    print("Saved full page screenshot to:", out_full)

finally:
    proc.terminate()


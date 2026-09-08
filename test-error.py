from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
        
        try:
            page.goto("http://localhost:5173", timeout=15000, wait_until="networkidle")
            time.sleep(2)
            
            content = page.content()
            if "Error Details:" in content:
                print("FOUND ERROR DETAILS IN DOM:")
                locator = page.locator("div", has_text="Error Details:")
                print(locator.all_inner_texts())
        except Exception as e:
            print(f"Script Error: {e}")
        
        browser.close()

run()

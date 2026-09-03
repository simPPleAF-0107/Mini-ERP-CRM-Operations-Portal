"""
Mini ERP + CRM Operations Portal — Launcher
Double-click this file or run: python run.py
"""

import subprocess
import sys
import time
import webbrowser
import threading
import shutil


FRONTEND_URL = "http://localhost:5173"
BACKEND_URL = "http://localhost:3000"


def print_banner():
    print()
    print("  ╔════════════════════════════════════════╗")
    print("  ║   Mini ERP + CRM Operations Portal     ║")
    print("  ╚════════════════════════════════════════╝")
    print()


def check_docker():
    """Check if Docker is installed and running."""
    if not shutil.which("docker"):
        print("  [ERROR] Docker is not installed!")
        print()
        print("  Download Docker Desktop from:")
        print("  https://www.docker.com/products/docker-desktop")
        return False

    result = subprocess.run(
        ["docker", "info"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("  [ERROR] Docker is not running!")
        print()
        print("  Please start Docker Desktop and try again.")
        return False

    print("  [OK] Docker is running")
    return True


def check_docker_compose():
    """Check if docker-compose is available."""
    # Try 'docker compose' (v2) first, then 'docker-compose' (v1)
    for cmd in [["docker", "compose", "version"], ["docker-compose", "version"]]:
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                return cmd[:len(cmd)-1]  # Return the base command without 'version'
        except FileNotFoundError:
            continue

    print("  [ERROR] docker-compose is not available!")
    return None


def open_browser_delayed(url, delay=15):
    """Open browser after a delay to let services start."""
    time.sleep(delay)
    print(f"\n  Opening browser at {url} ...")
    webbrowser.open(url)


def main():
    print_banner()

    # Pre-flight checks
    if not check_docker():
        input("\n  Press Enter to exit...")
        sys.exit(1)

    compose_cmd = check_docker_compose()
    if not compose_cmd:
        input("\n  Press Enter to exit...")
        sys.exit(1)

    print("  [OK] Docker Compose is available")
    print()
    print("  Starting all services (PostgreSQL + Backend + Frontend)...")
    print("  This may take a few minutes on first run.")
    print()
    print("  ┌────────────────────────────────────────┐")
    print(f"  │  Frontend :  {FRONTEND_URL:<24} │")
    print(f"  │  Backend  :  {BACKEND_URL:<24} │")
    print("  └────────────────────────────────────────┘")
    print()
    print("  Login:  admin@erp.com / admin123")
    print()
    print("  Press Ctrl+C to stop all services.")
    print()

    # Open browser after delay (background thread)
    browser_thread = threading.Thread(
        target=open_browser_delayed,
        args=(FRONTEND_URL,),
        daemon=True,
    )
    browser_thread.start()

    # Run docker-compose up --build
    try:
        subprocess.run(
            [*compose_cmd, "up", "--build"],
            cwd=sys.path[0] or ".",  # Run from script's directory
        )
    except KeyboardInterrupt:
        print("\n\n  Stopping services...")
        subprocess.run(
            [*compose_cmd, "down"],
            cwd=sys.path[0] or ".",
        )
        print("  All services stopped. Goodbye!")


if __name__ == "__main__":
    main()

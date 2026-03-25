import sys, http.server

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
directory = "/Users/liyu/Documents/Bot/ipss-app"

handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(
    *args, directory=directory, **kwargs
)
with http.server.HTTPServer(("", port), handler) as httpd:
    print(f"Serving {directory} on port {port}", flush=True)
    httpd.serve_forever()

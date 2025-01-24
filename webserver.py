from tornado.ioloop import IOLoop
from tornado.web import Application, StaticFileHandler

app = Application([
    (r"/(.*)", StaticFileHandler, {"path": "site", "default_filename": "index.html"}),
])

if __name__ == "__main__":
    app.listen(8000)
    print("Servidor rodando em http://localhost:8000")
    IOLoop.current().start()

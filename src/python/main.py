import logging

logging.basicConfig(level=logging.INFO)

from server import GestureServer


class Application:
    @staticmethod
    def run():
        server = GestureServer()
        server.run()


if __name__ == "__main__":
    Application.run()

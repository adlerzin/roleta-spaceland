import asyncio
import websockets

# Armazena todas as conexões ativas
conexoes = set()

async def handler(websocket, path):
    # Adiciona a nova conexão ao conjunto
    conexoes.add(websocket)
    try:
        async for mensagem in websocket:
            print(f"Mensagem recebida: {mensagem}")
            # Envia a mensagem para todas as outras conexões
            for conexao in conexoes:
                if conexao != websocket:  # Não envia de volta para quem mandou
                    await conexao.send(mensagem)
                    print("Mensagem enviada para outro cliente")
    finally:
        # Remove a conexão quando ela é fechada
        conexoes.remove(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("Servidor WebSocket iniciado em ws://localhost:8765")
        await asyncio.Future()  # Roda indefinidamente

if __name__ == "__main__":
    asyncio.run(main())

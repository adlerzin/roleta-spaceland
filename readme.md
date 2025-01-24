# 🎮 Space Land - Sistema de Sorteio

Sistema de sorteio para o jogo Space Land, incluindo uma roleta interativa e controles para diferentes modos de jogo.

## 📋 Descrição

Este projeto consiste em um sistema de sorteio web com uma roleta animada e interfaces de controle para diferentes modos de jogo do Space Land. O sistema utiliza WebSocket para comunicação em tempo real e um servidor HTTP para servir os arquivos estáticos.

## 🚀 Funcionalidades

- Roleta animada para sorteios
- Interface de controle mobile
- Diferentes modos de jogo:
  - 1 vs 3
  - Duelo
  - 2 vs 2
  - 4 Players
  - Bowser
- Tela de espera com redirecionamento automático
- Design responsivo (suporte para TV 4K e 1080p)

## 🛠️ Tecnologias Utilizadas

- Python 3
- WebSocket (websockets)
- Tornado Web Server
- HTML5
- CSS3
- JavaScript
- WebSocket API

## 🚀 Como Executar

1. Instale as dependências:
pip install websockets tornado

2. Inicie o servidor WebSocket:
python server.py

3. Em outro terminal, inicie o servidor Tornado:
python webserver.py

4. Acesse as interfaces:
- Tela Principal: `http://localhost:8000`
- Controle: `http://localhost:8000/controle`

## 🔧 Configuração

- O servidor WebSocket roda na porta 8765
- O servidor HTTP roda na porta 8000
- Para uso em rede local, substitua `localhost` pelo IP da máquina

## 📱 Interfaces

- **Tela de Espera**: Interface principal que aguarda comandos
- **Controle**: Interface para controlar a roleta
- **Roleta**: Interface animada para sorteios em diferentes modos:
  - 1v3: Um jogador contra três
  - 2v2: Dois times de dois jogadores
  - 4players: Todos contra todos
  - Duelo: Um contra um
  - Bowser: Modo especial Bowser

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Autor

- Adler (aka Springzito)

## 🙏 Agradecimentos

- superwiifan

let items = [];
let isSpinning = false;
let currentRotation = 0; // Adicionando variável para controlar a rotação atual
// Carrega o arquivo sorteio.txt ao iniciar
fetch('sorteio.txt')
    .then(response => response.text())
    .then(data => {
        items = data.split('\n')
            .filter(item => item.trim() !== '')
            .map(item => item.split(',')[0].trim()); // Pega apenas o texto antes da vírgula
        setupWheel();
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo:', error);
        document.getElementById('result').textContent = 'Erro ao carregar o arquivo sorteio.txt';
    });

function setupCanvas() {
    const canvas = document.getElementById('wheel');
    // Detecta se é 4K baseado na largura da tela
    const is4K = window.screen.width >= 3840;
    const size = is4K ? 1600 : 900;
    
    canvas.width = size;
    canvas.height = size;
    
    return size;
}

function setupWheel() {
    const size = setupCanvas();
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const center = size / 2;
    const radius = center - 20;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const sliceAngle = (2 * Math.PI) / items.length;
    const colors = [
        '#5865F2',
        '#3B1C7C',
        '#251351',
        '#4B3B8C',
        '#2E235D',
        '#1E1238'
    ];
    
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Aumentando o tamanho mínimo e máximo da fonte
    let fontSize = Math.min(48, Math.max(24, Math.floor(800 / items.length)));
    const maxTextWidth = radius * 0.8;
    
    function adjustFontSize() {
        let maxWidth = 0;
        ctx.font = `bold ${fontSize}px Poppins`;
        
        for (let item of items) {
            const width = ctx.measureText(item).width;
            maxWidth = Math.max(maxWidth, width);
        }
        
        if (maxWidth > maxTextWidth) {
            fontSize = fontSize * (maxTextWidth / maxWidth);
            fontSize = Math.floor(fontSize);
        }
        
        return `bold ${fontSize}px Poppins`;
    }
    
    const finalFont = adjustFontSize();
    
    for (let i = 0; i < items.length; i++) {
        // Desenha o setor
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.lineTo(center, center);
        ctx.fill();
        
        // Adiciona o gradiente
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Adiciona texto
        ctx.save();
        ctx.translate(center, center);
        
        // Calcula o ângulo médio do setor
        const middleAngle = i * sliceAngle + sliceAngle / 2;
        
        // Rotaciona para o ângulo do setor
        ctx.rotate(middleAngle);
        
        // Configura o texto
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.font = finalFont;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 8;
        
        // Ajusta a distância do texto do centro baseado no número de itens
        const textDistance = radius * (items.length > 15 ? 0.65 : 0.75); // Mais próximo do centro se tiver muitos itens
        
        // Quebra o texto em duas linhas se for muito longo
        const maxChars = Math.floor(maxTextWidth / (fontSize * 0.6)); // Aproximadamente 0.6 é a largura média de um caractere
        let text = items[i];
        if (text.length > maxChars) {
            const middleIndex = Math.floor(text.length / 2);
            const spaceIndex = text.lastIndexOf(' ', middleIndex);
            if (spaceIndex > 0) {
                const line1 = text.substring(0, spaceIndex);
                const line2 = text.substring(spaceIndex + 1);
                ctx.fillText(line1, textDistance, -fontSize/2);
                ctx.fillText(line2, textDistance, fontSize/2);
            } else {
                ctx.fillText(text, textDistance, 0);
            }
        } else {
            ctx.fillText(text, textDistance, 0);
        }
        
        ctx.restore();
    }
}

document.getElementById('spin').addEventListener('click', function() {
    if (isSpinning || items.length === 0) return;
    
    isSpinning = true;
    document.getElementById('result').style.visibility = 'hidden';
    const spinButton = document.getElementById('spin');
    spinButton.classList.add('hidden');
    
    const canvas = document.getElementById('wheel');
    const newRotation = 3600 + Math.random() * 360; // Removemos currentRotation daqui
    
    // Remove a transição e define a rotação atual
    canvas.style.transition = 'none';
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    // Força um reflow
    void canvas.offsetWidth;
    
    // Aplica a nova rotação com transição
    canvas.style.transition = 'transform 5s cubic-bezier(0.2, 0, 0.3, 1)';
    canvas.style.transform = `rotate(${currentRotation + newRotation}deg)`;
    
    // Aguarda o fim da animação
    setTimeout(() => {
        isSpinning = false;
        spinButton.classList.remove('hidden');
        
        currentRotation = (currentRotation + newRotation) % 360;
        
        const finalAngle = currentRotation * (Math.PI / 180);
        const sliceAngle = (2 * Math.PI) / items.length;
        const winningIndex = items.length - Math.floor(finalAngle / sliceAngle) - 1;
        
        // Busca o texto completo do item sorteado no arquivo original
        fetch('sorteio.txt')
            .then(response => response.text())
            .then(data => {
                const linhas = data.split('\n').filter(item => item.trim() !== '');
                const linhaCompleta = linhas[winningIndex];
                const [nome, ...descricaoParts] = linhaCompleta.split(',');
                const descricao = descricaoParts.join(',').trim();
                
                mostrarCarta(nome, descricao);
            });
    }, 5000);
});

function mostrarCarta(nome, descricao) {
    // Cria o overlay se não existir
    let overlay = document.querySelector('.overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    // Cria o popup se não existir
    let popup = document.querySelector('#popup-carta');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popup-carta';
        popup.innerHTML = `
            <div class="carta-container">
                <div class="carta-header">
                    <div class="carta-simbolo">♠</div>
                    <div class="carta-titulo">${nome}</div>
                    <div class="carta-simbolo">♠</div>
                </div>
                <div class="carta-corpo">
                    <div class="carta-descricao">${descricao}</div>
                </div>
                <div class="carta-footer">
                    <div class="carta-simbolo rotate">♠</div>
                    <button class="carta-fechar">Fechar</button>
                    <div class="carta-simbolo rotate">♠</div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        ws.send('abriuPopup');

        // Adiciona evento de fechar
        popup.querySelector('.carta-fechar').addEventListener('click', () => {
            popup.classList.remove('show');
            overlay.classList.remove('show');
        });
    } else {
        popup.querySelector('.carta-titulo').textContent = nome;
        popup.querySelector('.carta-descricao').textContent = descricao;
    }

    // Mostra o popup e overlay
    overlay.classList.add('show');
    popup.classList.add('show');
}

const ws = new WebSocket('ws://192.168.3.10:8765');

ws.onopen = function() {
    console.log('Conectado ao servidor WebSocket');
};

ws.onmessage = function(event) {
    if (event.data === 'rodou') {
        document.getElementById('spin').click();
    }
    if (event.data === 'voltar') {
        window.location.href = '/';
    }
    if (event.data === 'fechar') {
    document.querySelector('.carta-fechar').click();
    }
};

ws.onerror = function(error) {
    console.error('Erro WebSocket:', error);
};

// Adiciona um listener para redimensionamento da janela
window.addEventListener('resize', function() {
    setupWheel();
});

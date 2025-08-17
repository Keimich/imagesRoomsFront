# Frontend da Lousa Colaborativa (imagesRoomsFront)

Este é o projeto de frontend para a aplicação de lousa colaborativa em tempo real. Construído com React e Vite, ele oferece uma interface reativa e intuitiva para interagir com o backend `imagesRooms`.

## ✨ Features

- **Interface Moderna:** Layout limpo com painéis informativos e um botão de ação flutuante (FAB).
- **Criação e Acesso a Salas:** Página inicial para criar novas salas ou entrar em salas existentes com um ID.
- **Identidade Persistente:** Mantém um ID de usuário único no `localStorage` para reconhecer o usuário em reconexões.
- **UX Aprimorada:**
  - **Nomes Aleatórios:** Gera um nome de usuário divertido e aleatório para facilitar o primeiro acesso.
  - **Redirecionamento Inteligente:** Se um usuário acessa a URL de uma sala diretamente, ele é redirecionado para a home com o ID da sala já preenchido.
- **Interação com Imagens:**
  - **Adicionar por Arquivo:** Adicione imagens do seu computador.
  - **Adicionar por Clipboard:** Copie uma imagem de qualquer lugar e cole (`Ctrl+V`) diretamente na lousa.
  - **Tamanho Automático:** Imagens são adicionadas com suas dimensões originais (com um limite de tamanho máximo) e posicionadas no centro da tela.
  - **Manipulação Livre:** Arraste, redimensione e delete imagens com sincronização em tempo real.

## 🚀 Tecnologias Utilizadas

- **Framework:** React 19 (com Hooks)
- **Build Tool:** Vite
- **Roteamento:** React Router
- **Comunicação Real-Time:** Socket.IO Client
- **Interação de UI:** React Draggable
- **Utilitários:** `uuid` para IDs únicos.

---

## 🏃‍♂️ Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior).
- O [serviço de backend (`imagesRooms`)](https://github.com/seu-usuario/imagesRooms) deve estar em execução.

### 1. Instalação

1.  Clone este repositório.
2.  Navegue até o diretório do projeto e instale as dependências:
    ```bash
    npm install
    ```

### 2. Executando o Servidor de Desenvolvimento

Para iniciar a aplicação em modo de desenvolvimento com hot-reload, execute:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

---

## 📂 Estrutura do Projeto

- **`src/`**
  - **`components/`**: Contém os principais componentes React.
    - `HomePage.jsx`: Página inicial para criar/entrar em salas.
    - `RoomPage.jsx`: Componente principal que renderiza a sala de colaboração.
    - `Image.jsx`: Componente para uma única imagem arrastável e redimensionável.
  - **`hooks/`**: Contém hooks customizados.
    - `useResizeWatcher.js`: Hook para detectar a ação de redimensionamento em um elemento.
  - **`utils/`**: Funções de utilidade.
    - `user.js`: Funções para gerar ID e nome de usuário persistentes.
  - **`socket.js`**: Configuração e inicialização do cliente Socket.IO.
  - **`main.jsx`**: Ponto de entrada da aplicação, onde o roteador é configurado.
  - **`index.css`**: Estilos globais e classes de utilidade.
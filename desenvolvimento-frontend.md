# Contexto de Desenvolvimento: Frontend da Lousa Colaborativa

Este documento resume a arquitetura, componentes e estado atual do frontend da aplicação.

## 1. Visão Geral e Tecnologias

- **Objetivo:** Criar a interface de usuário para a lousa colaborativa, permitindo que os usuários interajam com as salas de forma intuitiva e em tempo real.
- **Tecnologias Principais:**
  - **Framework:** React 19 (com Hooks)
  - **Build Tool:** Vite
  - **Roteamento:** React Router
  - **Comunicação Real-Time:** Socket.IO Client
  - **Interação de UI:** React Draggable para arrastar elementos.

## 2. Arquitetura e Estrutura de Componentes

A aplicação é uma Single Page Application (SPA) dividida em duas rotas principais:

- **`/` (`HomePage.jsx`):** A página inicial onde o usuário pode criar uma nova sala ou entrar em uma existente. Ela gerencia a criação de um `userId` persistente (via `localStorage`) e a geração de um nome de usuário aleatório para facilitar o acesso.

- **`/room/:roomId` (`RoomPage.jsx`):** O coração da aplicação. Este componente:
  - Estabelece a conexão com o servidor Socket.IO.
  - Gerencia o estado da sala (lista de usuários e imagens).
  - Renderiza todos os elementos da lousa.
  - Contém toda a lógica para adicionar, mover, redimensionar e deletar imagens, além de colar da área de transferência.

- **`Image.jsx`:** Componente que representa uma única imagem na lousa. É responsável por seu próprio comportamento de arrastar e redimensionar, comunicando as alterações para o componente pai (`RoomPage`).

### Hooks Customizados

- **`useResizeWatcher.js`:** Um hook reutilizável que encapsula a lógica complexa de detectar quando um elemento está sendo redimensionado pelo usuário, retornando um estado booleano `isResizing`.

### Utilitários

- **`utils/user.js`:** Contém funções puras para gerenciar a identidade do usuário:
  - `getPersistentUserId()`: Obtém ou cria e salva um ID de usuário único no `localStorage`.
  - `generateRandomName()`: Gera um nome de usuário aleatório combinando um animal e um adjetivo.

## 3. Gerenciamento de Estado

O estado é gerenciado de forma local e reativa dentro dos componentes, utilizando principalmente os hooks `useState` e `useEffect`.

- **Estado Global (Simulado):** A comunicação com o backend via Socket.IO atua como a fonte da verdade para o estado da sala. Eventos como `currentRoomState` e `userListUpdate` substituem o estado local, garantindo que todos os clientes estejam sincronizados.
- **Estado Local:**
  - `HomePage`: Gerencia o nome do usuário e o ID da sala inseridos nos inputs.
  - `RoomPage`: Mantém o estado da lista de usuários e das imagens da sala.
  - `Image`: Gerencia sua própria posição local (`localPosition`) durante o arraste para uma experiência de usuário mais fluida e sem travamentos.

## 4. Sugestões de Melhorias Futuras

1.  **Componentização Adicional:** Para salas muito complexas, o `RoomPage.jsx` poderia ser dividido em componentes menores (ex: `UserList.jsx`, `Canvas.jsx`, `Toolbar.jsx`) para melhorar a organização.

2.  **Gerenciamento de Estado Avançado:** Se a aplicação crescer, a introdução de uma biblioteca de gerenciamento de estado como **Zustand** ou **Redux Toolkit** poderia centralizar a lógica de estado e facilitar a comunicação entre componentes distantes.

3.  **Feedback de Erros e Notificações:** Melhorar a UX exibindo notificações (toasts) para o usuário em caso de erros de conexão ou outras falhas, em vez de apenas registrar no console.

4.  **Migração para TypeScript:** Adotar TypeScript para adicionar segurança de tipos ao código, o que é especialmente útil para os payloads de eventos do Socket.IO, prevenindo bugs e melhorando a autocompletação no editor.

# 🧩 Pokédex — Desafio Técnico Front-End

Projeto desenvolvido como parte de um **desafio técnico de Front-End**, com o objetivo de criar uma **Pokédex moderna, interativa e responsiva**, seguindo o layout proposto no Figma e utilizando **JavaScript puro (Vanilla JS)**.

A aplicação consome dados da **PokéAPI** e foi construída com foco em **organização de código**, **boa experiência do usuário (UX)** e **arquitetura modular**.

---

## 🚀 Demonstração

Interface inspirada em layouts modernos, contendo:

* Grid de Pokémons
* Busca dinâmica
* Filtros por tipo e geração
* Paginação
* Layout totalmente responsivo

---

## ⚙️ Tecnologias utilizadas

* **HTML5**
* **CSS3** (organizado por responsabilidade)
* **JavaScript (ES Modules / Vanilla JS)**
* **PokéAPI** – [https://pokeapi.co](https://pokeapi.co)
* **Servidor local** (ex: Live Server)

---

## 📁 Estrutura do projeto

```bash
POKEDEX/
├── assets/
│   └── images/
├── css/
│   ├── base.css        # Reset, variáveis e estilos globais
│   ├── layout.css      # Estrutura e grid
│   ├── components.css  # Cards, busca e paginação
│   └── responsive.css  # Media queries
├── js/
│   ├── api.js          # Comunicação com a PokéAPI
│   ├── config.js       # Constantes e seletores
│   ├── state.js        # Estado global da aplicação
│   ├── render.js       # Renderização e loading
│   ├── search.js       # Busca e filtros
│   ├── pagination.js   # Controle de paginação
│   └── main.js         # Inicialização da aplicação
└── index.html
```

---

## ▶️ Como executar o projeto

### ⚠️ Atenção

Este projeto utiliza **ES Modules**, portanto é necessário rodá-lo em um **servidor local**.

### Passo a passo

1. Abra o projeto no VS Code
2. Utilize uma extensão como **Live Server**
3. Execute o `index.html` pelo servidor

---

## 🔎 Funcionalidades

### 🔍 Busca e filtros

Permite buscar Pokémons por:

* **Nome**
* **Tipo**
* **Geração**

A busca é dinâmica e funciona em conjunto com os filtros e a paginação, sem recarregar a página.

---

### 📄 Paginação

* Paginação funcional
* Navegação entre páginas
* Compatível com filtros e busca ativa
* Funciona igualmente em desktop e mobile

---

### 📱 Responsividade

* Layout adaptável para desktop, tablet e mobile
* Componentes ajustados para diferentes tamanhos de tela

---

## 🧠 Arquitetura

* Separação clara de responsabilidades
* Estado centralizado
* Código modular e reutilizável
* Sem uso de frameworks ou bibliotecas externas

---

## 👨‍💻 Autor

Desenvolvido por **Paulo Montefusco**
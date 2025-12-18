import { API, DOM } from './config.js';
import { loadPokemonPage } from './main.js';

/* ===================== */
/* Configurações         */
/* ===================== */

const DESKTOP_WINDOW = 7;
const MOBILE_WINDOW = 3;

/* ===================== */
/* Funções auxiliares    */
/* ===================== */

function isMobile() {
    return window.innerWidth <= 520;
}

function navButton(label, page, limit) {
    const btn = document.createElement('button');
    btn.className = 'pagination-nav';
    btn.textContent = label;

    btn.onclick = () => {
        const offset = (page - 1) * limit;
        loadPokemonPage(`${API.BASE_URL}?limit=${limit}&offset=${offset}`);
    };

    return btn;
}

function pageButton(page, currentPage, limit) {
    const btn = document.createElement('button');
    btn.className = 'pagination-page';
    btn.textContent = page;

    if (page === currentPage) {
        btn.classList.add('active');
    } else {
        btn.onclick = () => {
            const offset = (page - 1) * limit;
            loadPokemonPage(`${API.BASE_URL}?limit=${limit}&offset=${offset}`);
        };
    }

    return btn;
}

function dots() {
    const span = document.createElement('span');
    span.className = 'pagination-dots';
    span.textContent = '...';
    return span;
}

/* ===================== */
/* Renderização principal */
/* ===================== */

export function renderPagination(currentPage, totalPages, limit) {
    if (!DOM.pagination) return;

    DOM.pagination.innerHTML = '';

    const WINDOW = isMobile() ? MOBILE_WINDOW : DESKTOP_WINDOW;
    const OFFSET = Math.floor(WINDOW / 2);

    /* ← Anterior */
    if (currentPage > 1) {
        DOM.pagination.appendChild(
            navButton('← Anterior', currentPage - 1, limit)
        );
    }

    let startPage;
    let endPage;

    if (currentPage <= OFFSET + 1) {
        startPage = 1;
    } else if (currentPage >= totalPages - OFFSET) {
        startPage = Math.max(1, totalPages - WINDOW + 1);
    } else {
        startPage = currentPage - OFFSET;
    }

    endPage = Math.min(totalPages, startPage + WINDOW - 1);

    /* 1 … */
    if (startPage > 1) {
        DOM.pagination.appendChild(
            pageButton(1, currentPage, limit)
        );
        DOM.pagination.appendChild(dots());
    }

    /* Janela de páginas */
    for (let page = startPage; page <= endPage; page++) {
        DOM.pagination.appendChild(
            pageButton(page, currentPage, limit)
        );
    }

    /* … última página */
    if (endPage < totalPages) {
        DOM.pagination.appendChild(dots());
        DOM.pagination.appendChild(
            pageButton(totalPages, currentPage, limit)
        );
    }

    /* Próximo → */
    if (currentPage < totalPages) {
        DOM.pagination.appendChild(
            navButton('Próximo →', currentPage + 1, limit)
        );
    }
}

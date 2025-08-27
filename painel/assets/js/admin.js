/**
 * JavaScript Personalizado para Painel Administrativo
 * Sistema de Aluguel de Carrinhos Elétricos - SL Carrinhos
 */

$(document).ready(function() {
    // Configuração do momento.js para português
    moment.locale('pt-br');
    
    // Toggle do sidebar
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('collapsed');
        
        // Salvar estado no localStorage
        const isCollapsed = $('#sidebar').hasClass('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
    
    // Restaurar estado do sidebar
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed === 'true') {
        $('#sidebar').addClass('collapsed');
    }
    
    // Sidebar responsivo para mobile
    if ($(window).width() <= 768) {
        $('#sidebar').removeClass('collapsed');
        
        $('#sidebarCollapse').on('click', function() {
            $('#sidebar').toggleClass('active');
        });
        
        // Fechar sidebar ao clicar fora
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#sidebar, #sidebarCollapse').length) {
                $('#sidebar').removeClass('active');
            }
        });
    }
    
    // Animações de entrada
    $('.card, .stats-card').addClass('fade-in');
    
    // Tooltip do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Popover do Bootstrap
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Validação de formulários
    $('.needs-validation').on('submit', function(e) {
        if (!this.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            $(this).addClass('was-validated');
            return false;
        }
        $(this).addClass('was-validated');
        // Permitir envio se formulário for válido
        return true;
    });
    
    // Preview de imagem
    $('.image-upload').on('change', function(e) {
        const file = e.target.files[0];
        const preview = $(this).siblings('.image-preview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.html(`<img src="${e.target.result}" class="img-fluid rounded" style="max-height: 200px;">`);
            };
            reader.readAsDataURL(file);
        } else {
            preview.html('<div class="text-muted">Nenhuma imagem selecionada</div>');
        }
    });
    
    // Contador de caracteres
    $('.char-counter').each(function() {
        const maxLength = $(this).attr('maxlength');
        const counter = $(`<small class="text-muted float-end">0/${maxLength}</small>`);
        $(this).after(counter);
        
        $(this).on('input', function() {
            const currentLength = $(this).val().length;
            counter.text(`${currentLength}/${maxLength}`);
            
            if (currentLength > maxLength * 0.9) {
                counter.removeClass('text-muted').addClass('text-warning');
            } else {
                counter.removeClass('text-warning').addClass('text-muted');
            }
        });
    });
    
    // Auto-save de formulários (draft)
    $('.auto-save').on('input change', debounce(function() {
        const formData = $(this).closest('form').serialize();
        const formId = $(this).closest('form').attr('id');
        
        if (formId) {
            localStorage.setItem(`draft_${formId}`, formData);
            showToast('Rascunho salvo automaticamente', 'info', 2000);
        }
    }, 2000));
    
    // Restaurar rascunho
    $('form[id]').each(function() {
        const formId = $(this).attr('id');
        const draft = localStorage.getItem(`draft_${formId}`);
        
        if (draft && confirm('Deseja restaurar o rascunho salvo?')) {
            const params = new URLSearchParams(draft);
            
            for (const [key, value] of params) {
                const field = $(this).find(`[name="${key}"]`);
                if (field.length) {
                    if (field.is(':checkbox') || field.is(':radio')) {
                        field.filter(`[value="${value}"]`).prop('checked', true);
                    } else {
                        field.val(value);
                    }
                }
            }
        }
    });
    
    // Limpar rascunho ao enviar formulário
    $('form[id]').on('submit', function() {
        const formId = $(this).attr('id');
        localStorage.removeItem(`draft_${formId}`);
    });
});

/**
 * Função debounce para otimizar eventos
 */
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Exibir toast de notificação
 */
function showToast(message, type = 'info', duration = 5000) {
    const toastId = 'toast_' + Date.now();
    const iconClass = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';
    
    const toast = $(`
        <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="${iconClass} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);
    
    // Criar container de toasts se não existir
    if (!$('#toast-container').length) {
        $('body').append('<div id="toast-container" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>');
    }
    
    $('#toast-container').append(toast);
    
    const bsToast = new bootstrap.Toast(toast[0], {
        autohide: true,
        delay: duration
    });
    
    bsToast.show();
    
    // Remover toast após esconder
    toast.on('hidden.bs.toast', function() {
        $(this).remove();
    });
}

/**
 * Confirmar ação
 */
function confirmAction(message, callback, title = 'Confirmação') {
    if (confirm(message)) {
        if (typeof callback === 'function') {
            callback();
        }
        return true;
    }
    return false;
}

/**
 * Formatar moeda brasileira
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formatar data brasileira
 */
function formatDate(date, includeTime = false) {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return new Date(date).toLocaleDateString('pt-BR', options);
}

/**
 * Validar CPF
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    
    soma = 0;
    
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    
    return resto === parseInt(cpf.substring(10, 11));
}

/**
 * Validar CNPJ
 */
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) {
        return false;
    }
    
    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    if (resultado !== parseInt(digitos.charAt(0))) {
        return false;
    }
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    
    return resultado === parseInt(digitos.charAt(1));
}

/**
 * Buscar CEP
 */
function buscarCEP(cep, callback) {
    cep = cep.replace(/\D/g, '');
    
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    if (typeof callback === 'function') {
                        callback(data);
                    }
                } else {
                    showToast('CEP não encontrado', 'warning');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                showToast('Erro ao buscar CEP', 'error');
            });
    }
}

/**
 * Calcular idade
 */
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade;
}

/**
 * Exportar tabela para Excel
 */
function exportToExcel(tableId, filename = 'dados') {
    const table = document.getElementById(tableId);
    if (!table) {
        showToast('Tabela não encontrada', 'error');
        return;
    }
    
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Dados' });
    XLSX.writeFile(wb, `${filename}_${moment().format('YYYY-MM-DD')}.xlsx`);
}

/**
 * Imprimir elemento
 */
function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        showToast('Elemento não encontrado', 'error');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Impressão</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; }
                    @media print {
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                ${element.outerHTML}
                <script>window.print(); window.close();</script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

/**
 * Copiar texto para clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Texto copiado para a área de transferência', 'success', 2000);
        }).catch(err => {
            console.error('Erro ao copiar texto:', err);
            showToast('Erro ao copiar texto', 'error');
        });
    } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Texto copiado para a área de transferência', 'success', 2000);
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
            showToast('Erro ao copiar texto', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

/**
 * Gerar código aleatório
 */
function generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

/**
 * Atualizar tempo real
 */
function updateRealTime() {
    $('.real-time').each(function() {
        const startTime = $(this).data('start-time');
        if (startTime) {
            const now = moment();
            const start = moment(startTime);
            const duration = moment.duration(now.diff(start));
            
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const seconds = duration.seconds();
            
            $(this).text(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    });
}

// Atualizar tempo real a cada segundo
setInterval(updateRealTime, 1000);

// Verificar conexão com a internet
window.addEventListener('online', function() {
    showToast('Conexão restaurada', 'success', 3000);
});

window.addEventListener('offline', function() {
    showToast('Conexão perdida', 'warning', 5000);
});
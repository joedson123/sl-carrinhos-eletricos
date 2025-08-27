// Sistema de Gerenciamento de Dados Local
// SL Carrinhos Elétricos - Versão Offline

// Sistema de dados local
class LocalStorage {
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    static remove(key) {
        localStorage.removeItem(key);
    }
    
    static clear() {
        localStorage.clear();
    }
}

class DataManager {
    // Métodos para Tempos de Aluguel
    static getTemposAluguel() {
        return LocalStorage.get('tempos_aluguel') || [];
    }
    
    static addTempoAluguel(tempo) {
        const tempos = this.getTemposAluguel();
        tempo.id = this.generateId(tempos);
        tempo.created_at = new Date().toISOString();
        tempos.push(tempo);
        LocalStorage.set('tempos_aluguel', tempos);
        return tempo;
    }
    
    static updateTempoAluguel(id, updatedTempo) {
        const tempos = this.getTemposAluguel();
        const index = tempos.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
            tempos[index] = { ...tempos[index], ...updatedTempo, updated_at: new Date().toISOString() };
            LocalStorage.set('tempos_aluguel', tempos);
            return tempos[index];
        }
        return null;
    }
    
    static deleteTempoAluguel(id) {
        const tempos = this.getTemposAluguel();
        const filteredTempos = tempos.filter(t => t.id !== parseInt(id));
        LocalStorage.set('tempos_aluguel', filteredTempos);
        return filteredTempos.length < tempos.length;
    }
    
    // Métodos para Clientes
    static getClientes() {
        return LocalStorage.get('clientes') || [];
    }
    
    static addCliente(cliente) {
        const clientes = this.getClientes();
        cliente.id = this.generateId(clientes);
        cliente.created_at = new Date().toISOString();
        clientes.push(cliente);
        LocalStorage.set('clientes', clientes);
        return cliente;
    }
    
    static updateCliente(id, updatedCliente) {
        const clientes = this.getClientes();
        const index = clientes.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            clientes[index] = { ...clientes[index], ...updatedCliente, updated_at: new Date().toISOString() };
            LocalStorage.set('clientes', clientes);
            return clientes[index];
        }
        return null;
    }
    
    static deleteCliente(id) {
        const clientes = this.getClientes();
        const filteredClientes = clientes.filter(c => c.id !== parseInt(id));
        LocalStorage.set('clientes', filteredClientes);
        return filteredClientes.length < clientes.length;
    }
    
    // Métodos para Carrinhos
    static getCarrinhos() {
        return LocalStorage.get('carrinhos') || [];
    }
    
    static addCarrinho(carrinho) {
        const carrinhos = this.getCarrinhos();
        carrinho.id = this.generateId(carrinhos);
        carrinho.created_at = new Date().toISOString();
        carrinhos.push(carrinho);
        LocalStorage.set('carrinhos', carrinhos);
        return carrinho;
    }
    
    static updateCarrinho(id, updatedCarrinho) {
        const carrinhos = this.getCarrinhos();
        const index = carrinhos.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            carrinhos[index] = { ...carrinhos[index], ...updatedCarrinho, updated_at: new Date().toISOString() };
            LocalStorage.set('carrinhos', carrinhos);
            return carrinhos[index];
        }
        return null;
    }
    
    static deleteCarrinho(id) {
        const carrinhos = this.getCarrinhos();
        const filteredCarrinhos = carrinhos.filter(c => c.id !== parseInt(id));
        LocalStorage.set('carrinhos', filteredCarrinhos);
        return filteredCarrinhos.length < carrinhos.length;
    }
    
    // Métodos para Aluguéis
    static getAlugueis() {
        return LocalStorage.get('alugueis') || [];
    }
    
    static addAluguel(aluguel) {
        const alugueis = this.getAlugueis();
        aluguel.id = this.generateId(alugueis);
        aluguel.created_at = new Date().toISOString();
        
        // Buscar dados relacionados
        const cliente = this.getClientes().find(c => c.id === parseInt(aluguel.cliente_id));
        const carrinho = this.getCarrinhos().find(c => c.id === parseInt(aluguel.carrinho_id));
        const tempo = this.getTemposAluguel().find(t => t.id === parseInt(aluguel.tempo_id));
        
        // Adicionar informações relacionadas
        if (cliente) {
            aluguel.cliente_nome = cliente.nome;
            aluguel.cliente_telefone = cliente.telefone;
        }
        if (carrinho) {
            aluguel.carrinho_numero = carrinho.numero;
            aluguel.carrinho_modelo = carrinho.modelo;
        }
        if (tempo) {
            aluguel.tempo_nome = tempo.nome;
            aluguel.tempo_duracao = tempo.duracao;
            aluguel.valor = tempo.valor;
        }
        
        // Calcular data de fim
        if (aluguel.data_inicio && tempo) {
            const dataInicio = new Date(aluguel.data_inicio);
            const dataFim = new Date(dataInicio.getTime() + (tempo.duracao * 60000)); // duracao em minutos
            aluguel.data_fim = dataFim.toISOString();
        }
        
        alugueis.push(aluguel);
        LocalStorage.set('alugueis', alugueis);
        
        // Atualizar status do carrinho
        if (carrinho) {
            this.updateCarrinho(carrinho.id, { status: 'Em Uso' });
        }
        
        return aluguel;
    }
    
    static updateAluguel(id, updatedAluguel) {
        const alugueis = this.getAlugueis();
        const index = alugueis.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            const aluguelAtual = alugueis[index];
            alugueis[index] = { ...aluguelAtual, ...updatedAluguel, updated_at: new Date().toISOString() };
            LocalStorage.set('alugueis', alugueis);
            
            // Se o aluguel foi finalizado, liberar o carrinho
            if (updatedAluguel.status === 'Finalizado' && aluguelAtual.carrinho_id) {
                this.updateCarrinho(aluguelAtual.carrinho_id, { status: 'Disponível' });
            }
            
            return alugueis[index];
        }
        return null;
    }
    
    static deleteAluguel(id) {
        const alugueis = this.getAlugueis();
        const aluguel = alugueis.find(a => a.id === parseInt(id));
        
        if (aluguel && aluguel.carrinho_id) {
            // Liberar carrinho
            this.updateCarrinho(aluguel.carrinho_id, { status: 'Disponível' });
        }
        
        const filteredAlugueis = alugueis.filter(a => a.id !== parseInt(id));
        LocalStorage.set('alugueis', filteredAlugueis);
        return filteredAlugueis.length < alugueis.length;
    }
    
    // Métodos para Manutenções
    static getManutencoes() {
        return LocalStorage.get('manutencoes') || [];
    }
    
    static addManutencao(manutencao) {
        const manutencoes = this.getManutencoes();
        manutencao.id = this.generateId(manutencoes);
        manutencao.created_at = new Date().toISOString();
        
        // Buscar dados do carrinho
        const carrinho = this.getCarrinhos().find(c => c.id === parseInt(manutencao.carrinho_id));
        if (carrinho) {
            manutencao.carrinho_numero = carrinho.numero;
            manutencao.carrinho_modelo = carrinho.modelo;
        }
        
        manutencoes.push(manutencao);
        LocalStorage.set('manutencoes', manutencoes);
        
        // Atualizar status do carrinho
        if (carrinho) {
            this.updateCarrinho(carrinho.id, { status: 'Em Manutenção' });
        }
        
        return manutencao;
    }
    
    static updateManutencao(id, updatedManutencao) {
        const manutencoes = this.getManutencoes();
        const index = manutencoes.findIndex(m => m.id === parseInt(id));
        if (index !== -1) {
            const manutencaoAtual = manutencoes[index];
            manutencoes[index] = { ...manutencaoAtual, ...updatedManutencao, updated_at: new Date().toISOString() };
            LocalStorage.set('manutencoes', manutencoes);
            
            // Se a manutenção foi concluída, liberar o carrinho
            if (updatedManutencao.status === 'Concluída' && manutencaoAtual.carrinho_id) {
                this.updateCarrinho(manutencaoAtual.carrinho_id, { status: 'Disponível' });
            }
            
            return manutencoes[index];
        }
        return null;
    }
    
    static deleteManutencao(id) {
        const manutencoes = this.getManutencoes();
        const manutencao = manutencoes.find(m => m.id === parseInt(id));
        
        if (manutencao && manutencao.carrinho_id) {
            // Liberar carrinho se a manutenção não estava concluída
            if (manutencao.status !== 'Concluída') {
                this.updateCarrinho(manutencao.carrinho_id, { status: 'Disponível' });
            }
        }
        
        const filteredManutencoes = manutencoes.filter(m => m.id !== parseInt(id));
        LocalStorage.set('manutencoes', filteredManutencoes);
        return filteredManutencoes.length < manutencoes.length;
    }
    
    // Métodos para Cupons
    static getCupons() {
        return LocalStorage.get('cupons') || [];
    }
    
    static addCupom(cupom) {
        const cupons = this.getCupons();
        cupom.id = this.generateId(cupons);
        cupom.created_at = new Date().toISOString();
        cupons.push(cupom);
        LocalStorage.set('cupons', cupons);
        return cupom;
    }
    
    static updateCupom(id, updatedCupom) {
        const cupons = this.getCupons();
        const index = cupons.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            cupons[index] = { ...cupons[index], ...updatedCupom, updated_at: new Date().toISOString() };
            LocalStorage.set('cupons', cupons);
            return cupons[index];
        }
        return null;
    }
    
    static deleteCupom(id) {
        const cupons = this.getCupons();
        const filteredCupons = cupons.filter(c => c.id !== parseInt(id));
        LocalStorage.set('cupons', filteredCupons);
        return filteredCupons.length < cupons.length;
    }
    
    // Métodos utilitários
    static generateId(array) {
        if (array.length === 0) return 1;
        return Math.max(...array.map(item => item.id || 0)) + 1;
    }
    
    static initializeData() {
        // Inicializar dados padrão se não existirem
        if (!LocalStorage.get('tempos_aluguel')) {
            LocalStorage.set('tempos_aluguel', [
                { 
                    id: 1, 
                    nome: '10 minutos', 
                    duracao: 10, 
                    valor: 25.00, 
                    ativo: true, 
                    categoria: 'Curta Duração',
                    created_at: new Date().toISOString()
                },
                { 
                    id: 2, 
                    nome: '20 minutos', 
                    duracao: 20, 
                    valor: 45.00, 
                    ativo: true, 
                    categoria: 'Curta Duração',
                    created_at: new Date().toISOString()
                },
                { 
                    id: 3, 
                    nome: '30 minutos', 
                    duracao: 30, 
                    valor: 60.00, 
                    ativo: true, 
                    categoria: 'Curta Duração',
                    created_at: new Date().toISOString()
                },
                { 
                    id: 4, 
                    nome: '1 hora', 
                    duracao: 60, 
                    valor: 75.00, 
                    ativo: true, 
                    categoria: 'Média Duração',
                    created_at: new Date().toISOString()
                }
            ]);
        }
        
        if (!LocalStorage.get('clientes')) {
            LocalStorage.set('clientes', [
                {
                    id: 1,
                    nome: 'João Silva',
                    telefone: '(11) 99999-9999',
                    email: 'joao@email.com',
                    cpf: '123.456.789-00',
                    endereco: 'Rua das Flores, 123',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    nome: 'Maria Santos',
                    telefone: '(11) 88888-8888',
                    email: 'maria@email.com',
                    cpf: '987.654.321-00',
                    endereco: 'Av. Principal, 456',
                    created_at: new Date().toISOString()
                }
            ]);
        }
        
        if (!LocalStorage.get('carrinhos')) {
            LocalStorage.set('carrinhos', [
                { 
                    id: 1, 
                    numero: 'C001', 
                    modelo: 'Modelo A', 
                    status: 'Disponível', 
                    bateria: 100,
                    cor: 'Azul',
                    created_at: new Date().toISOString()
                },
                { 
                    id: 2, 
                    numero: 'C002', 
                    modelo: 'Modelo A', 
                    status: 'Disponível', 
                    bateria: 85,
                    cor: 'Vermelho',
                    created_at: new Date().toISOString()
                },
                { 
                    id: 3, 
                    numero: 'C003', 
                    modelo: 'Modelo B', 
                    status: 'Em Manutenção', 
                    bateria: 0,
                    cor: 'Verde',
                    created_at: new Date().toISOString()
                }
            ]);
        }
        
        if (!LocalStorage.get('alugueis')) {
            LocalStorage.set('alugueis', []);
        }
        
        if (!LocalStorage.get('manutencoes')) {
            LocalStorage.set('manutencoes', []);
        }
        
        if (!LocalStorage.get('cupons')) {
            LocalStorage.set('cupons', []);
        }
    }
    
    // Método para atualizar dashboard
    static updateDashboard() {
        const alugueis = this.getAlugueis();
        const clientes = this.getClientes();
        const carrinhos = this.getCarrinhos();
        
        const totalAlugueisEl = document.getElementById('total-alugueis');
        const totalClientesEl = document.getElementById('total-clientes');
        const totalCarrinhosEl = document.getElementById('total-carrinhos');
        const receitaTotalEl = document.getElementById('receita-total');
        
        if (totalAlugueisEl) totalAlugueisEl.textContent = alugueis.length;
        if (totalClientesEl) totalClientesEl.textContent = clientes.length;
        if (totalCarrinhosEl) totalCarrinhosEl.textContent = carrinhos.length;
        
        const receitaTotal = alugueis.reduce((total, aluguel) => total + (aluguel.valor || 0), 0);
        if (receitaTotalEl) receitaTotalEl.textContent = Utils.formatCurrency(receitaTotal);
        
        // Mostrar aluguéis recentes
        const alugueisRecentes = alugueis.slice(-5).reverse();
        const container = document.getElementById('alugueis-recentes');
        
        if (container) {
            if (alugueisRecentes.length === 0) {
                container.innerHTML = '<p class="text-muted">Nenhum aluguel encontrado.</p>';
            } else {
                container.innerHTML = alugueisRecentes.map(aluguel => `
                    <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                        <div>
                            <strong>Cliente: ${aluguel.cliente_nome || 'N/A'}</strong><br>
                            <small class="text-muted">Carrinho: ${aluguel.carrinho_numero || 'N/A'} | Tempo: ${aluguel.tempo_nome || 'N/A'}</small>
                        </div>
                        <div class="text-end">
                            <strong class="text-success">${Utils.formatCurrency(aluguel.valor || 0)}</strong><br>
                            <small class="text-muted">${Utils.formatDateTime(aluguel.data_inicio || aluguel.created_at)}</small>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
    
    // Estatísticas para Dashboard
    static getDashboardStats() {
        const alugueis = this.getAlugueis();
        const clientes = this.getClientes();
        const carrinhos = this.getCarrinhos();
        const tempos = this.getTemposAluguel();
        
        const receitaTotal = alugueis.reduce((total, aluguel) => total + (aluguel.valor || 0), 0);
        const alugueisAtivos = alugueis.filter(a => a.status !== 'Finalizado').length;
        const carrinhosDisponiveis = carrinhos.filter(c => c.status === 'Disponível').length;
        const carrinhosEmUso = carrinhos.filter(c => c.status === 'Em Uso').length;
        const carrinhosManutencao = carrinhos.filter(c => c.status === 'Em Manutenção').length;
        
        return {
            totalAlugueis: alugueis.length,
            alugueisAtivos,
            totalClientes: clientes.length,
            totalCarrinhos: carrinhos.length,
            carrinhosDisponiveis,
            carrinhosEmUso,
            carrinhosManutencao,
            receitaTotal,
            temposAtivos: tempos.filter(t => t.ativo).length,
            alugueisRecentes: alugueis.slice(-5).reverse()
        };
    }
    
    // Relatórios
    static getRelatorioAlugueis(dataInicio, dataFim) {
        const alugueis = this.getAlugueis();
        
        let filteredAlugueis = alugueis;
        
        if (dataInicio) {
            filteredAlugueis = filteredAlugueis.filter(a => 
                new Date(a.created_at) >= new Date(dataInicio)
            );
        }
        
        if (dataFim) {
            filteredAlugueis = filteredAlugueis.filter(a => 
                new Date(a.created_at) <= new Date(dataFim)
            );
        }
        
        const receita = filteredAlugueis.reduce((total, aluguel) => total + (aluguel.valor || 0), 0);
        
        return {
            alugueis: filteredAlugueis,
            total: filteredAlugueis.length,
            receita
        };
    }
    
    static getRelatorioTempos() {
        const alugueis = this.getAlugueis();
        const tempos = this.getTemposAluguel();
        
        const relatorio = tempos.map(tempo => {
            const alugueisDoTempo = alugueis.filter(a => a.tempo_id === tempo.id);
            const receita = alugueisDoTempo.reduce((total, aluguel) => total + (aluguel.valor || 0), 0);
            
            return {
                ...tempo,
                totalAlugueis: alugueisDoTempo.length,
                receita
            };
        });
        
        return relatorio.sort((a, b) => b.totalAlugueis - a.totalAlugueis);
    }
    
    static getRelatorioCarrinhos() {
        const alugueis = this.getAlugueis();
        const carrinhos = this.getCarrinhos();
        
        const relatorio = carrinhos.map(carrinho => {
            const alugueisDoCarrinho = alugueis.filter(a => a.carrinho_id === carrinho.id);
            const receita = alugueisDoCarrinho.reduce((total, aluguel) => total + (aluguel.valor || 0), 0);
            
            return {
                ...carrinho,
                totalAlugueis: alugueisDoCarrinho.length,
                receita
            };
        });
        
        return relatorio.sort((a, b) => b.totalAlugueis - a.totalAlugueis);
    }
}

// Validadores
class Validators {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validar dígitos verificadores
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digit1 = 11 - (sum % 11);
        if (digit1 > 9) digit1 = 0;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let digit2 = 11 - (sum % 11);
        if (digit2 > 9) digit2 = 0;
        
        return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
    }
    
    static validatePhone(phone) {
        const cleaned = phone.replace(/[^\d]/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
    }
    
    static validateRequired(value) {
        return value && value.toString().trim().length > 0;
    }
    
    static validateNumber(value, min = null, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    }
}

// Utilitários
class Utils {
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }
    
    static formatDateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    static formatTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    static formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            if (remainingMinutes === 0) {
                return `${hours}h`;
            } else {
                return `${hours}h ${remainingMinutes}min`;
            }
        }
    }
    
    static generateUniqueCode(prefix = '', length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = prefix;
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
    
    static confirmAction(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.LocalStorage = LocalStorage;
    window.DataManager = DataManager;
    window.Validators = Validators;
    window.Utils = Utils;
}
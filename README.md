# SL Carrinhos Elétricos - Sistema Offline

Sistema de gestão offline para aluguel de carrinhos elétricos, baseado no sistema original da SL Carrinhos Elétricos.

## 🚀 Características

- **100% Offline**: Funciona completamente no navegador sem necessidade de servidor
- **Armazenamento Local**: Todos os dados são salvos no localStorage do navegador
- **Interface Responsiva**: Design moderno e adaptável para desktop e mobile
- **Backup/Restore**: Sistema de exportação e importação de dados em JSON
- **Validações**: Validação de CPF, email, telefone e outros campos
- **Máscaras de Input**: Formatação automática de CPF, telefone e CEP

## 📋 Funcionalidades Implementadas

### ✅ Dashboard
- Estatísticas gerais do sistema
- Resumo de aluguéis, clientes e carrinhos
- Aluguéis recentes
- Indicadores de receita total

### ✅ Tempos de Aluguel
- CRUD completo (Criar, Ler, Atualizar, Deletar)
- Categorização por duração (Curta, Média, Longa)
- Estatísticas de popularidade
- Controle de status (Ativo/Inativo)
- Cálculo automático de valores médios

### ✅ Clientes
- Cadastro completo com validação de CPF
- Busca e filtros avançados
- Histórico de aluguéis por cliente
- Controle de status (Ativo/Inativo)
- Campos opcionais: email, endereço, observações

### ✅ Carrinhos
- Gestão completa da frota
- Controle de status (Disponível, Em Uso, Em Manutenção, Inativo)
- Monitoramento de bateria com indicadores visuais
- Histórico de uso por carrinho
- Informações técnicas (modelo, cor, observações)

### ✅ Sistema de Backup
- Exportação de todos os dados em formato JSON
- Importação de dados de backup
- Limpeza completa dos dados com confirmação
- Backup automático com data no nome do arquivo

## 🛠️ Como Usar

1. **Abrir o Sistema**:
   - Abra o arquivo `app-offline.html` em qualquer navegador moderno
   - Não é necessário servidor web ou conexão com internet

2. **Navegação**:
   - Use o menu lateral para navegar entre as seções
   - O botão de hambúrguer (☰) permite ocultar/mostrar o menu

3. **Gerenciar Dados**:
   - Clique nos botões "Novo" para adicionar registros
   - Use os ícones de ação (✏️ editar, 👁️ visualizar, 🗑️ excluir)
   - Utilize os filtros de busca para encontrar registros específicos

4. **Backup dos Dados**:
   - Acesse o menu do usuário (canto superior direito)
   - Clique em "Exportar Dados" para fazer backup
   - Use "Importar Dados" para restaurar um backup
   - "Limpar Dados" remove tudo e reinicializa o sistema

## 📊 Dados Iniciais

O sistema vem com dados de exemplo pré-configurados:

### Tempos de Aluguel
- 10 minutos - R$ 25,00
- 20 minutos - R$ 45,00
- 30 minutos - R$ 60,00
- 1 hora - R$ 75,00

### Clientes
- João Silva
- Maria Santos

### Carrinhos
- C001 - Modelo A (Azul)
- C002 - Modelo A (Vermelho)
- C003 - Modelo B (Verde, em manutenção)

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização e responsividade
- **JavaScript ES6+**: Lógica da aplicação
- **Bootstrap 5.3**: Framework CSS
- **Font Awesome 6.4**: Ícones
- **Google Fonts**: Tipografia (Poppins)
- **LocalStorage API**: Armazenamento de dados

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móveis (iOS/Android)

## 🔒 Segurança e Privacidade

- Todos os dados ficam armazenados localmente no navegador
- Nenhuma informação é enviada para servidores externos
- Os dados persistem apenas no dispositivo onde o sistema é usado
- Para compartilhar dados entre dispositivos, use a função de backup/restore

## 📝 Validações Implementadas

- **CPF**: Validação completa com dígitos verificadores
- **Email**: Validação de formato de email
- **Telefone**: Suporte para telefones fixos e celulares
- **Campos obrigatórios**: Validação de preenchimento
- **Duplicatas**: Prevenção de CPF e números de carrinho duplicados

## 🎨 Interface

- Design moderno e limpo
- Cores intuitivas para status (verde=ativo, vermelho=inativo, etc.)
- Indicadores visuais (badges, barras de progresso)
- Alertas e confirmações para ações importantes
- Responsivo para diferentes tamanhos de tela

## 📈 Estatísticas e Relatórios

- Dashboard com métricas em tempo real
- Contadores automáticos por seção
- Cálculos de valores médios
- Ranking de popularidade dos tempos
- Histórico de uso por cliente/carrinho

## 🔄 Atualizações Futuras

Funcionalidades que podem ser implementadas:
- Seção de Aluguéis com gestão completa
- Sistema de Manutenções
- Cupons de desconto
- Relatórios avançados com gráficos
- Impressão de comprovantes
- Integração com APIs de pagamento

## 📞 Suporte

Este é um sistema offline baseado no sistema original da SL Carrinhos Elétricos.
Para dúvidas sobre o sistema original, visite: https://slcarrinhoseletricos.com.br

---

**Desenvolvido com ❤️ para funcionar offline e sem complicações!**
# Carteira completa e NOX VIP

## Objetivo
Melhorar somente a página **Minha Conta**, reutilizando o saldo, os modais de depósito/retirada e a seção PIX existentes. A Home, os jogos, as categorias e a navegação permanecem inalterados.

## Implementação

### 1. Login e dados seguros
- Migrar cadastro, entrada e sessão do navegador para o Lovable Cloud.
- Manter e proteger por usuário: ID público, CPF, telefone e e-mail.
- Contas criadas apenas no navegador anteriormente precisarão ser cadastradas novamente.
- Manter o mesmo fluxo visual atual de cadastro e entrada.

### 2. Minha Carteira
- Reorganizar o card atual como **MINHA CARTEIRA**, mantendo o saldo e os botões **DEPOSITAR** e **RETIRAR**.
- Adicionar o resumo compacto de depósitos, retiradas e bônus.
- Transformar o histórico atual em **HISTÓRICO DA CARTEIRA**, com filtros para todos, depósitos, retiradas e bônus.
- Exibir tipo, valor, data/hora e status de cada movimentação.
- Manter a seção atual de chave PIX para retiradas e persistir os dados no banco.
- Não criar outro saldo, não creditar valores e não integrar pagamentos.

### 3. NOX VIP
- Adicionar um card compacto **NOX VIP** na página Minha Conta.
- Todo novo usuário começa no nível Bronze.
- Mostrar nível atual, progresso em reais, barra de progresso e próximo nível.
- Nesta etapa, o progresso começa em R$ 0,00 e fica preparado para uma futura regra configurável; nenhum bônus ou cashback será concedido automaticamente.
- **Ver todos os níveis** abrirá uma janela com Bronze, Prata, Ouro e Diamante e diferenças visuais discretas.
- Benefícios e requisitos ficarão configuráveis, inicialmente identificados como ainda não definidos.

## Estrutura técnica
- Criar tabelas privadas para perfis, carteiras, movimentações, chave PIX e progresso VIP, com acesso limitado ao próprio usuário.
- Criar automaticamente perfil, carteira com saldo zero e nível Bronze no cadastro.
- Manter valores monetários em centavos.
- Depósitos continuarão sem processamento real; somente confirmações futuras poderão alterar saldo ou gerar movimentações aprovadas.
- Retiradas continuarão usando a validação existente e serão registradas como pendentes, sem descontar saldo nesta etapa.
- Não armazenar senha, chave PIX completa ou outros dados sensíveis no histórico de movimentações.

## Validação
- Testar cadastro, saída e nova entrada.
- Confirmar persistência de perfil, saldo, chave PIX, histórico e VIP.
- Conferir filtros do histórico, modais existentes e visual mobile.
- Confirmar que Home, catálogo e gate global dos jogos continuam intactos.

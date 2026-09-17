# Primeira etapa da integração PinPay

## Objetivo
Permitir que um usuário autenticado escolha um dos nove valores existentes, gere uma cobrança PIX real pela PinPay e veja o QR Code/código copia e cola no modal atual. Nesta etapa, o depósito continuará pendente e o saldo não será creditado.

## Implementação
- Criar uma função protegida no backend para receber somente um dos valores permitidos e identificar o usuário pela sessão.
- Buscar e normalizar e-mail, CPF e telefone do perfil autenticado.
- Criar uma movimentação de depósito pendente e usar seu identificador como chave estável de idempotência.
- Chamar a PinPay com o token secreto, descrição `Depósito NOX`, metadados da movimentação/usuário e expiração de 20 minutos.
- Salvar o identificador retornado pela PinPay em `external_id`, mantendo o estado pendente.
- Em falha na criação externa, manter a movimentação sem possibilidade de crédito e apresentar apenas a mensagem segura solicitada.
- Alterar somente o modal de depósito para mostrar carregamento, impedir clique duplo e, após sucesso, exibir valor, QR Code, código PIX, botão de copiar e contagem regressiva baseada em `expires_at`.
- Atualizar o histórico em tela após a cobrança ser criada.

## Segurança e limites
- `PINPAY_TOKEN` será lido exclusivamente no backend e nunca retornado ou registrado.
- O navegador não poderá escolher valores arbitrários, informar outro usuário, atualizar saldo ou aprovar transações.
- Nenhum webhook, crédito automático, integração de saque ou mudança em Carteira/VIP/jogos será adicionada.
- Erros da PinPay serão tratados por categoria no backend, com detalhes internos limitados a código HTTP e `request_id` quando disponível.

## Validação
- Testar rejeição de valor não permitido e chamada sem autenticação.
- Testar o modal no mobile: seleção, bloqueio contra clique duplo, geração, QR Code, cópia e expiração.
- Confirmar no banco que a movimentação ficou como depósito pendente, com `external_id`, e que o saldo não mudou.
- Verificar compilação, erros de execução e regras de segurança do banco.

## Dependência externa
O `PINPAY_TOKEN` já está salvo. O teste real depende de a credencial estar válida e do contrato atual da API PinPay corresponder aos campos documentados.

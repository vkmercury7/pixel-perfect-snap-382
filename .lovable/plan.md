# Gerar PIX na Netlify sem chave administrativa

## Alteração
- Fazer a função autenticada de depósito usar a sessão atual do usuário para criar e atualizar sua própria movimentação PIX.
- Ajustar somente as permissões mínimas da tabela de movimentações para permitir depósitos pendentes e suas atualizações pelo próprio usuário.
- Preservar PinPay, autenticação, carteiras, saldo, histórico e interface existentes.

## Segurança e validação
- Restringir inserções a `user_id` da sessão, tipo `deposit`, status `pending` e valores fixos já aceitos.
- Restringir atualizações ao dono, sem permitir aprovação ou alteração de saldo.
- Confirmar que a geração continua criando uma movimentação pendente e não depende de `SUPABASE_SERVICE_ROLE_KEY`.

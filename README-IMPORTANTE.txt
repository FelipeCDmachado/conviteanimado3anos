ANTES DE RODAR OU PUBLICAR:

1) Crie um arquivo .env.local na raiz do projeto.
2) Cole suas variaveis completas do Supabase:

NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=COLE_A_CHAVE_PUBLICAVEL_COMPLETA_AQUI

3) Rode o SQL do arquivo supabase-guests.sql no Supabase.
4) No Vercel, adicione as mesmas duas variaveis em Settings > Environment Variables.

Observacao: a chave precisa ser a CHAVE PUBLICAVEL COMPLETA copiada pelo botao Copy do Supabase.

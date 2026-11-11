# AegisSec Defense Ops - Integração Supabase & Migrations

Este diretório contém a estrutura oficial de migrations e sementes (seeds) para o **Supabase** e **PostgreSQL**.

## 📁 Estrutura de Arquivos

```
supabase/
├── migrations/
│   └── 20261110000000_initial_schema.sql  # DDL completo das tabelas, índices e políticas RLS
├── seed.sql                                # Dados iniciais do SOC (CVEs, Tasks, Playbooks, Logs)
├── config.toml                             # Configuração do Supabase CLI
└── README.md                               # Guia de implantação e integração
```

## 🚀 Como Aplicar as Migrations no Supabase

### Opção 1: Supabase CLI (Recomendado para CI/CD e Local)

1. **Instalar o Supabase CLI** (caso não possua):
   ```bash
   npm install -g supabase
   ```

2. **Iniciar o Supabase Localmente**:
   ```bash
   supabase start
   ```

3. **Vincular ao seu Projeto Supabase na Nuvem**:
   ```bash
   supabase login
   supabase link --project-ref seu-project-ref-id
   ```

4. **Enviar as Migrations para o Banco Supabase**:
   ```bash
   supabase db push
   ```

5. **Aplicar os dados de Seed**:
   ```bash
   supabase db reset  # No ambiente local, aplica migrations e seed.sql automaticamente
   ```

---

### Opção 2: Supabase Dashboard (SQL Editor)

1. Acesse o seu projeto em [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Vá até a aba **SQL Editor** no menu lateral esquerdo.
3. Clique em **New query**.
4. Copie todo o conteúdo do arquivo `supabase/migrations/20261110000000_initial_schema.sql` e execute clicando em **Run**.
5. Em seguida, copie o conteúdo de `supabase/seed.sql` e execute para carregar os CVEs e o backlog do SOC.

---

## 🔑 Variáveis de Ambiente no Next.js (`.env`)

Para conectar o aplicativo diretamente ao Supabase via SDK cliente ou backend:

```env
# Conexão direta com Supabase
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# Ou via pool de conexão PostgreSQL (Cloud SQL ou Supabase Pooler porta 5432 / 6543):
# SQL_HOST="db.seu-projeto.supabase.co"
# SQL_USER="postgres"
# SQL_PASSWORD="sua-senha-do-banco"
# SQL_DB_NAME="postgres"
```

## 🛡️ Tabelas Geradas

1. **`users`**: Perfis de operadores e comandantes SecOps (RBAC, crachá mTLS).
2. **`vulnerabilities`**: Catálogo de CVEs, pontuações CVSS v3.1, EPSS, vetores de ataque, relatórios forenses e logs brutos de inspeção.
3. **`remediation_tasks`**: Kanban e Sprint de remediação (Em Execução, Bloqueados/CAB, DAST/SAST Verifying).
4. **`playbooks`**: Orquestrações automatizadas SOAR (Kernel patchers, revogação de chaves IAM, WAF virtual patch).
5. **`audit_logs`**: Trilha de auditoria criptograficamente assinada (SHA-256) de todas as contramedidas executadas.

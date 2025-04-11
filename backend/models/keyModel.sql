create table vanishing_keys (
  id uuid primary key default gen_random_uuid(),
  tx_id text unique not null,
  enc_key text not null,
  expiry timestamp not null,
  created_at timestamp default now()
);


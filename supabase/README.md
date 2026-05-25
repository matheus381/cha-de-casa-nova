# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In **SQL Editor**, run `schema.sql`, then `seed.sql` (gift `id` values are auto-generated UUIDs).
4. Enable **Realtime** for the `gifts` table: Database → Replication.
5. Run `npm run dev`.

To regenerate seed data from `data/gifts.ts`:

```bash
node scripts/generate-seed.mjs
```

# Security Hardening TODO

Objective: Fix IDOR and insecure authorization by introducing signed-request verification and enforcing server-side authorization across sensitive endpoints, then update frontend to send signed headers.

## 1) Server Auth Utility
- [ ] Create `src/utils/auth.ts`:
  - [ ] `buildAuthMessage({ wallet, method, path, timestamp })` – canonical EIP-191 message string.
  - [ ] `verifySignedRequest(req)` – reads headers `x-wallet`, `x-timestamp`, `x-signature`; verifies signature with `ethers.verifyMessage`; enforces 120s time window; returns normalized wallet.
  - [ ] `requireAuth(req, res)` – returns `{ wallet }` or sends 401/403.
  - [ ] `requireAdmin(req, res)` – accepts either:
    - [ ] `x-admin-token` equal to `process.env.ADMIN_TOKEN`, or
    - [ ] signed request where recovered wallet ∈ `ADMIN_WALLETS` (env list).
  - [ ] Utility to extract normalized path from `req.url` for message verification.

Env:
- [ ] `ADMIN_TOKEN` (string)
- [ ] `ADMIN_WALLETS` (comma-separated list)
- [ ] (Existing) `CRON_SECRET` for weekly cron (leave as is)

## 2) Backend Endpoint Hardening
- [ ] `src/pages/api/validate-invite.ts`
  - [ ] `requireAuth(req, res)`; derive `wallet` from auth; ignore `req.body.wallet`.
  - [ ] Proceed with code validation and user creation using `wallet` from auth only.

- [ ] `src/pages/api/my-invites.ts`
  - [ ] `requireAuth(req, res)`; derive `wallet` from auth.
  - [ ] Only return invites for `wallet` (owner).

- [ ] `src/pages/api/my-tweets.ts`
  - [ ] Convert to `requireAuth(req, res)`; derive `wallet` from auth; ignore query `wallet`.

- [ ] `src/pages/api/submit-tweet.ts`
  - [ ] `requireAuth(req, res)`; `wallet` from auth; keep `tweetUrl` from body and existing validations/limits.

- [ ] `src/pages/api/tweet-count.ts`
  - [ ] `requireAuth(req, res)`; derive `wallet` from auth; ignore query; only return current user&#39;s count.

- [ ] `src/pages/api/admin-tweet-tasks.ts`
  - [ ] Protect GET/POST via `requireAdmin(req, res)`.
  - [ ] Remove reliance on `wallet` from body for admin check.
  - [ ] Keep `pointsAwarded` / `bonus` logic unchanged.

- [ ] `src/pages/api/seed-admin-invite.ts`
  - [ ] Protect with `requireAdmin(req, res)` or `x-admin-token`.

- [ ] `src/pages/api/weekly-invite-generation.ts`
  - [ ] Keep as-is with `CRON_SECRET`.

- [ ] `src/pages/api/check-user.ts`
  - [ ] Leave as non-sensitive public informational endpoint.
  - [ ] Add comment warning: must not be used by client to grant privileged access; server endpoints enforce auth.

## 3) Frontend Updates (Signed Headers)
Message format for signing (example):
```
Glob Auth
Wallet: 0xabc...123
Method: POST
Path: /api/validate-invite
Timestamp: 1734470000
```

Headers to send for protected endpoints:
- `x-wallet`: user address (checksum or lowercase; server normalizes)
- `x-timestamp`: epoch seconds (or ISO string)
- `x-signature`: EIP-191 signature of the above message

- [ ] Update components to sign and attach headers:
  - [ ] `src/components/InviteGate.tsx` – when calling `/api/validate-invite`.
  - [ ] `src/components/InviteDashboard.tsx` – when calling `/api/my-invites`.
  - [ ] `src/components/TweetSubmission.tsx`
    - [ ] Signed GET to `/api/my-tweets`
    - [ ] Signed GET to `/api/tweet-count`
    - [ ] Signed POST to `/api/submit-tweet`
  - [ ] `src/components/AdminTweetTasks.tsx`
    - [ ] Option A: use `x-admin-token` (if available in environment at runtime).
    - [ ] Option B (preferred): sign with admin wallet; server checks `ADMIN_WALLETS`.

Notes:
- [ ] Use `wagmi`&#39;s `useSignMessage` to sign.
- [ ] Build the exact message string (method, path, timestamp) before calling fetch.
- [ ] Include headers in every request to protected endpoints.

## 4) Tests
- [ ] Without signature/token: all protected endpoints return 401/403.
- [ ] With valid signature and matching wallet: endpoints succeed.
- [ ] Attempt IDOR by changing another wallet in body/query: still rejected; server ignores client-supplied wallet.
- [ ] Admin:
  - [ ] Non-admin signed user: 403 on admin endpoints.
  - [ ] Admin signed user: success.
- [ ] `check-user` manipulation does not grant access; backend still blocks.

## 5) Documentation
- [ ] Update README with:
  - [ ] New security model.
  - [ ] Required env vars.
  - [ ] Signing format and 120s time window.
  - [ ] Example curl for signed request.

// components/WalletDebug.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useConnect, useAccount } from 'wagmi'

export default function WalletDebug() {
  const { connectors, connectAsync } = useConnect()
  const { address, isConnected } = useAccount()
  const [ethInfo, setEthInfo] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = (window as any).ethereum
      setEthInfo({
        exists: !!raw,
        isMetaMask: !!raw?.isMetaMask,
        providers: raw?.providers ? raw.providers.map((p:any) => ({
          isMetaMask: !!p.isMetaMask,
          // Removed Hyperliquid-specific debug flag
          keys: Object.keys(p).slice(0,30)
        })) : null,
      })
    }
  }, [])

  const tryConnect = async (c: any) => {
    console.log('Attempt connect ->', c.id, c.name, 'ready:', c.ready)
    try {
      const res = await connectAsync({ connector: c })
      console.log('connectAsync result ->', res)
  const first = (res as any)?.accounts?.[0]?.address || (res as any)?.addresses?.[0] || 'ok';
  alert('Connected: ' + first)
    } catch (err) {
      console.error('connectAsync error ->', err)
      alert('Connect failed — see console for error')
    }
  }

  return (
    <div style={{ padding: 12, background: '#111', color: '#fff', borderRadius: 8 }}>
      <h4>Wallet Debug</h4>
      <div>window.ethereum present: {String(ethInfo?.exists)}</div>
      <div>window.ethereum.isMetaMask: {String(ethInfo?.isMetaMask)}</div>
      <div>Connected wagmi address: {address ?? '—'}</div>
      <div>isConnected: {String(isConnected)}</div>

      <div style={{ marginTop: 8 }}>
        Available connectors:
        <ul>
          {connectors.map((c) => (
            <li key={c.id} style={{ marginBottom: 6 }}>
              <strong>{c.name}</strong> — id: {c.id} — ready: {String(c.ready)}
              <button style={{ marginLeft: 8 }} onClick={() => tryConnect(c)}>try connect</button>
              <pre style={{ marginTop: 6, color: '#ccc' }}>{JSON.stringify({
                id: c.id,
                name: c.name,
                ready: c.ready,
                // show any optional fields safely:
                // @ts-ignore
                options: c.options ? Object.keys(c.options) : undefined
              }, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </div>

      <pre style={{ marginTop: 8, color: '#ccc' }}>{JSON.stringify(ethInfo, null, 2)}</pre>
    </div>
  )
}

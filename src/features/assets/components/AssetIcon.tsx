'use client'

import { Bitcoin, Coins, CircleDollarSign, Gem } from 'lucide-react'
import { AssetKind } from '../types'

interface Props {
  kind: AssetKind
  size?: number
  className?: string
}

export function AssetIcon({ kind, size = 20, className }: Props) {
  const common = { size, strokeWidth: 1.5, className }
  switch (kind) {
    case 'tether':
      // نمادی شبیه Tether: دایره تیل با حرف T
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="700"
            fill="currentColor"
            fontFamily="ui-sans-serif, system-ui"
          >
            ₮
          </text>
        </svg>
      )
    case 'usd':
      return <CircleDollarSign {...common} />
    case 'full_coin':
    case 'half_coin':
    case 'quarter_coin':
    case 'gerami_coin':
      return <Coins {...common} />
    case 'gold_18':
    case 'gold_24':
      return <Gem {...common} />
    default:
      return <Bitcoin {...common} />
  }
}

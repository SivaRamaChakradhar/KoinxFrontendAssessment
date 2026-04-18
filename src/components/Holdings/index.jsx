import { useState } from 'react'
import './index.css'

const Holdings = ({
  holdings,
  selectedHoldingIds,
  onToggleHolding,
  onToggleAllHoldings,
}) => {
  const [showAllRows, setShowAllRows] = useState(false)

  const formatNumber = (value, maxFractionDigits = 2) =>
    Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    })

  const formatSignedRupee = (value) => {
    const amount = Number(value)
    const sign = amount >= 0 ? '+' : '-'
    return `${sign}₹${formatNumber(Math.abs(amount))}`
  }

  const allSelected = holdings.length > 0 && selectedHoldingIds.length === holdings.length
  const displayedHoldings = showAllRows ? holdings : holdings.slice(0, 6)

  if (!holdings || holdings.length === 0) {
    return <div className="holdings-empty">No holdings data available</div>
  }

  return (
    <div className="holdings-container">
      <h2 className="holdings-title">Holdings</h2>

      <div className="holdings-desktop">
        <div className="holdings-table-wrap">
          <table className="holdings-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <label className="checkbox-wrap" aria-label="Select all holdings">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => onToggleAllHoldings(e.target.checked)}
                    />
                    <span className="custom-checkbox" />
                  </label>
                </th>
                <th>Asset</th>
                <th>
                  Holdings
                  <span className="th-sub">Current Market Rate</span>
                </th>
                <th>Total Current Value</th>
                <th>Short-term</th>
                <th>Long-Term</th>
                <th>Amount to Sell</th>
              </tr>
            </thead>
            <tbody>
              {displayedHoldings.map((holding) => {
                const isSelected = selectedHoldingIds.includes(holding.id)
                const totalHoldings = Number(holding.totalHoldings ?? holding.totalHolding ?? 0)
                const currentValue = Number(holding.currentPrice) * totalHoldings
                const displayName = (holding.coinName || '').length > 18 ? holding.coin : holding.coinName

                return (
                  <tr key={holding.id} className={isSelected ? 'row-selected' : ''}>
                    <td className="td-checkbox">
                      <label className="checkbox-wrap" aria-label={`Select ${holding.coin}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleHolding(holding.id)}
                        />
                        <span className="custom-checkbox" />
                      </label>
                    </td>
                    <td>
                      <div className="asset-cell">
                        <img
                          src={holding.logo}
                          alt={holding.coin}
                          className="asset-logo"
                          onError={(e) => {
                            e.target.src =
                              'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg'
                          }}
                        />
                        <div>
                          <div className="asset-symbol">{displayName || holding.coin}</div>
                          <div className="asset-name">{holding.coin}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-primary">{formatNumber(totalHoldings, 6)} {holding.coin}</div>
                      <div className="cell-secondary">₹ {formatNumber(holding.averageBuyPrice)}/{holding.coin}</div>
                    </td>
                    <td>
                      <div className="cell-primary">₹ {formatNumber(currentValue)}</div>
                    </td>
                    <td>
                      <div className={`cell-primary ${holding.stcg.gain >= 0 ? 'gain-positive' : 'gain-negative'}`}>
                        {formatSignedRupee(holding.stcg.gain)}
                      </div>
                      <div className="cell-secondary">{formatNumber(holding.stcg.balance, 6)} {holding.coin}</div>
                    </td>
                    <td>
                      <div className={`cell-primary ${holding.ltcg.gain >= 0 ? 'gain-positive' : 'gain-negative'}`}>
                        {formatSignedRupee(holding.ltcg.gain)}
                      </div>
                      <div className="cell-secondary">{formatNumber(holding.ltcg.balance, 6)} {holding.coin}</div>
                    </td>
                    <td>
                      <div className="cell-primary">
                        {isSelected ? `${formatNumber(totalHoldings, 6)} ${holding.coin}` : '-'}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!showAllRows && holdings.length > 6 && (
        <button
          type="button"
          className="holdings-view-all"
          onClick={() => setShowAllRows(true)}
        >
          View all
        </button>
      )}
    </div>
  )
}

export default Holdings

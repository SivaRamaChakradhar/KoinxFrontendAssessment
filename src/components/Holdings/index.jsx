import { useMemo, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { RiExpandUpDownLine } from 'react-icons/ri'
import './index.css'

const Holdings = ({
  holdings,
  selectedHoldingIds,
  onToggleHolding,
  onToggleAllHoldings,
}) => {
  const [showAllRows, setShowAllRows] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'coin', direction: 'asc' })

  const formatNumber = (value, maxFractionDigits = 2) =>
    Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFractionDigits,
    })

  const formatSignedRupee = (value) => {
    const amount = Number(value)
    const sign = amount >= 0 ? '+' : '-'
    const fractionDigits = Math.abs(amount) < 1 ? 6 : 2
    return `${sign}$${formatNumber(Math.abs(amount), fractionDigits)}`
  }

  const getSortValue = (holding, key) => {
    switch (key) {
      case 'asset':
        return (holding.coinName || holding.coin || '').toLowerCase()
      case 'holdings':
        return Number(holding.totalHoldings ?? holding.totalHolding ?? 0)
      case 'currentPrice':
        return Number(holding.currentPrice ?? 0)
      case 'shortTerm':
        return Number(holding.stcg?.gain ?? 0)
      case 'longTerm':
        return Number(holding.ltcg?.gain ?? 0)
      case 'amountToSell':
        return Number(holding.totalHoldings ?? holding.totalHolding ?? 0)
      case 'coin':
      default:
        return (holding.coin || '').toLowerCase()
    }
  }

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedHoldings = useMemo(() => {
    const items = [...(holdings || [])]

    items.sort((a, b) => {
      const valueA = getSortValue(a, sortConfig.key)
      const valueB = getSortValue(b, sortConfig.key)

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA)
      }

      return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA
    })

    return items
  }, [holdings, sortConfig])

  const allSelected = holdings.length > 0 && selectedHoldingIds.length === holdings.length
  const displayedHoldings = showAllRows ? sortedHoldings : sortedHoldings.slice(0, 6)

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <RiExpandUpDownLine aria-hidden="true" />
    }

    return sortConfig.direction === 'asc' ? (
      <FaChevronUp aria-hidden="true" />
    ) : (
      <FaChevronDown aria-hidden="true" />
    )
  }

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
                <th>
                    Asset
                </th>
                <th>
                  Holdings
                  <span className="th-sub">Avg Buy Price</span>
                </th>
                <th>
                  Current Price
                </th>
                <th>
                  <button
                    type="button"
                    className="sort-header"
                    onClick={() => handleSort('shortTerm')}
                    aria-label={`Sort by short-term ${sortConfig.key === 'shortTerm' && sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Short-term
                    <span className="sort-indicator">
                      {getSortIcon('shortTerm')}
                    </span>
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    className="sort-header"
                    onClick={() => handleSort('longTerm')}
                    aria-label={`Sort by long-term ${sortConfig.key === 'longTerm' && sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Long-Term
                    <span className="sort-indicator">
                      {getSortIcon('longTerm')}
                    </span>
                  </button>
                </th>
                <th>
                  Amount to Sell
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedHoldings.map((holding) => {
                const isSelected = selectedHoldingIds.includes(holding.id)
                const totalHoldings = Number(holding.totalHoldings ?? holding.totalHolding ?? 0)
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
                      <div className="cell-secondary">$ {formatNumber(holding.averageBuyPrice)}/{holding.coin}</div>
                    </td>
                    <td>
                      <div className="cell-primary">$ {formatNumber(holding.currentPrice)}</div>
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

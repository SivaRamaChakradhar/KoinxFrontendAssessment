import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import "./index.css";

const TaxSummary = ({ tax, selectedHoldings }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  if (!tax || !tax.capitalGains) return null;

  const formatCurrency = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatSignedCurrency = (value) => {
    const amount = Number(value);
    const prefix = amount < 0 ? "-" : "";

    return `${prefix}$ ${formatCurrency(Math.abs(amount))}`;
  };

  const preData = tax.capitalGains;
  
  const stcgNetPre = preData.stcg.profits - preData.stcg.losses;
  const ltcgNetPre = preData.ltcg.profits - preData.ltcg.losses;
  const totalGainsPre = stcgNetPre + ltcgNetPre;

  const postData = {
    stcg: {
      profits: preData.stcg.profits,
      losses: preData.stcg.losses,
    },
    ltcg: {
      profits: preData.ltcg.profits,
      losses: preData.ltcg.losses,
    },
  };

  (selectedHoldings || []).forEach((holding) => {
    const shortTermGain = Number(holding?.stcg?.gain || 0);
    const longTermGain = Number(holding?.ltcg?.gain || 0);

    if (shortTermGain > 0) {
      postData.stcg.profits += shortTermGain;
    } else if (shortTermGain < 0) {
      postData.stcg.losses += Math.abs(shortTermGain);
    }

    if (longTermGain > 0) {
      postData.ltcg.profits += longTermGain;
    } else if (longTermGain < 0) {
      postData.ltcg.losses += Math.abs(longTermGain);
    }
  });

  postData.stcg.netGains = postData.stcg.profits - postData.stcg.losses;
  postData.ltcg.netGains = postData.ltcg.profits - postData.ltcg.losses;

  const stcgNetPost = postData.stcg.netGains;
  const ltcgNetPost = postData.ltcg.netGains;
  const totalGainsPost = stcgNetPost + ltcgNetPost;
  const savings = Math.max(totalGainsPre - totalGainsPost, 0);

  return (
    <>
      <div className="tax-summary-header">
        <div className="tax-title-wrap">
          <h2 className="tax-title">
            Tax Harvesting
            <span className="how-it-works-wrap">
              <button
                type="button"
                className="how-it-works-btn"
                onClick={() => setIsHowItWorksOpen((prev) => !prev)}
              >
                How it works?
              </button>
              {isHowItWorksOpen && (
                <div className="how-it-works-popover">
                  <p>
                    Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh
                    semper mattis scelerisque tellus. Vel mattis diam duis morbi
                    tellus dui consectetur.
                    {" "}
                    <a href="#" className="how-it-works-link">Know More</a>
                  </p>
                </div>
              )}
            </span>
          </h2>
        </div>
        <div className={`accordion ${isAccordionOpen ? "open" : ""}`}>
          <button
            type="button"
            className="accordion-btn"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <div className="accordion-btn-content">
                <IoMdInformationCircleOutline color={"#4A78FF"} size={30} /> 
                <p>Important Notes & Disclaimers</p>
            </div>
            {isAccordionOpen ?  <MdKeyboardArrowUp size={30}/> :<MdKeyboardArrowDown size={30}/> } 
          </button>
          {isAccordionOpen && (
            <div className="accordion-content">
              <ul>
                <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
                <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
                <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
                <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
                <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
              </ul>
            </div>
          )}
        </div>
      </div>  
      <div className="tax-summary">
        <div className="tax-sections">
          <div className="tax-section">
            <h3>Pre Harvesting</h3>
            <table className="tax-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Short-term</th>
                  <th>Long-term</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Profits</td>
                  <td className="positive">$ {formatCurrency(preData.stcg.profits)}</td>
                  <td className="positive">$ {formatCurrency(preData.ltcg.profits)}</td>
                </tr>
                <tr>
                  <td>Losses</td>
                  <td className="negative">- $ {formatCurrency(preData.stcg.losses)}</td>
                  <td className="negative">- $ {formatCurrency(preData.ltcg.losses)}</td>
                </tr>
                <tr className="net-row">
                  <td>Net Capital Gains</td>
                  <td>{formatSignedCurrency(stcgNetPre)}</td>
                  <td>{formatSignedCurrency(ltcgNetPre)}</td>
                </tr>
              </tbody>
            </table>
            <div className="realised-gains">
              Realised Capital Gains: <span className="gain-amount">{formatSignedCurrency(totalGainsPre)}</span>
            </div>
          </div>

          <div className="tax-section after-harvesting">
            <h3>After Harvesting</h3>
            <table className="tax-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Short-term</th>
                  <th>Long-term</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Profits</td>
                  <td className="positive">$ {formatCurrency(postData.stcg.profits)}</td>
                  <td className="positive">$ {formatCurrency(postData.ltcg.profits)}</td>
                </tr>
                <tr>
                  <td>Losses</td>
                  <td className="negative">- $ {formatCurrency(postData.stcg.losses)}</td>
                  <td className="negative">- $ {formatCurrency(postData.ltcg.losses)}</td>
                </tr>
                <tr className="net-row">
                  <td>Net Capital Gains</td>
                  <td>{formatSignedCurrency(stcgNetPost)}</td>
                  <td>{formatSignedCurrency(ltcgNetPost)}</td>
                </tr>
              </tbody>
            </table>
            <div className="realised-gains">
              Effective Capital Gains: <span className="negative-amount">{formatSignedCurrency(totalGainsPost)}</span>
            </div>

            {totalGainsPost < totalGainsPre && (
              <div className="after-savings-note">
                <span className="after-savings-icon">🎉</span>
                <span>
                  Your taxable capital gains are reduced by: <strong>$ {formatCurrency(savings)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
   </> 
  );
};

export default TaxSummary;
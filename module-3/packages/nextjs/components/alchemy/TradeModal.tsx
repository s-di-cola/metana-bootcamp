import React, { useEffect, useState } from "react";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: {
    tokenType: string;
    tokenIndex: number;
    quantity: number;
  };
  onTrade: (toTokenType: number, amount: number) => void;
  isTrading: boolean;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, fromToken, onTrade, isTrading }) => {
  const [toTokenType, setToTokenType] = useState(0); // Default to IRON
  const [amount, setAmount] = useState(0);

  const basicTokens = ["IRON", "COPPER", "SILVER"];

  useEffect(() => {
    // Reset amount when modal opens
    if (isOpen) {
      setAmount(0);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleTrade = () => {
    onTrade(toTokenType, amount);
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Trade {fromToken.tokenType}</h3>
        <div className="py-4">
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">To:</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={toTokenType}
              onChange={e => setToTokenType(Number(e.target.value))}
            >
              {basicTokens.map((tokenName, index) => (
                <option key={index} value={index}>
                  {tokenName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Amount:</span>
            </label>
            <input
              type="range"
              min="0"
              max={fromToken.quantity}
              step="1"
              value={amount}
              onChange={handleAmountChange}
              className="range range-primary"
            />
            <div className="flex justify-between text-sm px-2 mt-2">
              <span>0</span>
              <span>{fromToken.quantity}</span>
            </div>
            <div className="mt-4">
              <input
                type="number"
                min="0"
                max={fromToken.quantity}
                step="0.01"
                value={amount}
                onChange={handleAmountChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose} disabled={isTrading}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${isTrading ? "loading" : ""}`}
            onClick={handleTrade}
            disabled={amount === 0 || amount > fromToken.quantity || isTrading}
          >
            {isTrading ? "" : "Trade"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;

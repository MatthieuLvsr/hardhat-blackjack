import React from "react";

export function Bet({ betTokens, tokenSymbol, onBetPlaced }) {
  return (
    <div>
      <h4>Bet</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount) {
            betTokens(amount);
            // Call onBetPlaced after the bet has been placed
            onBetPlaced();
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Bet" />
        </div>
      </form>
    </div>
  );
}

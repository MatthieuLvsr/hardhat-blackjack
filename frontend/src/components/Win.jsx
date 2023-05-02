import React from "react";

export function Win({ winTokens, tokenSymbol }) {
  return (
    <div>
      <h4>Win</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);

          winTokens();
        }}
      >
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Win" />
        </div>
      </form>
    </div>
  );
}

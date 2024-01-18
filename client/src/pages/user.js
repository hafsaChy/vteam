import React, { useState, useEffect } from "react";

const User = ({ user, handleLogout }) => {
  const [matchingReceipts, setMatchingReceipts] = useState([]);
  const [startBalance, setStartBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addCashAmount, setAddCashAmount] = useState(0);

  const fetchUserDetails = async () => {
    try {
      const userResponse = await fetch(`http://localhost:3050/elcyckel/v1/users/${user.user_id}`);
      const userData = await userResponse.json();

      setStartBalance(parseFloat(userData.balance));
      setCurrentBalance(parseFloat(userData.current_balance));

      //Hämtar kvittot från servern
      const receiptsResponse = await fetch(`http://localhost:3050/elcyckel/v1/receipt`);
      const receiptsData = await receiptsResponse.json();

      const receiptsForUser = receiptsData.filter((receipt) => receipt.user_id === user.user_id);
      setMatchingReceipts(receiptsForUser);

      //Sätter totalsumman till de sammalagda summan av alla kvitton
      const totalAmount = receiptsForUser.reduce((sum, receipt) => sum + parseFloat(receipt.amount), 0);
      setTotalAmount(totalAmount);
    } catch (error) {
      console.error("Error fetching user details or receipts:", error);
    }
  };

  //Funktion som adderar pengar till saldot
  const addCash = async () => {
    try {
      //Beräknar det nya saldot
      const newCurrentBalance = currentBalance + addCashAmount;

      //PUT request som skickas för att uppdatera saldo på server sidan
      const updateBalanceResponse = await fetch(`http://localhost:3050/elcyckel/v1/users/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_balance: newCurrentBalance.toFixed(2),
        }),
      });

      //Uppdatera användardata om förfrågan var ok
      if (updateBalanceResponse.ok) {
        const updatedUserData = await updateBalanceResponse.json();
        console.log("Updated user data after adding cash:", updatedUserData);
        fetchUserDetails();
        setAddCashAmount(0);
      } else {
        console.error("Error adding cash on the server");
      }
    } catch (error) {
      console.error("Error adding cash:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [user?.user_id]);

  useEffect(() => {
    console.log("Start Balance:", startBalance);
    console.log("Total Amount:", totalAmount);
  
    if (startBalance !== 0 && totalAmount !== 0) {
      //Räkna ut current balance genom att ta start balance - kostnaden för alla resor
      const newCurrentBalance = startBalance - totalAmount;
      console.log("New Current Balance:", newCurrentBalance);
  
      const updatedCurrentBalance = Math.max(newCurrentBalance, 0);
      console.log("Updated Current Balance:", updatedCurrentBalance);
      setCurrentBalance(updatedCurrentBalance);
    }
  }, [startBalance, totalAmount]);
  
  

  return (
    <div>
      <div className="Account_info">
        <div className="info">
          <center>
            <h1>Account info</h1>
            <hr />
          </center>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
        <div className="history">
          <center>
            <h1>Account History</h1>
            <hr />
          </center>
          <div>
            {matchingReceipts.map((receipt) => (
              <div key={receipt.receipt_id} className="receipt">
                <p>
                  Receipt ID: {receipt.receipt_id} | Cost: {receipt.amount} | Distance: {receipt.distance_in_km} km
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="balance">
          <center>
            <h1>Balance</h1>
            <hr />
          </center>
          <p>Start balance: {startBalance.toFixed(2)}</p>
          <p>Current balance: {currentBalance.toFixed(2)}</p>
          {}
          <div>
            <h2>Add to current balance</h2>
            <input
              type="number"
              value={isNaN(addCashAmount) ? "" : addCashAmount}
              onChange={(e) => {
                const inputValue = parseFloat(e.target.value);
                if (!isNaN(inputValue) && inputValue >= 0) {
                  setAddCashAmount(inputValue);
                }
              }}
            />
            <button onClick={addCash}>Add Cash</button>
          </div>
        </div>
      </div>
      <div className="logout-container">
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default User;

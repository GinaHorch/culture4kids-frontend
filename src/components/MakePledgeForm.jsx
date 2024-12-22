import React, { useState } from "react";
import z from "zod";
import { useAuth } from "../hooks/use-auth";
import { useNavigate } from "react-router-dom";
import "./MakePledgeForm.css";

// Define the schema for pledge validation
const pledgeSchema = z.object({
    amount: z.coerce.number().min(1, { message: "Amount must be at least 1" }),
});

function MakePledgeForm({ projectId, remainingAmount }) {
  const { auth } = useAuth(); // For user authentication
  const navigate = useNavigate(); // For navigation
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false); // New state for anonymous pledge

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate the pledge amount
      pledgeSchema.parse({ amount: pledgeAmount });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/pledges/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${auth.token}`, // Pass auth token
        },
        body: JSON.stringify({ 
          amount: pledgeAmount, 
          comment, 
          project: projectId, 
          anonymous: isAnonymous, // Include anonymous flag in the request
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to make a pledge.");
      }

      setSuccess("Pledge submitted successfully!");
      setPledgeAmount("");
      setComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="make-pledge-form">
      <h3>Make a Pledge</h3>
      {auth?.token ? (
        remainingAmount === 0 ? (
          <p className="error-message">This project is fully pledged.</p>
        ) : (
          <div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="amount">Pledge Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(e.target.value)}
                  placeholder={`Max: $${remainingAmount}`}
                />
              </div>
              <div>
                <label htmlFor="comment">Comment (optional):</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a message to your pledge..."
                ></textarea>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  Make this pledge anonymous
                </label>
              </div>
              <button type="submit">Submit Pledge</button>
            </form>
          </div>
        )
      ) : (
        <div className="auth-buttons">
          <p className="error-message">You must be logged in to make a pledge.</p>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default MakePledgeForm;

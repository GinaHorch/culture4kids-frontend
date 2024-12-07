import React, { useState } from "react";
import z from "zod";
import { useAuth } from "../hooks/use-auth";
import "./MakePledgeForm.css";

 // Define the schema for pledge validation
 const pledgeSchema = z.object({
    amount: z.coerce().number().min(1, { message: "Amount must be at least 1" }),
});

function MakePledgeForm({ projectId, remainingAmount }) {
  const { auth } = useAuth(); // For user authentication
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/pledges/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`, // Pass auth token
        },
        body: JSON.stringify({ amount, comment }),
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
        <button type="submit">Submit Pledge</button>
      </form>
    </div>
  );
}

export default MakePledgeForm;

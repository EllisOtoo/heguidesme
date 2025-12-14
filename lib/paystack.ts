export const initializePayment = async (email: string, amount: number, callbackUrl: string) => {
  const url = "https://api.paystack.co/transaction/initialize";
  const fields = {
    email,
    amount, // In kobo/cents
    callback_url: callbackUrl,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to initialize payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Paystack Init Error:", error);
    throw error;
  }
};

export const verifyPayment = async (reference: string) => {
  const url = `https://api.paystack.co/transaction/verify/${reference}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
         const error = await response.json();
         throw new Error(error.message || "Failed to verify payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Paystack Verify Error:", error);
    throw error;
  }
};

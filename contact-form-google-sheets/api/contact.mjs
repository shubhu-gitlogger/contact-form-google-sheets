export default async function handler(req, res) {
  try {

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed"
      });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("GOOGLE_SCRIPT_URL is missing");

      return res.status(500).json({
        success: false,
        message: "Google Script URL is not configured."
      });
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      website
    } = req.body || {};

    // Honeypot spam protection
    if (website) {
      return res.status(400).json({
        success: false,
        message: "Spam detected."
      });
    }

    // Required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        message
      })
    });

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Google Script response:", text);

      return res.status(500).json({
        success: false,
        message: "Invalid response from Google Sheets."
      });
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message || "Failed to save enquiry."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry saved successfully."
    });

  } catch (error) {

    console.error("API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error."
    });
  }
}
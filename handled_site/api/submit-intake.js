export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, whatYouDo, describes, path, services, problem, tried, timeline, budget, referral, anything } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Name":                                         name,
            "Email":                                        email,
            "Phone":                                        phone || "",
            "What do you do":                               whatYouDo || "",
            "Which best describes you?":                    describes || "",
            "What you're looking for?":                     path || "",
            "Any specific services on your mind?":          services || "",
            "What's the main thing you want off your plate?": problem || "",
            "What have you tried so far?":                  tried || "",
            "Timeline":                                     timeline || "",
            "Budget range":                                 budget || "",
            "How did you hear about handled.?":             referral || "",
            "Anything else we should know?":                anything || "",
            "Submitted At":                                 new Date().toISOString(),
            "Status":                                       "New",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Airtable error:", err);
      return res.status(500).json({ error: "Could not save your info. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}

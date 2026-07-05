export async function query(prompt) {
	try {
		const response = await fetch(
			"https://router.huggingface.co/fal-ai/fal-ai/fast-sdxl?_subdomain=queue",
			{
				headers: {
					Authorization: `API_KEY`,
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({ prompt }),
			}
		)

		if (!response.ok) {
			throw new Error("Image generation failed")
		}

		const contentType = response.headers.get("content-type") || ""
		if (contentType.includes("application/json")) {
			const data = await response.json()
			const imageUrl = data?.images?.[0]?.url || data?.image?.url || data?.output?.[0]?.url
			if (imageUrl) {
				const imageResponse = await fetch(imageUrl)
				if (!imageResponse.ok) {
					throw new Error("Image download failed")
				}
				return await imageResponse.blob()
			}
			if (data?.images?.[0]?.b64_json) {
				return `data:image/png;base64,${data.images[0].b64_json}`
			}
		}

		return await response.blob()
	} catch (error) {
		return null
	}
}



export const serverFetch = async (path) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`);
        
        // ✅ Check status
        if (!res.ok) {
            console.error(`API Error: ${res.status}`);
            return null;  // ← Return null instead of crashing
        }

        // ✅ Get text first
        const text = await res.text();
        
        // ✅ Check if empty
        if (!text || text.trim() === "") {
            console.warn("Empty response");
            return null;
        }

        // ✅ Safe parse
        const data = JSON.parse(text);
        return data;

    } catch (error) {
        console.error("Fetch error:", error);
        return null;  // ← Never crash
    }
}
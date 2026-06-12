// Serverless memory buffer arrays
let liveTelemetry = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    direction: "Calm",
    windSpeed: 0,
    rainfall: 0,
    history: []
};

export default function handler(req, res) {
    // Cross-Origin Resource Sharing (CORS) Security Header Access Handling
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. INBOUND CONTEXT: The physical ESP32 uploading real-time sensor metrics
    if (req.method === 'POST') {
        const { temperature, humidity, pressure, direction, windSpeed, rainfall } = req.body;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        liveTelemetry = {
            temperature: Number(temperature) || 0,
            humidity: Number(humidity) || 0,
            pressure: Number(pressure) || 0,
            direction: direction || "Calm",
            windSpeed: Number(windSpeed) || 0,
            rainfall: Number(rainfall) || 0,
            history: [...liveTelemetry.history, { time: now, wind: Number(windSpeed) || 0, rain: Number(rainfall) || 0 }]
        };

        // Clip history slice windows so the browser canvas does not overload
        if (liveTelemetry.history.length > 100) {
            liveTelemetry.history.shift();
        }

        return res.status(200).json({ status: "Synchronized" });
    }

    // 2. OUTBOUND CONTEXT: The frontend web interface pulling metrics data
    if (req.method === 'GET') {
        return res.status(200).json(liveTelemetry);
    }

    return res.status(405).json({ error: "Method structural layout mismatch" });
}
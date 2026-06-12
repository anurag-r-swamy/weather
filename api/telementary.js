let globalCache = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    direction: "Calm",
    windSpeed: 0,
    rainfall: 0,
    history: []
};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const { temperature, humidity, pressure, direction, windSpeed, rainfall } = req.body;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        globalCache = {
            temperature: Number(temperature) || 0,
            humidity: Number(humidity) || 0,
            pressure: Number(pressure) || 0,
            direction: direction || "Calm",
            windSpeed: Number(windSpeed) || 0,
            rainfall: Number(rainfall) || 0,
            history: [...globalCache.history, { time: timestamp, wind: Number(windSpeed) || 0, rain: Number(rainfall) || 0 }]
        };

        if (globalCache.history.length > 60) globalCache.history.shift();

        return res.status(200).json({ status: "Updated" });
    }

    if (req.method === 'GET') {
        return res.status(200).json(globalCache);
    }

    return res.status(405).json({ error: "Method structural mismatch" });
}
const ical = require('node-ical');
const https = require('https');

const ICS_URLS = {
  a1: 'https://api.spotahome.com/public/calendar/1432862.ics?k=ab69793c38d58cee262048ba80fb2c00fcd49c7881ce9b46fe48ca0c3062c76e',
  a2: 'https://api.spotahome.com/public/calendar/1414420.ics?k=478f8409bc5ea709dcf1e9add08402f2916fb2dd26ca2a881b12209f45b41022',
  a3: 'https://api.spotahome.com/public/calendar/1414418.ics?k=ccf16123e31ae2758f7b124367221f13478f84bfbccdccc4e34860d6caf35f0f',
  a4: 'https://api.spotahome.com/public/calendar/1443994.ics?k=3b245f30d31e9bd4450a1f09c7db755ee7e169d70a44c56383c5eabe361896c4',
  a5: 'https://api.spotahome.com/public/calendar/1413975.ics?k=c3af6bb0c7588e49a04dad2f1f2b42b09f2057cae2c3354d38e284ac91fb3c9d',
  b1: 'https://api.spotahome.com/public/calendar/1414421.ics?k=ff925c5af178f704cc232998ce9dbc4a4af78e0b91d7550a87234f0304444252',
  b2: 'https://api.spotahome.com/public/calendar/1429922.ics?k=68c23f240698a28e9fc1ea6e37ecffeea36d1b38bec5ea29eefcd0ae84003b17',
  b3: 'https://api.spotahome.com/public/calendar/1439452.ics?k=46e00b931b72e2aa53b35b915c017936263f6dfd12b7b7c75481a0a4fb4aaa8b',
  b4: 'https://api.spotahome.com/public/calendar/1413974.ics?k=79ae522ec3e804c7f6992a981d71e746f15c20d33d1568979be1c537878f8983',
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

function toDateString(date) {
  if (!date) return null;
  if (typeof date === 'string') return date.slice(0, 10);
  try {
    return new Date(date).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const apt = ((req.query && req.query.apt) || '').toLowerCase().trim();

  if (!apt) {
    return res.status(400).json({ error: 'Missing apt parameter' });
  }

  // B5 has no iCal → always available
  if (apt === 'b5') {
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.json({ events: [] });
  }

  const icsUrl = ICS_URLS[apt];
  if (!icsUrl) {
    return res.status(404).json({ error: 'Unknown apartment ID' });
  }

  try {
    const rawIcs = await fetchUrl(icsUrl);
    const parsed = ical.parseICS(rawIcs);

    const events = [];
    for (const key of Object.keys(parsed)) {
      const ev = parsed[key];
      if (ev.type !== 'VEVENT') continue;
      const start = toDateString(ev.start);
      const end = toDateString(ev.end);
      if (start && end) {
        events.push({ start, end });
      }
    }

    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.json({ events });
  } catch (err) {
    console.error(`[ical] Failed to fetch ${apt}:`, err.message);
    return res.json({ events: [], error: 'fetch_failed' });
  }
};

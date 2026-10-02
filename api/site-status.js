// Vercel Serverless Function: Daksh Website Status Controller
// Global edge memory state + validation

let siteState = {
  status: 'active', // 'active' or 'disabled'
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System Init',
  message: 'Website is currently live and active.'
};

const AUTHORIZED_KEYS = [
  'VOXAI-GODMODE-MASTER-KEY-2026-X99-CRYPT-SHIELD-OMEGA',
  'DAKSH-GODMODE-MASTER-KEY-2026-X99-SHIELD',
  'Daksh#Admin2026!Secured',
  'VoxAI#Admin2026!Secured',
  'Daksh#Master2026!Lock',
  '889926'
];

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Return current site status
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      success: true,
      status: siteState.status,
      lastUpdated: siteState.lastUpdated,
      updatedBy: siteState.updatedBy,
      message: siteState.message,
      httpCode: siteState.status === 'active' ? 200 : 500
    });
  }

  // POST: Update status (requires auth)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { status, passcode, updatedBy } = body;

      if (!passcode || !AUTHORIZED_KEYS.includes(passcode.trim())) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid Admin Passcode or PIN'
        });
      }

      if (status !== 'active' && status !== 'disabled') {
        return res.status(400).json({
          success: false,
          error: 'Invalid status parameter. Must be "active" or "disabled".'
        });
      }

      siteState.status = status;
      siteState.lastUpdated = new Date().toISOString();
      siteState.updatedBy = updatedBy || 'Master Admin';
      siteState.message = status === 'active' 
        ? 'Website is currently live and active.' 
        : 'Website is disabled (500 Critical Server Crash simulation active).';

      return res.status(200).json({
        success: true,
        message: `Website status successfully updated to: ${status.toUpperCase()}`,
        status: siteState.status,
        lastUpdated: siteState.lastUpdated,
        httpCode: status === 'active' ? 200 : 500
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Server error processing status update: ' + err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};

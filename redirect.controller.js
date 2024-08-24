import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    // Check if the request is from Instagram's in-app browser
    const isInstagram = /Instagram/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/.test(userAgent);

    if (isInstagram) {
        if (isAndroid) {
            // Redirect to Chrome using an intent URL for Android devices
            const chromeIntentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
            return res.redirect(chromeIntentUrl);
        } else if (isIOS) {
            // iOS does not support direct Chrome redirection, so provide a fallback or prompt
            return res.send(`
                <html>
                <body>
                    <p>To open this link in Chrome, please click the three dots in the Instagram browser and select "Open in Browser" and then choose Chrome.</p>
                    <a href="${url}">Continue to ${url}</a>
                </body>
                </html>
            `);
        }
    }

    // Default redirect if not in Instagram browser
    return res.redirect(url);
});

export default router;

import { getSecret } from 'wix-secrets-backend';
import { fetch } from 'wix-fetch';

const API_ROOT = 'https://www.wixapis.com';
const SITE_ID = '12ee5ea0-70a7-492f-8020-ffb27cbb630f';
const SECRET_NAMES = ['WIX_API_KEY', 'BERLINWALK_WIX_API_KEY', 'berlinwalk-wix-api-key'];

function cleanText(value, fallback = '') {
  return String(value == null ? fallback : value).trim();
}

function cleanEmail(value) {
  return cleanText(value).toLowerCase();
}

function isLikelyEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readWixApiKey() {
  for (const name of SECRET_NAMES) {
    try {
      const value = cleanText(await getSecret(name));
      if (value) return value;
    } catch (error) {
      // Missing secrets throw; try the next known name before reporting failure.
    }
  }

  return '';
}

function compactApiMessage(parsed, fallbackText) {
  const message = parsed && (parsed.message || parsed.error || parsed.details);
  if (typeof message === 'string') return message.slice(0, 500);
  if (message) return JSON.stringify(message).slice(0, 500);
  return cleanText(fallbackText).slice(0, 500);
}

export async function subscribeEmailMarketing(email) {
  const normalizedEmail = cleanEmail(email);

  if (!normalizedEmail || !isLikelyEmail(normalizedEmail)) {
    return {
      ok: false,
      reason: 'invalid_email'
    };
  }

  const apiKey = await readWixApiKey();
  if (!apiKey) {
    return {
      ok: false,
      reason: 'missing_api_key'
    };
  }

  try {
    const response = await fetch(`${API_ROOT}/email-marketing/v1/email-subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'wix-site-id': SITE_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription: {
          email: normalizedEmail,
          subscriptionStatus: 'SUBSCRIBED'
        }
      })
    });

    const text = await response.text();
    let parsed = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch (error) {
      parsed = {};
    }

    if (!response.ok) {
      return {
        ok: false,
        reason: 'api_error',
        status: response.status,
        message: compactApiMessage(parsed, text)
      };
    }

    const subscription = parsed.subscription || {};
    return {
      ok: true,
      email: normalizedEmail,
      subscriptionStatus: subscription.subscriptionStatus || 'SUBSCRIBED'
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'network_error',
      message: cleanText(error && error.message ? error.message : error).slice(0, 500)
    };
  }
}

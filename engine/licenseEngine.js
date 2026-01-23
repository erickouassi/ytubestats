// Internal URL for license data
const licenseJsonUrl = "/data/data.json";

async function validateLicense(userLicenseKey) {
  const currentDomain = window.location.hostname;

  // Allow development environments
  const devDomains = ["localhost", "127.0.0.1"];
  const isLocalNetwork =
    currentDomain.startsWith("192.168.") ||
    currentDomain.startsWith("10.") ||
    currentDomain.endsWith(".local");

  const isDev = devDomains.includes(currentDomain) || isLocalNetwork;

  try {
    const res = await fetch(licenseJsonUrl);
    if (!res.ok) {
      localStorage.removeItem("licenseValidated");
      window.location.href = "error.html";
      return;
    }

    const data = await res.json();
    const license = data.licenses.find(item => item.key === userLicenseKey);

    if (!license) {
      localStorage.removeItem("licenseValidated");
      window.location.href = "invalid.html";
      return;
    }

    // Domain check (skip in development)
    if (!isDev && !license.domains.includes(currentDomain)) {
      localStorage.removeItem("licenseValidated");
      window.location.href = "domain.html";
      return;
    }

    // Expiration check
    const today = new Date();
    const expirationDate = new Date(license.expires);

    if (license.expires !== "never" && today > expirationDate) {
      const graceDays = Number(license.graceDays) || 0;

      if (graceDays > 0) {
        const graceLimit = new Date(expirationDate);
        graceLimit.setDate(graceLimit.getDate() + graceDays);

        if (today <= graceLimit) {
          localStorage.setItem("licenseValidated", "true");
          window.location.href = "home.html";
          return;
        }
      }

      localStorage.removeItem("licenseValidated");
      window.location.href = "expired.html";
      return;
    }

    // Multi-domain soft check (skip in development)
    if (!isDev && license.domains.length > license.maxDomains) {
      localStorage.removeItem("licenseValidated");
      window.location.href = "invalid.html";
      return;
    }

    // SUCCESS — persistent validation
    localStorage.setItem("licenseValidated", "true");
    window.location.href = "home.html";

  } catch (err) {
    localStorage.removeItem("licenseValidated");
    window.location.href = "error.html";
  }
}

/* Counterwise site configuration — explicit, reviewable, one place to flip.
   analyticsEndpoint: null means "not provisioned" (flag FLG-006). Set it to a
   first-party HTTPS endpoint (see analytics/ for a reference worker) only after
   a retention policy and privacy notice are in place. No cookies, no PII. */
window.CW_CONFIG = {
  analyticsEndpoint: null,   // e.g. "https://stats.example.com/e" — keep null until provisioned
  associatesTag: "shopnow047c-20",
  searchConsoleToken: null   // set after verifying the property (SG-29 / FLG-007)
};

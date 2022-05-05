const dotenv = require("dotenv");
dotenv.config();

const {
    ADMIN_PROJECT_ID,
    ADMIN_PRIVATE_KEY_ID,
    ADMIN_PRIVATE_KEY,
    ADMIN_CLIENT_EMAIL,
    ADMIN_CLIENT_ID,
    ADMIN_CLIENT_x509_CERT_URL
} = process.env;

const certificate = {
  type: "service_account",
  project_id: ADMIN_PROJECT_ID,
  private_key_id: ADMIN_PRIVATE_KEY_ID,
  private_key: ADMIN_PRIVATE_KEY,
  client_email: ADMIN_CLIENT_EMAIL,
  client_id: ADMIN_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: ADMIN_CLIENT_x509_CERT_URL
}

module.exports = {
  certificate
}

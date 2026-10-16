import tls from "tls";

const socket = tls.connect(
  {
    host: "mail.tantrapex.com",
    port: 465,
    servername: "mail.tantrapex.com",
    rejectUnauthorized: false,
  },
  () => {
    const cert = socket.getPeerCertificate(true);

    console.log("\n===== CERTIFICATE =====");
    console.log("Subject:", cert.subject);
    console.log("Issuer:", cert.issuer);
    console.log("SAN:", cert.subjectaltname);
    console.log("Valid From:", cert.valid_from);
    console.log("Valid To:", cert.valid_to);

    socket.end();
  }
);

socket.on("error", (err) => {
  console.error(err);
});
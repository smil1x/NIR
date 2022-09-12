export const getTestPrivateKey = () => `-----BEGIN PRIVATE KEY-----
MIIBOQIBAAJBAI5P3p8sndpc9l8uENUTqGNRXIRFJvfSMZ66otmyiUxjDEyaOsJW
uAM3BwFd/J6wdOrFIQrxZ1o2OfGr+w05sVcCAwEAAQJAYlOa7H2mPzaV32Nzq9Ue
NikD9DvXVcj8EcDAPgvWQ1jwFd7moqaOy7nrpJPlkzEywsOaQ0Dn8ZGo3Pndch0D
0QIhAMh6j36IBgORsrkW1YxUu0KDZlHW277I4oabyewye8IvAiEAtblulJN6E0T3
2aoP5FtDw9kfxB+MwXr4IfMvLRtfAVkCICWyPfcZ1p+nLsb0zzSy3f80u/GZh/pI
xadv9bjvCSxLAiAeUusY7+MXBBM3xyEPwgr0y255k6oxPwvY3nOo20BnQQIgQ8jC
7FqoMyoV6Z8WVOwO4iTJIPIj9ZcYMLvBZkyMi0U=
-----END PRIVATE KEY-----`;

export const getTestCertificate = () => `-----BEGIN CERTIFICATE-----
MIIBOQIBAAJBAI5P3p8sndpc9l8uENUTqGNRXIRFJvfSMZ66otmyiUxjDEyaOsJW
uAM3BwFd/J6wdOrFIQrxZ1o2OfGr+w05sVcCAwEAAQJAYlOa7H2mPzaV32Nzq9Ue
NikD9DvXVcj8EcDAPgvWQ1jwFd7moqaOy7nrpJPlkzEywsOaQ0Dn8ZGo3Pndch0D
0QIhAMh6j36IBgORsrkW1YxUu0KDZlHW277I4oabyewye8IvAiEAtblulJN6E0T3
2aoP5FtDw9kfxB+MwXr4IfMvLRtfAVkCICWyPfcZ1p+nLsb0zzSy3f80u/GZh/pI
xadv9bjvCSxLAiAeUusY7+MXBBM3xyEPwgr0y255k6oxPwvY3nOo20BnQQIgQ8jC
7FqoMyoV6Z8WVOwO4iTJIPIj9ZcYMLvBZkyMi0U=
-----END CERTIFICATE-----`;

export const getTestCertificateChain = () => `-----BEGIN CERTIFICATE-----
MIIBOQIBAAJBAI5P3p8sndpc9l8uENUTqGNRXIRFJvfSMZ66otmyiUxjDEyaOsJW
uAM3BwFd/J6wdOrFIQrxZ1o2OfGr+w05sVcCAwEAAQJAYlOa7H2mPzaV32Nzq9Ue
NikD9DvXVcj8EcDAPgvWQ1jwFd7moqaOy7nrpJPlkzEywsOaQ0Dn8ZGo3Pndch0D
0QIhAMh6j36IBgORsrkW1YxUu0KDZlHW277I4oabyewye8IvAiEAtblulJN6E0T3
2aoP5FtDw9kfxB+MwXr4IfMvLRtfAVkCICWyPfcZ1p+nLsb0zzSy3f80u/GZh/pI
xadv9bjvCSxLAiAeUusY7+MXBBM3xyEPwgr0y255k6oxPwvY3nOo20BnQQIgQ8jC
7FqoMyoV6Z8WVOwO4iTJIPIj9ZcYMLvBZkyMi0U=
-----END CERTIFICATE-----`;

export const testCerts = `
${getTestPrivateKey()}
${getTestCertificate()}
${getTestCertificateChain()}
`;

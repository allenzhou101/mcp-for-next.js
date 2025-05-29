export async function GET() {
    return Response.json({
        issuer: "https://api.descope.org/v1/apps/P2CqCdq2bnO9JS2awFKlIPngwPUK",
        jwks_uri: "https://api.descope.org/P2CqCdq2bnO9JS2awFKlIPngwPUK/.well-known/jwks.json",
        authorization_endpoint: "https://api.descope.org/oauth2/v1/apps/authorize",
        response_types_supported: ["code"],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256"],
        token_endpoint: "https://api.descope.org/oauth2/v1/apps/token",
        userinfo_endpoint: "https://api.descope.org/oauth2/v1/apps/userinfo",
        scopes_supported: ["openid", "profile", "email", "phone"],
        claims_supported: [
            "iss",
            "aud",
            "iat",
            "exp",
            "sub",
            "name",
            "email",
            "email_verified",
            "phone_number",
            "phone_number_verified",
            "picture",
            "family_name",
            "given_name"
        ],
        revocation_endpoint: "https://api.descope.org/oauth2/v1/apps/revoke",
        registration_endpoint: "https://api.descope.org/v1/mgmt/inboundapp/app/P2CqCdq2bnO9JS2awFKlIPngwPUK/register"
    });
}
package et.gov.police.dto;

public class LoginResponse {
    private String   accessToken;
    private String   refreshToken;
    private String   tokenType;
    private long     expiresIn;
    private UserInfo user;

    public LoginResponse() {}

    private LoginResponse(Builder b) {
        this.accessToken  = b.accessToken;
        this.refreshToken = b.refreshToken;
        this.tokenType    = b.tokenType;
        this.expiresIn    = b.expiresIn;
        this.user         = b.user;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String   accessToken;
        private String   refreshToken;
        private String   tokenType;
        private long     expiresIn;
        private UserInfo user;

        public Builder accessToken(String v)  { this.accessToken  = v; return this; }
        public Builder refreshToken(String v) { this.refreshToken = v; return this; }
        public Builder tokenType(String v)    { this.tokenType    = v; return this; }
        public Builder expiresIn(long v)      { this.expiresIn    = v; return this; }
        public Builder user(UserInfo v)       { this.user         = v; return this; }
        public LoginResponse build()          { return new LoginResponse(this); }
    }

    public String   getAccessToken()  { return accessToken; }
    public String   getRefreshToken() { return refreshToken; }
    public String   getTokenType()    { return tokenType; }
    public long     getExpiresIn()    { return expiresIn; }
    public UserInfo getUser()         { return user; }

    public void setAccessToken(String v)  { this.accessToken  = v; }
    public void setRefreshToken(String v) { this.refreshToken = v; }
    public void setTokenType(String v)    { this.tokenType    = v; }
    public void setExpiresIn(long v)      { this.expiresIn    = v; }
    public void setUser(UserInfo v)       { this.user         = v; }

    // ── Nested UserInfo ───────────────────────────────────────────
    public static class UserInfo {
        private Long   id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String badge;
        private String rank;

        public UserInfo() {}

        private UserInfo(Builder b) {
            this.id       = b.id;
            this.username = b.username;
            this.email    = b.email;
            this.fullName = b.fullName;
            this.role     = b.role;
            this.badge    = b.badge;
            this.rank     = b.rank;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long   id;
            private String username;
            private String email;
            private String fullName;
            private String role;
            private String badge;
            private String rank;

            public Builder id(Long v)       { this.id       = v; return this; }
            public Builder username(String v){ this.username = v; return this; }
            public Builder email(String v)  { this.email    = v; return this; }
            public Builder fullName(String v){ this.fullName = v; return this; }
            public Builder role(String v)   { this.role     = v; return this; }
            public Builder badge(String v)  { this.badge    = v; return this; }
            public Builder rank(String v)   { this.rank     = v; return this; }
            public UserInfo build()         { return new UserInfo(this); }
        }

        public Long   getId()       { return id; }
        public String getUsername() { return username; }
        public String getEmail()    { return email; }
        public String getFullName() { return fullName; }
        public String getRole()     { return role; }
        public String getBadge()    { return badge; }
        public String getRank()     { return rank; }
    }
}

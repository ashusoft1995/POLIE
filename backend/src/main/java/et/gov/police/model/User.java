package et.gov.police.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email",    columnList = "email",    unique = true),
    @Index(name = "idx_users_username", columnList = "username", unique = true)
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 60)
    private String username;

    @Email @NotBlank
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(length = 30)
    private String badge;

    @Column(length = 60)
    private String rank;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false)
    private boolean accountLocked = false;

    @Column(length = 6)
    private String resetOtp;

    private LocalDateTime resetOtpExpiry;

    @Column(nullable = false)
    private int failedLoginAttempts = 0;

    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public User() {}

    private User(Builder b) {
        this.username             = b.username;
        this.email                = b.email;
        this.password             = b.password;
        this.fullName             = b.fullName;
        this.role                 = b.role;
        this.badge                = b.badge;
        this.rank                 = b.rank;
        this.enabled              = b.enabled;
        this.accountLocked        = b.accountLocked;
        this.failedLoginAttempts  = b.failedLoginAttempts;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String  username;
        private String  email;
        private String  password;
        private String  fullName;
        private Role    role;
        private String  badge;
        private String  rank;
        private boolean enabled             = true;
        private boolean accountLocked       = false;
        private int     failedLoginAttempts = 0;

        public Builder username(String v)            { this.username = v; return this; }
        public Builder email(String v)               { this.email = v; return this; }
        public Builder password(String v)            { this.password = v; return this; }
        public Builder fullName(String v)            { this.fullName = v; return this; }
        public Builder role(Role v)                  { this.role = v; return this; }
        public Builder badge(String v)               { this.badge = v; return this; }
        public Builder rank(String v)                { this.rank = v; return this; }
        public Builder enabled(boolean v)            { this.enabled = v; return this; }
        public Builder accountLocked(boolean v)      { this.accountLocked = v; return this; }
        public User build()                          { return new User(this); }
    }

    // Getters
    public Long          getId()                  { return id; }
    public String        getUsername()            { return username; }
    public String        getEmail()               { return email; }
    public String        getPassword()            { return password; }
    public String        getFullName()            { return fullName; }
    public Role          getRole()                { return role; }
    public String        getBadge()               { return badge; }
    public String        getRank()                { return rank; }
    public boolean       isEnabled()              { return enabled; }
    public boolean       isAccountLocked()        { return accountLocked; }
    public String        getResetOtp()            { return resetOtp; }
    public LocalDateTime getResetOtpExpiry()      { return resetOtpExpiry; }
    public int           getFailedLoginAttempts() { return failedLoginAttempts; }
    public LocalDateTime getLastLoginAt()         { return lastLoginAt; }
    public LocalDateTime getCreatedAt()           { return createdAt; }
    public LocalDateTime getUpdatedAt()           { return updatedAt; }

    // Setters
    public void setId(Long v)                         { this.id = v; }
    public void setUsername(String v)                 { this.username = v; }
    public void setEmail(String v)                    { this.email = v; }
    public void setPassword(String v)                 { this.password = v; }
    public void setFullName(String v)                 { this.fullName = v; }
    public void setRole(Role v)                       { this.role = v; }
    public void setBadge(String v)                    { this.badge = v; }
    public void setRank(String v)                     { this.rank = v; }
    public void setEnabled(boolean v)                 { this.enabled = v; }
    public void setAccountLocked(boolean v)           { this.accountLocked = v; }
    public void setResetOtp(String v)                 { this.resetOtp = v; }
    public void setResetOtpExpiry(LocalDateTime v)    { this.resetOtpExpiry = v; }
    public void setFailedLoginAttempts(int v)         { this.failedLoginAttempts = v; }
    public void setLastLoginAt(LocalDateTime v)       { this.lastLoginAt = v; }

    // Helpers
    public boolean isResetOtpValid(String otp) {
        return resetOtp != null
            && resetOtp.equals(otp)
            && resetOtpExpiry != null
            && LocalDateTime.now().isBefore(resetOtpExpiry);
    }

    public void clearResetOtp() {
        this.resetOtp = null;
        this.resetOtpExpiry = null;
    }
}

package et.gov.police.service;

import et.gov.police.dto.*;
import et.gov.police.model.User;
import et.gov.police.repository.UserRepository;
import et.gov.police.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int OTP_VALID_MINUTES   = 15;

    private final UserRepository       userRepository;
    private final PasswordEncoder      passwordEncoder;
    private final JwtUtil              jwtUtil;
    private final AuthenticationManager authManager;
    private final EmailService         emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       EmailService emailService) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil         = jwtUtil;
        this.authManager     = authenticationManager;
        this.emailService    = emailService;
    }

    @Transactional
    public ApiResponse<LoginResponse> login(LoginRequest req) {
        User user = userRepository.findByUsernameOrEmail(req.getIdentifier()).orElse(null);

        if (user == null)
            return ApiResponse.fail("Invalid credentials. Please try again.");
        if (!user.isEnabled())
            return ApiResponse.fail("Account disabled. Contact the administrator.");
        if (user.isAccountLocked())
            return ApiResponse.fail("Account locked. Contact the administrator.");

        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), req.getPassword())
            );
        } catch (AuthenticationException e) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setAccountLocked(true);
                userRepository.save(user);
                return ApiResponse.fail("Account locked after " + MAX_FAILED_ATTEMPTS + " failed attempts.");
            }
            userRepository.save(user);
            int remaining = MAX_FAILED_ATTEMPTS - user.getFailedLoginAttempts();
            return ApiResponse.fail("Invalid credentials. " + remaining + " attempt(s) remaining.");
        }

        user.setFailedLoginAttempts(0);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String accessToken  = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        LoginResponse response = LoginResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtUtil.getExpirationMs())
            .user(LoginResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .badge(user.getBadge())
                .rank(user.getRank())
                .build())
            .build();

        return ApiResponse.ok("Login successful", response);
    }

    @Transactional
    public ApiResponse<Void> forgotPassword(ForgotPasswordRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElse(null);
        if (user == null)
            return ApiResponse.ok("If that email is registered, an OTP has been sent.");

        String otp = generateOtp();
        user.setResetOtp(otp);
        user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(OTP_VALID_MINUTES));
        userRepository.save(user);

        String name = user.getFullName() != null ? user.getFullName() : user.getUsername();
        emailService.sendOtpEmail(user.getEmail(), name, otp);
        log.info("OTP generated for user: {}", user.getUsername());
        return ApiResponse.ok("OTP has been sent to your email address.");
    }

    @Transactional(readOnly = true)
    public ApiResponse<Void> verifyOtp(VerifyOtpRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElse(null);
        if (user == null || !user.isResetOtpValid(req.getOtp()))
            return ApiResponse.fail("Invalid or expired OTP.");
        return ApiResponse.ok("OTP verified successfully.");
    }

    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElse(null);
        if (user == null || !user.isResetOtpValid(req.getOtp()))
            return ApiResponse.fail("Invalid or expired OTP. Please request a new one.");

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.clearResetOtp();
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        userRepository.save(user);

        log.info("Password reset for user: {}", user.getUsername());
        return ApiResponse.ok("Password reset successfully. You may now log in.");
    }

    private String generateOtp() {
        return String.valueOf(100000 + new SecureRandom().nextInt(900000));
    }
}

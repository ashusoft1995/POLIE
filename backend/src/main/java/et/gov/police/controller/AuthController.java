package et.gov.police.controller;

import et.gov.police.dto.*;
import et.gov.police.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<LoginResponse> response = authService.login(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 401).body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        ApiResponse<Void> response = authService.verifyOtp(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse<Void> response = authService.resetPassword(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("Hossana Police Backend is running", "UP"));
    }
}

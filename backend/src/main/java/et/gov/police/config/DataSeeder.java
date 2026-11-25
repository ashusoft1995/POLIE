package et.gov.police.config;

import et.gov.police.model.Role;
import et.gov.police.model.User;
import et.gov.police.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and upserting default users...");

        List<Object[]> defaults = List.of(
            new Object[]{"head",       "head@hossanapolice.gov.et",       "head123",        "Head Habtamu Woldemariam", Role.POLICE_HEAD,  "PHD-001", "Head of Police"},
            new Object[]{"detective",  "detective@hossanapolice.gov.et",  "detective123",   "Det. Abebe Girma",         Role.DETECTIVE,    "DET-012", "Detective Sergeant"},
            new Object[]{"preventive", "preventive@hossanapolice.gov.et", "preventive123",  "Off. Meron Tadesse",       Role.PREVENTIVE,   "PRV-021", "Police Officer I"},
            new Object[]{"traffic",    "traffic@hossanapolice.gov.et",    "traffic123",     "Off. Kebede Alemu",        Role.TRAFFIC,      "TRF-033", "Traffic Officer"},
            new Object[]{"hr",         "hr@hossanapolice.gov.et",         "hr123",          "Insp. Almaz Worku",        Role.HR,           "HR-005",  "HR Inspector"},
            new Object[]{"admin",      "admin@hossanapolice.gov.et",      "admin123",       "Admin Daniel Kebede",      Role.SYSTEM_ADMIN, "ADM-001", "System Administrator"}
        );

        for (Object[] d : defaults) {
            String username = (String) d[0];
            String email    = (String) d[1];
            String password = (String) d[2];
            String fullName = (String) d[3];
            Role   role     = (Role)   d[4];
            String badge    = (String) d[5];
            String rank     = (String) d[6];

            userRepository.findByUsername(username).ifPresentOrElse(
                existing -> {
                    // Always re-encode password so it matches the known plain-text
                    existing.setPassword(passwordEncoder.encode(password));
                    existing.setFullName(fullName);
                    existing.setEmail(email);
                    existing.setRole(role);
                    existing.setBadge(badge);
                    existing.setRank(rank);
                    existing.setEnabled(true);
                    existing.setAccountLocked(false);
                    existing.setFailedLoginAttempts(0);
                    userRepository.save(existing);
                    log.info("✅ Updated user: {}", username);
                },
                () -> {
                    User u = User.builder()
                        .username(username).email(email)
                        .password(passwordEncoder.encode(password))
                        .fullName(fullName).role(role)
                        .badge(badge).rank(rank).build();
                    userRepository.save(u);
                    log.info("✅ Created user: {}", username);
                }
            );
        }
        log.info("✅ All default users are ready.");
    }
}

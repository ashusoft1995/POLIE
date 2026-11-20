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
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding initial police officers...");

        List<User> users = List.of(
            User.builder().username("head").email("head@hossanapolice.gov.et")
                .password(passwordEncoder.encode("head123"))
                .fullName("Head Habtamu Woldemariam").role(Role.POLICE_HEAD)
                .badge("PHD-001").rank("Head of Police").build(),

            User.builder().username("detective").email("detective@hossanapolice.gov.et")
                .password(passwordEncoder.encode("detective123"))
                .fullName("Det. Abebe Girma").role(Role.DETECTIVE)
                .badge("DET-012").rank("Detective Sergeant").build(),

            User.builder().username("preventive").email("preventive@hossanapolice.gov.et")
                .password(passwordEncoder.encode("preventive123"))
                .fullName("Off. Meron Tadesse").role(Role.PREVENTIVE)
                .badge("PRV-021").rank("Police Officer I").build(),

            User.builder().username("traffic").email("traffic@hossanapolice.gov.et")
                .password(passwordEncoder.encode("traffic123"))
                .fullName("Off. Kebede Alemu").role(Role.TRAFFIC)
                .badge("TRF-033").rank("Traffic Officer").build(),

            User.builder().username("hr").email("hr@hossanapolice.gov.et")
                .password(passwordEncoder.encode("hr123"))
                .fullName("Insp. Almaz Worku").role(Role.HR)
                .badge("HR-005").rank("HR Inspector").build(),

            User.builder().username("admin").email("admin@hossanapolice.gov.et")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Admin Daniel Kebede").role(Role.SYSTEM_ADMIN)
                .badge("ADM-001").rank("System Administrator").build()
        );

        userRepository.saveAll(users);
        log.info("✅ Seeded {} users.", users.size());
    }
}

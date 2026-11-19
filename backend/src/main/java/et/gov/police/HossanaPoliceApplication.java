package et.gov.police;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HossanaPoliceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HossanaPoliceApplication.class, args);
    }
}

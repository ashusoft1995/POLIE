package et.gov.police.security;

import et.gov.police.model.User;
import et.gov.police.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(identifier)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identifier));

        return new UserDetailsImpl(user);
    }
    
    public static class UserDetailsImpl implements UserDetails {
        private final User user;
        
        public UserDetailsImpl(User user) {
            this.user = user;
        }
        
        public User getUser() {
            return user;
        }
        
        @Override
        public String getUsername() {
            return user.getUsername();
        }
        
        @Override
        public String getPassword() {
            return user.getPassword();
        }
        
        @Override
        public List<SimpleGrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }
        
        @Override
        public boolean isEnabled() {
            return user.isEnabled();
        }
        
        @Override
        public boolean isAccountNonLocked() {
            return !user.isAccountLocked();
        }
        
        @Override
        public boolean isAccountNonExpired() {
            return true;
        }
        
        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }
    }
}

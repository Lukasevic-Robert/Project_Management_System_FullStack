package lt.rebellion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lt.rebellion.user.User;
import lt.rebellion.user.UserRepository;

@Service("userDetailsServiceImpl")
public class UserDetailsServiceImpl implements UserDetailsService{

	
	private static final Logger LOG = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

	
	private final UserRepository userRepository;
	
	@Autowired
	public UserDetailsServiceImpl(UserRepository userRepository) {
	this.userRepository = userRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		
		LOG.info("loadUserByUsername method has been called; email : " + email);
		
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User doesn't exist"));
		return UserDetailsImpl.build(user);
	}
}

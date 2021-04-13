package lt.rebellion.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.user.UserRepository;

@Component
@AllArgsConstructor
public class MyCommandLineRunner implements CommandLineRunner{

	UserRepository userRepository;
	
	
	@Override
	public void run(String... args) throws Exception {
	
		
	}

}

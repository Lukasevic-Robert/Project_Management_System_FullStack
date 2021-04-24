package lt.rebellion.project;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.user.User;
import lt.rebellion.user.UserRepository;


@Component
@Order(2)
@AllArgsConstructor 
public class CommandLineRunnerProject implements CommandLineRunner{

	ProjectRepository projectRepository;
	UserRepository userRepository;
	
	@Override
	public void run(String... args) throws Exception {
		List<User> users = userRepository.findAll();
		
		// Creating projects for Admin and User
		for (int i = 0; i < 5; i++) {
			projectRepository.save(new Project("Project"+ i, "Project " + i + " description", users.get(0)));
		}
		for (int i = 5; i < 10; i++) {
			projectRepository.save(new Project("Project"+ i, "Project " + i + " description", users.get(1)));
		}
	}
}

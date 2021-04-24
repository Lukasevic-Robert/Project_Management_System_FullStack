package lt.rebellion.project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lt.rebellion.user.UserService;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class ProjectService {

	@Autowired
	ProjectRepository projectRepository;
	@Autowired
	UserService userService;
	
	
	public List<Project> getAllProjectsByUserId(){
		List<Project> allProjects = projectRepository.findAllProjectsByUserId(userService.getCurrentUserId());
		return allProjects;
	}
}

package lt.rebellion.project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class ProjectController {

	@Autowired
	ProjectService projectService;
	
	@GetMapping("/projects")
	public List<Project> getAllProjectsByUserId(){
		return projectService.getAllProjectsByUserId();
	}
}

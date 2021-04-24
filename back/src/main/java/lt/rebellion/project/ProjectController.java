package lt.rebellion.project;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
public class ProjectController {

	private final ProjectService projectService;
	
	// Get Pagignated Projects
	@GetMapping("/page")
	public ResponseEntity<Page<ProjectDTO>> getAllProjectsByUserId(@RequestParam("page") int page, @RequestParam("size") int size){
		return projectService.findPaginated(page, size);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Project> getProjectById(@PathVariable Long id){
		return projectService.getProjectById(id);
	}
	
	// Create new Project
	@PostMapping
	public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectRequestDTO project){
		return projectService.createProject(project);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProjectById(@PathVariable Long id){
		return projectService.deleteProjectById(id);
	}
}

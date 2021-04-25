package lt.rebellion.project;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
	
	// GET Pagignated Projects
	@GetMapping("/page")
	public ResponseEntity<Page<ProjectDTO>> getAllProjectsByUserId(@RequestParam("page") int page, @RequestParam("size") int size){
		return projectService.findPaginated(page, size);
	}
	
	//GET project by id
	@GetMapping("/{id}")
	public ResponseEntity<Project> getProjectById(@PathVariable Long id){
		return projectService.getProjectById(id);
	}
	
	// CREATE new Project
	@PostMapping
	public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectRequestDTO projectRequestDTO){
		return projectService.createProject(projectRequestDTO);
	}
	
	// UPDATE project by id
	@PutMapping("/{id}")
	public ResponseEntity<ProjectDTO> updateProjectById(@PathVariable Long id, @Valid @RequestBody ProjectRequestDTO projectRequestDTO){
		return projectService.updateProject(id, projectRequestDTO);
	}
	
	// DELETE project by id
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteProjectById(@PathVariable Long id){
		return projectService.deleteProjectById(id);
	}
}

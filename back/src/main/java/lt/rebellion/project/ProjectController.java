package lt.rebellion.project;



import java.io.IOException;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lt.rebellion.journal.Activity;
import lt.rebellion.journal.Category;
import lt.rebellion.journal.JournalService;
import lt.rebellion.journal.Type;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
public class ProjectController {

	private final ProjectService projectService;

	@Autowired
	private JournalService journalService;
	
	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/page")
	public Page<ProjectDTO> getPaginatedProjects(Pageable pageable){
		return projectService.findPaginated(pageable);
	}
	
	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/pageByUser")
	public Page<ProjectDTO> getPaginatedProjects_ByLoggedInUser(Pageable pageable){
		return projectService.getPaginatedProjectsByUserId(pageable);
	}
	
	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/pageFilter")
	public Page<ProjectDTO> getPaginatedProjectsByKeyword(Pageable pageable, @RequestParam String keyword) {
		return projectService.getPaginatedProjectsByKeyword(pageable, keyword);
	}
	
	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/{id}")
	public Project getProjectById(@PathVariable @Valid @NotBlank Long id){
		return projectService.getProjectById(id);
	}
	
	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	@PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
	public ProjectDTO createProject(@Valid @NotBlank @RequestBody ProjectRequestDTO projectRequestDTO){
		String message="Project: "+projectRequestDTO.getName()+" was created";
		journalService.newJournalEntry(Type.INFO, Category.PROJECT, Activity.CREATED,
				message);

		return projectService.createProject(projectRequestDTO);
	}
	
	@ResponseStatus(HttpStatus.OK)
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
	public ProjectDTO updateProjectById(@PathVariable @NotBlank Long id, @Valid @RequestBody ProjectRequestDTO projectRequestDTO){
		String message="Project with id: "+id+" was updated";
		journalService.newJournalEntry(Type.INFO, Category.PROJECT, Activity.UPDATED,
				message);
		return projectService.updateProject(id, projectRequestDTO);
	}
	
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
	public void deleteProjectById(@PathVariable @NotBlank Long id){
		String message="Project with id: "+id+" was deleted";
		journalService.newJournalEntry(Type.INFO, Category.PROJECT, Activity.DELETED,
				message);
		 projectService.deleteProjectById(id);
	}
	
	@GetMapping("/export")
	public HttpServletResponse exportToCSV(HttpServletResponse response) throws IOException {
       return projectService.exportToCSV(response);
    }
}

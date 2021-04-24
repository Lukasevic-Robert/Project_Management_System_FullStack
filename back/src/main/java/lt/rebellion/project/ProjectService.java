package lt.rebellion.project;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lt.rebellion.exception.NotFoundException;
import lt.rebellion.service.ResponseService;
import lt.rebellion.task.TaskRepository;
import lt.rebellion.user.UserService;

@Service
@RequiredArgsConstructor
public class ProjectService implements ResponseService<ProjectDTO> {

	private final ProjectRepository projectRepository;
	private final UserService userService;
	private final TaskRepository taskRepository;

	@Override
	public ResponseEntity<Page<ProjectDTO>> findPaginated(int page, int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "id");
		Pageable pageable = PageRequest.of(page - 1, size, Sort.by(order));
		Page<Project> allProjects = projectRepository.findAllPaginatedProjectsByUserId(userService.getCurrentUserId(), pageable);
		List<ProjectDTO> allProjectDTOs = allProjects.stream().map(p -> toProjectDTO(p)).collect(Collectors.toList());
		Page<ProjectDTO> backToPage = new PageImpl<ProjectDTO>(allProjectDTOs);

		return new ResponseEntity<>(backToPage, HttpStatus.OK);
	}

	// Project to DTO
	public ProjectDTO toProjectDTO(Project project) {
		Long id = project.getId();
		int allTasks = taskRepository.getAllTaskCount(id);
		int allUndoneTasks = taskRepository.getAllUndoneTaskCount(id);
		return new ProjectDTO(id, project.getName(), project.getDescription(), project.getStatus().name(), allTasks,
				allUndoneTasks, project.getCreated(), project.getUpdated());
	}

	// Create new Project
	public ResponseEntity<ProjectDTO> createProject(CreateProjectRequestDTO projectRequestDTO) {
		Project project = new Project(projectRequestDTO.getName(), projectRequestDTO.getDescription(), userService.getCurrentUser());
		projectRepository.save(project);
		ProjectDTO projectDTO = toProjectDTO(project);
		return new ResponseEntity<>(projectDTO, HttpStatus.OK);
	}

	// Get Project by Id
	public ResponseEntity<Project> getProjectById(Long id) {

		Project project = projectRepository.findByIdAndUserId(id, userService.getCurrentUserId());
		if (validateRequestedProject(id)) {
			return new ResponseEntity<>(project, HttpStatus.OK);
		}

		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}

	// DELETE Project by Id
	public ResponseEntity<String> deleteProjectById(Long id) {
		if (validateRequestedProject(id)) {
			projectRepository.deleteById(id);
			return new ResponseEntity<String>(HttpStatus.OK);
		}
		return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);

	}

	public Boolean validateRequestedProject(Long id) {
		Project project = projectRepository.findById(id).get();
		if (project == null) {
			throw new NotFoundException("Project Not Found");
		}
		List<Project> projects = projectRepository.getAllProjectsByUserId(userService.getCurrentUserId());
		if (projects == null) {
			throw new NotFoundException("Current User don't have any projects");
		}

		return projects.stream().anyMatch(p -> p.getId().equals(id));
	}
}

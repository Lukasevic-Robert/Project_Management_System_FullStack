package lt.rebellion.project;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import lt.rebellion.user.User;
import lt.rebellion.user.UserDTO;
import lt.rebellion.user.UserService;

@Service
@RequiredArgsConstructor
public class ProjectService implements ResponseService<ProjectDTO> {

	private final ProjectRepository projectRepository;
	private final UserService userService;
	private final TaskRepository taskRepository;
	
	
	private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

	



	// GET ALL projects paginated
	@Override
	public ResponseEntity<Page<ProjectDTO>> findPaginated(int page, int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(page -1, size, Sort.by(order));
		Page<Project> allProjects = projectRepository.findAll(pageable);
		List<ProjectDTO> allProjectDTOs = allProjects.stream().map(p -> toProjectDTO(p)).collect(Collectors.toList());
		Page<ProjectDTO> backToPage = new PageImpl<ProjectDTO>(allProjectDTOs, pageable, allProjects.getTotalElements());

		return new ResponseEntity<>(backToPage, HttpStatus.OK);
	}
	
	// GET ALL projects paginated by User
	@Override
	public ResponseEntity<Page<ProjectDTO>> findPaginatedByUserId(int page, int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "project_id");
		Pageable pageable = PageRequest.of(page -1, size, Sort.by(order));
		Page<Project> allProjects = projectRepository.findAllPaginatedProjectsByUserId(userService.getCurrentUserId(), pageable);
		List<ProjectDTO> allProjectDTOs = allProjects.stream().map(p -> toProjectDTO(p)).collect(Collectors.toList());
		Page<ProjectDTO> backToPage = new PageImpl<ProjectDTO>(allProjectDTOs, pageable, allProjects.getTotalElements());
		
		return new ResponseEntity<>(backToPage, HttpStatus.OK);
	}
	
	// GET Project by Id
	public ResponseEntity<Project> getProjectById(Long id) {

		if (validateRequestedProject(id)) {
			Project project = projectRepository.findById(id).get();
			return new ResponseEntity<>(project, HttpStatus.OK);
		}

		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	}
	
	// CREATE new Project
	public ResponseEntity<ProjectDTO> createProject(ProjectRequestDTO projectRequestDTO) {
		
		log.warn("name " + projectRequestDTO.getName());
		Set<User> users = new HashSet<>();
		users.add(userService.getCurrentUser());
		Project project = new Project(projectRequestDTO.getName(), projectRequestDTO.getDescription(), users);
		Set<User> userSet = new HashSet<>(projectRequestDTO.getUsersId().stream().map(u -> userService.getUserById(u)).collect(Collectors.toList()));
		project.setUsers(userSet);
		projectRepository.save(project);
		ProjectDTO projectDTO = toProjectDTO(project);
		return new ResponseEntity<>(projectDTO, HttpStatus.OK);
	}
	
	// UPDATE project by id
	public ResponseEntity<ProjectDTO> updateProject(Long id, ProjectRequestDTO projectRequestDTO){
		
		if(validateRequestedProject(id)) {

			Project project = projectRepository.findById(id).get();
			project.setName(projectRequestDTO.getName());
			project.setDescription(projectRequestDTO.getDescription());
			Set<User> userSet = new HashSet<>(projectRequestDTO.getUsersId().stream().map(u -> userService.getUserById(u)).collect(Collectors.toList()));
			project.setUsers(userSet);
			projectRepository.save(project);
			ProjectDTO projectDTO = toProjectDTO(project);
			return new ResponseEntity<ProjectDTO>(projectDTO, HttpStatus.OK);
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

	// Project to DTO
	public ProjectDTO toProjectDTO(Project project) {
		Long id = project.getId();
		List<UserDTO> usersDTO = project.getUsers().stream().map(u -> userService.userToDTO(u)).collect(Collectors.toList());
		int allTasks = taskRepository.getAllTaskCount(id);
		int allUndoneTasks = taskRepository.getAllUndoneTaskCount(id);
		return new ProjectDTO(id,
				project.getName(),
				project.getDescription(),
				project.getStatus().name(),
				allTasks, allUndoneTasks, usersDTO,
				project.getCreated(),
				project.getUpdated());
	}

	public Boolean validateRequestedProject(Long id) {
		if(id == null) {
			throw new NullPointerException("validateRequestedProject method was called - id Param = " + id);
		}
		Project project = projectRepository.findById(id).get();
		if (project == null) {
			throw new NotFoundException("Project Not Found");
		}
		
		return true;
	}
}

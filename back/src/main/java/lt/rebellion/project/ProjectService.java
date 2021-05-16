package lt.rebellion.project;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import lombok.RequiredArgsConstructor;
import lt.rebellion.exception.NotFoundException;
import lt.rebellion.model.EStatus;
import lt.rebellion.task.TaskRepository;
import lt.rebellion.user.User;
import lt.rebellion.user.UserDTO;
import lt.rebellion.user.UserService;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

	private final ProjectRepository projectRepository;
	private final UserService userService;
	private final TaskRepository taskRepository;
	
	public Page<ProjectDTO> findPaginated(Pageable pageable) {
		Page<ProjectDTO> allProjects = projectRepository.findAll(pageable).map(this::toProjectDTO);
		return allProjects;
	}

	public Page<ProjectDTO> getPaginatedProjectsByUserId(Pageable pageable) {
		Page<ProjectDTO> allProjects = projectRepository
				.findAllPaginatedProjectsByUserId(userService.getCurrentUserId(), pageable).map(this::toProjectDTO);
		return allProjects;
	}

	public Page<ProjectDTO> getPaginatedProjectsByKeyword(Pageable pageable, String keyword) {
		Page<ProjectDTO> allProjects = projectRepository.findPaginatedProjectsByKeyword(pageable, keyword.toUpperCase())
				.map(this::toProjectDTO);
		return allProjects;
	}

	public Project getProjectById(Long id) {
		validateRequestedProject(id);
		Project project = projectRepository.findById(id).get();
		return project;
	}

	public ProjectDTO createProject(ProjectRequestDTO projectRequestDTO) {

		Project project = new Project(projectRequestDTO.getName(), projectRequestDTO.getDescription());
		Set<User> userSet = new HashSet<>(projectRequestDTO.getUsersId().stream().map(id -> userService.getUserById(id))
				.collect(Collectors.toList()));
		project.setUsers(userSet);
		projectRepository.save(project);
		ProjectDTO projectDTO = toProjectDTO(project);
		return projectDTO;
	}

	public ProjectDTO updateProject(Long id, ProjectRequestDTO projectRequestDTO) {

		validateRequestedProject(id);

		Project project = projectRepository.findById(id).get();
		project.setName(projectRequestDTO.getName());
		project.setDescription(projectRequestDTO.getDescription());
		project.setStatus(EStatus.valueOf(projectRequestDTO.getStatus()));
		Set<User> userSet = new HashSet<>(projectRequestDTO.getUsersId().stream().map(u -> userService.getUserById(u))
				.collect(Collectors.toList()));
		project.setUsers(userSet);
		projectRepository.save(project);
		ProjectDTO projectDTO = toProjectDTO(project);
		return projectDTO;
	}

	public void deleteProjectById(Long id) {
		validateRequestedProject(id);
		projectRepository.deleteById(id);
	}

	public HttpServletResponse exportToCSV(HttpServletResponse response) throws IOException {

		response.setContentType("text/csv");
		
		List<Project> projects = projectRepository.findAll();
		List<ProjectDTO> projectsDTO = projects.stream().map(project -> toProjectDTO(project))
				.collect(Collectors.toList());

		ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
		String[] csvHeader = { "Project ID", "Name", "Description", "Status", "Total tasks", "Undone tasks", "Users" };
		String[] nameMapping = { "id", "name", "description", "status", "taskCount", "undoneTaskCount", "users" };
		csvWriter.writeHeader(csvHeader);

		for (ProjectDTO project : projectsDTO) {
			csvWriter.write(project, nameMapping);
		}
		csvWriter.close();
		return response;
	}

	public ProjectDTO toProjectDTO(Project project) {
		Long id = project.getId();
		List<UserDTO> usersDTO = project.getUsers().stream().map(u -> userService.userToDTO(u))
				.collect(Collectors.toList());
		int allTasks = taskRepository.getAllTaskCount(id);
		int allUndoneTasks = taskRepository.getAllUndoneTaskCount(id);
		return new ProjectDTO(id, project.getName(), project.getDescription(), project.getStatus().name(), allTasks,
				allUndoneTasks, usersDTO, project.getCreated(), project.getUpdated());
	}

	public Boolean validateRequestedProject(Long id) {
		if (id == null) {
			throw new NullPointerException("validateRequestedProject method was called - id Param = " + id);
		}
		projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project Not Found"));
		return true;
	}
}

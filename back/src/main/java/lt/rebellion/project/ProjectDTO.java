package lt.rebellion.project;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lt.rebellion.user.UserDTO;

@RequiredArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class ProjectDTO {

	private Long id;
	private String name;
	private String description;
	private String status;
	private int taskCount;
	private int undoneTaskCount;
	private List<UserDTO> users;
	private Date created;
	private Date updated;
	
}

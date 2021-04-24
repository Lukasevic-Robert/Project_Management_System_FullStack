package lt.rebellion.project;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

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
	private Date created;
	private Date updated;
	
}

package lt.rebellion.task;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskCreateRequestDTO {

	private String name;
	private Long projectId;
	private List<String> description;
	private String priority;
}

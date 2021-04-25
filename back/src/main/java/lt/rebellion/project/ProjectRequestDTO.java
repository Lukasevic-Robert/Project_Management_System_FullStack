package lt.rebellion.project;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class ProjectRequestDTO {

	private String name;
	private String description;
}

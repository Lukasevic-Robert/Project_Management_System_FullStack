package lt.rebellion.project;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class ProjectRequestDTO {

	private String name;
	private String description;
	private List<Long> usersId = new ArrayList<>();
}

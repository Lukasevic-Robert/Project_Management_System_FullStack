package lt.rebellion.project;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class ProjectRequestDTO {

	@NotBlank
	private String name;
	@NotBlank
	private String description;
	private String status;
	private List<Long> usersId = new ArrayList<>();
}

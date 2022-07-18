package fG.Model;

import fG.Enum.TaskDefinitonType;
import lombok.Data;

@Data
public class TaskDefinition {
    private String cronExpression;
    private TaskDefinitonType actionType;
    private String data;
}
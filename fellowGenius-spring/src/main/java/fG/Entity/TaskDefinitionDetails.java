package fG.Entity;

import fG.Enum.TaskDefinitonType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDefinitionDetails {
    @Id
    String id;
    String cronExpression;
    TaskDefinitonType actionType;
    String data;
}

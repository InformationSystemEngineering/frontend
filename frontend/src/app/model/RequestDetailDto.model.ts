import { CustomRequest } from './Request.model';
import { Fair } from './Fair.model';
import { Classroom } from './Classroom.model';
import { Faculty } from './Faculty.model';
import { TopicDetails } from './TopicDetails.model';

export interface RequestDetailDto {
  request: CustomRequest;
  faculty: Faculty;
  fair: Fair;
  classrooms: Classroom[];
  showDetails?: boolean;
  topics?: TopicDetails[];
}

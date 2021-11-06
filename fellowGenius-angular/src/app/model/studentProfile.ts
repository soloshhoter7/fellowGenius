export class StudentProfileModel {
	public sid: number;
	public fullName: string;
	public email: string;
	public contact: string;
	public linkedInProfile: string;
	public dateOfBirth: string;
	public profilePictureUrl: string;
	public learningAreas: string[] = [];
	public highestQualification:string;
	public yearsOfExperience:number;
	public currentOrganisation:string;
	public currentDesignation:string;
	upiID:string;
}

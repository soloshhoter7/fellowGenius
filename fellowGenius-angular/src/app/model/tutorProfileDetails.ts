export class tutorProfileDetails {
  public tid: number;
  public bookingId:number;
  public fullName: string;
  public email:string;
  public contact:string;
  public dateOfBirth:string;
  public institute: string;
  public educationalQualifications: string[] = [];
  public price1: string;
  public price2: string;
  public price3: string;
  public description: string;
  public speciality: string;
  public rating: number;
  public reviewCount: number;
  public lessonCompleted: number;
  public profilePictureUrl: string;
  public professionalSkills: string;
  public currentOrganisation: string;
  public currentDesignation:string;
  public previousOrganisations: string[] = [];
  public areaOfExpertise: expertise[] = [];
  public profileCompleted: number;
  public yearsOfExperience: number;
  public linkedInProfile: string;
  public upiID:string;
}
export class expertise {
  public category: string;
  public subCategory:string;
  public price: number;
}
